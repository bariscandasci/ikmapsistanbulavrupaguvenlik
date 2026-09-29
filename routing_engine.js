/**
 * routing_engine — Avrupa yakası omurga grafı.
 *
 * Ankara ikmapsv2 motorundaki üç davranış burada sadeleştirilmiş halde durur:
 *   1. Hedef Durağa Kilitlenme (target snap): aramanın vardığı uçta kapı
 *      bandındaki (150 m) durak varken daha uzak inişler seçimden düşer.
 *   2. Yürüme cezası: yürüyüş kenarları seçimde 1.5x ağırdır; gösterilen
 *      süre gerçek yürüyüştür (4.5 km/s).
 *   3. Canlı sefer fallback: ilk biniş için /api/live-arrival denenir;
 *      kod yoksa, servis boşsa veya hata verirse bekleme = sefer aralığı / 2.
 *
 * Ankara'ya özgü koridor cezaları (İncek halkası, 442 havalimanı, ÖHO)
 * taşınmadı. Hat grafı, hat-durumlu Dijkstra ve iki yönlü kenarlar duruyor.
 *
 * Classic script. Düğüm: vm ile de yüklenebilir.
 */
(function (root) {
  const WALK_SPEED_KMH = 4.5;
  const WALK_PENALTY_FACTOR = 1.5;
  const DOOR_ALIGHT_KM = 0.15;
  const DOOR_ALIGHT_MIN_PER_KM = 140;
  const CLOSE_ALIGHT_KM = 0.25;
  const EARLY_ALIGHT_MIN_PER_KM = 45;
  const WALK_TRANSFER_MAX_KM = 0.35;
  const NEAREST_STOP_SEARCH_KM = 6;
  const NEAREST_STOP_MAX_CANDIDATES = 8;
  const WALK_STEP_MIN_KM = 0.12;
  const GRID_CELL_DEG = 0.008;
  const STOP_DWELL_MIN = 0.35;
  const PRIMARY_TRANSFER_PENALTY_MIN = 8;
  const MIN_TRANSFERS_PENALTY_MIN = 2000;
  const MODE_SPEED_KMH = { metro: 34, tramvay: 18, marmaray: 42, metrobus: 28, otobus: 20 };
  const MODE_HEADWAY_MIN = { metro: 6, tramvay: 5, marmaray: 10, metrobus: 3, otobus: 12 };
  const UNRELIABLE_COORD_SOURCES = new Set(["enterpolasyon", "ekstrapolasyon"]);

  function haversineKm(a, b) {
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const lat1 = (a.lat * Math.PI) / 180;
    const lat2 = (b.lat * Math.PI) / 180;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  function walkMinutes(km) {
    return (km / WALK_SPEED_KMH) * 60;
  }

  function roundTo5(n) {
    return Math.round(n / 5) * 5;
  }

  function lineHeadwayMin(line) {
    if (line && typeof line.headwayMin === "number") return line.headwayMin;
    const modeHeadway = line && MODE_HEADWAY_MIN[line.mode];
    return modeHeadway !== undefined ? modeHeadway : MODE_HEADWAY_MIN.otobus;
  }

  function boardingWaitMin(headwayMin) {
    const headway = headwayMin != null ? headwayMin : MODE_HEADWAY_MIN.otobus;
    return headway / 2;
  }

  function gridCellKey(lat, lng) {
    return Math.floor(lat / GRID_CELL_DEG) + ":" + Math.floor(lng / GRID_CELL_DEG);
  }

  class MinHeap {
    constructor() {
      this.items = [];
    }
    push(item) {
      const a = this.items;
      a.push(item);
      let i = a.length - 1;
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (a[p].minutes <= a[i].minutes) break;
        const tmp = a[p];
        a[p] = a[i];
        a[i] = tmp;
        i = p;
      }
    }
    pop() {
      const a = this.items;
      const top = a[0];
      const last = a.pop();
      if (a.length) {
        a[0] = last;
        let i = 0;
        const n = a.length;
        for (;;) {
          let smallest = i;
          const l = 2 * i + 1;
          const r = 2 * i + 2;
          if (l < n && a[l].minutes < a[smallest].minutes) smallest = l;
          if (r < n && a[r].minutes < a[smallest].minutes) smallest = r;
          if (smallest === i) break;
          const tmp = a[i];
          a[i] = a[smallest];
          a[smallest] = tmp;
          i = smallest;
        }
      }
      return top;
    }
    get isEmpty() {
      return this.items.length === 0;
    }
  }

  function asPoint(point) {
    if (!point) return null;
    if (typeof point.lat === "number" && typeof point.lng === "number") {
      return { lat: point.lat, lng: point.lng, name: point.name || "Nokta" };
    }
    if (point.coords && typeof point.coords.lat === "number") {
      return { lat: point.coords.lat, lng: point.coords.lng, name: point.name || "Nokta" };
    }
    return null;
  }

  /**
   * Hedef durağa kilitlenme. Kapı bandında (150 m) erişilen bir durak varsa
   * daha uzak adaylara km başına ek seçim cezası biner. Kapı durağı yoksa
   * 250 m bandı aynı işi görür. Gösterilen yürüyüş süresine bu ceza yazılmaz.
   */
  function targetSnapWalkCost(km, bands) {
    const walk = walkMinutes(km);
    let walkCost = walk * WALK_PENALTY_FACTOR;
    if (bands.hasDoor && km > DOOR_ALIGHT_KM) {
      walkCost += (km - DOOR_ALIGHT_KM) * DOOR_ALIGHT_MIN_PER_KM;
    } else if (bands.hasClose && km > CLOSE_ALIGHT_KM) {
      walkCost += (km - CLOSE_ALIGHT_KM) * EARLY_ALIGHT_MIN_PER_KM;
    }
    return walkCost;
  }

  function buildTransitGraph(network) {
    if (typeof applyTransitGraphExtensions === "function") applyTransitGraphExtensions(network);
    const stopsById = new Map();
    const grid = new Map();
    (network.transitStops || []).forEach((s) => {
      if (typeof s.lat !== "number" || typeof s.lng !== "number") return;
      stopsById.set(s.id, s);
      const key = gridCellKey(s.lat, s.lng);
      if (!grid.has(key)) grid.set(key, []);
      grid.get(key).push(s.id);
    });

    const adjacency = new Map();
    const addEdge = (fromId, toId, minutes, lineId, mode, headwayMin, hatNo) => {
      if (!adjacency.has(fromId)) adjacency.set(fromId, []);
      adjacency.get(fromId).push({
        to: toId,
        minutes: minutes,
        lineId: lineId,
        mode: mode,
        headwayMin: headwayMin || 0,
        hatNo: hatNo || null,
      });
    };

    const linesByLocalId = new Map();
    (network.transitLines || []).forEach((line) => {
      linesByLocalId.set(line.id, line);
      const ids = line.stopIds || [];
      for (let i = 0; i < ids.length - 1; i++) {
        const a = stopsById.get(ids[i]);
        const b = stopsById.get(ids[i + 1]);
        if (!a || !b) continue;
        const km = haversineKm(a, b);
        const speed = MODE_SPEED_KMH[line.mode] || MODE_SPEED_KMH.otobus;
        const minutes = (km / speed) * 60 + STOP_DWELL_MIN;
        const headway = lineHeadwayMin(line);
        addEdge(a.id, b.id, minutes, line.id, line.mode, headway, line.hatNo);
        addEdge(b.id, a.id, minutes, line.id, line.mode, headway, line.hatNo);
      }
    });

    const offsets = [-1, 0, 1];
    stopsById.forEach((s) => {
      if (UNRELIABLE_COORD_SOURCES.has(s.coordSource)) return;
      const cellLat = Math.floor(s.lat / GRID_CELL_DEG);
      const cellLng = Math.floor(s.lng / GRID_CELL_DEG);
      offsets.forEach((dLat) => {
        offsets.forEach((dLng) => {
          const bucket = grid.get(cellLat + dLat + ":" + (cellLng + dLng));
          if (!bucket) return;
          bucket.forEach((otherId) => {
            if (otherId === s.id) return;
            const other = stopsById.get(otherId);
            if (UNRELIABLE_COORD_SOURCES.has(other.coordSource)) return;
            const km = haversineKm(s, other);
            if (km > 0 && km <= WALK_TRANSFER_MAX_KM) addEdge(s.id, otherId, walkMinutes(km), null, "yurume");
          });
        });
      });
    });

    (network.walkLinks || []).forEach((link) => {
      const a = stopsById.get(link.from);
      const b = stopsById.get(link.to);
      if (!a || !b) return;
      const km = haversineKm(a, b);
      if (km <= WALK_TRANSFER_MAX_KM) return;
      addEdge(a.id, b.id, walkMinutes(km), null, "yurume");
      addEdge(b.id, a.id, walkMinutes(km), null, "yurume");
    });

    return { stopsById: stopsById, grid: grid, adjacency: adjacency, linesByLocalId: linesByLocalId };
  }

  function stopsWithinRadius(graph, lat, lng, radiusKm) {
    const cellSpan = Math.ceil(radiusKm / 0.7) + 1;
    const cellLat = Math.floor(lat / GRID_CELL_DEG);
    const cellLng = Math.floor(lng / GRID_CELL_DEG);
    const results = [];
    for (let dLat = -cellSpan; dLat <= cellSpan; dLat++) {
      for (let dLng = -cellSpan; dLng <= cellSpan; dLng++) {
        const bucket = graph.grid.get(cellLat + dLat + ":" + (cellLng + dLng));
        if (!bucket) continue;
        bucket.forEach((id) => {
          const s = graph.stopsById.get(id);
          if (UNRELIABLE_COORD_SOURCES.has(s.coordSource)) return;
          const km = haversineKm({ lat: lat, lng: lng }, s);
          if (km <= radiusKm) results.push({ stop: s, km: km });
        });
      }
    }
    results.sort((a, b) => a.km - b.km);
    return results;
  }

  function runDijkstra(graph, sources, transferPenaltyMin) {
    const NONE = " ";
    const dist = new Map();
    const realDist = new Map();
    const prev = new Map();
    const keyStopId = new Map();
    const bestAtStop = new Map();
    const bestStateAtStop = new Map();
    const bestRealMinutesAtStop = new Map();
    const heap = new MinHeap();

    function relaxBestAtStop(stopId, key, minutes, realMinutes) {
      const cur = bestAtStop.get(stopId);
      if (cur === undefined || minutes < cur - 1e-9) {
        bestAtStop.set(stopId, minutes);
        bestStateAtStop.set(stopId, key);
        bestRealMinutesAtStop.set(stopId, realMinutes);
      }
    }

    sources.forEach((source) => {
      const realStartMinutes = source.realStart === undefined ? source.startMinutes : source.realStart;
      const key = source.stopId + "|" + NONE;
      dist.set(key, source.startMinutes);
      realDist.set(key, realStartMinutes);
      keyStopId.set(key, source.stopId);
      heap.push({ stopId: source.stopId, lineKey: NONE, minutes: source.startMinutes });
      relaxBestAtStop(source.stopId, key, source.startMinutes, realStartMinutes);
    });

    while (!heap.isEmpty) {
      const cur = heap.pop();
      const curKey = cur.stopId + "|" + cur.lineKey;
      if (cur.minutes > dist.get(curKey) + 1e-6) continue;
      const curLine = cur.lineKey === NONE ? null : cur.lineKey;
      const curRealMinutes = realDist.get(curKey);
      const edges = graph.adjacency.get(cur.stopId) || [];
      edges.forEach((edge) => {
        let waitCost = 0;
        let newLineKey;
        const boarding = edge.lineId && curLine !== edge.lineId;
        if (edge.lineId) {
          if (boarding) waitCost = boardingWaitMin(edge.headwayMin);
          newLineKey = edge.lineId;
        } else {
          newLineKey = NONE;
        }
        const penalty = boarding ? transferPenaltyMin : 0;
        const edgeCost = edge.lineId ? edge.minutes : edge.minutes * WALK_PENALTY_FACTOR;
        const newMinutes = cur.minutes + edgeCost + waitCost + penalty;
        const newRealMinutes = curRealMinutes + edge.minutes + waitCost;
        const newKey = edge.to + "|" + newLineKey;
        const known = dist.get(newKey);
        if (known === undefined || newMinutes < known - 1e-9) {
          dist.set(newKey, newMinutes);
          realDist.set(newKey, newRealMinutes);
          keyStopId.set(newKey, edge.to);
          prev.set(newKey, { fromKey: curKey, lineId: edge.lineId, mode: edge.mode });
          heap.push({ stopId: edge.to, lineKey: newLineKey, minutes: newMinutes });
          relaxBestAtStop(edge.to, newKey, newMinutes, newRealMinutes);
        }
      });
    }

    return {
      prev: prev,
      keyStopId: keyStopId,
      bestAtStop: bestAtStop,
      bestStateAtStop: bestStateAtStop,
      bestRealMinutesAtStop: bestRealMinutesAtStop,
    };
  }

  const dijkstraCacheByGraph = new Map();

  function getDijkstraFrom(coords, graph, transferPenaltyMin) {
    const key = coords.lat.toFixed(4) + "," + coords.lng.toFixed(4);
    const variant = String(transferPenaltyMin || 0);
    let variants = dijkstraCacheByGraph.get(graph);
    if (!variants) {
      variants = new Map();
      dijkstraCacheByGraph.set(graph, variants);
    }
    const cached = variants.get(variant);
    if (cached && cached.key === key) return cached.result;
    const sources = stopsWithinRadius(graph, coords.lat, coords.lng, NEAREST_STOP_SEARCH_KM)
      .slice(0, NEAREST_STOP_MAX_CANDIDATES)
      .map((item) => ({
        stopId: item.stop.id,
        startMinutes: walkMinutes(item.km) * WALK_PENALTY_FACTOR,
        realStart: walkMinutes(item.km),
      }));
    const result = runDijkstra(graph, sources, transferPenaltyMin || 0);
    variants.set(variant, { key: key, result: result });
    return result;
  }

  function findRealRoute(originCoords, destCoords, graph, fixedSide, transferPenaltyMin) {
    if (!graph) return null;
    const fromCoords = fixedSide === "dest" ? destCoords : originCoords;
    const toCoords = fixedSide === "dest" ? originCoords : destCoords;
    const search = getDijkstraFrom(fromCoords, graph, transferPenaltyMin || 0);
    const toCandidates = stopsWithinRadius(graph, toCoords.lat, toCoords.lng, NEAREST_STOP_SEARCH_KM).slice(
      0,
      NEAREST_STOP_MAX_CANDIDATES
    );
    const bands = {
      hasDoor: toCandidates.some((c) => c.km <= DOOR_ALIGHT_KM && search.bestAtStop.has(c.stop.id)),
      hasClose: toCandidates.some((c) => c.km <= CLOSE_ALIGHT_KM && search.bestAtStop.has(c.stop.id)),
    };
    let best = null;
    toCandidates.forEach((candidate) => {
      if (!search.bestAtStop.has(candidate.stop.id)) return;
      const walkCost = targetSnapWalkCost(candidate.km, bands);
      const total = search.bestAtStop.get(candidate.stop.id) + walkCost;
      const realTotal = search.bestRealMinutesAtStop.get(candidate.stop.id) + walkMinutes(candidate.km);
      if (!best || total < best.total) {
        best = { total: total, stopId: candidate.stop.id, realTotal: realTotal, snapKm: candidate.km };
      }
    });
    if (!best) return null;

    const pathStopIds = [];
    const edgeAtStop = new Map();
    let curKey = search.bestStateAtStop.get(best.stopId);
    while (curKey) {
      pathStopIds.unshift(search.keyStopId.get(curKey));
      const prevHop = search.prev.get(curKey);
      if (prevHop) edgeAtStop.set(search.keyStopId.get(curKey), { lineId: prevHop.lineId, mode: prevHop.mode });
      curKey = prevHop ? prevHop.fromKey : null;
    }

    if (fixedSide === "dest") {
      const reversedIds = pathStopIds.slice().reverse();
      const reversedEdgeAtStop = new Map();
      for (let i = 0; i < pathStopIds.length - 1; i++) {
        reversedEdgeAtStop.set(pathStopIds[i], edgeAtStop.get(pathStopIds[i + 1]));
      }
      return {
        totalMinutes: best.realTotal,
        pathStopIds: reversedIds,
        edgeAtStop: reversedEdgeAtStop,
        snappedStopId: best.stopId,
        snapKm: best.snapKm,
      };
    }

    return {
      totalMinutes: best.realTotal,
      pathStopIds: pathStopIds,
      edgeAtStop: edgeAtStop,
      snappedStopId: best.stopId,
      snapKm: best.snapKm,
    };
  }

  function geometryAlongLine(graph, lineId, fromId, toId) {
    const line = graph.linesByLocalId.get(lineId);
    const fallback = [fromId, toId].filter(Boolean);
    if (!line || !line.stopIds) return fallback;
    const ids = line.stopIds;
    const fromIndex = ids.indexOf(fromId);
    const toIndex = ids.indexOf(toId);
    if (fromIndex < 0 || toIndex < 0) return fallback;
    return fromIndex <= toIndex ? ids.slice(fromIndex, toIndex + 1) : ids.slice(toIndex, fromIndex + 1).reverse();
  }

  function pathToSteps(pathStopIds, edgeAtStop, graph) {
    const rawEdges = [];
    for (let i = 1; i < pathStopIds.length; i++) {
      const info = edgeAtStop.get(pathStopIds[i]) || { lineId: null, mode: "yurume" };
      rawEdges.push({ from: pathStopIds[i - 1], to: pathStopIds[i], lineId: info.lineId, mode: info.mode });
    }
    const meaningful = rawEdges.filter((edge) => {
      if (edge.lineId) return true;
      const a = graph.stopsById.get(edge.from);
      const b = graph.stopsById.get(edge.to);
      if (!a || !b) return false;
      return haversineKm(a, b) > WALK_STEP_MIN_KM;
    });
    const merged = [];
    meaningful.forEach((edge) => {
      const last = merged[merged.length - 1];
      if (last && last.lineId === edge.lineId) last.to = edge.to;
      else merged.push({ lineId: edge.lineId, mode: edge.mode, from: edge.from, to: edge.to });
    });
    return merged.map((step) => {
      const fromStop = graph.stopsById.get(step.from);
      const toStop = graph.stopsById.get(step.to);
      const geometryStopIds = step.lineId
        ? geometryAlongLine(graph, step.lineId, step.from, step.to)
        : [step.from, step.to];
      if (step.lineId) {
        const line = graph.linesByLocalId.get(step.lineId);
        return {
          mode: line ? line.mode : step.mode,
          line: line ? line.name : "Hat",
          hatNo: line ? line.hatNo : null,
          from: fromStop ? fromStop.name : step.from,
          to: toStop ? toStop.name : step.to,
          verified: line ? line.verified !== false : true,
          lineId: step.lineId,
          fromStopId: step.from,
          toStopId: step.to,
          geometryStopIds: geometryStopIds,
          fallbackWaitMin: line ? boardingWaitMin(lineHeadwayMin(line)) : boardingWaitMin(null),
        };
      }
      return {
        mode: "yurume",
        line: "Yürüyüş",
        hatNo: null,
        from: fromStop ? fromStop.name : step.from,
        to: toStop ? toStop.name : step.to,
        verified: true,
        lineId: null,
        fromStopId: step.from,
        toStopId: step.to,
        geometryStopIds: geometryStopIds,
      };
    });
  }

  function unverifiedRoute(origin, dest) {
    const distanceKm = haversineKm(origin, dest);
    const durationMin = Math.max(roundTo5((distanceKm / 18) * 60 + 10), 12);
    return {
      durationMin: durationMin,
      rawMinutes: durationMin,
      transfers: 0,
      distanceKm: distanceKm,
      verified: false,
      snappedStopId: null,
      snapKm: null,
      walkPenaltyFactor: WALK_PENALTY_FACTOR,
      liveFallback: true,
      steps: [
        {
          mode: "otobus",
          line: "Yerel hat (doğrulanamadı)",
          from: origin.name,
          to: dest.name,
          verified: false,
          lineId: null,
          approx: true,
        },
      ],
      pathStopIds: [],
    };
  }

  let transitGraph = null;

  function dataStore() {
    if (typeof ISTANBUL_AVRUPA_DATA !== "undefined") return ISTANBUL_AVRUPA_DATA;
    return null;
  }

  function ensureGraph() {
    if (transitGraph) return transitGraph;
    const network = dataStore();
    if (!network) return null;
    transitGraph = buildTransitGraph(network);
    return transitGraph;
  }

  function plan(originInput, destInput, options) {
    const origin = asPoint(originInput);
    const dest = asPoint(destInput);
    if (!origin || !dest) return null;
    const opts = options || {};
    const graph = opts.graph || ensureGraph();
    const distanceKm = haversineKm(origin, dest);
    if (!graph) return unverifiedRoute(origin, dest);
    const fixedSide = opts.fixedSide || "origin";
    const transferPenaltyMin = opts.transferPenaltyMin != null ? opts.transferPenaltyMin : PRIMARY_TRANSFER_PENALTY_MIN;
    const route = findRealRoute(origin, dest, graph, fixedSide, transferPenaltyMin);
    if (!route) return unverifiedRoute(origin, dest);

    const steps = pathToSteps(route.pathStopIds, route.edgeAtStop, graph);
    const firstStop = graph.stopsById.get(route.pathStopIds[0]);
    const lastStop = graph.stopsById.get(route.pathStopIds[route.pathStopIds.length - 1]);
    if (firstStop && lastStop) {
      const firstWalkKm = haversineKm(origin, firstStop);
      const lastWalkKm = haversineKm(lastStop, dest);
      if (lastWalkKm > WALK_STEP_MIN_KM) {
        steps.push({
          mode: "yurume",
          line: "Yürüyüş",
          from: lastStop.name,
          to: dest.name,
          verified: true,
          lineId: null,
          fromStopId: lastStop.id,
          toStopId: null,
        });
      }
      if (firstWalkKm > WALK_STEP_MIN_KM) {
        steps.unshift({
          mode: "yurume",
          line: "Yürüyüş",
          from: origin.name,
          to: firstStop.name,
          verified: true,
          lineId: null,
          fromStopId: null,
          toStopId: firstStop.id,
        });
      }
    }
    const rideSteps = steps.filter((step) => step.lineId);
    const transfers = Math.max(rideSteps.length - 1, 0);
    const verified = rideSteps.every((step) => step.verified !== false);
    const firstRide = rideSteps[0] || null;
    return {
      durationMin: Math.max(roundTo5(route.totalMinutes), 5),
      rawMinutes: route.totalMinutes,
      transfers: transfers,
      distanceKm: distanceKm,
      verified: verified,
      snappedStopId: route.snappedStopId,
      snapKm: route.snapKm,
      walkPenaltyFactor: WALK_PENALTY_FACTOR,
      liveFallback: true,
      boardingFallbackMin: firstRide ? firstRide.fallbackWaitMin : null,
      steps: steps,
      pathStopIds: route.pathStopIds,
    };
  }

  function firstBoard(route) {
    if (!route || !route.steps) return null;
    const step = route.steps.find((item) => item.lineId);
    if (!step) return null;
    const graph = ensureGraph();
    const line = graph && graph.linesByLocalId.get(step.lineId);
    const stop = step.fromStopId && graph ? graph.stopsById.get(step.fromStopId) : null;
    return {
      step: step,
      line: line || null,
      stop: stop,
      hatNo: (line && line.hatNo) || step.hatNo || null,
      stopId: step.fromStopId || null,
      liveStopNo: stop && stop.liveStopNo ? String(stop.liveStopNo) : null,
      fallbackWaitMin: step.fallbackWaitMin != null ? step.fallbackWaitMin : boardingWaitMin(lineHeadwayMin(line)),
    };
  }

  function defaultGetLive(board) {
    const url = "/api/live-arrival?hat=" + encodeURIComponent(board.hatNo) + "&durak=" + encodeURIComponent(board.liveStopNo);
    return fetch(url, { headers: { Accept: "application/json" } })
      .then((res) => {
        if (!res.ok) throw new Error("live " + res.status);
        return res.json();
      })
      .then((body) => {
        const rows = (body && body.table) || [];
        let best = null;
        rows.forEach((row) => {
          const codes = [row.hat_no, row.hat_kod].map((value) => (value == null ? "" : String(value)));
          if (codes.indexOf(String(board.hatNo)) === -1) return;
          const seconds = Number(row.saniye);
          if (!Number.isFinite(seconds) || seconds >= 999000) return;
          if (/geçti/i.test(String(row.sure || ""))) return;
          if (best == null || seconds < best) best = seconds;
        });
        if (best == null) return null;
        if (best <= 0) return 0;
        return Math.max(1, Math.ceil(best / 60));
      });
  }

  function withLiveFallback(route, options) {
    if (!route) return Promise.resolve(null);
    const board = firstBoard(route);
    const staticLive = {
      source: "static",
      estimatedWaitMin: board ? board.fallbackWaitMin : null,
      hatNo: board ? board.hatNo : null,
      stopId: board ? board.stopId : null,
    };
    function finishStatic(reason) {
      route.live = Object.assign({ reason: reason }, staticLive);
      route.liveFallback = true;
      return route;
    }
    if (!board || !board.liveStopNo || !board.hatNo) return Promise.resolve(finishStatic("no-live-id"));
    const loader = (options && options.getLive) || defaultGetLive;
    return Promise.resolve()
      .then(() => loader(board))
      .then((minutes) => {
        if (minutes == null) return finishStatic("empty");
        const base = typeof route.rawMinutes === "number" ? route.rawMinutes : route.durationMin;
        route.durationMin = Math.max(roundTo5(base - board.fallbackWaitMin + minutes), 5);
        route.live = {
          source: "live",
          estimatedWaitMin: minutes,
          hatNo: board.hatNo,
          stopId: board.stopId,
        };
        route.liveFallback = false;
        return route;
      })
      .catch(() => finishStatic("error"));
  }

  function routing_engine(origin, destination, options) {
    const route = plan(origin, destination, options);
    if (options && options.liveFallback === false) return Promise.resolve(route);
    return withLiveFallback(route, options);
  }

  routing_engine.plan = plan;
  routing_engine.withLiveFallback = withLiveFallback;
  routing_engine.firstBoard = firstBoard;
  routing_engine.ensureGraph = ensureGraph;
  Object.defineProperty(routing_engine, "graph", {
    get: function () {
      return ensureGraph();
    },
  });
  routing_engine.internals = {
    WALK_PENALTY_FACTOR: WALK_PENALTY_FACTOR,
    DOOR_ALIGHT_KM: DOOR_ALIGHT_KM,
    targetSnapWalkCost: targetSnapWalkCost,
    haversineKm: haversineKm,
    boardingWaitMin: boardingWaitMin,
    buildTransitGraph: buildTransitGraph,
    MIN_TRANSFERS_PENALTY_MIN: MIN_TRANSFERS_PENALTY_MIN,
    PRIMARY_TRANSFER_PENALTY_MIN: PRIMARY_TRANSFER_PENALTY_MIN,
  };

  root.routing_engine = routing_engine;
  root.haversineKm = haversineKm;
})(typeof window !== "undefined" ? window : globalThis);
