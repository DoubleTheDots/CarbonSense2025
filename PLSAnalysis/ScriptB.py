import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.cross_decomposition import PLSRegression
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.model_selection import LeaveOneOut
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType

def load_data(file_path, x_start, x_end):
    data = pd.read_csv(file_path, delim_whitespace=True)
    X = data.iloc[:, x_start:x_end+1].values
    y = data.iloc[:, 0].values
    return X, y, data

def plsr_with_loo(X, y, n_components=10):
    loo = LeaveOneOut()
    y_preds = np.zeros_like(y, dtype=float)
    for train_idx, test_idx in loo.split(X):
        model = PLSRegression(n_components=n_components)
        model.fit(X[train_idx], y[train_idx])
        y_preds[test_idx] = model.predict(X[test_idx]).flatten()
    rmse = np.sqrt(mean_squared_error(y, y_preds))
    r2 = r2_score(y, y_preds)
    return model, y_preds, rmse, r2

def plot_rmsep(y_true, y_pred, title="RMSEP Plot"):
    rmsep = np.sqrt(mean_squared_error(y_true, y_pred))
    plt.figure()
    plt.plot([1], [rmsep], 'ro-')
    plt.title(title)
    plt.xlabel("Component")
    plt.ylabel("RMSEP")
    plt.legend(["RMSEP"], loc="upper right")
    plt.show()

def plot_scores(model, comps=[0, 1, 2, 3], title="PLSR Scores"):
    scores = model.x_scores_[:, comps]
    plt.figure()
    for i in range(len(comps)-1):
        plt.scatter(scores[:, i], scores[:, i+1])
    plt.title(title)
    plt.xlabel(f"Component {comps[0]+1}")
    plt.ylabel(f"Component {comps[1]+1}")
    plt.show()

def run_all(file, start, end, name=""):
    X, y, data = load_data(file, start, end)
    model, y_pred, rmse, r2 = plsr_with_loo(X, y)
    print(f"Summary for {name} ({start}-{end}):")
    print("RMSEP:", rmse)
    print("R2 Score:", r2)
    plot_rmsep(y, y_pred, f"RMSEP {name}")
    plot_scores(model, title=f"Scores {name}")

    # Train/test split
    X_train, y_train = X[20:], y[20:]
    X_test, y_test = X[:20], y[:20]
    model = PLSRegression(n_components=2)
    model.fit(X_train, y_train)
    y_test_pred = model.predict(X_test)
    print(f"Test prediction for {name}:\n", y_test_pred.flatten())

    # Define input shape: batch size 1, number of features (e.g., 176)
    n_features = X_train.shape[1]
    initial_type = [('float_input', FloatTensorType([None, n_features]))]

    # Convert model to ONNX
    onnx_model = convert_sklearn(model, initial_types=initial_type)

    # Save ONNX model
    with open(f"{name}_model.onnx", "wb") as f:
        f.write(onnx_model.SerializeToString())


# Run on all datasets and ranges
datasets = [
    ("data_msc.txt", "MSC", [(26, 376), (101, 376), (151, 376), (201, 376)]),
    ("data_sg1.txt", "SG1", [(26, 376), (201, 376)]),
    ("data_snv.txt", "SNV", [(26, 376), (201, 376)])
]

for file, label, ranges in datasets:
    for start, end in ranges:
        run_all(file, start, end, f"{label} {start+1}-{end+1}")
