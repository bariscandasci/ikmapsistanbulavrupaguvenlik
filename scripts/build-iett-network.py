#!/usr/bin/env python3
"""İBB İETT GTFS dosyalarını transit_network.json otobüs hatlarına çevirir.

Raylı hatlar (metro, tramvay, Marmaray) mevcut dosyada kalır. Basitleştirilmiş
otobüs hatlarının yerine GTFS'teki tam durak sırası yazılır.

Kaynak: https://data.ibb.gov.tr/dataset/iett-gtfs-verisi (21 Nisan 2026)
Beklenen dosyalar: /tmp/iett/routes.csv, stops.csv, trips.csv, stop_times.zip
"""

import csv
import json
import zipfile
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GTFS = Path("/tmp/iett")
OUT = ROOT / "transit_network.json"


def fix_text(value):
    if not value:
        return ""
    value = value.replace("\ufeff", "")
    out = bytearray()
    for char in value:
        encoded = None
        for encoding in ("cp1252", "latin-1"):
            try:
                encoded = char.encode(encoding)
                break
            except Exception:
                continue
        if encoded is None:
            return value
        out.extend(encoded)
    try:
        return out.decode("utf-8")
    except UnicodeDecodeError:
        return value


def fix_coord(raw):
    text = str(raw).strip().replace(",", ".")
    if text.count(".") <= 1:
        return float(text)
    digits = text.replace(".", "")
    return float(digits[:2] + "." + digits[2:])


def load_stops():
    stops = {}
    with open(GTFS / "stops.csv", encoding="utf-8-sig", newline="") as handle:
        for row in csv.DictReader(handle, delimiter=";"):
            stop_id = row.get("stop_id") or row.get("\ufeffstop_id")
            try:
                lat = fix_coord(row["stop_lat"])
                lng = fix_coord(row["stop_lon"])
            except Exception:
                continue
            if not (40.5 < lat < 41.7 and 27.8 < lng < 30.0):
                continue
            stops[stop_id] = {
                "id": "iett_" + stop_id,
                "name": fix_text(row["stop_name"]).strip() or stop_id,
                "lat": round(lat, 6),
                "lng": round(lng, 6),
                "mode": "otobus",
                "coordSource": "iett-gtfs",
                "knownStopId": "iett_" + stop_id,
            }
    return stops


def load_routes():
    by_id = {}
    with open(GTFS / "routes.csv", encoding="utf-8-sig", newline="") as handle:
        for row in csv.DictReader(handle, delimiter=";"):
            short = fix_text(row["route_short_name"]).strip()
            if not short:
                continue
            by_id[row["route_id"]] = {
                "short": short,
                "long": fix_text(row["route_long_name"]).strip(),
            }
    return by_id


def load_trip_routes():
    trip_route = {}
    with open(GTFS / "trips.csv", encoding="utf-8-sig", newline="") as handle:
        for row in csv.DictReader(handle, delimiter=";"):
            trip_route[row["trip_id"]] = row["route_id"]
    return trip_route


def longest_trips(routes, trip_route):
    counts = defaultdict(int)
    with zipfile.ZipFile(GTFS / "stop_times.zip") as archive:
        with archive.open("stop_times.txt") as handle:
            for row in csv.DictReader((line.decode("utf-8") for line in handle)):
                counts[row["trip_id"]] += 1
    best = {}
    for trip_id, count in counts.items():
        route = routes.get(trip_route.get(trip_id))
        if not route or count < 2:
            continue
        current = best.get(route["short"])
        if current is None or count > current[0]:
            best[route["short"]] = (count, trip_id, route)
    return best


def sequences_for(chosen):
    wanted = {trip_id: short for short, (_count, trip_id, _route) in chosen.items()}
    buckets = defaultdict(list)
    with zipfile.ZipFile(GTFS / "stop_times.zip") as archive:
        with archive.open("stop_times.txt") as handle:
            for row in csv.DictReader((line.decode("utf-8") for line in handle)):
                short = wanted.get(row["trip_id"])
                if short is None:
                    continue
                buckets[short].append((int(row["stop_sequence"]), row["stop_id"]))
    result = {}
    for short, pairs in buckets.items():
        pairs.sort()
        ordered = []
        for _seq, stop_id in pairs:
            stop_key = "iett_" + stop_id
            if ordered and ordered[-1] == stop_key:
                continue
            ordered.append(stop_key)
        if len(ordered) >= 2:
            result[short] = ordered
    return result


def main():
    existing = json.loads(OUT.read_text())
    rail_lines = [line for line in existing["lines"] if line.get("mode") != "otobus"]
    used = {stop_id for line in rail_lines for stop_id in line.get("stopIds", [])}
    rail_stops = [stop for stop in existing["stops"] if stop["id"] in used]

    gtfs_stops = load_stops()
    routes = load_routes()
    print("gtfs stops", len(gtfs_stops), "route ids", len(routes))
    chosen = longest_trips(routes, load_trip_routes())
    print("lines", len(chosen))
    sequences = sequences_for(chosen)

    lines = []
    referenced = set()
    for short in sorted(sequences):
        stop_ids = [stop_id for stop_id in sequences[short] if stop_id[5:] in gtfs_stops]
        if len(stop_ids) < 2:
            continue
        route = chosen[short][2]
        long_name = route["long"]
        lines.append({
            "id": "iett_" + short.lower().replace(" ", ""),
            "name": f"{short}: {long_name}" if long_name else short,
            "mode": "otobus",
            "verified": True,
            "source": "İBB Açık Veri İETT GTFS, 21 Nisan 2026",
            "hatNo": short,
            "stopIds": stop_ids,
        })
        referenced.update(stop_ids)

    bus_stops = [gtfs_stops[stop_id[5:]] for stop_id in sorted(referenced)]
    network = {"stops": rail_stops + bus_stops, "lines": rail_lines + lines}
    OUT.write_text(json.dumps(network, ensure_ascii=False, separators=(",", ":")))
    print("wrote", OUT, "stops", len(network["stops"]), "lines", len(network["lines"]), "bytes", OUT.stat().st_size)


if __name__ == "__main__":
    main()
