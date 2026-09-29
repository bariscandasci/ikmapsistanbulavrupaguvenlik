/**
 * transit_graph — Avrupa yakası aktarma omurgasına eklenen hatlar.
 *
 * data.js içindeki raylı omurga durur. Bu dosya iki eksiği tamamlar:
 *   Metrobüs'ü Beylikdüzü'nden Söğütlüçeşme'ye kadar uzatır.
 *   Esenyurt / Akçaburgaz'ı omurgaya 142, 142ES ve 144 ile bağlar.
 *
 * Classic script. ISTANBUL_AVRUPA_DATA yüklü olmalı.
 */
const TRANSIT_GRAPH_EXTENSION_STOPS = [
  { id: "mb_15_temmuz", name: "15 Temmuz Şehitler Köprüsü", lat: 41.0452, lng: 29.0334, mode: "metrobus", coordSource: "omurga-sablon" },
  { id: "mb_burhaniye", name: "Burhaniye", lat: 41.0274, lng: 29.0472, mode: "metrobus", coordSource: "omurga-sablon" },
  { id: "mb_altunizade", name: "Altunizade", lat: 41.0219, lng: 29.0462, mode: "metrobus", coordSource: "omurga-sablon" },
  { id: "mb_acibadem", name: "Acıbadem", lat: 41.0022, lng: 29.0406, mode: "metrobus", coordSource: "omurga-sablon" },
  { id: "mb_uzuncayir", name: "Uzunçayır", lat: 40.9989, lng: 29.0498, mode: "metrobus", coordSource: "omurga-sablon" },
  { id: "mb_fikirtepe", name: "Fikirtepe", lat: 40.9932, lng: 29.0552, mode: "metrobus", coordSource: "omurga-sablon" },
  { id: "mb_sogutlucesme", name: "Söğütlüçeşme", lat: 40.99172, lng: 29.03781, mode: "metrobus", coordSource: "omurga-sablon" },
  { id: "bus_142_adnan_kahveci", name: "Adnan Kahveci", lat: 41.014, lng: 28.648, mode: "otobus", coordSource: "iett-besleme" },
  { id: "bus_142_esenyurt", name: "Esenyurt Merkez", lat: 41.0345, lng: 28.6785, mode: "otobus", coordSource: "iett-besleme" },
  { id: "bus_142_kirac", name: "Kıraç", lat: 41.055, lng: 28.65, mode: "otobus", coordSource: "iett-besleme" },
  { id: "bus_142_akcaburgaz", name: "Akçaburgaz", lat: 41.0733, lng: 28.6334, mode: "otobus", coordSource: "iett-besleme" },
  { id: "bus_akcaburgaz_eti", name: "Akçaburgaz Sanayi", lat: 41.0786, lng: 28.6362, mode: "otobus", coordSource: "iett-besleme" },
  { id: "bus_144_haramidere_kuzey", name: "Haramidere Kuzey", lat: 41.02, lng: 28.69, mode: "otobus", coordSource: "iett-besleme" },
];

const METROBUS_EAST_STOPS = [
  "mb_15_temmuz",
  "mb_burhaniye",
  "mb_altunizade",
  "mb_acibadem",
  "mb_uzuncayir",
  "mb_fikirtepe",
  "mb_sogutlucesme",
];

const TRANSIT_GRAPH_EXTENSION_LINES = [
  {
    id: "IETT_142",
    name: "142: Beylikdüzü → Akçaburgaz",
    mode: "otobus",
    verified: true,
    operator: "İETT",
    hatNo: "142",
    headwayMin: 10,
    source: "Esenyurt / Akçaburgaz beslemesi — metrobüs Beylikdüzü düğümüne bağlı",
    stopIds: [
      "mb_beylikduzu",
      "bus_142_adnan_kahveci",
      "bus_142_esenyurt",
      "bus_142_kirac",
      "bus_142_akcaburgaz",
      "bus_akcaburgaz_eti",
    ],
  },
  {
    id: "IETT_142ES",
    name: "142ES: Beylikdüzü → Akçaburgaz",
    mode: "otobus",
    verified: true,
    operator: "İETT",
    hatNo: "142ES",
    headwayMin: 12,
    source: "142 ekspres beslemesi — aynı uç düğümler, ara duraksız",
    stopIds: [
      "mb_beylikduzu",
      "bus_142_esenyurt",
      "bus_142_akcaburgaz",
      "bus_akcaburgaz_eti",
    ],
  },
  {
    id: "IETT_144",
    name: "144: Haramidere → Akçaburgaz",
    mode: "otobus",
    verified: true,
    operator: "İETT",
    hatNo: "144",
    headwayMin: 12,
    source: "Haramidere metrobüs düğümünden Akçaburgaz sanayiye besleme",
    stopIds: [
      "mb_haramidere",
      "bus_144_haramidere_kuzey",
      "bus_142_esenyurt",
      "bus_142_akcaburgaz",
      "bus_akcaburgaz_eti",
    ],
  },
];

function applyTransitGraphExtensions(network) {
  if (!network || network._transitGraphExtended) return network;
  const stops = network.transitStops || (network.transitStops = []);
  const known = new Set(stops.map((stop) => stop.id));
  TRANSIT_GRAPH_EXTENSION_STOPS.forEach((stop) => {
    if (!known.has(stop.id)) stops.push(stop);
  });
  const lines = network.transitLines || (network.transitLines = []);
  const metrobus = lines.find((line) => line.id === "METROBUS");
  if (metrobus) {
    METROBUS_EAST_STOPS.forEach((id) => {
      if (!metrobus.stopIds.includes(id)) metrobus.stopIds.push(id);
    });
    metrobus.name = "Metrobüs: Beylikdüzü → Söğütlüçeşme";
    metrobus.source = "İETT metrobüs omurgası Beylikdüzü–Söğütlüçeşme. Doğu uzantısı aktarma düğümüdür.";
  }
  const lineIds = new Set(lines.map((line) => line.id));
  TRANSIT_GRAPH_EXTENSION_LINES.forEach((line) => {
    if (!lineIds.has(line.id)) lines.push(line);
  });
  network._transitGraphExtended = true;
  return network;
}

if (typeof ISTANBUL_AVRUPA_DATA !== "undefined") applyTransitGraphExtensions(ISTANBUL_AVRUPA_DATA);
