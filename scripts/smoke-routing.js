const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const network = JSON.parse(fs.readFileSync(path.join(root, "transit_network.json"), "utf8"));
const geometry = JSON.parse(fs.readFileSync(path.join(root, "transit_network_geometry.json"), "utf8"));

function makeEl() {
  return {
    classList: {
      add() {},
      remove() {},
      toggle() {},
      contains() { return false; },
    },
    style: {},
    dataset: {},
    children: [],
    className: "",
    value: "",
    textContent: "",
    innerHTML: "",
    addEventListener() {},
    appendChild(child) { return child; },
    insertBefore(node) { return node; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    setAttribute() {},
    focus() {},
  };
}

function layer() {
  const node = {
    addTo() { return node; },
    addLayer() {},
    removeLayer() {},
    clearLayers() {},
    hasLayer() { return false; },
    bindTooltip() { return node; },
    bindPopup() { return node; },
    setIcon() {},
    setTooltipContent() {},
    setLatLngs() {},
  };
  return node;
}

const context = {
  console,
  setTimeout,
  clearTimeout,
  URL,
  URLSearchParams,
  localStorage: { getItem() { return null; }, setItem() {} },
  L: {
    map() {
      return {
        setView() { return this; },
        addLayer() {},
        removeLayer() {},
        hasLayer() { return true; },
        fitBounds() {},
        on() { return this; },
        createPane() {},
        getPane() { return { style: {} }; },
        flyTo() { return this; },
        panTo() { return this; },
        getZoom() { return 11; },
      };
    },
    circle() {
      const node = { addTo() { return node; }, setLatLng() {}, setRadius() {} };
      return node;
    },
    tileLayer() { return layer(); },
    control: { scale() { return { addTo() {} }; } },
    divIcon() { return {}; },
    marker() { return layer(); },
    layerGroup() { return layer(); },
    markerClusterGroup() { return layer(); },
    polyline() { return layer(); },
    circleMarker() { return layer(); },
    latLngBounds() { return { pad() { return this; } }; },
  },
  document: {
    getElementById() { return makeEl(); },
    createElement() { return makeEl(); },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    addEventListener() {},
  },
  fetch(url) {
    const href = String(url);
    if (href.includes("transit_network.json")) return Promise.resolve({ ok: true, json: async () => network });
    if (href.includes("transit_network_geometry.json")) return Promise.resolve({ ok: true, json: async () => geometry });
    if (href.includes("dolmus_lines.json")) return Promise.resolve({ ok: true, json: async () => ({ stops: [], lines: [] }) });
    return Promise.reject(new Error("offline " + href));
  },
};
context.window = context;
context.globalThis = context;
vm.createContext(context);

const appSource = [
  fs.readFileSync(path.join(root, "data.js"), "utf8"),
  fs.readFileSync(path.join(root, "app.js"), "utf8"),
  "loadLocalTransitNetwork().then(function () { return loadLocalTransitGeometry(); }).then(function () { globalThis.__graph = transitGraph; globalThis.__estimate = estimateTransit; globalThis.__shape = rideShapeLatLngs; globalThis.__options = buildClickRouteOptions; });",
].join("\n");

vm.runInContext(appSource, context);

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
  for (let i = 0; i < 50 && !context.__graph; i++) await wait(20);
  if (!context.__graph) throw new Error("graf kurulamadı");

  const data = vm.runInContext("ANKARA_DATA", context);
  const estimate = context.__estimate;
  const shape = context.__shape;
  const assert = (cond, message) => {
    if (!cond) throw new Error(message);
  };

  assert(data.projects.length === 7, "7 proje");
  assert(!data.projects.some((p) => /ankara|kızılay|batikent/i.test(p.name + p.address)), "Ankara projesi kalmamalı");
  assert(data.projects.some((p) => p.id === "proj_eti_dpo"), "Eti DPO");
  assert(data.projects.some((p) => p.id === "proj_mall_of_avm"), "Mall of AVM");

  const bagcilar = data.districts.find((d) => d.id === "bagcilar");
  const merkez = bagcilar.neighborhoods.find((n) => n.id === "bagcilar_merkez");
  const mall = data.projects.find((p) => p.id === "proj_mall_of_avm");
  const eti = data.projects.find((p) => p.id === "proj_eti_dpo");

  const mallRoute = estimate(
    { name: merkez.name, coords: { lat: merkez.lat, lng: merkez.lng }, stopId: merkez.accessStopId },
    { name: mall.name, coords: { lat: mall.lat, lng: mall.lng }, stopId: mall.accessStopId }
  );
  assert(mallRoute.verified, "Mall rotası doğrulanamadı: " + mallRoute.routeSummary);
  assert(mallRoute.durationMin <= 70, "Bağcılar→Mall hâlâ uzun: " + mallRoute.durationMin);
  assert(
    mallRoute.steps.some((step) => step.lineId && (step.lineId.startsWith("iett_") || step.lineId.startsWith("mbs_"))),
    "Mall rotası otobüs kullanmıyor: " + mallRoute.steps.map((s) => s.line).join(" | ")
  );
  const mallOptions = context.__options(
    { lat: merkez.lat, lng: merkez.lng },
    { lat: mall.lat, lng: mall.lng },
    mallRoute
  );
  const optionKey = (opt) => (opt.steps || []).filter((step) => step.lineId).map((step) => step.lineId).join(">");
  assert(mallOptions.length >= 2, "Mall tek rota seçeneği: " + mallOptions.map((opt) => opt.label + " " + opt.routeSummary).join(" || "));
  assert(mallOptions[0].durationMin === mallRoute.durationMin, "İlk seçenek en hızlı rota değil");
  assert(optionKey(mallOptions[0]) === optionKey(mallRoute), "İlk seçenek ana rotadan saptı");
  assert(new Set(mallOptions.map(optionKey)).size === mallOptions.length, "Rota seçenekleri birbirinin kopyası");
  assert(!mallOptions.some((opt) => /\b(925|976|760)\b/.test(opt.routeSummary || "")), "Listede olmayan hat uyduruldu");

  const kirazli = context.__graph.stopsById.get("stop_kirazli");
  const navCues = context.buildNavCues([
    { mode: "hub", line: "Yürüyüş", from: "Başlangıç", to: "Kirazlı", lineId: null, toStopId: "stop_kirazli" },
    { mode: "metro", line: "M3", from: "Kirazlı", to: "İkitelli Sanayi", lineId: "M3", fromStopId: "stop_kirazli", toStopId: "stop_ikitelli_sanayi" },
  ], { lat: 41.07, lng: 28.8 });
  assert(navCues.length === 2, "Yönlendirme adımı eksik: " + navCues.length);
  assert(Math.abs(navCues[0].lat - kirazli.lat) < 0.0001, "İlk adım Kirazlı değil");
  assert(context.advanceNavIndex(navCues, 0, { lat: kirazli.lat, lng: kirazli.lng }) === 1, "30 m içinde sonraki adıma geçilmedi");
  assert(context.advanceNavIndex(navCues, 0, { lat: kirazli.lat + 0.01, lng: kirazli.lng }) === 0, "Uzak konum adımı ilerletti");
  assert(context.formatNavDistance(28) === "28 m", "Metre yazımı");
  assert(context.formatNavDistance(1400) === "1,4 km", "Kilometre yazımı");
  const busLines = network.lines.filter((line) => line.mode === "otobus");
  assert(busLines.length > 400, "İETT hatları eksik: " + busLines.length);
  assert(busLines.some((line) => line.hatNo === "146T"), "146T yok");
  const a30 = busLines.find((line) => line.id === "mbs_a30_4");
  assert(a30 && /Otocenter/i.test(a30.name), "A30 Bağcılar-Otocenter-MOİ yok");
  const a30Shape = shape({ lineId: a30.id, fromStopId: a30.stopIds[0], toStopId: a30.stopIds[Math.min(12, a30.stopIds.length - 1)] });
  assert(a30Shape && a30Shape.length >= 20, "A30 yolu düz kiriş olarak kalıyor: " + (a30Shape && a30Shape.length));
  const m3 = {
    lineId: "M3",
    fromStopId: "stop_kirazli",
    toStopId: "stop_ikitelli_sanayi",
  };
  const m3Shape = shape(m3);
  assert(m3Shape && m3Shape.length >= 5, "M3 çizgisi ara istasyonları atlıyor");
  assert(Math.abs(m3Shape[0][0] - 41.03186) < 0.001 && Math.abs(m3Shape[m3Shape.length - 1][0] - 41.0714) < 0.001, "M3 uçları Kirazlı ve İkitelli değil");
  assert(m3Shape.some((p) => Math.abs(p[0] - 41.05489) < 0.001), "M3 Mahmutbey atlandı");
  const names = context.__graph.linesByLocalId.get("M3").stopIds;
  const from = names.indexOf(m3.fromStopId);
  const to = names.indexOf(m3.toStopId);
  assert(m3Shape.length >= Math.abs(to - from) + 1, "M3 şekli durak sayısından kısa");

  const etiRoute = estimate(
    { name: merkez.name, coords: { lat: merkez.lat, lng: merkez.lng }, stopId: merkez.accessStopId },
    { name: eti.name, coords: { lat: eti.lat, lng: eti.lng }, stopId: eti.accessStopId }
  );
  assert(etiRoute.verified, "Eti DPO doğrulanamadı: " + etiRoute.routeSummary);
  const lines = etiRoute.steps.map((step) => step.line).join(" | ");
  assert(/metrobüs|34|142|144/i.test(lines), "Eti rotasında omurga/besleme yok: " + lines);

  const torium = data.projects.find((p) => p.id === "proj_torium");
  const liv = data.projects.find((p) => p.id === "proj_liv_hospital");
  const mengenler = data.projects.find((p) => p.id === "proj_mengenler");
  const beylikduzu = data.districts.find((d) => d.id === "beylikduzu").neighborhoods[0];
  const mecidiyekoy = data.districts.find((d) => d.id === "sisli").neighborhoods.find((n) => n.id === "sisli_mecidiyekoy");
  const esenyurt = data.districts.find((d) => d.id === "esenyurt").neighborhoods[0];

  const toriumRoute = estimate(
    { name: beylikduzu.name, coords: { lat: beylikduzu.lat, lng: beylikduzu.lng }, stopId: beylikduzu.accessStopId },
    { name: torium.name, coords: { lat: torium.lat, lng: torium.lng }, stopId: torium.accessStopId }
  );
  assert(toriumRoute.verified, "Torium doğrulanamadı");
  assert(toriumRoute.durationMin <= 45, "Beylikdüzü→Torium hâlâ uzun: " + toriumRoute.durationMin);

  const livRoute = estimate(
    { name: esenyurt.name, coords: { lat: esenyurt.lat, lng: esenyurt.lng }, stopId: esenyurt.accessStopId },
    { name: liv.name, coords: { lat: liv.lat, lng: liv.lng }, stopId: liv.accessStopId }
  );
  assert(livRoute.verified, "Liv doğrulanamadı");
  assert(livRoute.durationMin <= 30, "Esenyurt→Liv hâlâ dolanıyor: " + livRoute.durationMin);

  const mengenlerRoute = estimate(
    { name: mecidiyekoy.name, coords: { lat: mecidiyekoy.lat, lng: mecidiyekoy.lng }, stopId: mecidiyekoy.accessStopId },
    { name: mengenler.name, coords: { lat: mengenler.lat, lng: mengenler.lng }, stopId: mengenler.accessStopId }
  );
  assert(mengenlerRoute.verified, "Mengenler doğrulanamadı");
  assert(mengenlerRoute.durationMin <= 40, "Mecidiyeköy→Mengenler hâlâ uzun: " + mengenlerRoute.durationMin);

  const republika = data.projects.find((p) => p.id === "proj_ortakoy_republika");
  const mecidiyekoyRepublika = estimate(
    { name: mecidiyekoy.name, coords: { lat: mecidiyekoy.lat, lng: mecidiyekoy.lng }, stopId: mecidiyekoy.accessStopId },
    { name: republika.name, coords: { lat: republika.lat, lng: republika.lng }, stopId: republika.accessStopId }
  );
  assert(mecidiyekoyRepublika.durationMin <= 30, "Mecidiyeköy→Republika hâlâ dolanıyor: " + mecidiyekoyRepublika.durationMin);
  assert(mecidiyekoyRepublika.steps.some((step) => /M7/.test(step.line || "")), "Mecidiyeköy→Republika M7 kullanmıyor: " + mecidiyekoyRepublika.steps.map((s) => s.line).join(" | "));

  const mecidiyekoyTorium = estimate(
    { name: mecidiyekoy.name, coords: { lat: mecidiyekoy.lat, lng: mecidiyekoy.lng }, stopId: mecidiyekoy.accessStopId },
    { name: torium.name, coords: { lat: torium.lat, lng: torium.lng }, stopId: torium.accessStopId }
  );
  assert(mecidiyekoyTorium.durationMin <= 90, "Mecidiyeköy→Torium metrobüs hâlâ yavaş: " + mecidiyekoyTorium.durationMin);

  console.log("smoke ok", {
    mallMin: mallRoute.durationMin,
    mallLines: mallRoute.steps.filter((s) => s.lineId).map((s) => s.line),
    m3Points: m3Shape.length,
    etiMin: etiRoute.durationMin,
    etiLines: etiRoute.steps.filter((s) => s.lineId).map((s) => s.line),
    projects: data.projects.length,
    lines: network.lines.length,
  });
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
