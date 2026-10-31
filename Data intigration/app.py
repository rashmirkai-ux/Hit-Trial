import pandas as pd, requests, folium, streamlit as st
from streamlit_folium import st_folium

st.set_page_config(page_title="Flood Early-Warning Advisor", layout="wide")
st.title("Flood Early-Warning & Village Evacuation Advisor")

df = pd.read_csv("village_risk.csv")
lat, lon = df.lat.mean(), df.lon.mean()

# ---------- STEP 3: forecast ----------
@st.cache_data(ttl=3600)
def get_forecast(lat, lon):
    rain = requests.get("https://api.open-meteo.com/v1/forecast", params={
        "latitude": lat, "longitude": lon, "daily": "precipitation_sum",
        "forecast_days": 3, "timezone": "Asia/Kolkata"}, timeout=20).json()
    flow = requests.get("https://flood-api.open-meteo.com/v1/flood", params={
        "latitude": lat, "longitude": lon, "daily": "river_discharge",
        "forecast_days": 7}, timeout=20).json()
    rain3 = sum(x for x in rain["daily"]["precipitation_sum"] if x is not None)
    q = [x for x in flow["daily"]["river_discharge"] if x is not None]
    rise = max(q) / q[0] if q and q[0] > 0 else 1.0
    return rain3, rise

try:
    rain3, rise = get_forecast(lat, lon)
    source = "Live forecast (Open-Meteo)"
except Exception:
    rain3, rise = 10.0, 1.0
    source = "Offline fallback values"

# Demo controls: lets you SIMULATE a storm on stage
st.sidebar.header("Demo controls")
if st.sidebar.checkbox("Simulate heavy rain scenario"):
    rain3 = st.sidebar.slider("3-day rain (mm)", 0, 300, 150)
    rise = st.sidebar.slider("River flow rise (x today)", 1.0, 4.0, 2.2)
    source = "Simulated scenario"

def alert_level(rain3, rise):
    if rain3 > 100 or rise > 2:   return "RED"
    if rain3 > 50  or rise > 1.5: return "ORANGE"
    if rain3 > 20  or rise > 1.2: return "YELLOW"
    return "GREEN"

alert = alert_level(rain3, rise)

# ---------- STEP 4: advice ----------
def advice(alert, risk):
    if risk == "FLOODED":
        return "Rescue priority: move to shelter now"
    if alert == "RED":
        return {"HIGH": "EVACUATE NOW", "MEDIUM": "Evacuate within 6 hours",
                "LOW": "Stay alert, prepare go-bag"}[risk]
    if alert == "ORANGE":
        return {"HIGH": "Prepare to evacuate within 12 hours",
                "MEDIUM": "Get ready, monitor updates", "LOW": "Monitor updates"}[risk]
    if alert == "YELLOW":
        return "Monitor updates" if risk in ("HIGH", "MEDIUM") else "No action"
    return "No action"

df["advice"] = df.risk.apply(lambda r: advice(alert, r))

# ---------- STEP 5: dashboard ----------
c1, c2, c3 = st.columns(3)
c1.metric("Alert level", alert)
c2.metric("3-day rain (mm)", round(rain3))
c3.metric("River flow vs today", f"{rise:.2f}x")
st.caption(f"Data source: {source}")

colors = {"FLOODED": "darkred", "HIGH": "red", "MEDIUM": "orange", "LOW": "green"}
m = folium.Map(location=[lat, lon], zoom_start=10)
for _, v in df.iterrows():
    folium.CircleMarker([v.lat, v.lon], radius=6, color=colors[v.risk], fill=True,
        popup=f"{v['name']}: {v.risk}. {v.advice}").add_to(m)
st_folium(m, width=900, height=500)

st.subheader("Villages needing action")
st.dataframe(df[~df.advice.isin(["No action"])][["name", "risk", "dist_to_flood_m", "advice"]])