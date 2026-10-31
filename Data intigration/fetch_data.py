import requests, pandas as pd
from datetime import date, timedelta

START, END = "2010-01-01", str(date.today() - timedelta(days=7))
PTS = {"harike": (31.17, 74.95), "bhakra": (31.41, 76.43), "pong": (31.97, 76.05)}

def rain(lat, lon):
    r = requests.get("https://archive-api.open-meteo.com/v1/archive", params={
        "latitude": lat, "longitude": lon, "start_date": START, "end_date": END,
        "daily": "precipitation_sum", "timezone": "Asia/Kolkata"}, timeout=120).json()
    return pd.Series(r["daily"]["precipitation_sum"],
                     index=pd.to_datetime(r["daily"]["time"]))

def discharge(lat, lon):
    r = requests.get("https://flood-api.open-meteo.com/v1/flood", params={
        "latitude": lat, "longitude": lon, "start_date": START, "end_date": END,
        "daily": "river_discharge"}, timeout=120).json()
    return pd.Series(r["daily"]["river_discharge"],
                     index=pd.to_datetime(r["daily"]["time"]))

print()
df = pd.DataFrame({f"rain_{k}": rain(*v) for k, v in PTS.items()})
df["discharge"] = discharge(*PTS["harike"])
df.index.name = "date"
df.to_csv("data.csv")
print(df.describe().T[["count", "mean", "max"]])
print(df.loc["2025-08-20":"2025-09-10", "discharge"])
