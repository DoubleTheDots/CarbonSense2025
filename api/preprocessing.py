import numpy as np
import csv
from io import StringIO
from .savgol_filter import savgol_filter

class NumpyDataset:
    """Simple numpy-based replacement for pandas DataFrame"""
    def __init__(self, data=None, columns=None):
        self.data = data if data is not None else {}
        self.columns = columns if columns is not None else []
        self.empty = len(self.columns) == 0
    
    def __getitem__(self, key):
        if isinstance(key, str):
            return self.data.get(key, np.array([]))
        # Support for list of column names
        elif isinstance(key, list):
            return NumpyDataset(
                data={col: self.data[col] for col in key if col in self.data},
                columns=key
            )
        return None
        
    def to_dict(self, orient='records'):
        if orient == 'records':
            result = []
            # Get max length of any column
            max_len = max([len(arr) for arr in self.data.values()]) if self.data else 0
            for i in range(max_len):
                record = {}
                for col in self.columns:
                    if col in self.data and i < len(self.data[col]):
                        record[col] = float(self.data[col][i])
                result.append(record)
            return result
        return {}

def extract_scan_data(file_path: str):
    # Read the file, looking for the start of the scan data
    with open(file_path, 'r') as file:
        lines = file.readlines()

    # Find where the scan data starts
    start_idx = None
    for i, line in enumerate(lines):
        if '***Scan Data***' in line:
            start_idx = i + 2  # Skip the header
            break

    # Return empty dataset if no scan data is found
    if start_idx is None:
        return NumpyDataset()

    # Extract the scan data until we hit the next section or an empty line
    scan_data_lines = []
    for line in lines[start_idx:]:
        if line.strip() == '' or line.startswith('***'):
            break
        scan_data_lines.append(line.strip())

    # Parse CSV data manually
    scan_data_str = '\n'.join(scan_data_lines)
    reader = csv.reader(StringIO(scan_data_str))
    
    # Initialize columns
    wavelength = []
    absorbance = []
    ref_signal = []
    sample_signal = []
    
    # Parse rows
    for row in reader:
        if len(row) >= 4:  # Ensure we have all expected columns
            try:
                wavelength.append(float(row[0]))
                absorbance.append(float(row[1]))
                ref_signal.append(float(row[2]))
                sample_signal.append(float(row[3]))
            except (ValueError, IndexError):
                # Skip rows that can't be converted to float
                continue
    
    # Return data as NumpyDataset
    return NumpyDataset(
        data={
            'Wavelength': np.array(wavelength),
            'Absorbance': np.array(absorbance),
            'Reference Signal': np.array(ref_signal),
            'Sample Signal': np.array(sample_signal)
        },
        columns=['Wavelength', 'Absorbance', 'Reference Signal', 'Sample Signal']
    )

def preprocess_data(scan_data_df: NumpyDataset):
    # Get absorbance values as 2D array (1 sample x n wavelengths)
    absorbance = scan_data_df['Absorbance'].reshape(1, -1)
    wavelength = scan_data_df['Wavelength']

    # --- MSC (Multiplicative Scatter Correction) ---
    def msc(input_data):
        # Mean spectrum
        mean_spectrum = np.mean(input_data, axis=0)
        corrected = np.zeros_like(input_data)

        for i in range(input_data.shape[0]):
            fit = np.polyfit(mean_spectrum, input_data[i, :], 1, full=True)
            slope, intercept = fit[0]
            corrected[i, :] = (input_data[i, :] - intercept) / slope

        return corrected

    def scale_01(x):
        return (x - np.min(x)) / (np.max(x) - np.min(x)) if np.max(x) != np.min(x) else np.zeros_like(x)

    msc_corrected = msc(absorbance)
    msc_scaled = np.apply_along_axis(scale_01, axis=1, arr=msc_corrected)

    # --- SNV (Standard Normal Variate) ---
    def snv(X):
        return (X - np.mean(X, axis=1, keepdims=True)) / np.std(X, axis=1, keepdims=True)

    snv_corrected = snv(absorbance)
    
    # --- Savitzky-Golay 1st derivative (SG1) ---
    sg1_corrected = savgol_filter(absorbance, window_length=11, polyorder=2, deriv=1)

    # --- Savitzky-Golay 2nd derivative (SG2) ---
    sg2_corrected = savgol_filter(absorbance, window_length=11, polyorder=2, deriv=2)

    # Return data as NumpyDataset instead of DataFrame
    return NumpyDataset(
        data={
            'Wavelength': wavelength,
            'Original': absorbance.flatten(),
            'MSC': msc_scaled.flatten(),
            'SNV': snv_corrected.flatten(),
            'SG1': sg1_corrected.flatten(),
            'SG2': sg2_corrected.flatten(),
        },
        columns=['Wavelength', 'Original', 'MSC', 'SNV', 'SG1', 'SG2']
    )
