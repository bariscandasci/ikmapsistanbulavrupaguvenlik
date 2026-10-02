#!/usr/bin/env python3
"""İBB minibüs güzergahlarını transit ağına ekler.

Kaynak: https://data.ibb.gov.tr/dataset/minibus-hatlari-verisi
GeoJSON (5 Haziran 2025): /tmp/pt/minibus.geojson

İETT GTFS minibüs taşımaz. Google'ın Bağcılar → Mall of İstanbul için
gösterdiği A30 (Bağcılar–Otocenter–MOİ) bu dosyadadır. 925, ne İETT
GTFS'te (21 Nisan 2026) ne bu minibüs dosyasında vardır; uydurulmaz.

Hatlar ana grafa `otobus` olarak girer (dolmuş modu rota hesabının
dışında). Çizgi, durak sırasından ~400 m aralıkla örneklenir; gerçek
yol şekli transit_network_geometry.json'a yazılır.
"""

import json
import math
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GEOJSON = Path("/tmp/pt/minibus.geojson")
NETWORK = ROOT / "transit_network.json"
GEOMETRY = ROOT / "transit_network_geometry.json"

SOURCE = "İBB Açık Veri Minibüs Hatları GeoJSON, 5 Haziran 2025"
SAMPLE_KM = 0.4
MAX_VERTEX_GAP_KM = 1.5
MIN_LENGTH_KM = 1.5
MIN_POINTS = 15
NEAR_KM = 0.7
ALWAYS_HATS = {"A30", "A26"}

# Yedi proje ve sık kullanılan kalkış noktaları (lng, lat).
SITES = [
    (28.6878147, 41.0041831),
    (28.8075256, 41.0625272),
    (28.8304931, 40.9983995),
    (28.6354638, 41.0792312),
    (28.6717817, 41.0563428),
    (29.0345988, 41.0814212),
    (29.0206898, 41.0542874),
    (28.856, 41.039),
    (28.995, 41.066),
    (28.675, 41.034),
    (28.642, 41.002),
]


def hav(a, b):
    """a, b = (lng, lat) → km."""
    radius = 6371.0
    p1, p2 = math.radians(a[1]), math.radians(b[1])
    dp = math.radians(b[1] - a[1])
    dl = math.radians(b[0] - a[0])
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * radius * math.asin(min(1.0, math.sqrt(h)))


def length_km(coords):
    return sum(hav(coords[i], coords[i + 1]) for i in range(len(coords) - 1))


def parts_of(geom):
    if geom["type"] == "LineString":
        return [geom["coordinates"]]
    if geom["type"] == "MultiLineString":
        return geom["coordinates"]
    return []


def slug(hat):
    text = hat.translate(str.maketrans("İIıŞşĞğÜüÖöÇç", "iiissgguuoocc")).lower()
    return re.sub(r"[^a-z0-9]+", "", text) or "hat"


def resample(coords, step_km):
    out = [coords[0]]
    prev = coords[0]
    acc = 0.0
    for cur in coords[1:]:
        seg = hav(prev, cur)
        if seg <= 1e-6:
            prev = cur
            continue
        walked = 0.0
        while acc + (seg - walked) >= step_km:
            need = step_km - acc
            walked += need
            t = walked / seg
            out.append([prev[0] + (cur[0] - prev[0]) * t, prev[1] + (cur[1] - prev[1]) * t])
            acc = 0.0
        acc += seg - walked
        prev = cur
    if hav(out[-1], coords[-1]) > 0.05:
        out.append(coords[-1])
    return out


def near_site(coords):
    for coord in coords[::3]:
        for site in SITES:
            if hav(coord, site) <= NEAR_KM:
                return True
    return False


def main():
    features = json.loads(GEOJSON.read_text(encoding="utf-8"))["features"]
    best = {}
    for feature in features:
        props = feature["properties"]
        hat = (props.get("HATNO") or "").strip()
        name = " ".join((props.get("GUZERGAH") or props.get("HAT_ADI") or hat).split())
        if not hat or not name:
            continue
        for coords in parts_of(feature["geometry"]):
            if len(coords) < MIN_POINTS:
                continue
            km = length_km(coords)
            if km < MIN_LENGTH_KM:
                continue
            gap = max(hav(coords[i], coords[i + 1]) for i in range(len(coords) - 1))
            if gap > MAX_VERTEX_GAP_KM:
                continue
            if hat not in ALWAYS_HATS and not near_site(coords):
                continue
            key = (hat, " ".join(name.upper().split()))
            prev = best.get(key)
            if prev is None or km > prev[0]:
                best[key] = (km, coords, hat, name)

    network = json.loads(NETWORK.read_text(encoding="utf-8"))
    geometry = json.loads(GEOMETRY.read_text(encoding="utf-8"))
    network["stops"] = [s for s in network["stops"] if not str(s.get("id", "")).startswith("mbs_")]
    network["lines"] = [ln for ln in network["lines"] if not str(ln.get("id", "")).startswith("mbs_")]
    for key in list(geometry):
        if str(key).startswith("mbs_"):
            del geometry[key]

    existing = [(s["lng"], s["lat"], s["name"]) for s in network["stops"] if "lat" in s and "lng" in s]
    grid = {}
    for lng, lat, name in existing:
        cell = (int(lat / 0.005), int(lng / 0.005))
        grid.setdefault(cell, []).append((lng, lat, name))

    def nearby_name(lng, lat):
        cell = (int(lat / 0.005), int(lng / 0.005))
        best_name, best_km = None, 0.18
        for dlat in (-1, 0, 1):
            for dlng in (-1, 0, 1):
                for olng, olat, oname in grid.get((cell[0] + dlat, cell[1] + dlng), []):
                    km = hav((lng, lat), (olng, olat))
                    if km < best_km:
                        best_km = km
                        best_name = oname
        return best_name

    counts = {}
    added_stops = 0
    for _key, (km, coords, hat, name) in sorted(best.items()):
        counts[hat] = counts.get(hat, 0)
        line_id = f"mbs_{slug(hat)}_{counts[hat]}"
        counts[hat] += 1
        samples = resample(coords, SAMPLE_KM)
        ring = hav(samples[0], samples[-1]) < 0.04 and len(samples) > 3
        if ring:
            samples = samples[:-1]
        stop_ids = []
        for index, (lng, lat) in enumerate(samples):
            stop_id = f"{line_id}_{index:03d}"
            label = nearby_name(lng, lat) or f"{hat} {name}"
            network["stops"].append({
                "id": stop_id,
                "name": label[:80],
                "lat": round(lat, 6),
                "lng": round(lng, 6),
                "mode": "otobus",
                "coordSource": "ibb-minibus",
                "knownStopId": stop_id,
            })
            stop_ids.append(stop_id)
            added_stops += 1
        if ring:
            stop_ids.append(stop_ids[0])
        network["lines"].append({
            "id": line_id,
            "name": f"{hat}: {name}"[:140],
            "mode": "otobus",
            "verified": True,
            "source": SOURCE,
            "hatNo": hat,
            "stopIds": stop_ids,
        })
        geometry[line_id] = [[round(lat, 6), round(lng, 6)] for lng, lat in coords]

    NETWORK.write_text(json.dumps(network, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    GEOMETRY.write_text(json.dumps(geometry, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(
        f"minibus hat {sum(counts.values())} durak {added_stops} "
        f"toplam hat {len(network['lines'])} durak {len(network['stops'])} "
        f"geometri {len(geometry)}"
    )


if __name__ == "__main__":
    main()
