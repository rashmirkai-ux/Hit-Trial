import json
import pandas as pd, numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import precision_score, recall_score, f1_score

df = pd.read_csv("../data.csv", parse_dates=["date"], index_col="date").ffill().dropna()

up = df.rain_bhakra + df.rain_pong                    # rain over the dam catchments
X = pd.DataFrame({
    "rain_local_1d": df.rain_harike,
    "rain_local_3d": df.rain_harike.rolling(3).sum(),
    "rain_up_1d": up,
    "rain_up_3d": up.rolling(3).sum(),
    "rain_up_7d": up.rolling(7).sum(),
    "q": df.discharge,
    "dq_1d": df.discharge.diff(1),
    "dq_3d": df.discharge.diff(3),
    "month": df.index.month,
}, index=df.index)

QUANT = 0.95                                          # lower to 0.90 if recall is poor
THR = df.discharge.quantile(QUANT)
print("Flood-level discharge:", round(THR, 1))

out = pd.DataFrame({"q": df.discharge, "thr": THR}, index=df.index)
ok = X.dropna().index
metrics = {"flood_level": float(THR)}

for h in (1, 2, 3):                                   # 24, 48, 72 hours
    fut = pd.concat([df.discharge.shift(-k) for k in range(1, h + 1)], axis=1).max(axis=1)
    y = (fut >= THR).astype(int)
    valid = ok.intersection(df.index[:-h])
    tr, te = valid[valid < "2023-01-01"], valid[valid >= "2023-01-01"]
    model = RandomForestClassifier(n_estimators=300, min_samples_leaf=5,
                                   class_weight="balanced", random_state=0, n_jobs=-1)
    model.fit(X.loc[tr], y.loc[tr])
    pred = model.predict(X.loc[te])
    metrics[f"{h*24}h"] = {
        "precision": round(precision_score(y.loc[te], pred, zero_division=0), 2),
        "recall": round(recall_score(y.loc[te], pred, zero_division=0), 2),
        "f1": round(f1_score(y.loc[te], pred, zero_division=0), 2),
        "test_flood_days": int(y.loc[te].sum()),
    }
    print(f"{h*24}h:", metrics[f"{h*24}h"])
    out[f"p{h*24}"] = pd.Series(model.predict_proba(X.loc[ok])[:, 1], index=ok)

out.index.name = "date"
out.to_csv("predictions.csv")
json.dump(metrics, open("metrics.json", "w"), indent=2)
print("Saved predictions.csv and metrics.json")
from sklearn.metrics import recall_score, precision_score

# Baseline 1: "flood tomorrow if flood today" (persistence)
# Baseline 2: model WITHOUT the flow columns (rain only)
rain_cols = ["rain_local_1d", "rain_local_3d", "rain_up_1d", "rain_up_3d", "rain_up_7d", "month"]

for h in (1, 2, 3):
    fut = pd.concat([df.discharge.shift(-k) for k in range(1, h + 1)], axis=1).max(axis=1)
    y = (fut >= THR).astype(int)
    valid = ok.intersection(df.index[:-h])
    tr, te = valid[valid < "2023-01-01"], valid[valid >= "2023-01-01"]

    persist = (df.discharge.loc[te] >= THR).astype(int)
    m2 = RandomForestClassifier(n_estimators=300, min_samples_leaf=5,
                                class_weight="balanced", random_state=0, n_jobs=-1)
    m2.fit(X.loc[tr, rain_cols], y.loc[tr])
    p2 = m2.predict(X.loc[te, rain_cols])
    print(f"{h*24}h | persistence recall {recall_score(y.loc[te], persist):.2f} "
          f"precision {precision_score(y.loc[te], persist):.2f} | "
          f"rain-only recall {recall_score(y.loc[te], p2):.2f} "
          f"precision {precision_score(y.loc[te], p2, zero_division=0):.2f}")