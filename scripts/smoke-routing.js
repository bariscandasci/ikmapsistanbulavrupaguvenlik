/**
 * Omurga grafı, hedef durak kilidi, yürüme cezası ve canlı sefer yedeği.
 * Çalıştırma: npm test
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const context = { console, fetch: () => Promise.reject(new Error("offline")) };
context.window = context;
context.globalThis = context;
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, "data.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "transit_graph.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "routing_engine.js"), "utf8"), context);

const engine = vm.runInContext("routing_engine", context);
const data = vm.runInContext("ISTANBUL_AVRUPA_DATA", context);
const assert = (cond, message) => {
  if (!cond) throw new Error(message);
};

assert(data.map.center[0] === 41.04 && data.map.center[1] === 28.82 && data.map.zoom === 11, "harita merkezi");
assert(data.projects.length === 7, "PROJE_KONUM kayıtları");
["Torium", "Mall of AVM", "Medipol Hastanesi", "Eti DPO", "Liv Hospital", "Mengenler", "Ortaköy Republika"].forEach((name) => {
  const project = data.projects.find((item) => item.name === name);
  assert(project, "proje eksik: " + name);
  assert(Number.isFinite(project.lat) && Number.isFinite(project.lng), name + " koordinat");
  assert(project.lat > 40.9 && project.lat < 41.3 && project.lng > 28.4 && project.lng < 29.15, name + " Avrupa yakası");
  assert(project.shiftPattern === "2+2+2", name + " vardiya");
});
assert(data.districts.length === 25, "25 Avrupa ilçesi");
["Beşiktaş", "Şişli", "Beyoğlu", "Bakırköy", "Bahçelievler", "Esenyurt", "Başakşehir", "Sarıyer", "Küçükçekmece"].forEach((name) => {
  assert(data.districts.some((d) => d.name === name), "ilçe eksik: " + name);
});
data.districts.forEach((district) => {
  assert(Array.isArray(district.neighborhoods) && district.neighborhoods.length > 0, district.name + " mahalle şablonu");
});

const lineIds = data.transitLines.map((line) => line.id);
["M1A", "M1B", "M2", "M3", "M7", "M9", "M11", "T1", "T4", "T5", "B1", "METROBUS", "IETT_142", "IETT_142ES", "IETT_144"].forEach((id) => {
  assert(lineIds.includes(id), "hat eksik: " + id);
});
const metrobus = data.transitLines.find((line) => line.id === "METROBUS");
assert(metrobus.stopIds[0] === "mb_beylikduzu" && metrobus.stopIds[metrobus.stopIds.length - 1] === "mb_sogutlucesme", "metrobüs Beylikdüzü–Söğütlüçeşme");

const graph = engine.graph;
const yenikapiEdges = graph.adjacency.get("stop_yenikapi") || [];
assert(!yenikapiEdges.some((edge) => edge.to === "stop_seyrantepe"), "M2 Seyrantepe sahte kenarı olmamalı");
const yildizRide = (graph.adjacency.get("stop_yildiz") || []).filter((edge) => edge.lineId);
assert(yildizRide.length && yildizRide.every((edge) => edge.to === "stop_fulya"), "M7 Yıldız yalnızca Fulya'ya bağlanır");

const snap = engine.internals.targetSnapWalkCost;
const near = snap(0.1, { hasDoor: true, hasClose: true });
const far = snap(0.4, { hasDoor: true, hasClose: true });
assert(engine.internals.WALK_PENALTY_FACTOR === 1.5, "yürüme cezası 1.5");
assert(far > near + 30, "hedef durak kilidi uzak inişi cezalandırmalı");

const besiktas = data.districts.find((d) => d.id === "besiktas");
const levent = besiktas.neighborhoods.find((n) => n.id === "besiktas_levent");
const bakirkoy = data.districts.find((d) => d.id === "bakirkoy");
const route = engine.plan(
  { lat: levent.lat, lng: levent.lng, name: "Levent" },
  { lat: bakirkoy.lat, lng: bakirkoy.lng, name: "Bakırköy" }
);
assert(route && route.verified, "Levent → Bakırköy omurgada doğrulanmalı");
assert(route.snappedStopId, "hedef durak kilitlenmeli");
assert(route.durationMin >= 5 && route.durationMin < 150, "süre makul: " + route.durationMin);
assert(route.steps.some((step) => step.lineId), "en az bir hat adımı");
assert(route.liveFallback === true, "canlı sefer öncesi yedek bayrağı");

const bagcilarMerkez = data.districts.find((d) => d.id === "bagcilar").neighborhoods.find((n) => n.id === "bagcilar_merkez");
const mall = data.projects.find((item) => item.id === "proj_mall_of_avm");
const mallRoute = engine.plan(
  { lat: bagcilarMerkez.lat, lng: bagcilarMerkez.lng, name: "Bağcılar Merkez" },
  { lat: mall.lat, lng: mall.lng, name: mall.name },
  { fixedSide: "origin" }
);
const m3Step = mallRoute.steps.find((step) => step.lineId === "M3");
assert(m3Step && m3Step.geometryStopIds.length >= 5, "M3 ara istasyon zinciri");
assert(m3Step.geometryStopIds[0] === "stop_kirazli" && m3Step.geometryStopIds[m3Step.geometryStopIds.length - 1] === "stop_ikitelli_sanayi", "M3 uç istasyonlar");
["stop_yeni_mahalle_2", "stop_mahmutbey", "stop_istoc"].forEach((id) => {
  assert(m3Step.geometryStopIds.indexOf(id) > 0, "M3 atlanan istasyon: " + id);
});

const eti = data.projects.find((item) => item.id === "proj_eti_dpo");
const etiRoute = engine.plan(
  { lat: bagcilarMerkez.lat, lng: bagcilarMerkez.lng, name: "Bağcılar Merkez" },
  { lat: eti.lat, lng: eti.lng, name: eti.name },
  { fixedSide: "origin" }
);
assert(etiRoute.verified === true, "Eti DPO omurgada doğrulanmalı: " + (etiRoute.steps || []).map((step) => step.line).join(" | "));
assert(etiRoute.steps.some((step) => step.lineId === "METROBUS"), "Eti rotasında metrobüs");
assert(etiRoute.steps.some((step) => step.hatNo === "142" || step.hatNo === "142ES" || step.hatNo === "144"), "Eti rotasında İETT beslemesi");

const project = context.createSecurityProject({
  name: "Şema örneği",
  position: "Silahlı Güvenlik",
  shiftPattern: "12/36",
  shuttle: true,
  meal: "Yemekhane",
  transport: "Servis",
  address: "Levent",
  lat: levent.lat,
  lng: levent.lng,
});
assert(project.sector === "Güvenlik", "sektör");
assert(project.armed === "silahli", "silahlı alan");
assert(project.shiftPattern === "12/36", "vardiya");
assert(project.shuttle === true, "servis");
assert(project.duty === "gozetim", "görev");
const torium = data.projects.find((item) => item.id === "proj_torium");
assert(torium.armed === "" && torium.salary === "40.000 TL" && torium.accessStopId === "mb_haramidere", "torium tablodan");

engine.withLiveFallback(route, {
  getLive() {
    return Promise.reject(new Error("iett down"));
  },
}).then((withFallback) => {
  assert(withFallback.liveFallback === true, "servis düşünce yedek");
  assert(withFallback.live.source === "static", "statik sefer");
  const boarded = Object.assign({}, route, {
    steps: route.steps.map((step, index) => index === route.steps.findIndex((item) => item.lineId)
      ? Object.assign({}, step, { fromStopId: step.fromStopId })
      : step),
  });
  const graphStop = graph.stopsById.get(engine.firstBoard(boarded).stopId);
  graphStop.liveStopNo = "1001";
  return engine.withLiveFallback(boarded, {
    getLive() {
      return Promise.resolve(2);
    },
  });
}).then((live) => {
  assert(live.live.source === "live", "canlı sefer uygulanmalı");
  assert(live.liveFallback === false, "canlıda yedek kapalı");
  assert(live.live.estimatedWaitMin === 2, "bekleme");
  console.log("smoke ok", {
    leventBakirkoyMin: route.durationMin,
    transfers: route.transfers,
    snap: route.snappedStopId,
    districts: data.districts.length,
    lines: data.transitLines.length,
  });
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
