# UniSC CarbonSense

The UniSC CarbonSense project provides a cloud-based platform for processing and analyzing Near Infrared (NIR) spectral data to estimate soil carbon in coastal wetlands. Users can upload spectral data, which is then pre-processed and modeled to generate carbon predictions. The results are accessible through the web application, allowing users to visualize and interpret soil carbon measurements easily. This system aims to simplify the process of assessing soil carbon, making it more accessible for landowners, researchers, and environmental managers involved in wetland restoration and carbon farming.

## Project Structure

The project follows a specific structure required for Vercel deployment:

```
unisc-carbon-sense/
├── api/                # Python backend (Flask API)
├── PLSAnalysis/        # PLS Model generation
├── public/             # Static files
└── src/                # Next.js frontend
    ├── app/            # Next.js App Router pages and layouts
    ├── components/     # Reusable UI components
    ├── hooks/          # Custom React hooks
    └── lib/            # Utility functions and helpers
```

This structure is required because:

1. The `/src/app` directory uses Next.js App Router conventions for frontend routing.
2. The `/api` directory at the root level follows Vercel's Python serverless functions convention.
3. Each Python file in the `/api` directory must define an `app` variable that exposes a WSGI Application.

For detailed information on the Python runtime requirements, see the [Vercel Python Runtime documentation](https://vercel.com/docs/functions/runtimes/python).

**Important**: Alternative structures won't work on Vercel because:

- Python files inside the `/src/app` directory would be treated as part of the Next.js routing system
- Using route groups like `/src/app/(backend)` for Python files won't work as they're still processed by Next.js
- Vercel specifically looks for Python entry points in the `/api` directory for serverless function deployment

## How It Works

The Python/Flask server is mapped into the Next.js app under `/api/`.

This is implemented using [`next.config.js` rewrites](https://github.com/vercel/examples/blob/main/python/nextjs-flask/next.config.js) to map any request to `/api/:path*` to the Flask API, which is hosted in the `/api` folder.

On localhost, the rewrite will be made to the `127.0.0.1:5328` port, which is where the Flask server is running.

In production, the Flask server is hosted as [Python serverless functions](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/python) on Vercel.

## Getting Started

First, install the dependencies:

```bash
npm install
```

And the Python dependencies:

```bash
pip install -r requirements.txt
```

> **Note:** Several optimizations were made to keep the Vercel serverless function under the 250 MB uncompressed limit:
>
> - `scipy` and `scikit-learn` have been removed from `requirements.txt`. MSC is now implemented using NumPy, and a lightweight NumPy‑based Savitzky–Golay implementation lives in `api/savgol_filter.py`.
> - `pandas` has been removed and replaced with a custom NumPy-based data structure in `preprocessing.py`. While pandas is excellent for data manipulation, it adds significant size to the deployment.
> - We use ONNX for machine learning model deployment because it provides a compact, portable format for the model while the runtime (`onnxruntime`) handles the inference with good performance.

Then, set up your environment variables:

1. Copy the `.env.example` file to create a new `.env` file in the project root:

   ```bash
   cp .env.example .env
   ```

   > **Note:** While Next.js typically uses `.env.local`, the Python backend requires a `.env` file to access environment variables through python-dotenv.

2. Edit the `.env` file and fill in your actual Azure Storage credentials and other configuration values. Ask your supervisor for the configuration values.

Then, run the development server:
(This will start the Next.js frontend and the Flask backend.)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The Flask server will be running on [http://127.0.0.1:5328](http://127.0.0.1:5328).

## API Endpoints

- `GET /api/python` - Simple test endpoint that returns "Hello, World!"
- `POST /api/upload` - Handles CSV file uploads to Azure Blob Storage
  - Accepts: multipart/form-data with a 'file' field containing a CSV file
  - Returns: JSON with status of the upload operation

## Generating PLSR Models and ONNX Files

This project includes scripts to train Partial Least Squares Regression (PLSR) models and export them to the ONNX format.

**Folder:** PLSAnalysis

**Script:** ScriptB.py

This Python script generates and exports PLSR models trained on spectral data using different preprocessing techniques and wavelength ranges. The models are saved in ONNX format for use in deployment environments.

The following models will be generated:
- MSC preprocessing:
  - 950–1650 nm
  - 1100–1650 nm
  - 1200–1650 nm
  - 1300–1650 nm
- SG1 preprocessing:
  - 950–1650 nm
  - 1300–1650 nm
- SNV preprocessing:
  - 950–1650 nm
  - 1300–1650 nm

Each model is saved as an .onnx file in the PLSAnalysis directory.

Reference
ScriptB.R: The original R script used to train and validate the models is also included for reference.
 