import json
import numpy as np, rasterio, pandas as pd, folium
from scipy.ndimage import distance_transform_edt

# 1. Load flood mask
from scipy.ndimage import label

# 1. Load flood mask
src = rasterio.open("flood_mask2.tif")
mask = np.nan_to_num(src.read(1)) > 0
print("Flooded pixels before cleaning:", int(mask.sum()))

# Remove speckle: keep only connected flood patches of at least MIN_PIXELS
MIN_PIXELS = 200            # 200 pixels x 900 m2 = about 18 hectares
lab, n = label(mask)
sizes = np.bincount(lab.ravel())
keep = sizes >= MIN_PIXELS
keep[0] = False             # label 0 is background
mask = keep[lab]
print("Flooded pixels after cleaning:", int(mask.sum()))

dist_m = distance_transform_edt(~mask) * 30      # distance to nearest flood, ~30 m per pixel

# 2. Load villages (already downloaded)
data = json.load(open("village_osm.json"))
print("Villages found:", len(data["elements"]))

# 3. Classify each village
rows = []
for el in data["elements"]:
    lon, lat = el["lon"], el["lat"]
    r, c = src.index(lon, lat)
    if not (0 <= r < mask.shape[0] and 0 <= c < mask.shape[1]):
        continue
    d = dist_m[r, c]
    risk = "FLOODED" if d == 0 else "HIGH" if d < 500 else "MEDIUM" if d < 1500 else "LOW"
    rows.append({"name": el.get("tags", {}).get("name", "unnamed"),
                 "lat": lat, "lon": lon,
                 "dist_to_flood_m": round(float(d)), "risk": risk})

df = pd.DataFrame(rows)

# 4. Rough India-side filter (approximate border for this box)
df = df[df.lon > 74.30 + (df.lat - 30.70) * 1.0]
print("Villages kept:", len(df))
print(df["risk"].value_counts())
df.to_csv("village_risk.csv", index=False)

# 5. Quick map
colors = {"FLOODED": "darkred", "HIGH": "red", "MEDIUM": "orange", "LOW": "green"}
m = folium.Map(location=[df.lat.mean(), df.lon.mean()], zoom_start=10)
for _, v in df.iterrows():
    folium.CircleMarker([v.lat, v.lon], radius=5, color=colors[v.risk], fill=True,
                        popup=f"{v['name']}: {v.risk} ({v.dist_to_flood_m} m)").add_to(m)
m.save("risk_map.html")
print("Saved village_risk.csv and risk_map.html")