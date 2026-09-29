/**
 * İstanbul Avrupa Yakası güvenlik projeleri — arayüz.
 * Classic script. ISTANBUL_AVRUPA_DATA ve routing_engine yüklü olmalı.
 */
const DATA = ISTANBUL_AVRUPA_DATA;
const PROJECT_CACHE_KEY = "ik_avrupa_guvenlik_projects_v1";
const GEOCODE_CACHE_KEY = "ik_avrupa_guvenlik_geocode_v1";

const ARMED_LABEL = { silahli: "Silahlı", silahsiz: "Silahsız" };
const DUTY_LABEL = { danisma: "Danışma", gozetim: "Gözetim", karma: "Karma" };
const MODE_ICON = {
  metro: "🚇",
  tramvay: "🚊",
  marmaray: "🚆",
  metrobus: "🚌",
  otobus: "🚍",
  yurume: "🚶",
};
const MODE_COLOR = {
  metro: "#7c3aed",
  tramvay: "#0f766e",
  marmaray: "#0369a1",
  metrobus: "#c2410c",
  otobus: "#334155",
  yurume: "#94a3b8",
};

function loadStoredProjects() {
  try {
    const raw = JSON.parse(localStorage.getItem(PROJECT_CACHE_KEY) || "[]");
    if (Array.isArray(raw)) raw.forEach((item) => DATA.projects.push(createSecurityProject(item)));
  } catch {
    /* boş havuz */
  }
}
loadStoredProjects();

function saveProjects() {
  localStorage.setItem(PROJECT_CACHE_KEY, JSON.stringify(DATA.projects));
}

let URGENT_PROJECT_IDS = new Set();
let INACTIVE_PROJECT_IDS = new Set();
function recomputeFlags() {
  URGENT_PROJECT_IDS = new Set(DATA.projects.filter((p) => p.urgent).map((p) => p.id));
  INACTIVE_PROJECT_IDS = new Set(DATA.projects.filter((p) => !p.active).map((p) => p.id));
}
recomputeFlags();

function activeProjects() {
  return DATA.projects.filter((p) => !INACTIVE_PROJECT_IDS.has(p.id));
}

function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[ch]));
}

const mapView = DATA.map || { center: [41.05, 28.9], zoom: 11 };
const map = L.map("map", { zoomControl: true }).setView(mapView.center, mapView.zoom);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap",
}).addTo(map);
L.control.scale({ metric: true, imperial: false, position: "bottomright" }).addTo(map);

const projectIcon = L.divIcon({ className: "", html: '<div class="pin pin-project"></div>', iconSize: [22, 22], iconAnchor: [11, 22] });
const urgentProjectIcon = L.divIcon({ className: "", html: '<div class="pin pin-project pin-project-urgent"></div>', iconSize: [24, 24], iconAnchor: [12, 24] });
function districtIcon(color) {
  return L.divIcon({
    className: "",
    html: `<div class="pin pin-district" style="background:${color}"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

const markersLayer = L.layerGroup().addTo(map);
const routesLayer = L.layerGroup().addTo(map);
const projectCluster = L.markerClusterGroup({
  maxClusterRadius: 45,
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  iconCreateFunction: (cluster) => L.divIcon({
    html: `<div>${cluster.getChildCount()}</div>`,
    className: "marker-cluster-custom",
    iconSize: [38, 38],
  }),
});
map.addLayer(projectCluster);
const projectMarkersById = {};
const districtMarkersById = {};

function buildProjectMarker(project) {
  const urgent = URGENT_PROJECT_IDS.has(project.id);
  const marker = L.marker([project.lat, project.lng], { icon: urgent ? urgentProjectIcon : projectIcon });
  marker.bindTooltip(`${urgent ? "ACİL — " : ""}${project.name} — ${project.address}`, { direction: "top" });
  projectMarkersById[project.id] = marker;
  if (!INACTIVE_PROJECT_IDS.has(project.id)) projectCluster.addLayer(marker);
}
function rebuildProjectMarkers() {
  projectCluster.clearLayers();
  Object.keys(projectMarkersById).forEach((id) => delete projectMarkersById[id]);
  DATA.projects.forEach(buildProjectMarker);
}
rebuildProjectMarkers();

DATA.districts.forEach((district) => {
  const marker = L.circleMarker([district.lat, district.lng], {
    radius: 5,
    color: "#4f46e5",
    weight: 1,
    fillColor: "#c7d2fe",
    fillOpacity: 0.9,
  }).addTo(markersLayer);
  marker.bindTooltip(district.name, { direction: "top" });
});

const districtSelect = document.getElementById("districtSelect");
const neighborhoodSelect = document.getElementById("neighborhoodSelect");
const projectSelect = document.getElementById("projectSelect");
const originPanel = document.getElementById("panel-origin");
const projectPanel = document.getElementById("panel-project");
const resultsList = document.getElementById("resultsList");
const resultsHeading = document.getElementById("resultsHeading");
const emptyState = document.getElementById("emptyState");
const routeDetail = document.getElementById("routeDetail");
const routeDetailTitle = document.getElementById("routeDetailTitle");
const routeDetailSteps = document.getElementById("routeDetailSteps");
const routeDetailWarning = document.getElementById("routeDetailWarning");
const routeDetailVariantToggle = document.getElementById("routeDetailVariantToggle");
const addressInput = document.getElementById("addressInput");
const addressStatus = document.getElementById("addressStatus");

DATA.districts
  .slice()
  .sort((a, b) => a.name.localeCompare(b.name, "tr"))
  .forEach((district) => {
    const option = document.createElement("option");
    option.value = district.id;
    option.textContent = district.name;
    districtSelect.appendChild(option);
  });

function fillNeighborhoods(districtId) {
  neighborhoodSelect.innerHTML = "";
  const district = DATA.districts.find((item) => item.id === districtId);
  if (!district) {
    neighborhoodSelect.disabled = true;
    neighborhoodSelect.innerHTML = '<option value="">Önce ilçe seçin</option>';
    return;
  }
  neighborhoodSelect.disabled = false;
  const center = document.createElement("option");
  center.value = district.id;
  center.textContent = district.name + " (ilçe merkezi)";
  neighborhoodSelect.appendChild(center);
  (district.neighborhoods || [])
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, "tr"))
    .forEach((neighborhood) => {
      const option = document.createElement("option");
      option.value = neighborhood.id;
      option.textContent = neighborhood.name;
      neighborhoodSelect.appendChild(option);
    });
}

let customOrigin = null;
function allOrigins() {
  const rows = [];
  DATA.districts.forEach((district) => {
    rows.push({
      id: district.id,
      name: district.name + " (ilçe merkezi)",
      districtName: district.name,
      lat: district.lat,
      lng: district.lng,
    });
    (district.neighborhoods || []).forEach((neighborhood) => {
      rows.push({
        id: neighborhood.id,
        name: neighborhood.name + " / " + district.name,
        districtName: district.name,
        lat: neighborhood.lat,
        lng: neighborhood.lng,
      });
    });
  });
  if (customOrigin) rows.push(customOrigin);
  return rows;
}
function originById(id) {
  return allOrigins().find((item) => item.id === id) || null;
}
function projectById(id) {
  return DATA.projects.find((item) => item.id === id) || null;
}
function currentOriginId() {
  if (customOrigin && neighborhoodSelect.value === customOrigin.id) return customOrigin.id;
  return neighborhoodSelect.value || "";
}

let currentMode = "origin-to-project";
let currentThreshold = null;
let currentPosition = null;
let activeEstimate = null;
let useFewestTransfers = false;

function applyPositionFilter(projects) {
  return currentPosition ? projects.filter((project) => project.position === currentPosition) : projects;
}

function durationBucket(min) {
  if (min <= 30) return { color: "#15803d", label: "kısa" };
  if (min <= 45) return { color: "#a16207", label: "orta" };
  if (min <= 60) return { color: "#c2410c", label: "uzun" };
  return { color: "#b91c1c", label: "çok uzun" };
}

function pointOf(item) {
  return { lat: item.lat, lng: item.lng, name: item.name };
}

function rankProjectsForOrigin(originId, thresholdMin) {
  const origin = originById(originId);
  if (!origin) return [];
  const rows = applyPositionFilter(activeProjects()).map((project) => {
    const route = routing_engine.plan(pointOf(origin), pointOf(project), { fixedSide: "origin" });
    return Object.assign({ project: project, origin: origin }, route);
  });
  rows.sort((a, b) => {
    const aUrgent = URGENT_PROJECT_IDS.has(a.project.id) ? 0 : 1;
    const bUrgent = URGENT_PROJECT_IDS.has(b.project.id) ? 0 : 1;
    if (aUrgent !== bUrgent) return aUrgent - bUrgent;
    return a.durationMin - b.durationMin;
  });
  return thresholdMin == null ? rows : rows.filter((row) => row.durationMin <= thresholdMin || URGENT_PROJECT_IDS.has(row.project.id));
}

function rankDistrictsForProject(projectId, thresholdMin) {
  const project = projectById(projectId);
  if (!project) return [];
  const rows = DATA.districts.map((district) => {
    const route = routing_engine.plan(pointOf(district), pointOf(project), { fixedSide: "dest" });
    return Object.assign({ district: district, project: project }, route);
  });
  rows.sort((a, b) => a.durationMin - b.durationMin);
  return thresholdMin == null ? rows : rows.filter((row) => row.durationMin <= thresholdMin);
}

function rebuildProjectSelect() {
  const previous = projectSelect.value;
  projectSelect.innerHTML = '<option value="">Seçiniz…</option>';
  applyPositionFilter(activeProjects())
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, "tr"))
    .forEach((project) => {
      const option = document.createElement("option");
      option.value = project.id;
      option.textContent = project.name + " — " + project.position;
      projectSelect.appendChild(option);
    });
  if (previous && projectById(previous) && !INACTIVE_PROJECT_IDS.has(previous)) projectSelect.value = previous;
}
rebuildProjectSelect();

function clearResults() {
  resultsList.innerHTML = "";
  resultsHeading.textContent = "";
  emptyState.classList.remove("hidden");
  routeDetail.classList.add("hidden");
  routesLayer.clearLayers();
  Object.values(districtMarkersById).forEach((marker) => markersLayer.removeLayer(marker));
  for (const key in districtMarkersById) delete districtMarkersById[key];
}

function securityTerms(project) {
  return {
    salary: project.salary || "—",
    meal: project.meal || "—",
    transport: project.shuttle ? "Servis" : (project.transport || "—"),
    shift: (project.shiftPattern || "") + (project.shift ? " · " + project.shift : ""),
    armed: ARMED_LABEL[project.armed] || project.armed,
    duty: DUTY_LABEL[project.duty] || project.duty,
  };
}

function buildResultCard(opts) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "result-card" + (opts.highlight ? " result-card-active" : "") + (opts.urgent ? " result-card-urgent" : "");
  const terms = opts.terms;
  const termsRow = terms
    ? `<div class="result-card-terms">
        <span>${escapeHtml(terms.armed)}</span>
        <span>${escapeHtml(terms.duty)}</span>
        <span>⏰ ${escapeHtml(terms.shift)}</span>
        <span>🍽️ ${escapeHtml(terms.meal)}</span>
        <span>🚌 ${escapeHtml(terms.transport)}</span>
      </div>`
    : "";
  const shuttle = terms && terms.transport === "Servis"
    ? '<div class="result-card-servis-note">Servis imkanı var. Süre, omurga toplu taşıma hesabıdır.</div>'
    : "";
  const referral = opts.referral ? `<div class="result-card-referral">${escapeHtml(opts.referral)}</div>` : "";
  card.innerHTML = `
    ${opts.urgent ? '<span class="result-card-urgent-badge">ACİL</span>' : ""}
    <div class="flex items-center justify-between gap-2">
      <div class="min-w-0">
        <div class="font-semibold text-slate-800 truncate">${escapeHtml(opts.title)}</div>
        <div class="text-xs text-slate-500 truncate">${escapeHtml(opts.subtitle)}</div>
      </div>
      <div class="flex flex-col items-end shrink-0">
        <span class="duration-badge" data-role="duration" style="background:${opts.bucket.color}1a; color:${opts.bucket.color}">~${opts.durationMin} dk</span>
        <span class="text-[11px] text-slate-400 mt-1">${opts.transfers} aktarma</span>
      </div>
    </div>
    ${referral}
    ${termsRow}
    ${shuttle}
    <div data-role="live-arrival"></div>`;
  card.addEventListener("click", () => {
    document.querySelectorAll(".result-card").forEach((item) => item.classList.remove("result-card-active"));
    card.classList.add("result-card-active");
    opts.onClick();
  });
  attachLiveArrival(card, opts.liveRow);
  return card;
}

function attachLiveArrival(card, row) {
  const slot = card.querySelector("[data-role='live-arrival']");
  if (!row || !window.LiveBus) return;
  const board = routing_engine.firstBoard(row);
  if (!board) {
    slot.textContent = "";
    return;
  }
  slot.innerHTML = `<div class="live-arrival live-arrival-static">Statik sefer: ~${board.fallbackWaitMin} dk bekleme</div>`;
  LiveBus.getLiveBusArrival(board.stopId, board.line && board.line.id, {
    hatNo: board.hatNo,
    liveStopNo: board.liveStopNo,
    fallbackWaitMin: board.fallbackWaitMin,
  }).then((result) => {
    if (!card.isConnected) return;
    if (result.source === "live") {
      const base = typeof row.rawMinutes === "number" ? row.rawMinutes : row.durationMin;
      const total = Math.max(Math.round((base - board.fallbackWaitMin + result.estimatedWaitMin) / 5) * 5, 5);
      slot.innerHTML = `<div class="live-arrival live-arrival-live">Canlı: hat ${escapeHtml(result.hatNo)} · ${result.estimatedWaitMin} dk</div>`;
      const badge = card.querySelector("[data-role='duration']");
      if (badge) badge.textContent = "~" + total + " dk";
    } else {
      slot.innerHTML = `<div class="live-arrival live-arrival-static">Statik sefer: ~${result.estimatedWaitMin} dk bekleme</div>`;
    }
  });
}

function renderSteps(steps) {
  routeDetailSteps.innerHTML = (steps || []).map((step, index) => {
    const icon = MODE_ICON[step.mode] || "•";
    const verb = step.lineId ? "biniş" : "yürüyüş";
    return `<div class="route-step">
      <span class="route-step-num">${index + 1}</span>
      <span class="route-step-icon">${icon}</span>
      <div>
        <div class="route-step-line">${escapeHtml(step.line)}</div>
        <div class="route-step-stops">${escapeHtml(step.from)} → ${escapeHtml(step.to)} · ${verb}</div>
      </div>
    </div>`;
  }).join("");
}

function drawRoute(route, destLatLng) {
  routesLayer.clearLayers();
  if (!route) return;
  const graph = routing_engine.graph;
  const latlngs = [];
  (route.pathStopIds || []).forEach((id) => {
    const stop = graph && graph.stopsById.get(id);
    if (stop) latlngs.push([stop.lat, stop.lng]);
  });
  if (destLatLng) latlngs.push([destLatLng.lat, destLatLng.lng]);
  if (latlngs.length >= 2) {
    const line = L.polyline(latlngs, { color: "#4f46e5", weight: 5, opacity: 0.85 }).addTo(routesLayer);
    map.fitBounds(line.getBounds().pad(0.2), { animate: true });
  }
  const snap = route.snappedStopId && graph && graph.stopsById.get(route.snappedStopId);
  if (snap) {
    L.circleMarker([snap.lat, snap.lng], { radius: 7, color: "#ea4335", weight: 2, fillOpacity: 0.9 })
      .bindTooltip("Hedef durak: " + snap.name, { direction: "top" })
      .addTo(routesLayer);
  }
  (route.steps || []).forEach((step) => {
    if (!step.lineId || !graph) return;
    const from = graph.stopsById.get(step.fromStopId);
    const to = graph.stopsById.get(step.toStopId);
    if (!from || !to) return;
    L.polyline([[from.lat, from.lng], [to.lat, to.lng]], {
      color: MODE_COLOR[step.mode] || "#4f46e5",
      weight: 4,
      opacity: 0.35,
    }).addTo(routesLayer);
  });
}

function showRouteResult(row) {
  activeEstimate = row;
  useFewestTransfers = false;
  routeDetail.classList.remove("hidden");
  routeDetailVariantToggle.classList.remove("hidden");
  document.getElementById("routeVariantFastestBtn").classList.add("mode-btn-active");
  document.getElementById("routeVariantFewestBtn").classList.remove("mode-btn-active");
  routeDetailTitle.textContent = `Rota · ${row.transfers} aktarma · ~${row.durationMin} dk`;
  routeDetailWarning.classList.toggle("hidden", row.verified !== false);
  renderSteps(row.steps);
}

document.getElementById("routeVariantFastestBtn").addEventListener("click", () => {
  if (!activeEstimate) return;
  useFewestTransfers = false;
  document.getElementById("routeVariantFastestBtn").classList.add("mode-btn-active");
  document.getElementById("routeVariantFewestBtn").classList.remove("mode-btn-active");
  routeDetailTitle.textContent = `Rota · ${activeEstimate.transfers} aktarma · ~${activeEstimate.durationMin} dk`;
  renderSteps(activeEstimate.steps);
  drawRoute(activeEstimate, activeEstimate.project);
});
document.getElementById("routeVariantFewestBtn").addEventListener("click", () => {
  if (!activeEstimate) return;
  useFewestTransfers = true;
  const alt = routing_engine.plan(
    pointOf(activeEstimate.origin || activeEstimate.district),
    pointOf(activeEstimate.project),
    {
      fixedSide: activeEstimate.origin ? "origin" : "dest",
      transferPenaltyMin: routing_engine.internals.MIN_TRANSFERS_PENALTY_MIN,
    }
  );
  document.getElementById("routeVariantFewestBtn").classList.add("mode-btn-active");
  document.getElementById("routeVariantFastestBtn").classList.remove("mode-btn-active");
  routeDetailTitle.textContent = `En az aktarma · ${alt.transfers} aktarma · ~${alt.durationMin} dk`;
  routeDetailWarning.classList.toggle("hidden", alt.verified !== false);
  renderSteps(alt.steps);
  drawRoute(alt, activeEstimate.project);
});

function renderOriginToProject(originId) {
  const rows = rankProjectsForOrigin(originId, currentThreshold);
  routesLayer.clearLayers();
  const origin = originById(originId);
  emptyState.classList.toggle("hidden", rows.length > 0);
  emptyState.textContent = rows.length ? "" : "Bu ilçe için açık güvenlik projesi yok. Proje Ekle ile kayıt açın.";
  resultsHeading.textContent = origin.name + " → projeler (" + rows.length + ")";
  map.setView([origin.lat, origin.lng], 12, { animate: true });
  resultsList.innerHTML = "";
  rows.forEach((row, index) => {
    const bucket = durationBucket(row.durationMin);
    resultsList.appendChild(buildResultCard({
      title: row.project.name,
      subtitle: row.project.position + " · " + row.project.address,
      durationMin: row.durationMin,
      transfers: row.transfers,
      bucket: bucket,
      terms: securityTerms(row.project),
      urgent: URGENT_PROJECT_IDS.has(row.project.id),
      referral: row.project.referral,
      highlight: index === 0,
      liveRow: row,
      onClick: () => {
        drawRoute(row, row.project);
        showRouteResult(row);
      },
    }));
    if (index === 0) {
      drawRoute(row, row.project);
      showRouteResult(row);
    }
  });
  if (!rows.length) routeDetail.classList.add("hidden");
}

function renderProjectToOrigin(projectId) {
  const rows = rankDistrictsForProject(projectId, currentThreshold);
  routesLayer.clearLayers();
  Object.values(districtMarkersById).forEach((marker) => markersLayer.removeLayer(marker));
  for (const key in districtMarkersById) delete districtMarkersById[key];
  const project = projectById(projectId);
  emptyState.classList.toggle("hidden", rows.length > 0);
  resultsHeading.textContent = project.name + " → ilçeler (" + rows.length + ")";
  map.setView([project.lat, project.lng], 11, { animate: true });
  resultsList.innerHTML = "";
  rows.forEach((row, index) => {
    const bucket = durationBucket(row.durationMin);
    const marker = L.marker([row.district.lat, row.district.lng], { icon: districtIcon(bucket.color) }).addTo(markersLayer);
    marker.bindTooltip(row.district.name + " · ~" + row.durationMin + " dk", { direction: "top" });
    districtMarkersById[row.district.id] = marker;
    resultsList.appendChild(buildResultCard({
      title: row.district.name,
      subtitle: "İlçe merkezi",
      durationMin: row.durationMin,
      transfers: row.transfers,
      bucket: bucket,
      highlight: index === 0,
      liveRow: row,
      onClick: () => {
        drawRoute(row, project);
        showRouteResult(row);
      },
    }));
    if (index === 0) {
      drawRoute(row, project);
      showRouteResult(row);
    }
  });
}

function runSearch() {
  if (currentMode === "origin-to-project") {
    const originId = currentOriginId();
    if (!originId) return clearResults();
    renderOriginToProject(originId);
    return;
  }
  if (currentMode === "project-to-candidates") {
    if (!projectSelect.value || typeof window.renderProjectToCandidates !== "function") return clearResults();
    window.renderProjectToCandidates(projectSelect.value);
    return;
  }
  if (!projectSelect.value) return clearResults();
  renderProjectToOrigin(projectSelect.value);
}

document.querySelectorAll(".mode-btn[data-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    currentMode = button.dataset.mode;
    document.querySelectorAll(".mode-btn[data-mode]").forEach((item) => item.classList.toggle("mode-btn-active", item === button));
    const showProject = currentMode !== "origin-to-project";
    originPanel.classList.toggle("hidden", showProject);
    projectPanel.classList.toggle("hidden", !showProject);
    if (currentMode === "project-to-candidates" && typeof window.openCandidateView === "function") {
      window.openCandidateView(projectSelect.value);
      return;
    }
    runSearch();
  });
});

districtSelect.addEventListener("change", () => {
  customOrigin = null;
  fillNeighborhoods(districtSelect.value);
  runSearch();
});
neighborhoodSelect.addEventListener("change", () => {
  customOrigin = null;
  runSearch();
});
projectSelect.addEventListener("change", runSearch);

document.querySelectorAll(".threshold-btn[data-threshold]").forEach((button) => {
  button.addEventListener("click", () => {
    currentThreshold = button.dataset.threshold === "all" ? null : Number(button.dataset.threshold);
    document.querySelectorAll(".threshold-btn[data-threshold]").forEach((item) => {
      item.classList.toggle("threshold-btn-active", item === button);
    });
    runSearch();
  });
});
document.querySelectorAll(".position-btn").forEach((button) => {
  button.addEventListener("click", () => {
    currentPosition = button.dataset.position === "all" ? null : button.dataset.position;
    document.querySelectorAll(".position-btn").forEach((item) => item.classList.toggle("threshold-btn-active", item === button));
    rebuildProjectSelect();
    runSearch();
  });
});

function readJsonCache(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch {
    return {};
  }
}

async function geocodeAddress(query) {
  const cache = readJsonCache(GEOCODE_CACHE_KEY);
  const cacheKey = query.trim().toLocaleLowerCase("tr");
  if (cache[cacheKey]) return cache[cacheKey];
  const url = "https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=tr&bounded=1"
    + "&viewbox=28.15,41.45,29.25,40.80&q=" + encodeURIComponent(query + ", İstanbul, Türkiye");
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("adres bulunamadı");
  const data = await res.json();
  if (!data.length) return null;
  const result = {
    label: data[0].display_name.split(",").slice(0, 2).join(",").trim(),
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
  cache[cacheKey] = result;
  localStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify(cache));
  return result;
}

document.getElementById("addressSearchBtn").addEventListener("click", async () => {
  const query = addressInput.value.trim();
  if (!query) return;
  addressStatus.textContent = "Aranıyor…";
  try {
    const hit = await geocodeAddress(query);
    if (!hit) {
      addressStatus.textContent = "Avrupa yakası sınırında sonuç yok.";
      return;
    }
    customOrigin = { id: "custom_" + hit.lat.toFixed(4) + "_" + hit.lng.toFixed(4), name: hit.label, lat: hit.lat, lng: hit.lng };
    neighborhoodSelect.disabled = false;
    const option = document.createElement("option");
    option.value = customOrigin.id;
    option.textContent = hit.label;
    neighborhoodSelect.appendChild(option);
    neighborhoodSelect.value = customOrigin.id;
    addressStatus.textContent = hit.label;
    currentMode = "origin-to-project";
    originPanel.classList.remove("hidden");
    projectPanel.classList.add("hidden");
    runSearch();
  } catch (error) {
    addressStatus.textContent = "Adres servisi yanıt vermedi.";
  }
});
addressInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") document.getElementById("addressSearchBtn").click();
});

function nearestStopId(lat, lng) {
  const graph = routing_engine.graph;
  let best = null;
  let bestKm = Infinity;
  graph.stopsById.forEach((stop) => {
    const km = haversineKm({ lat: lat, lng: lng }, stop);
    if (km < bestKm) {
      bestKm = km;
      best = stop.id;
    }
  });
  return best;
}

const addProjectModal = document.getElementById("addProjectModal");
function openAddProject() { addProjectModal.classList.remove("hidden"); }
function closeAddProject() { addProjectModal.classList.add("hidden"); }
document.getElementById("addProjectBtn").addEventListener("click", openAddProject);
document.getElementById("addProjectClose").addEventListener("click", closeAddProject);
document.getElementById("addProjectCancel").addEventListener("click", closeAddProject);
document.getElementById("addProjectForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.target;
  const status = document.getElementById("addProjectStatus");
  const data = Object.fromEntries(new FormData(form).entries());
  data.shuttle = form.elements.shuttle.checked;
  status.textContent = "Konum aranıyor…";
  try {
    const hit = await geocodeAddress(data.address);
    if (!hit) {
      status.textContent = "Adres çözülemedi. Avrupa yakası içinde daha açık yazın.";
      return;
    }
    const project = createSecurityProject(Object.assign({}, data, {
      lat: hit.lat,
      lng: hit.lng,
      accessStopId: nearestStopId(hit.lat, hit.lng),
    }));
    DATA.projects.push(project);
    saveProjects();
    recomputeFlags();
    rebuildProjectMarkers();
    rebuildProjectSelect();
    form.reset();
    status.textContent = "Kaydedildi: " + hit.label;
    closeAddProject();
    if (currentOriginId()) runSearch();
  } catch (error) {
    status.textContent = "Kayıt sırasında adres servisi yanıt vermedi.";
  }
});

function renderFlagModal(listEl, flag) {
  listEl.innerHTML = "";
  if (!DATA.projects.length) {
    listEl.innerHTML = '<p class="text-sm text-slate-400 py-4">Henüz proje yok.</p>';
    return;
  }
  DATA.projects.slice().sort((a, b) => a.name.localeCompare(b.name, "tr")).forEach((project) => {
    const row = document.createElement("label");
    row.className = "flex items-start gap-2 text-sm text-slate-700 py-1";
    const checked = flag === "urgent" ? project.urgent : project.active;
    row.innerHTML = `<input type="checkbox" data-id="${project.id}" ${checked ? "checked" : ""} /> <span>${escapeHtml(project.name)} <span class="text-slate-400">${escapeHtml(project.position)}</span></span>`;
    listEl.appendChild(row);
  });
}
const urgentModal = document.getElementById("urgentModal");
const inactiveModal = document.getElementById("inactiveModal");
document.getElementById("urgentBtn").addEventListener("click", () => {
  renderFlagModal(document.getElementById("urgentModalList"), "urgent");
  urgentModal.classList.remove("hidden");
});
document.getElementById("inactiveBtn").addEventListener("click", () => {
  renderFlagModal(document.getElementById("inactiveModalList"), "active");
  inactiveModal.classList.remove("hidden");
});
document.getElementById("urgentModalClose").addEventListener("click", () => urgentModal.classList.add("hidden"));
document.getElementById("urgentModalCancel").addEventListener("click", () => urgentModal.classList.add("hidden"));
document.getElementById("inactiveModalClose").addEventListener("click", () => inactiveModal.classList.add("hidden"));
document.getElementById("inactiveModalCancel").addEventListener("click", () => inactiveModal.classList.add("hidden"));
document.getElementById("urgentModalSave").addEventListener("click", () => {
  const ids = new Set([...document.querySelectorAll("#urgentModalList input:checked")].map((input) => input.dataset.id));
  DATA.projects.forEach((project) => { project.urgent = ids.has(project.id); });
  saveProjects();
  recomputeFlags();
  rebuildProjectMarkers();
  urgentModal.classList.add("hidden");
  runSearch();
});
document.getElementById("inactiveModalSave").addEventListener("click", () => {
  const ids = new Set([...document.querySelectorAll("#inactiveModalList input:checked")].map((input) => input.dataset.id));
  DATA.projects.forEach((project) => { project.active = ids.has(project.id); });
  saveProjects();
  recomputeFlags();
  rebuildProjectMarkers();
  rebuildProjectSelect();
  inactiveModal.classList.add("hidden");
  runSearch();
});

window.ikApp = {
  runSearch: runSearch,
  activeProjects: activeProjects,
  projectById: projectById,
  originById: originById,
  pointOf: pointOf,
  durationBucket: durationBucket,
  escapeHtml: escapeHtml,
  securityTerms: securityTerms,
  rebuildProjectSelect: rebuildProjectSelect,
  map: map,
  clearMapRoutes: () => routesLayer.clearLayers(),
};
