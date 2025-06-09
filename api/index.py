import os
import numpy as np
import onnxruntime as ort
from flask import Flask, request, jsonify
import tempfile
from azure.storage.blob import BlobServiceClient, ContentSettings
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from .interpolation import linear_interp_np
from .preprocessing import extract_scan_data, preprocess_data

#dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
#load_dotenv(dotenv_path)
load_dotenv()

app = Flask(__name__)


def get_azure_storage_connection_string():
    """Get Azure Storage connection string from environment variables."""
    connection_string = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
    if not connection_string:
        raise ValueError(
            "AZURE_STORAGE_CONNECTION_STRING environment variable is not set.")
    return connection_string


@app.route("/api/python")
def hello_world():
    return "<p>Hello, World!</p>"

# TODO: Delete route and test.csv (used only for testing)


@app.route("/api/test", methods=["GET"])
def process_file_test():
    scan_data_df = extract_scan_data("api/test.csv")

    preprocessed_df = preprocess_data(scan_data_df)

    # 1. Define the expected wavelengths (these must match training data)
    # [950, 952, ..., 1650] → length: 351
    expected_wavelengths = np.arange(950, 1652, 2)

    # 2. Get real data wavelengths and MSC-corrected values
    real_wavelengths = preprocessed_df['Wavelength']
    real_msc_values = preprocessed_df['MSC']

    # 3. Interpolate real MSC data to match expected wavelengths
    interpolated_msc = linear_interp_np(real_wavelengths, real_msc_values, expected_wavelengths).astype(np.float32)

    # 4. Reshape for ONNX input
    x_input = interpolated_msc.reshape(1, -1)  # shape is now (1, 276)

    # 5. Load ONNX model and make prediction
    session = ort.InferenceSession("api/model.onnx")
    input_name = session.get_inputs()[0].name
    pred = session.run(None, {input_name: x_input})[0]

    return jsonify({
        "carbonPercentage": float(pred[0][0]),
        "preprocessedData": preprocessed_df.to_dict(orient='records')
    }), 200


@app.route("/api/process", methods=["GET"])
def process_file():
    """
    Process CSV files that was previously uploaded to Azure Blob Storage.
    Retrieves files using the provided batchId.
    """
    batchId = request.args.get("batchId")

    if not batchId:
        return jsonify({"message": "No batchId provided"}), 400

    try:
        # Get container name from environment variables
        container_name = os.getenv(
            "AZURE_STORAGE_CONTAINER_NAME", "carbonsense")

        # Connect to Azure Blob Storage
        blob_service_client = BlobServiceClient.from_connection_string(
            get_azure_storage_connection_string()
        )

        container_client = blob_service_client.get_container_client(
            container_name)

        # List blobs under the folder uploads/{batchId}/
        blobs_list = container_client.list_blobs(
            name_starts_with=f"uploads/{batchId}/")

        # Collect all CSV blobs
        csv_blob_names = [
            blob.name for blob in blobs_list if blob.name.lower().endswith(".csv")]

        if not csv_blob_names:
            return jsonify({"message": f"No CSV files found in batch {batchId}"}), 404

        all_msc_values = []

        for csv_blob_name in csv_blob_names:
            blob_client = container_client.get_blob_client(csv_blob_name)

            # Create a temporary file to download the blob
            with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as temp:
                # Download the blob to the temporary file
                download_stream = blob_client.download_blob()
                temp.write(download_stream.readall())
                temp_path = temp.name

           # Extract the Scan Data from the CSV
            scan_data_df = extract_scan_data(temp_path)
            os.unlink(temp_path)

            if scan_data_df.empty:
                continue  # Skip bad files

           # Apply preprocessing to data
            preprocessed_df = preprocess_data(scan_data_df)

            # Define the expected wavelengths (these must match training data)
            # [950, 952, ..., 1650] → length: 351
            expected_wavelengths = np.arange(950, 1652, 2)

            # Get real data wavelengths and MSC-corrected values
            real_wavelengths = preprocessed_df['Wavelength']
            real_msc_values = preprocessed_df['MSC']

            # Interpolate real MSC data to match expected wavelengths
            interpolated_msc = linear_interp_np(real_wavelengths, real_msc_values, expected_wavelengths).astype(np.float32)

            all_msc_values.append(interpolated_msc)

        if not all_msc_values:
            return jsonify({"message": "No valid spectral data found"}), 400

        # Compute average across all scans
        averaged_msc = np.mean(all_msc_values, axis=0)

        # Reshape for ONNX input
        x_input = averaged_msc.reshape(1, -1)  # shape is now (1, 276)

        # Load ONNX model and make prediction
        session = ort.InferenceSession("api/model.onnx")
        input_name = session.get_inputs()[0].name
        pred = session.run(None, {input_name: x_input})[0]

        return jsonify({
            "message": "Files processed successfully",
            "batchId": batchId,
            "numFilesUsed": len(all_msc_values),
            "carbonPercentage": float(pred[0][0])
        }), 200

    except ValueError as e:
        return jsonify({"message": str(e)}), 500
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500


@app.route("/api/upload", methods=["POST"])
def upload_file():
    """
    Handle file upload to Azure Blob Storage.
    Accepts CSV files only.
    Stores files in the form of: container-name/uploads/batchId/filename
    filename is formed as: batchId-index.csv
    batchId is unique identifier, created in frontend
    index is the index of the file in the batch
    """
    if "files" not in request.files:
        return jsonify({"message": "No file part in the request"}), 400

    if "batchId" not in request.form:
        return jsonify({"message": "No batchId part in the request"}), 400

    files = request.files.getlist("files")
    batch_id = request.form.get("batchId")

    if not files:
        return jsonify({"message": "No files selected"}), 400
    if not batch_id:
        return jsonify({"message": "No batchId selected"}), 400

    for file in files:
        if not file.filename.lower().endswith(".csv"):
            return jsonify({"message": "Only CSV files are allowed"}), 400

    uploaded_files = []

    try:
        for file in files:
            # Secure the filename
            filename = secure_filename(file.filename)

            # Create blob name
            blob_name = f"uploads/{batch_id}/{filename}"

            # Get container name from environment variables
            container_name = os.getenv(
                "AZURE_STORAGE_CONTAINER_NAME", "carbonsense")

            # Create a temporary file
            with tempfile.NamedTemporaryFile(delete=False) as temp:
                file.save(temp.name)

                blob_service_client = BlobServiceClient.from_connection_string(
                    get_azure_storage_connection_string()
                )
                container_client = blob_service_client.get_container_client(
                    container_name)

                # Create container if it doesn't exist
                if not container_client.exists():
                    container_client.create_container()

                # Upload the file
                with open(temp.name, "rb") as data:
                    container_client.upload_blob(
                        name=blob_name,
                        data=data,
                        overwrite=True,
                        content_settings=ContentSettings(
                            content_type="text/csv")
                    )
                # Clean up the temporary file
                os.unlink(temp.name)

            uploaded_files.append(filename)

        return jsonify({
            "message": "Files uploaded successfully",
            "uploadedFiles": uploaded_files
        }), 200

    except ValueError as e:
        return jsonify({"message": str(e)}), 500
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500
