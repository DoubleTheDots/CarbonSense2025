import numpy as np

def linear_interp_np(x_known, y_known, x_new):
    x_known = np.asarray(x_known)
    y_known = np.asarray(y_known)
    x_new = np.asarray(x_new)

    # Sort known values just in case
    sort_idx = np.argsort(x_known)
    x_known = x_known[sort_idx]
    y_known = y_known[sort_idx]

    # Allocate output array
    y_new = np.empty_like(x_new, dtype=np.float32)

    # Clip x_new for extrapolation
    x_clipped = np.clip(x_new, x_known[0], x_known[-1])

    # Search for the interval index
    idxs = np.searchsorted(x_known, x_clipped, side='right') - 1
    idxs = np.clip(idxs, 0, len(x_known) - 2)

    x0 = x_known[idxs]
    x1 = x_known[idxs + 1]
    y0 = y_known[idxs]
    y1 = y_known[idxs + 1]

    # Linear interpolation formula
    slope = (y1 - y0) / (x1 - x0)
    y_new = y0 + slope * (x_new - x0)

    return y_new