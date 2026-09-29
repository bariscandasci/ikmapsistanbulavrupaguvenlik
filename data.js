/**
 * ISTANBUL_AVRUPA_DATA — İstanbul Avrupa Yakası Güvenlik Projeleri iskeleti.
 *
 * Classic <script> olarak yüklenir (ES module değil). Ankara ikmapsv2 veri
 * modelinin (ilçe / durak / hat / hub) Avrupa yakasına indirgenmiş halidir.
 * projects[] bilinçli olarak boştur: şirket proje portföyü bu iskelete
 * sonradan işlenir. Kart alanları SECURITY_PROJECT_FIELDS ile tanımlıdır.
 *
 * Harita: merkez [41.05, 28.90], zoom 11.
 *
 * Toplu taşıma omurgası (modüler hat listesi):
 *   M1A, M1B, M2 (+ Seyrantepe kolu), M3, M7, M9, M11,
 *   T1, T4, T5, Marmaray (Sirkeci–Halkalı), İETT metrobüs (Beylikdüzü–Zincirlikuyu).
 * Raylı durak koordinatları ikmapsistanbulanadolu OSM/Overpass çıkışındandır
 * (2026-09-07). Metrobüs pinleri omurga şablonudur. İETT otobüs GTFS'i
 * bu iskelete dahil değildir; omurga dışındaki noktalar routing_engine
 * içinde "doğrulanamadı" yedeğine düşer.
 */

const SECURITY_PROJECT_FIELDS = {
  id: { type: "string", required: true },
  name: { type: "string", required: true, label: "Proje adı" },
  sector: { type: "string", default: "Güvenlik" },
  position: {
    type: "enum",
    label: "Pozisyon",
    values: ["Silahlı Güvenlik", "Silahsız Güvenlik", "Danışma", "Gözetim"],
  },
  armed: { type: "enum", label: "Silahlı / Silahsız", values: ["silahli", "silahsiz"] },
  duty: { type: "enum", label: "Danışma / Gözetim", values: ["danisma", "gozetim", "karma"] },
  shiftPattern: { type: "enum", label: "Vardiya", values: ["8/16", "12/36"] },
  shift: { type: "string", label: "Çalışma saati" },
  meal: { type: "string", label: "Yemek" },
  transport: { type: "string", label: "Yol" },
  shuttle: { type: "boolean", label: "Servis imkanı" },
  address: { type: "string", required: true },
  lat: { type: "number", required: true },
  lng: { type: "number", required: true },
  accessStopId: { type: "string" },
  salary: { type: "string", label: "Maaş" },
  gender: { type: "enum", values: ["Kadın/Erkek", "Kadın", "Erkek"] },
  referral: { type: "string", label: "Yönlendirme" },
  capacity: { type: "number", label: "Kontenjan" },
  urgent: { type: "boolean", default: false },
  active: { type: "boolean", default: true },
};

function createSecurityProject(input) {
  const src = input || {};
  const position = src.position || "Silahsız Güvenlik";
  let capacity = src.capacity;
  if (capacity === "" || capacity == null) capacity = null;
  else capacity = Number(capacity);
  return {
    id: src.id || ("proj_" + Date.now().toString(36)),
    name: String(src.name || "").trim(),
    sector: "Güvenlik",
    position: position,
    armed: src.armed || (position === "Silahlı Güvenlik" ? "silahli" : "silahsiz"),
    duty: src.duty || (position === "Danışma" ? "danisma" : "gozetim"),
    shiftPattern: src.shiftPattern || "8/16",
    shift: src.shift || "",
    meal: src.meal || "",
    transport: src.transport || "",
    shuttle: Boolean(src.shuttle),
    address: String(src.address || "").trim(),
    lat: Number(src.lat),
    lng: Number(src.lng),
    accessStopId: src.accessStopId || null,
    salary: src.salary || "",
    gender: src.gender || "Kadın/Erkek",
    referral: src.referral || "",
    capacity: Number.isFinite(capacity) ? capacity : null,
    urgent: Boolean(src.urgent),
    active: src.active !== false,
  };
}

const ISTANBUL_AVRUPA_DATA = {
  "map": {
    "center": [
      41.05,
      28.9
    ],
    "zoom": 11,
    "label": "İstanbul Avrupa Yakası"
  },
  "urgentProjectIds": [],
  "projects": [],
  "districts": [
    {
      "id": "besiktas",
      "name": "Beşiktaş",
      "lat": 41.0422,
      "lng": 29.006,
      "accessStopId": "stop_kabatas",
      "neighborhoods": [
        {
          "id": "besiktas_levent",
          "name": "Levent",
          "lat": 41.0815,
          "lng": 29.0119,
          "accessStopId": "stop_levent"
        },
        {
          "id": "besiktas_etiler",
          "name": "Etiler",
          "lat": 41.0789,
          "lng": 29.0339,
          "accessStopId": "stop_kabatas"
        }
      ]
    },
    {
      "id": "sisli",
      "name": "Şişli",
      "lat": 41.0602,
      "lng": 28.9877,
      "accessStopId": "stop_sisli",
      "neighborhoods": [
        {
          "id": "sisli_mecidiyekoy",
          "name": "Mecidiyeköy",
          "lat": 41.067,
          "lng": 28.995,
          "accessStopId": "stop_mecidiyekoy"
        },
        {
          "id": "sisli_nisantasi",
          "name": "Nişantaşı",
          "lat": 41.048,
          "lng": 28.994,
          "accessStopId": "stop_osmanbey"
        }
      ]
    },
    {
      "id": "bakirkoy",
      "name": "Bakırköy",
      "lat": 40.9819,
      "lng": 28.8772,
      "accessStopId": "stop_bakirkoy",
      "neighborhoods": [
        {
          "id": "bakirkoy_yesilkoy",
          "name": "Yeşilköy",
          "lat": 40.9686,
          "lng": 28.825,
          "accessStopId": "stop_yesilkoy"
        },
        {
          "id": "bakirkoy_florya",
          "name": "Florya",
          "lat": 40.976,
          "lng": 28.793,
          "accessStopId": "stop_florya"
        }
      ]
    },
    {
      "id": "bagcilar",
      "name": "Bağcılar",
      "lat": 41.039,
      "lng": 28.856,
      "accessStopId": "stop_bagcilar_meydan",
      "neighborhoods": [
        {
          "id": "bagcilar_merkez",
          "name": "Bağcılar Merkez",
          "lat": 41.039,
          "lng": 28.856,
          "accessStopId": "stop_kirazli"
        },
        {
          "id": "bagcilar_gunesli",
          "name": "Güneşli",
          "lat": 41.062,
          "lng": 28.839,
          "accessStopId": "stop_kirazli"
        }
      ]
    },
    {
      "id": "esenyurt",
      "name": "Esenyurt",
      "lat": 41.035,
      "lng": 28.677,
      "accessStopId": "stop_kirazli",
      "neighborhoods": [
        {
          "id": "esenyurt_merkez",
          "name": "Esenyurt Merkez",
          "lat": 41.035,
          "lng": 28.677,
          "accessStopId": "stop_kirazli"
        },
        {
          "id": "esenyurt_pinar",
          "name": "Pınar",
          "lat": 41.027,
          "lng": 28.669,
          "accessStopId": "stop_kirazli"
        }
      ]
    },
    {
      "id": "kucukcekmece",
      "name": "Küçükçekmece",
      "lat": 41,
      "lng": 28.775,
      "accessStopId": "stop_kucukcekmece",
      "neighborhoods": [
        {
          "id": "kucukcekmece_halkali",
          "name": "Halkalı",
          "lat": 41.023,
          "lng": 28.781,
          "accessStopId": "stop_halkali"
        },
        {
          "id": "kucukcekmece_sefakoy",
          "name": "Sefaköy",
          "lat": 40.991,
          "lng": 28.794,
          "accessStopId": "stop_yesilyurt"
        }
      ]
    },
    {
      "id": "basaksehir",
      "name": "Başakşehir",
      "lat": 41.093,
      "lng": 28.801,
      "accessStopId": "stop_sehir_hastanesi",
      "neighborhoods": [
        {
          "id": "basaksehir_merkez",
          "name": "Başakşehir Merkez",
          "lat": 41.093,
          "lng": 28.801,
          "accessStopId": "stop_sehir_hastanesi"
        },
        {
          "id": "basaksehir_sultangazi_sinir",
          "name": "Onurkent",
          "lat": 41.089,
          "lng": 28.793,
          "accessStopId": "stop_onurkent"
        }
      ]
    },
    {
      "id": "fatih",
      "name": "Fatih",
      "lat": 41.019,
      "lng": 28.949,
      "accessStopId": "stop_aksaray",
      "neighborhoods": [
        {
          "id": "fatih_aksaray",
          "name": "Aksaray",
          "lat": 41.011,
          "lng": 28.954,
          "accessStopId": "stop_aksaray"
        },
        {
          "id": "fatih_yenikapi",
          "name": "Yenikapı",
          "lat": 41.001,
          "lng": 28.95,
          "accessStopId": "stop_yenikapi"
        }
      ]
    },
    {
      "id": "zeytinburnu",
      "name": "Zeytinburnu",
      "lat": 40.995,
      "lng": 28.902,
      "accessStopId": "stop_zeytinburnu",
      "neighborhoods": [
        {
          "id": "zeytinburnu_kazlicesme",
          "name": "Kazlıçeşme",
          "lat": 40.9927,
          "lng": 28.917,
          "accessStopId": "stop_kazlicesme"
        }
      ]
    },
    {
      "id": "eyupsultan",
      "name": "Eyüpsultan",
      "lat": 41.048,
      "lng": 28.9339,
      "accessStopId": "stop_eyupsultan_teleferik",
      "neighborhoods": [
        {
          "id": "eyupsultan_alibeykoy",
          "name": "Alibeyköy",
          "lat": 41.0792,
          "lng": 28.9496,
          "accessStopId": "stop_alibeykoy"
        }
      ]
    },
    {
      "id": "kagithane",
      "name": "Kağıthane",
      "lat": 41.0796,
      "lng": 28.9731,
      "accessStopId": "stop_kagithane",
      "neighborhoods": [
        {
          "id": "kagithane_caglayan",
          "name": "Çağlayan",
          "lat": 41.0708,
          "lng": 28.9806,
          "accessStopId": "stop_caglayan"
        }
      ]
    },
    {
      "id": "beyoglu",
      "name": "Beyoğlu",
      "lat": 41.037,
      "lng": 28.985,
      "accessStopId": "stop_taksim",
      "neighborhoods": [
        {
          "id": "beyoglu_karakoy",
          "name": "Karaköy",
          "lat": 41.0222,
          "lng": 28.9748,
          "accessStopId": "stop_karakoy"
        },
        {
          "id": "beyoglu_cihangir",
          "name": "Cihangir",
          "lat": 41.0316,
          "lng": 28.9822,
          "accessStopId": "stop_taksim"
        }
      ]
    },
    {
      "id": "sariyer",
      "name": "Sarıyer",
      "lat": 41.167,
      "lng": 29.057,
      "accessStopId": "stop_haciosman",
      "neighborhoods": [
        {
          "id": "sariyer_maslak",
          "name": "Maslak",
          "lat": 41.1082,
          "lng": 29.0209,
          "accessStopId": "stop_itu_ayazaga"
        },
        {
          "id": "sariyer_istinye",
          "name": "İstinye",
          "lat": 41.109,
          "lng": 29.057,
          "accessStopId": "stop_haciosman"
        }
      ]
    },
    {
      "id": "bayrampasa",
      "name": "Bayrampaşa",
      "lat": 41.036,
      "lng": 28.908,
      "accessStopId": "stop_bayrampasa_maltepe",
      "neighborhoods": [
        {
          "id": "bayrampasa_merkez",
          "name": "Bayrampaşa Merkez",
          "lat": 41.036,
          "lng": 28.908,
          "accessStopId": "stop_bayrampasa_maltepe"
        }
      ]
    },
    {
      "id": "esenler",
      "name": "Esenler",
      "lat": 41.044,
      "lng": 28.876,
      "accessStopId": "stop_esenler",
      "neighborhoods": [
        {
          "id": "esenler_merkez",
          "name": "Esenler Merkez",
          "lat": 41.044,
          "lng": 28.876,
          "accessStopId": "stop_esenler"
        }
      ]
    },
    {
      "id": "gungoren",
      "name": "Güngören",
      "lat": 41.018,
      "lng": 28.873,
      "accessStopId": "stop_gungoren",
      "neighborhoods": [
        {
          "id": "gungoren_merkez",
          "name": "Güngören Merkez",
          "lat": 41.018,
          "lng": 28.873,
          "accessStopId": "stop_gungoren"
        }
      ]
    },
    {
      "id": "bahcelievler",
      "name": "Bahçelievler",
      "lat": 41,
      "lng": 28.859,
      "accessStopId": "stop_bahcelievler",
      "neighborhoods": [
        {
          "id": "bahcelievler_merkez",
          "name": "Bahçelievler Merkez",
          "lat": 41,
          "lng": 28.859,
          "accessStopId": "stop_bahcelievler"
        }
      ]
    },
    {
      "id": "gaziosmanpasa",
      "name": "Gaziosmanpaşa",
      "lat": 41.065,
      "lng": 28.915,
      "accessStopId": "stop_veysel_karani_aksemsettin",
      "neighborhoods": [
        {
          "id": "gaziosmanpasa_merkez",
          "name": "Gaziosmanpaşa Merkez",
          "lat": 41.065,
          "lng": 28.915,
          "accessStopId": "stop_veysel_karani_aksemsettin"
        }
      ]
    },
    {
      "id": "sultangazi",
      "name": "Sultangazi",
      "lat": 41.107,
      "lng": 28.867,
      "accessStopId": "stop_50_yil_bastabya",
      "neighborhoods": [
        {
          "id": "sultangazi_merkez",
          "name": "Sultangazi Merkez",
          "lat": 41.107,
          "lng": 28.867,
          "accessStopId": "stop_50_yil_bastabya"
        }
      ]
    },
    {
      "id": "arnavutkoy",
      "name": "Arnavutköy",
      "lat": 41.185,
      "lng": 28.74,
      "accessStopId": "stop_arnavutkoy_hastane",
      "neighborhoods": [
        {
          "id": "arnavutkoy_merkez",
          "name": "Arnavutköy Merkez",
          "lat": 41.185,
          "lng": 28.74,
          "accessStopId": "stop_arnavutkoy_hastane"
        }
      ]
    },
    {
      "id": "avcilar",
      "name": "Avcılar",
      "lat": 40.98,
      "lng": 28.721,
      "accessStopId": "mb_avcilar",
      "neighborhoods": [
        {
          "id": "avcilar_merkez",
          "name": "Avcılar Merkez",
          "lat": 40.98,
          "lng": 28.721,
          "accessStopId": "mb_avcilar"
        }
      ]
    },
    {
      "id": "beylikduzu",
      "name": "Beylikdüzü",
      "lat": 41.002,
      "lng": 28.64,
      "accessStopId": "mb_beylikduzu",
      "neighborhoods": [
        {
          "id": "beylikduzu_merkez",
          "name": "Beylikdüzü Merkez",
          "lat": 41.002,
          "lng": 28.64,
          "accessStopId": "mb_beylikduzu"
        }
      ]
    },
    {
      "id": "buyukcekmece",
      "name": "Büyükçekmece",
      "lat": 41.02,
      "lng": 28.585,
      "accessStopId": "mb_beylikduzu",
      "neighborhoods": [
        {
          "id": "buyukcekmece_merkez",
          "name": "Büyükçekmece Merkez",
          "lat": 41.02,
          "lng": 28.585,
          "accessStopId": "mb_beylikduzu"
        }
      ]
    },
    {
      "id": "catalca",
      "name": "Çatalca",
      "lat": 41.143,
      "lng": 28.461,
      "accessStopId": "mb_beylikduzu",
      "neighborhoods": [
        {
          "id": "catalca_merkez",
          "name": "Çatalca Merkez",
          "lat": 41.143,
          "lng": 28.461,
          "accessStopId": "mb_beylikduzu"
        }
      ]
    },
    {
      "id": "silivri",
      "name": "Silivri",
      "lat": 41.073,
      "lng": 28.247,
      "accessStopId": "mb_beylikduzu",
      "neighborhoods": [
        {
          "id": "silivri_merkez",
          "name": "Silivri Merkez",
          "lat": 41.073,
          "lng": 28.247,
          "accessStopId": "mb_beylikduzu"
        }
      ]
    }
  ],
  "transitStops": [
    {
      "id": "stop_kabatas",
      "name": "Kabataş",
      "mode": "hub",
      "lat": 41.0344774,
      "lng": 28.9926707,
      "coordSource": "osm"
    },
    {
      "id": "stop_findikli_msu",
      "name": "Fındıklı - MSÜ",
      "mode": "tramvay",
      "lat": 41.0315308,
      "lng": 28.9894567,
      "coordSource": "osm"
    },
    {
      "id": "stop_tophane",
      "name": "Tophane",
      "mode": "tramvay",
      "lat": 41.0268005,
      "lng": 28.9802781,
      "coordSource": "osm"
    },
    {
      "id": "stop_karakoy",
      "name": "Karaköy",
      "mode": "hub",
      "lat": 41.0222299,
      "lng": 28.9747557,
      "coordSource": "osm"
    },
    {
      "id": "stop_eminonu",
      "name": "Eminönü",
      "mode": "hub",
      "lat": 41.0174499,
      "lng": 28.9732148,
      "coordSource": "osm"
    },
    {
      "id": "stop_sirkeci",
      "name": "Sirkeci",
      "mode": "hub",
      "lat": 41.0151642,
      "lng": 28.9758304,
      "coordSource": "osm"
    },
    {
      "id": "stop_gulhane",
      "name": "Gülhane",
      "mode": "tramvay",
      "lat": 41.0121632,
      "lng": 28.9784087,
      "coordSource": "osm"
    },
    {
      "id": "stop_sultanahmet",
      "name": "Sultanahmet",
      "mode": "tramvay",
      "lat": 41.0081113,
      "lng": 28.9755143,
      "coordSource": "osm"
    },
    {
      "id": "stop_cemberlitas",
      "name": "Çemberlitaş",
      "mode": "tramvay",
      "lat": 41.0084652,
      "lng": 28.9711451,
      "coordSource": "osm"
    },
    {
      "id": "stop_beyazit_kapali_carsi",
      "name": "Beyazıt - Kapalı Çarşı",
      "mode": "tramvay",
      "lat": 41.0090852,
      "lng": 28.9666458,
      "coordSource": "osm"
    },
    {
      "id": "stop_aksaray",
      "name": "Aksaray",
      "mode": "hub",
      "lat": 41.0096115,
      "lng": 28.9538781,
      "coordSource": "osm"
    },
    {
      "id": "stop_yusufpasa",
      "name": "Yusufpaşa",
      "mode": "tramvay",
      "lat": 41.0100961,
      "lng": 28.9466545,
      "coordSource": "osm"
    },
    {
      "id": "stop_haseki",
      "name": "Haseki",
      "mode": "tramvay",
      "lat": 41.0110406,
      "lng": 28.9431092,
      "coordSource": "osm"
    },
    {
      "id": "stop_findikzade",
      "name": "Fındıkzade",
      "mode": "tramvay",
      "lat": 41.0118214,
      "lng": 28.9404859,
      "coordSource": "osm"
    },
    {
      "id": "stop_capa_sehremini",
      "name": "Çapa-Şehremini",
      "mode": "tramvay",
      "lat": 41.015279,
      "lng": 28.9333351,
      "coordSource": "osm"
    },
    {
      "id": "stop_pazartekke",
      "name": "Pazartekke",
      "mode": "tramvay",
      "lat": 41.0182396,
      "lng": 28.9271904,
      "coordSource": "osm"
    },
    {
      "id": "stop_topkapi",
      "name": "Topkapı",
      "mode": "hub",
      "lat": 41.0192853,
      "lng": 28.9194457,
      "coordSource": "osm"
    },
    {
      "id": "stop_cevizlibag_a_o_y",
      "name": "Cevizlibağ-A.Ö.Y.",
      "mode": "tramvay",
      "lat": 41.0160557,
      "lng": 28.9115859,
      "coordSource": "osm"
    },
    {
      "id": "stop_merkez_efendi",
      "name": "Merkez Efendi",
      "mode": "tramvay",
      "lat": 41.0103501,
      "lng": 28.9094588,
      "coordSource": "osm"
    },
    {
      "id": "stop_seyitnizam_aksemsettin",
      "name": "Seyitnizam-Akşemsettin",
      "mode": "tramvay",
      "lat": 41.0042355,
      "lng": 28.9073596,
      "coordSource": "osm"
    },
    {
      "id": "stop_mithatpasa",
      "name": "Mithatpaşa",
      "mode": "tramvay",
      "lat": 41.003385,
      "lng": 28.8998873,
      "coordSource": "osm"
    },
    {
      "id": "stop_mehmet_akif",
      "name": "Mehmet Akif",
      "mode": "tramvay",
      "lat": 41.0058363,
      "lng": 28.8816928,
      "coordSource": "osm"
    },
    {
      "id": "stop_merter_tekstil_merkezi",
      "name": "Merter Tekstil Merkezi",
      "mode": "tramvay",
      "lat": 41.0115728,
      "lng": 28.8807848,
      "coordSource": "osm"
    },
    {
      "id": "stop_gungoren",
      "name": "Güngören",
      "mode": "tramvay",
      "lat": 41.0152632,
      "lng": 28.877486,
      "coordSource": "osm"
    },
    {
      "id": "stop_akincilar",
      "name": "Akıncılar",
      "mode": "tramvay",
      "lat": 41.0171401,
      "lng": 28.8714699,
      "coordSource": "osm"
    },
    {
      "id": "stop_soganli",
      "name": "Soğanlı",
      "mode": "tramvay",
      "lat": 41.0205923,
      "lng": 28.8676168,
      "coordSource": "osm"
    },
    {
      "id": "stop_gunestepe",
      "name": "Güneştepe",
      "mode": "tramvay",
      "lat": 41.028958,
      "lng": 28.8610215,
      "coordSource": "osm"
    },
    {
      "id": "stop_yavuz_selim",
      "name": "Yavuz Selim",
      "mode": "tramvay",
      "lat": 41.0235482,
      "lng": 28.8640724,
      "coordSource": "osm"
    },
    {
      "id": "stop_zeytinburnu",
      "name": "Zeytinburnu",
      "mode": "hub",
      "lat": 41.0015333,
      "lng": 28.8901578,
      "coordSource": "osm"
    },
    {
      "id": "stop_bagcilar",
      "name": "Bağcılar",
      "mode": "tramvay",
      "lat": 41.0322093,
      "lng": 28.8606194,
      "coordSource": "osm"
    },
    {
      "id": "stop_yenikapi",
      "name": "Yenikapı",
      "mode": "hub",
      "lat": 41.005728,
      "lng": 28.9505658,
      "coordSource": "osm"
    },
    {
      "id": "stop_emniyet_fatih",
      "name": "Emniyet - Fatih",
      "mode": "hub",
      "lat": 41.0174301,
      "lng": 28.9396317,
      "coordSource": "osm"
    },
    {
      "id": "stop_topkapi_ulubatli",
      "name": "Topkapı Ulubatlı",
      "mode": "hub",
      "lat": 41.0238758,
      "lng": 28.9306248,
      "coordSource": "osm"
    },
    {
      "id": "stop_bayrampasa_maltepe",
      "name": "Bayrampaşa-Maltepe",
      "mode": "hub",
      "lat": 41.0341161,
      "lng": 28.9203244,
      "coordSource": "osm"
    },
    {
      "id": "stop_sagmalcilar",
      "name": "Sağmalcılar",
      "mode": "hub",
      "lat": 41.040912,
      "lng": 28.9072258,
      "coordSource": "osm"
    },
    {
      "id": "stop_kocatepe",
      "name": "Kocatepe",
      "mode": "hub",
      "lat": 41.0485107,
      "lng": 28.8954577,
      "coordSource": "osm"
    },
    {
      "id": "stop_otogar",
      "name": "Otogar",
      "mode": "hub",
      "lat": 41.0401083,
      "lng": 28.8946163,
      "coordSource": "osm"
    },
    {
      "id": "stop_terazidere",
      "name": "Terazidere",
      "mode": "metro",
      "lat": 41.0303612,
      "lng": 28.897936,
      "coordSource": "osm"
    },
    {
      "id": "stop_davutpasa_ytu",
      "name": "Davutpaşa - YTÜ",
      "mode": "metro",
      "lat": 41.0205272,
      "lng": 28.900245,
      "coordSource": "osm"
    },
    {
      "id": "stop_merter",
      "name": "Merter",
      "mode": "metro",
      "lat": 41.0076182,
      "lng": 28.8961612,
      "coordSource": "osm"
    },
    {
      "id": "stop_bakirkoy_incirli",
      "name": "Bakırköy-İncirli",
      "mode": "metro",
      "lat": 40.9966391,
      "lng": 28.8753909,
      "coordSource": "osm"
    },
    {
      "id": "stop_bahcelievler",
      "name": "Bahçelievler",
      "mode": "metro",
      "lat": 40.9955091,
      "lng": 28.8632993,
      "coordSource": "osm"
    },
    {
      "id": "stop_atakoy_sirinevler",
      "name": "Ataköy-Şirinevler",
      "mode": "metro",
      "lat": 40.9913766,
      "lng": 28.8460141,
      "coordSource": "osm"
    },
    {
      "id": "stop_yenibosna",
      "name": "Yenibosna",
      "mode": "hub",
      "lat": 40.9894444,
      "lng": 28.8367394,
      "coordSource": "osm"
    },
    {
      "id": "stop_dtm_istanbul_fuar_merkezi",
      "name": "DTM-İstanbul Fuar Merkezi",
      "mode": "metro",
      "lat": 40.9866459,
      "lng": 28.8284451,
      "coordSource": "osm"
    },
    {
      "id": "stop_ataturk_havalimani",
      "name": "Atatürk Havalimanı",
      "mode": "metro",
      "lat": 40.9797389,
      "lng": 28.8210402,
      "coordSource": "osm"
    },
    {
      "id": "stop_esenler",
      "name": "Esenler",
      "mode": "metro",
      "lat": 41.0375458,
      "lng": 28.8885667,
      "coordSource": "osm"
    },
    {
      "id": "stop_menderes",
      "name": "Menderes",
      "mode": "metro",
      "lat": 41.0428043,
      "lng": 28.8784472,
      "coordSource": "osm"
    },
    {
      "id": "stop_ucyuzlu",
      "name": "Üçyüzlü",
      "mode": "metro",
      "lat": 41.036756,
      "lng": 28.8706206,
      "coordSource": "osm"
    },
    {
      "id": "stop_bagcilar_meydan",
      "name": "Bağcılar Meydan",
      "mode": "metro",
      "lat": 41.034741,
      "lng": 28.8566453,
      "coordSource": "osm"
    },
    {
      "id": "stop_kirazli",
      "name": "Kirazlı",
      "mode": "hub",
      "lat": 41.0318577,
      "lng": 28.8421605,
      "coordSource": "osm"
    },
    {
      "id": "stop_kazlicesme",
      "name": "Kazlıçeşme",
      "mode": "marmaray",
      "lat": 40.9927446,
      "lng": 28.9169682,
      "coordSource": "osm"
    },
    {
      "id": "stop_zeytinburnu_fisekhane",
      "name": "Zeytinburnu-Fişekhane",
      "mode": "marmaray",
      "lat": 40.9859358,
      "lng": 28.9053777,
      "coordSource": "osm"
    },
    {
      "id": "stop_yeni_mahalle",
      "name": "Yeni Mahalle",
      "mode": "marmaray",
      "lat": 40.9818034,
      "lng": 28.8810217,
      "coordSource": "osm"
    },
    {
      "id": "stop_bakirkoy",
      "name": "Bakırköy",
      "mode": "marmaray",
      "lat": 40.9804407,
      "lng": 28.8724034,
      "coordSource": "osm"
    },
    {
      "id": "stop_atakoy",
      "name": "Ataköy",
      "mode": "hub",
      "lat": 40.9802954,
      "lng": 28.8562255,
      "coordSource": "osm"
    },
    {
      "id": "stop_yesilyurt",
      "name": "Yeşilyurt",
      "mode": "marmaray",
      "lat": 40.9655489,
      "lng": 28.8372396,
      "coordSource": "osm"
    },
    {
      "id": "stop_yesilkoy",
      "name": "Yeşilköy",
      "mode": "marmaray",
      "lat": 40.9627331,
      "lng": 28.8248804,
      "coordSource": "osm"
    },
    {
      "id": "stop_florya_akvaryum",
      "name": "Florya Akvaryum",
      "mode": "marmaray",
      "lat": 40.9678693,
      "lng": 28.7970755,
      "coordSource": "osm"
    },
    {
      "id": "stop_florya",
      "name": "Florya",
      "mode": "marmaray",
      "lat": 40.9729697,
      "lng": 28.7876456,
      "coordSource": "osm"
    },
    {
      "id": "stop_kucukcekmece",
      "name": "Küçükçekmece",
      "mode": "marmaray",
      "lat": 40.9885491,
      "lng": 28.773056,
      "coordSource": "osm"
    },
    {
      "id": "stop_mustafa_kemal",
      "name": "Mustafa Kemal",
      "mode": "marmaray",
      "lat": 41.0061388,
      "lng": 28.7739784,
      "coordSource": "osm"
    },
    {
      "id": "stop_halkali",
      "name": "Halkalı",
      "mode": "hub",
      "lat": 41.0184381,
      "lng": 28.7668524,
      "coordSource": "osm"
    },
    {
      "id": "stop_bakirkoy_sahil",
      "name": "Bakırköy Sahil",
      "mode": "metro",
      "lat": 40.9735585,
      "lng": 28.8679821,
      "coordSource": "osm"
    },
    {
      "id": "stop_ozgurluk_meydani",
      "name": "Özgürlük Meydanı",
      "mode": "metro",
      "lat": 40.9817899,
      "lng": 28.8743051,
      "coordSource": "osm"
    },
    {
      "id": "stop_incirli",
      "name": "İncirli",
      "mode": "metro",
      "lat": 40.9976509,
      "lng": 28.8753178,
      "coordSource": "osm"
    },
    {
      "id": "stop_haznedar",
      "name": "Haznedar",
      "mode": "metro",
      "lat": 41.0047045,
      "lng": 28.8718966,
      "coordSource": "osm"
    },
    {
      "id": "stop_ilkyuva",
      "name": "İlkyuva",
      "mode": "metro",
      "lat": 41.0117328,
      "lng": 28.8657307,
      "coordSource": "osm"
    },
    {
      "id": "stop_yildiztepe",
      "name": "Yıldıztepe",
      "mode": "metro",
      "lat": 41.019572,
      "lng": 28.8578319,
      "coordSource": "osm"
    },
    {
      "id": "stop_molla_gurani",
      "name": "Molla Gürani",
      "mode": "metro",
      "lat": 41.0259558,
      "lng": 28.8480788,
      "coordSource": "osm"
    },
    {
      "id": "stop_yeni_mahalle_2",
      "name": "Yeni Mahalle",
      "mode": "metro",
      "lat": 41.0404308,
      "lng": 28.8361223,
      "coordSource": "osm"
    },
    {
      "id": "stop_mahmutbey",
      "name": "Mahmutbey",
      "mode": "hub",
      "lat": 41.0548896,
      "lng": 28.8306126,
      "coordSource": "osm"
    },
    {
      "id": "stop_istoc",
      "name": "İSTOÇ",
      "mode": "metro",
      "lat": 41.065077,
      "lng": 28.8260847,
      "coordSource": "osm"
    },
    {
      "id": "stop_ikitelli_sanayi",
      "name": "İkitelli Sanayi",
      "mode": "hub",
      "lat": 41.0713956,
      "lng": 28.8038216,
      "coordSource": "osm"
    },
    {
      "id": "stop_turgut_ozal",
      "name": "Turgut Özal",
      "mode": "metro",
      "lat": 41.0811589,
      "lng": 28.7976309,
      "coordSource": "osm"
    },
    {
      "id": "stop_siteler",
      "name": "Siteler",
      "mode": "metro",
      "lat": 41.0882794,
      "lng": 28.7966542,
      "coordSource": "osm"
    },
    {
      "id": "stop_basak_konutlari",
      "name": "Başak Konutları",
      "mode": "metro",
      "lat": 41.0977803,
      "lng": 28.7914561,
      "coordSource": "osm"
    },
    {
      "id": "stop_metrokent",
      "name": "Metrokent",
      "mode": "metro",
      "lat": 41.1082043,
      "lng": 28.8016211,
      "coordSource": "osm"
    },
    {
      "id": "stop_onurkent",
      "name": "Onurkent",
      "mode": "metro",
      "lat": 41.1135424,
      "lng": 28.7904668,
      "coordSource": "osm"
    },
    {
      "id": "stop_sehir_hastanesi",
      "name": "Şehir Hastanesi",
      "mode": "metro",
      "lat": 41.1032857,
      "lng": 28.7775639,
      "coordSource": "osm"
    },
    {
      "id": "stop_toplu_konutlar",
      "name": "Toplu Konutlar",
      "mode": "metro",
      "lat": 41.1077392,
      "lng": 28.768059,
      "coordSource": "osm"
    },
    {
      "id": "stop_kayasehir_merkez",
      "name": "Kayaşehir Merkez",
      "mode": "metro",
      "lat": 41.1190274,
      "lng": 28.7663849,
      "coordSource": "osm"
    },
    {
      "id": "stop_cobancesme",
      "name": "Çobançeşme",
      "mode": "metro",
      "lat": 40.9997593,
      "lng": 28.822727,
      "coordSource": "osm"
    },
    {
      "id": "stop_29_ekim_cumhuriyet",
      "name": "29 Ekim Cumhuriyet",
      "mode": "metro",
      "lat": 41.006234,
      "lng": 28.8188131,
      "coordSource": "osm"
    },
    {
      "id": "stop_dogu_sanayi",
      "name": "Doğu Sanayi",
      "mode": "metro",
      "lat": 41.0149429,
      "lng": 28.8181549,
      "coordSource": "osm"
    },
    {
      "id": "stop_mimar_sinan",
      "name": "Mimar Sinan",
      "mode": "metro",
      "lat": 41.0250791,
      "lng": 28.8167821,
      "coordSource": "osm"
    },
    {
      "id": "stop_15_temmuz",
      "name": "15 Temmuz",
      "mode": "metro",
      "lat": 41.0369237,
      "lng": 28.8142134,
      "coordSource": "osm"
    },
    {
      "id": "stop_halkali_caddesi",
      "name": "Halkalı Caddesi",
      "mode": "metro",
      "lat": 41.0451704,
      "lng": 28.8066077,
      "coordSource": "osm"
    },
    {
      "id": "stop_ataturk_mahallesi",
      "name": "Atatürk Mahallesi",
      "mode": "metro",
      "lat": 41.0521866,
      "lng": 28.7989581,
      "coordSource": "osm"
    },
    {
      "id": "stop_bahariye_2",
      "name": "Bahariye",
      "mode": "metro",
      "lat": 41.0585053,
      "lng": 28.7994906,
      "coordSource": "osm"
    },
    {
      "id": "stop_masko",
      "name": "MASKO",
      "mode": "metro",
      "lat": 41.0639891,
      "lng": 28.8042749,
      "coordSource": "osm"
    },
    {
      "id": "stop_ziya_gokalp",
      "name": "Ziya Gökalp",
      "mode": "metro",
      "lat": 41.0746891,
      "lng": 28.786412,
      "coordSource": "osm"
    },
    {
      "id": "stop_olimpiyat",
      "name": "Olimpiyat",
      "mode": "metro",
      "lat": 41.0796429,
      "lng": 28.7670768,
      "coordSource": "osm"
    },
    {
      "id": "stop_mescid_i_selam",
      "name": "Mescid-i Selam",
      "mode": "tramvay",
      "lat": 41.1162428,
      "lng": 28.8511412,
      "coordSource": "osm"
    },
    {
      "id": "stop_cebeci",
      "name": "Cebeci",
      "mode": "tramvay",
      "lat": 41.1124107,
      "lng": 28.8575196,
      "coordSource": "osm"
    },
    {
      "id": "stop_yeni_mahalle_3",
      "name": "Yeni Mahalle",
      "mode": "tramvay",
      "lat": 41.1002839,
      "lng": 28.8628946,
      "coordSource": "osm"
    },
    {
      "id": "stop_haci_sukru",
      "name": "Hacı Şükrü",
      "mode": "tramvay",
      "lat": 41.0933385,
      "lng": 28.8638623,
      "coordSource": "osm"
    },
    {
      "id": "stop_50_yil_bastabya",
      "name": "50. Yıl-Baştabya",
      "mode": "tramvay",
      "lat": 41.087787,
      "lng": 28.8669014,
      "coordSource": "osm"
    },
    {
      "id": "stop_cumhuriyet_mahallesi",
      "name": "Cumhuriyet Mahallesi",
      "mode": "tramvay",
      "lat": 41.0845661,
      "lng": 28.8715664,
      "coordSource": "osm"
    },
    {
      "id": "stop_kiptas_venezia",
      "name": "KİPTAŞ Venezia",
      "mode": "tramvay",
      "lat": 41.0812918,
      "lng": 28.8745733,
      "coordSource": "osm"
    },
    {
      "id": "stop_karadeniz",
      "name": "Karadeniz",
      "mode": "tramvay",
      "lat": 41.0751817,
      "lng": 28.8824304,
      "coordSource": "osm"
    },
    {
      "id": "stop_taskopru",
      "name": "Taşköprü",
      "mode": "tramvay",
      "lat": 41.0725735,
      "lng": 28.8877129,
      "coordSource": "osm"
    },
    {
      "id": "stop_ali_fuat_basgil",
      "name": "Ali Fuat Başgil",
      "mode": "tramvay",
      "lat": 41.0684467,
      "lng": 28.8956044,
      "coordSource": "osm"
    },
    {
      "id": "stop_bosna_cukurcesme",
      "name": "Bosna-Çukurçeşme",
      "mode": "tramvay",
      "lat": 41.0618015,
      "lng": 28.9020548,
      "coordSource": "osm"
    },
    {
      "id": "stop_uluyol_berec",
      "name": "Uluyol-Bereç",
      "mode": "tramvay",
      "lat": 41.0541152,
      "lng": 28.9102178,
      "coordSource": "osm"
    },
    {
      "id": "stop_rami",
      "name": "Rami",
      "mode": "tramvay",
      "lat": 41.0465704,
      "lng": 28.9155264,
      "coordSource": "osm"
    },
    {
      "id": "stop_topcular",
      "name": "Topçular",
      "mode": "tramvay",
      "lat": 41.0416106,
      "lng": 28.9195261,
      "coordSource": "osm"
    },
    {
      "id": "stop_demirkapi",
      "name": "Demirkapı",
      "mode": "tramvay",
      "lat": 41.0369846,
      "lng": 28.9233484,
      "coordSource": "osm"
    },
    {
      "id": "stop_sehitlik",
      "name": "Şehitlik",
      "mode": "tramvay",
      "lat": 41.0341412,
      "lng": 28.9282944,
      "coordSource": "osm"
    },
    {
      "id": "stop_edirnekapi",
      "name": "Edirnekapı",
      "mode": "tramvay",
      "lat": 41.0313088,
      "lng": 28.9340531,
      "coordSource": "osm"
    },
    {
      "id": "stop_vatan",
      "name": "Vatan",
      "mode": "tramvay",
      "lat": 41.0255685,
      "lng": 28.9292392,
      "coordSource": "osm"
    },
    {
      "id": "stop_fetihkapi",
      "name": "Fetihkapı",
      "mode": "tramvay",
      "lat": 41.0215177,
      "lng": 28.9249855,
      "coordSource": "osm"
    },
    {
      "id": "stop_haciosman",
      "name": "Hacıosman",
      "mode": "metro",
      "lat": 41.1398775,
      "lng": 29.0303462,
      "coordSource": "osm"
    },
    {
      "id": "stop_darussafaka",
      "name": "Darüşşafaka",
      "mode": "metro",
      "lat": 41.1292867,
      "lng": 29.0248677,
      "coordSource": "osm"
    },
    {
      "id": "stop_ataturk_oto_sanayi",
      "name": "Atatürk Oto Sanayi",
      "mode": "metro",
      "lat": 41.1181945,
      "lng": 29.0239613,
      "coordSource": "osm"
    },
    {
      "id": "stop_itu_ayazaga",
      "name": "İTÜ-Ayazağa",
      "mode": "metro",
      "lat": 41.1082049,
      "lng": 29.0209202,
      "coordSource": "osm"
    },
    {
      "id": "stop_sanayi",
      "name": "Sanayi",
      "mode": "metro",
      "lat": 41.0942446,
      "lng": 29.0049849,
      "coordSource": "osm"
    },
    {
      "id": "stop_4_levent",
      "name": "4. Levent",
      "mode": "metro",
      "lat": 41.086047,
      "lng": 29.0069725,
      "coordSource": "osm"
    },
    {
      "id": "stop_levent",
      "name": "Levent",
      "mode": "hub",
      "lat": 41.0769862,
      "lng": 29.0135732,
      "coordSource": "osm"
    },
    {
      "id": "stop_gayrettepe",
      "name": "Gayrettepe",
      "mode": "hub",
      "lat": 41.0691324,
      "lng": 29.0110477,
      "coordSource": "osm"
    },
    {
      "id": "stop_sisli",
      "name": "Şişli",
      "mode": "metro",
      "lat": 41.0646058,
      "lng": 28.9926418,
      "coordSource": "osm"
    },
    {
      "id": "stop_osmanbey",
      "name": "Osmanbey",
      "mode": "metro",
      "lat": 41.0527563,
      "lng": 28.9872434,
      "coordSource": "osm"
    },
    {
      "id": "stop_taksim",
      "name": "Taksim",
      "mode": "hub",
      "lat": 41.0367798,
      "lng": 28.9866658,
      "coordSource": "osm"
    },
    {
      "id": "stop_sishane",
      "name": "Şişhane",
      "mode": "metro",
      "lat": 41.0284104,
      "lng": 28.9725882,
      "coordSource": "osm"
    },
    {
      "id": "stop_halic",
      "name": "Haliç",
      "mode": "metro",
      "lat": 41.0226507,
      "lng": 28.9665946,
      "coordSource": "osm"
    },
    {
      "id": "stop_vezneciler",
      "name": "Vezneciler",
      "mode": "metro",
      "lat": 41.0122579,
      "lng": 28.9595144,
      "coordSource": "osm"
    },
    {
      "id": "stop_yildiz",
      "name": "Yıldız",
      "mode": "metro",
      "lat": 41.0540063,
      "lng": 29.0098445,
      "coordSource": "osm"
    },
    {
      "id": "stop_fulya",
      "name": "Fulya",
      "mode": "metro",
      "lat": 41.0620788,
      "lng": 29.007826,
      "coordSource": "osm"
    },
    {
      "id": "stop_mecidiyekoy",
      "name": "Mecidiyeköy",
      "mode": "metro",
      "lat": 41.0653135,
      "lng": 28.9955607,
      "coordSource": "osm"
    },
    {
      "id": "stop_caglayan",
      "name": "Çağlayan",
      "mode": "metro",
      "lat": 41.0707989,
      "lng": 28.9806277,
      "coordSource": "osm"
    },
    {
      "id": "stop_kagithane",
      "name": "Kağıthane",
      "mode": "hub",
      "lat": 41.079665,
      "lng": 28.9731572,
      "coordSource": "osm"
    },
    {
      "id": "stop_nurtepe",
      "name": "Nurtepe",
      "mode": "metro",
      "lat": 41.0799595,
      "lng": 28.9632821,
      "coordSource": "osm"
    },
    {
      "id": "stop_alibeykoy",
      "name": "Alibeyköy",
      "mode": "metro",
      "lat": 41.0791653,
      "lng": 28.9495879,
      "coordSource": "osm"
    },
    {
      "id": "stop_circir_mahallesi",
      "name": "Çırçır Mahallesi",
      "mode": "metro",
      "lat": 41.0802839,
      "lng": 28.9361933,
      "coordSource": "osm"
    },
    {
      "id": "stop_veysel_karani_aksemsettin",
      "name": "Veysel Karani-Akşemsettin",
      "mode": "metro",
      "lat": 41.0797574,
      "lng": 28.9281764,
      "coordSource": "osm"
    },
    {
      "id": "stop_yesilpinar",
      "name": "Yeşilpınar",
      "mode": "metro",
      "lat": 41.0824149,
      "lng": 28.9183405,
      "coordSource": "osm"
    },
    {
      "id": "stop_k_zim_karabekir",
      "name": "Kâzım Karabekir",
      "mode": "metro",
      "lat": 41.0854613,
      "lng": 28.9085465,
      "coordSource": "osm"
    },
    {
      "id": "stop_yenimahalle",
      "name": "Yenimahalle",
      "mode": "metro",
      "lat": 41.0839716,
      "lng": 28.8928118,
      "coordSource": "osm"
    },
    {
      "id": "stop_karadeniz_mahallesi",
      "name": "Karadeniz Mahallesi",
      "mode": "metro",
      "lat": 41.0813391,
      "lng": 28.8749302,
      "coordSource": "osm"
    },
    {
      "id": "stop_giyimkent_tekstilkent",
      "name": "Giyimkent-Tekstilkent",
      "mode": "metro",
      "lat": 41.0713794,
      "lng": 28.8667234,
      "coordSource": "osm"
    },
    {
      "id": "stop_oruc_reis_yuzyil",
      "name": "Oruç Reis - Yüzyıl",
      "mode": "metro",
      "lat": 41.0628956,
      "lng": 28.8552786,
      "coordSource": "osm"
    },
    {
      "id": "stop_goztepe_2",
      "name": "Göztepe",
      "mode": "metro",
      "lat": 41.0570155,
      "lng": 28.8479518,
      "coordSource": "osm"
    },
    {
      "id": "stop_alibeykoy_cep_otogari",
      "name": "Alibeyköy Cep Otogarı",
      "mode": "tramvay",
      "lat": 41.0868716,
      "lng": 28.9439324,
      "coordSource": "osm"
    },
    {
      "id": "stop_alibeykoy_metro",
      "name": "Alibeyköy Metro",
      "mode": "tramvay",
      "lat": 41.0784279,
      "lng": 28.9494362,
      "coordSource": "osm"
    },
    {
      "id": "stop_alibeykoy_merkez",
      "name": "Alibeyköy Merkez",
      "mode": "tramvay",
      "lat": 41.0737108,
      "lng": 28.945958,
      "coordSource": "osm"
    },
    {
      "id": "stop_universite",
      "name": "Üniversite",
      "mode": "tramvay",
      "lat": 41.0699016,
      "lng": 28.9428216,
      "coordSource": "osm"
    },
    {
      "id": "stop_silahtaraga_mahallesi",
      "name": "Silahtarağa Mahallesi",
      "mode": "tramvay",
      "lat": 41.0648566,
      "lng": 28.9429308,
      "coordSource": "osm"
    },
    {
      "id": "stop_eyupsultan_devlet_hastanesi",
      "name": "Eyüpsultan Devlet Hastanesi",
      "mode": "tramvay",
      "lat": 41.056762,
      "lng": 28.9411459,
      "coordSource": "osm"
    },
    {
      "id": "stop_eyupsultan_teleferik",
      "name": "Eyüpsultan Teleferik",
      "mode": "tramvay",
      "lat": 41.0505614,
      "lng": 28.9351644,
      "coordSource": "osm"
    },
    {
      "id": "stop_feshane",
      "name": "Feshane",
      "mode": "tramvay",
      "lat": 41.0455401,
      "lng": 28.9378997,
      "coordSource": "osm"
    },
    {
      "id": "stop_ayvansaray",
      "name": "Ayvansaray",
      "mode": "tramvay",
      "lat": 41.0395444,
      "lng": 28.9439399,
      "coordSource": "osm"
    },
    {
      "id": "stop_balat",
      "name": "Balat",
      "mode": "tramvay",
      "lat": 41.0340207,
      "lng": 28.9480391,
      "coordSource": "osm"
    },
    {
      "id": "stop_fener",
      "name": "Fener",
      "mode": "tramvay",
      "lat": 41.0286148,
      "lng": 28.9544538,
      "coordSource": "osm"
    },
    {
      "id": "stop_cibali",
      "name": "Cibali",
      "mode": "tramvay",
      "lat": 41.0242282,
      "lng": 28.9602875,
      "coordSource": "osm"
    },
    {
      "id": "stop_kucukpazar",
      "name": "Küçükpazar",
      "mode": "tramvay",
      "lat": 41.0209233,
      "lng": 28.9632559,
      "coordSource": "osm"
    },
    {
      "id": "stop_halkali_stadi",
      "name": "Halkalı Stadı",
      "mode": "metro",
      "lat": 41.056569,
      "lng": 28.7748859,
      "coordSource": "osm"
    },
    {
      "id": "stop_olimpiyatkoy",
      "name": "Olimpiyatköy",
      "mode": "metro",
      "lat": 41.0780764,
      "lng": 28.7699116,
      "coordSource": "osm"
    },
    {
      "id": "stop_kayasehir",
      "name": "Kayaşehir",
      "mode": "metro",
      "lat": 41.1173262,
      "lng": 28.7658803,
      "coordSource": "osm"
    },
    {
      "id": "stop_ibn_haldun_universitesi",
      "name": "İbn Haldun Üniversitesi",
      "mode": "metro",
      "lat": 41.1394663,
      "lng": 28.793969,
      "coordSource": "osm"
    },
    {
      "id": "stop_arnavutkoy_hastane",
      "name": "Arnavutköy Hastane",
      "mode": "metro",
      "lat": 41.1791198,
      "lng": 28.74788,
      "coordSource": "osm"
    },
    {
      "id": "stop_tasoluk",
      "name": "Taşoluk",
      "mode": "metro",
      "lat": 41.2070981,
      "lng": 28.7160865,
      "coordSource": "osm"
    },
    {
      "id": "stop_kargo_terminali",
      "name": "Kargo Terminali",
      "mode": "metro",
      "lat": 41.2553423,
      "lng": 28.712731,
      "coordSource": "osm"
    },
    {
      "id": "stop_istanbul_havalimani",
      "name": "İstanbul Havalimanı",
      "mode": "metro",
      "lat": 41.2558497,
      "lng": 28.7426107,
      "coordSource": "osm"
    },
    {
      "id": "stop_ihsaniye",
      "name": "İhsaniye",
      "mode": "metro",
      "lat": 41.2428514,
      "lng": 28.8088272,
      "coordSource": "osm"
    },
    {
      "id": "stop_gokturk",
      "name": "Göktürk",
      "mode": "metro",
      "lat": 41.1768557,
      "lng": 28.8836397,
      "coordSource": "osm"
    },
    {
      "id": "stop_kemerburgaz",
      "name": "Kemerburgaz",
      "mode": "metro",
      "lat": 41.1590973,
      "lng": 28.9101084,
      "coordSource": "osm"
    },
    {
      "id": "stop_hasdal",
      "name": "Hasdal",
      "mode": "metro",
      "lat": 41.1212278,
      "lng": 28.9467385,
      "coordSource": "osm"
    },
    {
      "id": "stop_seyrantepe",
      "name": "Seyrantepe",
      "mode": "hub",
      "lat": 41.1012886,
      "lng": 28.9957442,
      "coordSource": "osm"
    },
    {
      "id": "mb_beylikduzu",
      "name": "Beylikdüzü Son Durak",
      "lat": 41.0022,
      "lng": 28.6398,
      "mode": "metrobus",
      "coordSource": "omurga-sablon"
    },
    {
      "id": "mb_beykent",
      "name": "Beykent",
      "lat": 40.9905,
      "lng": 28.661,
      "mode": "metrobus",
      "coordSource": "omurga-sablon"
    },
    {
      "id": "mb_haramidere",
      "name": "Haramidere",
      "lat": 40.99,
      "lng": 28.69,
      "mode": "metrobus",
      "coordSource": "omurga-sablon"
    },
    {
      "id": "mb_avcilar",
      "name": "Avcılar Merkez-Üniversite Kampüsü",
      "lat": 40.9878,
      "lng": 28.7215,
      "mode": "metrobus",
      "coordSource": "omurga-sablon"
    },
    {
      "id": "mb_kucukcekmece",
      "name": "Küçükçekmece",
      "lat": 41.0045,
      "lng": 28.7895,
      "mode": "metrobus",
      "coordSource": "omurga-sablon"
    },
    {
      "id": "mb_sefakoy",
      "name": "Sefaköy",
      "lat": 41.0018,
      "lng": 28.8025,
      "mode": "metrobus",
      "coordSource": "omurga-sablon"
    },
    {
      "id": "mb_yenibosna",
      "name": "Yenibosna",
      "lat": 40.9968,
      "lng": 28.8375,
      "mode": "metrobus",
      "coordSource": "omurga-sablon"
    },
    {
      "id": "mb_sirinevler",
      "name": "Şirinevler",
      "lat": 41.0022,
      "lng": 28.8435,
      "mode": "metrobus",
      "coordSource": "omurga-sablon"
    },
    {
      "id": "mb_bahcelievler",
      "name": "Bahçelievler",
      "lat": 41.0024,
      "lng": 28.8596,
      "mode": "metrobus",
      "coordSource": "omurga-sablon"
    },
    {
      "id": "mb_incirli",
      "name": "İncirli",
      "lat": 41.0065,
      "lng": 28.8725,
      "mode": "metrobus",
      "coordSource": "omurga-sablon"
    },
    {
      "id": "mb_zeytinburnu",
      "name": "Zeytinburnu",
      "lat": 41.0088,
      "lng": 28.8995,
      "mode": "metrobus",
      "coordSource": "omurga-sablon"
    },
    {
      "id": "mb_merter",
      "name": "Merter",
      "lat": 41.0122,
      "lng": 28.8888,
      "mode": "metrobus",
      "coordSource": "omurga-sablon"
    },
    {
      "id": "mb_cevizlibag",
      "name": "Cevizlibağ",
      "lat": 41.0168,
      "lng": 28.9105,
      "mode": "metrobus",
      "coordSource": "omurga-sablon"
    },
    {
      "id": "mb_topkapi",
      "name": "Topkapı",
      "lat": 41.0215,
      "lng": 28.9188,
      "mode": "metrobus",
      "coordSource": "omurga-sablon"
    },
    {
      "id": "mb_edirnekapi",
      "name": "Edirnekapı",
      "lat": 41.0345,
      "lng": 28.9395,
      "mode": "metrobus",
      "coordSource": "omurga-sablon"
    },
    {
      "id": "mb_halicioglu",
      "name": "Halıcıoğlu",
      "lat": 41.0502,
      "lng": 28.9448,
      "mode": "metrobus",
      "coordSource": "omurga-sablon"
    },
    {
      "id": "mb_okmeydani",
      "name": "Okmeydanı",
      "lat": 41.0585,
      "lng": 28.968,
      "mode": "metrobus",
      "coordSource": "omurga-sablon"
    },
    {
      "id": "mb_caglayan",
      "name": "Çağlayan",
      "lat": 41.0702,
      "lng": 28.9825,
      "mode": "metrobus",
      "coordSource": "omurga-sablon"
    },
    {
      "id": "mb_mecidiyekoy",
      "name": "Mecidiyeköy",
      "lat": 41.0665,
      "lng": 28.9948,
      "mode": "metrobus",
      "coordSource": "omurga-sablon"
    },
    {
      "id": "mb_zincirlikuyu",
      "name": "Zincirlikuyu",
      "lat": 41.0672,
      "lng": 29.0138,
      "mode": "metrobus",
      "coordSource": "omurga-sablon"
    }
  ],
  "transitLines": [
    {
      "id": "T1",
      "name": "T1: Kabataş → Bağcılar",
      "mode": "tramvay",
      "verified": true,
      "operator": "Metro İstanbul",
      "hatNo": "T1",
      "source": "OpenStreetMap/Overpass omurga şablonu (ikmapsistanbulanadolu, 2026-09-07) — Avrupa yakası",
      "stopIds": [
        "stop_kabatas",
        "stop_findikli_msu",
        "stop_tophane",
        "stop_karakoy",
        "stop_eminonu",
        "stop_sirkeci",
        "stop_gulhane",
        "stop_sultanahmet",
        "stop_cemberlitas",
        "stop_beyazit_kapali_carsi",
        "stop_aksaray",
        "stop_yusufpasa",
        "stop_haseki",
        "stop_findikzade",
        "stop_capa_sehremini",
        "stop_pazartekke",
        "stop_topkapi",
        "stop_cevizlibag_a_o_y",
        "stop_merkez_efendi",
        "stop_seyitnizam_aksemsettin",
        "stop_mithatpasa",
        "stop_mehmet_akif",
        "stop_merter_tekstil_merkezi",
        "stop_gungoren",
        "stop_akincilar",
        "stop_soganli",
        "stop_gunestepe",
        "stop_yavuz_selim",
        "stop_zeytinburnu",
        "stop_bagcilar"
      ],
      "headwayMin": 5
    },
    {
      "id": "M1A",
      "name": "M1A: Yenikapı → Atatürk Havalimanı",
      "mode": "metro",
      "verified": true,
      "operator": "Metro İstanbul",
      "hatNo": "M1A",
      "source": "OpenStreetMap/Overpass omurga şablonu (ikmapsistanbulanadolu, 2026-09-07) — Avrupa yakası",
      "stopIds": [
        "stop_yenikapi",
        "stop_aksaray",
        "stop_emniyet_fatih",
        "stop_topkapi_ulubatli",
        "stop_bayrampasa_maltepe",
        "stop_sagmalcilar",
        "stop_kocatepe",
        "stop_otogar",
        "stop_terazidere",
        "stop_davutpasa_ytu",
        "stop_merter",
        "stop_zeytinburnu",
        "stop_bakirkoy_incirli",
        "stop_bahcelievler",
        "stop_atakoy_sirinevler",
        "stop_yenibosna",
        "stop_dtm_istanbul_fuar_merkezi",
        "stop_ataturk_havalimani"
      ],
      "headwayMin": 6
    },
    {
      "id": "M1B",
      "name": "M1B: Yenikapı → Kirazlı",
      "mode": "metro",
      "verified": true,
      "operator": "Metro İstanbul",
      "hatNo": "M1B",
      "source": "OpenStreetMap/Overpass omurga şablonu (ikmapsistanbulanadolu, 2026-09-07) — Avrupa yakası",
      "stopIds": [
        "stop_yenikapi",
        "stop_aksaray",
        "stop_emniyet_fatih",
        "stop_topkapi_ulubatli",
        "stop_bayrampasa_maltepe",
        "stop_sagmalcilar",
        "stop_kocatepe",
        "stop_otogar",
        "stop_esenler",
        "stop_menderes",
        "stop_ucyuzlu",
        "stop_bagcilar_meydan",
        "stop_kirazli"
      ],
      "headwayMin": 6
    },
    {
      "id": "B1",
      "name": "Marmaray: Sirkeci → Halkalı",
      "mode": "marmaray",
      "verified": true,
      "operator": "TCDD Taşımacılık",
      "hatNo": "Marmaray",
      "source": "OpenStreetMap/Overpass omurga şablonu (ikmapsistanbulanadolu, 2026-09-07) — Avrupa yakası",
      "stopIds": [
        "stop_sirkeci",
        "stop_yenikapi",
        "stop_kazlicesme",
        "stop_zeytinburnu_fisekhane",
        "stop_yeni_mahalle",
        "stop_bakirkoy",
        "stop_atakoy",
        "stop_yesilyurt",
        "stop_yesilkoy",
        "stop_florya_akvaryum",
        "stop_florya",
        "stop_kucukcekmece",
        "stop_mustafa_kemal",
        "stop_halkali"
      ],
      "headwayMin": 10
    },
    {
      "id": "M3",
      "name": "M3: Bakırköy Sahil → Kayaşehir Merkez",
      "mode": "metro",
      "verified": true,
      "operator": "Metro İstanbul",
      "hatNo": "M3",
      "source": "OpenStreetMap/Overpass omurga şablonu (ikmapsistanbulanadolu, 2026-09-07) — Avrupa yakası",
      "stopIds": [
        "stop_bakirkoy_sahil",
        "stop_ozgurluk_meydani",
        "stop_incirli",
        "stop_haznedar",
        "stop_ilkyuva",
        "stop_yildiztepe",
        "stop_molla_gurani",
        "stop_kirazli",
        "stop_yeni_mahalle_2",
        "stop_mahmutbey",
        "stop_istoc",
        "stop_ikitelli_sanayi",
        "stop_turgut_ozal",
        "stop_siteler",
        "stop_basak_konutlari",
        "stop_metrokent",
        "stop_onurkent",
        "stop_sehir_hastanesi",
        "stop_toplu_konutlar",
        "stop_kayasehir_merkez"
      ],
      "headwayMin": 6
    },
    {
      "id": "M9",
      "name": "M9: Ataköy → Olimpiyat",
      "mode": "metro",
      "verified": true,
      "operator": "Metro İstanbul",
      "hatNo": "M9",
      "source": "OpenStreetMap/Overpass omurga şablonu (ikmapsistanbulanadolu, 2026-09-07) — Avrupa yakası",
      "stopIds": [
        "stop_atakoy",
        "stop_yenibosna",
        "stop_cobancesme",
        "stop_29_ekim_cumhuriyet",
        "stop_dogu_sanayi",
        "stop_mimar_sinan",
        "stop_15_temmuz",
        "stop_halkali_caddesi",
        "stop_ataturk_mahallesi",
        "stop_bahariye_2",
        "stop_masko",
        "stop_ikitelli_sanayi",
        "stop_ziya_gokalp",
        "stop_olimpiyat"
      ],
      "headwayMin": 6
    },
    {
      "id": "T4",
      "name": "T4: Mescid-i Selam → Topkapı",
      "mode": "tramvay",
      "verified": true,
      "operator": "Metro İstanbul",
      "hatNo": "T4",
      "source": "OpenStreetMap/Overpass omurga şablonu (ikmapsistanbulanadolu, 2026-09-07) — Avrupa yakası",
      "stopIds": [
        "stop_mescid_i_selam",
        "stop_cebeci",
        "stop_yeni_mahalle_3",
        "stop_haci_sukru",
        "stop_50_yil_bastabya",
        "stop_cumhuriyet_mahallesi",
        "stop_kiptas_venezia",
        "stop_karadeniz",
        "stop_taskopru",
        "stop_ali_fuat_basgil",
        "stop_bosna_cukurcesme",
        "stop_sagmalcilar",
        "stop_uluyol_berec",
        "stop_rami",
        "stop_topcular",
        "stop_demirkapi",
        "stop_sehitlik",
        "stop_edirnekapi",
        "stop_vatan",
        "stop_fetihkapi",
        "stop_topkapi"
      ],
      "headwayMin": 5
    },
    {
      "id": "M2",
      "name": "M2: Hacıosman → Yenikapı",
      "mode": "metro",
      "verified": true,
      "operator": "Metro İstanbul",
      "hatNo": "M2",
      "source": "OpenStreetMap/Overpass omurga şablonu (ikmapsistanbulanadolu, 2026-09-07) — Avrupa yakası",
      "stopIds": [
        "stop_haciosman",
        "stop_darussafaka",
        "stop_ataturk_oto_sanayi",
        "stop_itu_ayazaga",
        "stop_sanayi",
        "stop_4_levent",
        "stop_levent",
        "stop_gayrettepe",
        "stop_sisli",
        "stop_osmanbey",
        "stop_taksim",
        "stop_sishane",
        "stop_halic",
        "stop_vezneciler",
        "stop_yenikapi"
      ],
      "headwayMin": 6
    },
    {
      "id": "M7",
      "name": "M7: Yıldız → Mahmutbey",
      "mode": "metro",
      "verified": true,
      "operator": "Metro İstanbul",
      "hatNo": "M7",
      "source": "OpenStreetMap/Overpass omurga şablonu (ikmapsistanbulanadolu, 2026-09-07) — Avrupa yakası",
      "stopIds": [
        "stop_yildiz",
        "stop_fulya",
        "stop_mecidiyekoy",
        "stop_caglayan",
        "stop_kagithane",
        "stop_nurtepe",
        "stop_alibeykoy",
        "stop_circir_mahallesi",
        "stop_veysel_karani_aksemsettin",
        "stop_yesilpinar",
        "stop_k_zim_karabekir",
        "stop_yenimahalle",
        "stop_karadeniz_mahallesi",
        "stop_giyimkent_tekstilkent",
        "stop_oruc_reis_yuzyil",
        "stop_goztepe_2",
        "stop_mahmutbey"
      ],
      "headwayMin": 6
    },
    {
      "id": "T5",
      "name": "T5: Alibeyköy Cep Otogarı → Eminönü",
      "mode": "tramvay",
      "verified": true,
      "operator": "Metro İstanbul",
      "hatNo": "T5",
      "source": "OpenStreetMap/Overpass omurga şablonu (ikmapsistanbulanadolu, 2026-09-07) — Avrupa yakası",
      "stopIds": [
        "stop_alibeykoy_cep_otogari",
        "stop_alibeykoy_metro",
        "stop_alibeykoy_merkez",
        "stop_universite",
        "stop_silahtaraga_mahallesi",
        "stop_eyupsultan_devlet_hastanesi",
        "stop_eyupsultan_teleferik",
        "stop_feshane",
        "stop_ayvansaray",
        "stop_balat",
        "stop_fener",
        "stop_cibali",
        "stop_kucukpazar",
        "stop_eminonu"
      ],
      "headwayMin": 5
    },
    {
      "id": "M11",
      "name": "M11: Halkalı → Gayrettepe",
      "mode": "metro",
      "verified": true,
      "operator": "Metro İstanbul",
      "hatNo": "M11",
      "source": "OpenStreetMap/Overpass omurga şablonu (ikmapsistanbulanadolu, 2026-09-07) — Avrupa yakası",
      "stopIds": [
        "stop_halkali",
        "stop_halkali_stadi",
        "stop_olimpiyatkoy",
        "stop_kayasehir",
        "stop_ibn_haldun_universitesi",
        "stop_arnavutkoy_hastane",
        "stop_tasoluk",
        "stop_kargo_terminali",
        "stop_istanbul_havalimani",
        "stop_ihsaniye",
        "stop_gokturk",
        "stop_kemerburgaz",
        "stop_hasdal",
        "stop_kagithane",
        "stop_gayrettepe"
      ],
      "headwayMin": 6
    },
    {
      "id": "M2_SEYRANTEPE",
      "name": "M2 Seyrantepe kolu: Sanayi → Seyrantepe",
      "mode": "metro",
      "verified": true,
      "operator": "Metro İstanbul",
      "hatNo": "M2",
      "source": "M2 ana hattından ayrılan kol — Yenikapı ile sahte kenar kurulmasın diye ayrı modül",
      "stopIds": [
        "stop_sanayi",
        "stop_seyrantepe"
      ],
      "headwayMin": 6
    },
    {
      "id": "METROBUS",
      "name": "Metrobüs: Beylikdüzü → Zincirlikuyu",
      "mode": "metrobus",
      "verified": true,
      "operator": "İETT",
      "hatNo": "34",
      "headwayMin": 3,
      "source": "İETT metrobüs Avrupa yakası omurgası — istasyon pinleri şablon koordinatıdır",
      "stopIds": [
        "mb_beylikduzu",
        "mb_beykent",
        "mb_haramidere",
        "mb_avcilar",
        "mb_kucukcekmece",
        "mb_sefakoy",
        "mb_yenibosna",
        "mb_sirinevler",
        "mb_bahcelievler",
        "mb_incirli",
        "mb_zeytinburnu",
        "mb_merter",
        "mb_cevizlibag",
        "mb_topkapi",
        "mb_edirnekapi",
        "mb_halicioglu",
        "mb_okmeydani",
        "mb_caglayan",
        "mb_mecidiyekoy",
        "mb_zincirlikuyu"
      ]
    }
  ],
  "walkLinks": [
    {
      "from": "mb_mecidiyekoy",
      "to": "stop_mecidiyekoy",
      "km": 0.147
    },
    {
      "from": "mb_caglayan",
      "to": "stop_caglayan",
      "km": 0.17
    },
    {
      "from": "mb_zincirlikuyu",
      "to": "stop_gayrettepe",
      "km": 0.315
    },
    {
      "from": "mb_sirinevler",
      "to": "stop_atakoy_sirinevler",
      "km": 1.222
    },
    {
      "from": "mb_yenibosna",
      "to": "stop_yenibosna",
      "km": 0.82
    },
    {
      "from": "mb_bahcelievler",
      "to": "stop_bahcelievler",
      "km": 0.827
    },
    {
      "from": "mb_incirli",
      "to": "stop_incirli",
      "km": 1.012
    },
    {
      "from": "mb_incirli",
      "to": "stop_bakirkoy_incirli",
      "km": 1.123
    },
    {
      "from": "mb_zeytinburnu",
      "to": "stop_zeytinburnu",
      "km": 1.126
    },
    {
      "from": "mb_merter",
      "to": "stop_merter",
      "km": 0.801
    },
    {
      "from": "mb_cevizlibag",
      "to": "stop_cevizlibag_a_o_y",
      "km": 0.123
    },
    {
      "from": "mb_topkapi",
      "to": "stop_topkapi",
      "km": 0.252
    },
    {
      "from": "mb_edirnekapi",
      "to": "stop_edirnekapi",
      "km": 0.578
    },
    {
      "from": "stop_sisli",
      "to": "stop_mecidiyekoy",
      "km": 0.257
    },
    {
      "from": "stop_alibeykoy",
      "to": "stop_alibeykoy_metro",
      "km": 0.083
    }
  ],
  "hubStopIds": [
    "stop_yenikapi",
    "stop_aksaray",
    "stop_taksim",
    "stop_otogar",
    "stop_kirazli",
    "stop_mahmutbey",
    "stop_gayrettepe",
    "stop_levent",
    "stop_mecidiyekoy",
    "stop_kagithane",
    "stop_halkali",
    "stop_atakoy",
    "stop_zeytinburnu",
    "stop_bakirkoy",
    "mb_mecidiyekoy",
    "mb_zincirlikuyu",
    "mb_sirinevler",
    "mb_avcilar",
    "stop_topkapi",
    "stop_eminonu",
    "stop_ikitelli_sanayi",
    "stop_yenibosna"
  ]
};
