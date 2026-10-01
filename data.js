/**
 * ANKARA_DATA — Ankara ikmapsv2 ile aynı şema.
 * Projeler PROJE_KONUM İstanbul güvenlik kayıtlarıdır.
 * Durak ve hatlar İstanbul Avrupa omurgasıdır (M1A, M1B, M2, M3, M7, M9, M11,
 * T1, T4, T5, Marmaray ve İBB İETT GTFS otobüs hatları.
 * Graf ve çizim transit_network.json + transit_network_geometry.json üzerinden
 * Ankara app.js motorunu kullanır.
 */
const ANKARA_DATA = {
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
  "urgentProjectIds": [],
  "projects": [
    {
      "id": "proj_torium",
      "name": "Torium",
      "sector": "Güvenlik",
      "position": "",
      "address": "Haramidere, Beylikdüzü",
      "lat": 41.0041831,
      "lng": 28.6878147,
      "accessStopId": "mb_haramidere_sanayi",
      "shift": "2+2+2 · 4 çalış 2 izin",
      "salary": "40.000 TL Brüt maaş",
      "meal": "PROJEDEN + 5000 TL MULTİNER",
      "transport": "-",
      "referral": "Projeye yönlendirilecek · İK ANIL YOGURTÇU · Op. SADİR SELÇUK ERKAN · KÜÇÜKÇEKMECE LOJMAN · Yaş ≤ 35 · 40.000 TL MAAŞ 5000 TL MULTİNET 2+2+2",
      "gender": "Erkek",
      "urgent": false,
      "active": true
    },
    {
      "id": "proj_mall_of_avm",
      "name": "Mall of AVM",
      "sector": "Güvenlik",
      "position": "",
      "address": "İkitelli, Başakşehir",
      "lat": 41.0625272,
      "lng": 28.8075256,
      "accessStopId": "stop_masko",
      "shift": "2+2+2 · 4 çalış 2 izin",
      "salary": "40.000 TL Brüt maaş",
      "meal": "PROJEDEN + 5000 TL MULTİNER",
      "transport": "-",
      "referral": "Projeye yönlendirilecek · İK ANIL YOGURTÇU · Op. OKTAY AHMET KARAKAYA · KÜÇÜKÇEKMECE LOJMAN · Yaş ≤ 35 · 40.000 TL MAAŞ 5000 TL MULTİNET 2+2+2",
      "gender": "Erkek",
      "urgent": false,
      "active": true
    },
    {
      "id": "proj_medipol",
      "name": "Medipol Hastanesi",
      "sector": "Güvenlik",
      "position": "",
      "address": "Yenibosna, Bahçelievler",
      "lat": 40.9983995,
      "lng": 28.8304931,
      "accessStopId": "mb_yenibosna",
      "shift": "2+2+2 · 4 çalış 2 izin",
      "salary": "35.872 TL Brüt maaş",
      "meal": "PROJEDEN + 5000 TL MULTİNER",
      "transport": "3.628 TL",
      "referral": "Projeye yönlendirilecek · İK BURCU BAYRAK · Op. ZEKERİYA GÜNEY · KÜÇÜKÇEKMECE LOJMAN · Yaş ≤ 35 · 39500 TL MAAŞ PROJEDEN YEMEK 2+2+2",
      "gender": "Erkek",
      "urgent": false,
      "active": true
    },
    {
      "id": "proj_eti_dpo",
      "name": "Eti DPO",
      "sector": "Güvenlik",
      "position": "",
      "address": "Akçaburgaz, Esenyurt",
      "lat": 41.0792312,
      "lng": 28.6354638,
      "accessStopId": "bus_akcaburgaz_eti",
      "shift": "2+2+2 · 4 çalış 2 izin",
      "salary": "45.372 TL Brüt maaş",
      "meal": "11.000 TL NAKİT YEMEK",
      "transport": "3.628 TL",
      "referral": "Projeye yönlendirilecek · İK BURCU BAYRAK · Op. SELİM BAYRAM · Yaş ≤ 30 · 60000 TL HERŞEY DAHİL 2+2+2",
      "gender": "Erkek",
      "urgent": false,
      "active": true
    },
    {
      "id": "proj_liv_hospital",
      "name": "Liv Hospital",
      "sector": "Güvenlik",
      "position": "",
      "address": "Esenkent, Esenyurt",
      "lat": 41.0563428,
      "lng": 28.6717817,
      "accessStopId": "bus_142_esenkent",
      "shift": "2+2+2 · 4 çalış 2 izin",
      "salary": "42.241 TL Brüt maaş",
      "meal": "PROJEDEN",
      "transport": "3.298 TL",
      "referral": "Projeye yönlendirilecek · İK ŞAHİN KOÇALİ · Op. MESUT KURT · Yaş ≤ 30 · 42.241 TL + 3298 TL + Yemek",
      "gender": "Erkek",
      "urgent": false,
      "active": true
    },
    {
      "id": "proj_mengenler",
      "name": "Mengenler",
      "sector": "Güvenlik",
      "position": "",
      "address": "Etiler, Beşiktaş",
      "lat": 41.0814212,
      "lng": 29.0345988,
      "accessStopId": "stop_etiler",
      "shift": "2+2+2 · 4 çalış 2 izin",
      "salary": "42.000 TL Net maaş",
      "meal": "5500 MULTİNET",
      "transport": "-",
      "referral": "İK ŞAHİN KOÇALİ · Op. MESUT KURT · Yaş ≤ 45 · 2+2+2 42.000 TL Net (vergi kesintisi yoktur.) + 5500 TL Multinet",
      "gender": "Erkek",
      "urgent": false,
      "active": true
    },
    {
      "id": "proj_ortakoy_republika",
      "name": "Ortaköy Republika",
      "sector": "Güvenlik",
      "position": "",
      "address": "Balmumcu, Beşiktaş",
      "lat": 41.0542874,
      "lng": 29.0206898,
      "accessStopId": "stop_yildiz",
      "shift": "2+2+2 · 4 çalış 2 izin",
      "salary": "44.000 TL Net maaş",
      "meal": "PROJEDEN",
      "transport": "3.628 TL",
      "referral": "Projeye yönlendirilecek · İK BURCU BAYRAK · Op. SELİM BAYRAM · Yaş ≤ 35 · 44.000 TL NET MAAŞ 3628 TL YOL PROJEDEN YEMEK",
      "gender": "Erkek",
      "urgent": false,
      "active": true
    }
  ],
  "transitStops": [
    {
      "id": "stop_kabatas",
      "name": "Kabataş",
      "mode": "otobus",
      "lat": 41.0344774,
      "lng": 28.9926707
    },
    {
      "id": "stop_findikli_msu",
      "name": "Fındıklı - MSÜ",
      "mode": "ankaray",
      "lat": 41.0315308,
      "lng": 28.9894567
    },
    {
      "id": "stop_tophane",
      "name": "Tophane",
      "mode": "ankaray",
      "lat": 41.0268005,
      "lng": 28.9802781
    },
    {
      "id": "stop_karakoy",
      "name": "Karaköy",
      "mode": "otobus",
      "lat": 41.0222299,
      "lng": 28.9747557
    },
    {
      "id": "stop_eminonu",
      "name": "Eminönü",
      "mode": "otobus",
      "lat": 41.0174499,
      "lng": 28.9732148
    },
    {
      "id": "stop_sirkeci",
      "name": "Sirkeci",
      "mode": "otobus",
      "lat": 41.0151642,
      "lng": 28.9758304
    },
    {
      "id": "stop_gulhane",
      "name": "Gülhane",
      "mode": "ankaray",
      "lat": 41.0121632,
      "lng": 28.9784087
    },
    {
      "id": "stop_sultanahmet",
      "name": "Sultanahmet",
      "mode": "ankaray",
      "lat": 41.0081113,
      "lng": 28.9755143
    },
    {
      "id": "stop_cemberlitas",
      "name": "Çemberlitaş",
      "mode": "ankaray",
      "lat": 41.0084652,
      "lng": 28.9711451
    },
    {
      "id": "stop_beyazit_kapali_carsi",
      "name": "Beyazıt - Kapalı Çarşı",
      "mode": "ankaray",
      "lat": 41.0090852,
      "lng": 28.9666458
    },
    {
      "id": "stop_aksaray",
      "name": "Aksaray",
      "mode": "otobus",
      "lat": 41.0096115,
      "lng": 28.9538781
    },
    {
      "id": "stop_yusufpasa",
      "name": "Yusufpaşa",
      "mode": "ankaray",
      "lat": 41.0100961,
      "lng": 28.9466545
    },
    {
      "id": "stop_haseki",
      "name": "Haseki",
      "mode": "ankaray",
      "lat": 41.0110406,
      "lng": 28.9431092
    },
    {
      "id": "stop_findikzade",
      "name": "Fındıkzade",
      "mode": "ankaray",
      "lat": 41.0118214,
      "lng": 28.9404859
    },
    {
      "id": "stop_capa_sehremini",
      "name": "Çapa-Şehremini",
      "mode": "ankaray",
      "lat": 41.015279,
      "lng": 28.9333351
    },
    {
      "id": "stop_pazartekke",
      "name": "Pazartekke",
      "mode": "ankaray",
      "lat": 41.0182396,
      "lng": 28.9271904
    },
    {
      "id": "stop_topkapi",
      "name": "Topkapı",
      "mode": "otobus",
      "lat": 41.0192853,
      "lng": 28.9194457
    },
    {
      "id": "stop_cevizlibag_a_o_y",
      "name": "Cevizlibağ-A.Ö.Y.",
      "mode": "ankaray",
      "lat": 41.0160557,
      "lng": 28.9115859
    },
    {
      "id": "stop_merkez_efendi",
      "name": "Merkez Efendi",
      "mode": "ankaray",
      "lat": 41.0103501,
      "lng": 28.9094588
    },
    {
      "id": "stop_seyitnizam_aksemsettin",
      "name": "Seyitnizam-Akşemsettin",
      "mode": "ankaray",
      "lat": 41.0042355,
      "lng": 28.9073596
    },
    {
      "id": "stop_mithatpasa",
      "name": "Mithatpaşa",
      "mode": "ankaray",
      "lat": 41.003385,
      "lng": 28.8998873
    },
    {
      "id": "stop_mehmet_akif",
      "name": "Mehmet Akif",
      "mode": "ankaray",
      "lat": 41.0058363,
      "lng": 28.8816928
    },
    {
      "id": "stop_merter_tekstil_merkezi",
      "name": "Merter Tekstil Merkezi",
      "mode": "ankaray",
      "lat": 41.0115728,
      "lng": 28.8807848
    },
    {
      "id": "stop_gungoren",
      "name": "Güngören",
      "mode": "ankaray",
      "lat": 41.0152632,
      "lng": 28.877486
    },
    {
      "id": "stop_akincilar",
      "name": "Akıncılar",
      "mode": "ankaray",
      "lat": 41.0171401,
      "lng": 28.8714699
    },
    {
      "id": "stop_soganli",
      "name": "Soğanlı",
      "mode": "ankaray",
      "lat": 41.0205923,
      "lng": 28.8676168
    },
    {
      "id": "stop_gunestepe",
      "name": "Güneştepe",
      "mode": "ankaray",
      "lat": 41.028958,
      "lng": 28.8610215
    },
    {
      "id": "stop_yavuz_selim",
      "name": "Yavuz Selim",
      "mode": "ankaray",
      "lat": 41.0235482,
      "lng": 28.8640724
    },
    {
      "id": "stop_zeytinburnu",
      "name": "Zeytinburnu",
      "mode": "otobus",
      "lat": 41.0015333,
      "lng": 28.8901578
    },
    {
      "id": "stop_bagcilar",
      "name": "Bağcılar",
      "mode": "ankaray",
      "lat": 41.0322093,
      "lng": 28.8606194
    },
    {
      "id": "stop_yenikapi",
      "name": "Yenikapı",
      "mode": "otobus",
      "lat": 41.005728,
      "lng": 28.9505658
    },
    {
      "id": "stop_emniyet_fatih",
      "name": "Emniyet - Fatih",
      "mode": "otobus",
      "lat": 41.0174301,
      "lng": 28.9396317
    },
    {
      "id": "stop_topkapi_ulubatli",
      "name": "Topkapı Ulubatlı",
      "mode": "otobus",
      "lat": 41.0238758,
      "lng": 28.9306248
    },
    {
      "id": "stop_bayrampasa_maltepe",
      "name": "Bayrampaşa-Maltepe",
      "mode": "otobus",
      "lat": 41.0341161,
      "lng": 28.9203244
    },
    {
      "id": "stop_sagmalcilar",
      "name": "Sağmalcılar",
      "mode": "otobus",
      "lat": 41.040912,
      "lng": 28.9072258
    },
    {
      "id": "stop_kocatepe",
      "name": "Kocatepe",
      "mode": "otobus",
      "lat": 41.0485107,
      "lng": 28.8954577
    },
    {
      "id": "stop_otogar",
      "name": "Otogar",
      "mode": "otobus",
      "lat": 41.0401083,
      "lng": 28.8946163
    },
    {
      "id": "stop_terazidere",
      "name": "Terazidere",
      "mode": "metro",
      "lat": 41.0303612,
      "lng": 28.897936
    },
    {
      "id": "stop_davutpasa_ytu",
      "name": "Davutpaşa - YTÜ",
      "mode": "metro",
      "lat": 41.0205272,
      "lng": 28.900245
    },
    {
      "id": "stop_merter",
      "name": "Merter",
      "mode": "metro",
      "lat": 41.0076182,
      "lng": 28.8961612
    },
    {
      "id": "stop_bakirkoy_incirli",
      "name": "Bakırköy-İncirli",
      "mode": "metro",
      "lat": 40.9966391,
      "lng": 28.8753909
    },
    {
      "id": "stop_bahcelievler",
      "name": "Bahçelievler",
      "mode": "metro",
      "lat": 40.9955091,
      "lng": 28.8632993
    },
    {
      "id": "stop_atakoy_sirinevler",
      "name": "Ataköy-Şirinevler",
      "mode": "metro",
      "lat": 40.9913766,
      "lng": 28.8460141
    },
    {
      "id": "stop_yenibosna",
      "name": "Yenibosna",
      "mode": "otobus",
      "lat": 40.9894444,
      "lng": 28.8367394
    },
    {
      "id": "stop_dtm_istanbul_fuar_merkezi",
      "name": "DTM-İstanbul Fuar Merkezi",
      "mode": "metro",
      "lat": 40.9866459,
      "lng": 28.8284451
    },
    {
      "id": "stop_ataturk_havalimani",
      "name": "Atatürk Havalimanı",
      "mode": "metro",
      "lat": 40.9797389,
      "lng": 28.8210402
    },
    {
      "id": "stop_esenler",
      "name": "Esenler",
      "mode": "metro",
      "lat": 41.0375458,
      "lng": 28.8885667
    },
    {
      "id": "stop_menderes",
      "name": "Menderes",
      "mode": "metro",
      "lat": 41.0428043,
      "lng": 28.8784472
    },
    {
      "id": "stop_ucyuzlu",
      "name": "Üçyüzlü",
      "mode": "metro",
      "lat": 41.036756,
      "lng": 28.8706206
    },
    {
      "id": "stop_bagcilar_meydan",
      "name": "Bağcılar Meydan",
      "mode": "metro",
      "lat": 41.034741,
      "lng": 28.8566453
    },
    {
      "id": "stop_kirazli",
      "name": "Kirazlı",
      "mode": "otobus",
      "lat": 41.0318577,
      "lng": 28.8421605
    },
    {
      "id": "stop_kazlicesme",
      "name": "Kazlıçeşme",
      "mode": "tren",
      "lat": 40.9927446,
      "lng": 28.9169682
    },
    {
      "id": "stop_zeytinburnu_fisekhane",
      "name": "Zeytinburnu-Fişekhane",
      "mode": "tren",
      "lat": 40.9859358,
      "lng": 28.9053777
    },
    {
      "id": "stop_yeni_mahalle",
      "name": "Yeni Mahalle",
      "mode": "tren",
      "lat": 40.9818034,
      "lng": 28.8810217
    },
    {
      "id": "stop_bakirkoy",
      "name": "Bakırköy",
      "mode": "tren",
      "lat": 40.9804407,
      "lng": 28.8724034
    },
    {
      "id": "stop_atakoy",
      "name": "Ataköy",
      "mode": "otobus",
      "lat": 40.9802954,
      "lng": 28.8562255
    },
    {
      "id": "stop_yesilyurt",
      "name": "Yeşilyurt",
      "mode": "tren",
      "lat": 40.9655489,
      "lng": 28.8372396
    },
    {
      "id": "stop_yesilkoy",
      "name": "Yeşilköy",
      "mode": "tren",
      "lat": 40.9627331,
      "lng": 28.8248804
    },
    {
      "id": "stop_florya_akvaryum",
      "name": "Florya Akvaryum",
      "mode": "tren",
      "lat": 40.9678693,
      "lng": 28.7970755
    },
    {
      "id": "stop_florya",
      "name": "Florya",
      "mode": "tren",
      "lat": 40.9729697,
      "lng": 28.7876456
    },
    {
      "id": "stop_kucukcekmece",
      "name": "Küçükçekmece",
      "mode": "tren",
      "lat": 40.9885491,
      "lng": 28.773056
    },
    {
      "id": "stop_mustafa_kemal",
      "name": "Mustafa Kemal",
      "mode": "tren",
      "lat": 41.0061388,
      "lng": 28.7739784
    },
    {
      "id": "stop_halkali",
      "name": "Halkalı",
      "mode": "otobus",
      "lat": 41.0184381,
      "lng": 28.7668524
    },
    {
      "id": "stop_bakirkoy_sahil",
      "name": "Bakırköy Sahil",
      "mode": "metro",
      "lat": 40.9735585,
      "lng": 28.8679821
    },
    {
      "id": "stop_ozgurluk_meydani",
      "name": "Özgürlük Meydanı",
      "mode": "metro",
      "lat": 40.9817899,
      "lng": 28.8743051
    },
    {
      "id": "stop_incirli",
      "name": "İncirli",
      "mode": "metro",
      "lat": 40.9976509,
      "lng": 28.8753178
    },
    {
      "id": "stop_haznedar",
      "name": "Haznedar",
      "mode": "metro",
      "lat": 41.0047045,
      "lng": 28.8718966
    },
    {
      "id": "stop_ilkyuva",
      "name": "İlkyuva",
      "mode": "metro",
      "lat": 41.0117328,
      "lng": 28.8657307
    },
    {
      "id": "stop_yildiztepe",
      "name": "Yıldıztepe",
      "mode": "metro",
      "lat": 41.019572,
      "lng": 28.8578319
    },
    {
      "id": "stop_molla_gurani",
      "name": "Molla Gürani",
      "mode": "metro",
      "lat": 41.0259558,
      "lng": 28.8480788
    },
    {
      "id": "stop_yeni_mahalle_2",
      "name": "Yeni Mahalle",
      "mode": "metro",
      "lat": 41.0404308,
      "lng": 28.8361223
    },
    {
      "id": "stop_mahmutbey",
      "name": "Mahmutbey",
      "mode": "otobus",
      "lat": 41.0548896,
      "lng": 28.8306126
    },
    {
      "id": "stop_istoc",
      "name": "İSTOÇ",
      "mode": "metro",
      "lat": 41.065077,
      "lng": 28.8260847
    },
    {
      "id": "stop_ikitelli_sanayi",
      "name": "İkitelli Sanayi",
      "mode": "otobus",
      "lat": 41.0713956,
      "lng": 28.8038216
    },
    {
      "id": "stop_turgut_ozal",
      "name": "Turgut Özal",
      "mode": "metro",
      "lat": 41.0811589,
      "lng": 28.7976309
    },
    {
      "id": "stop_siteler",
      "name": "Siteler",
      "mode": "metro",
      "lat": 41.0882794,
      "lng": 28.7966542
    },
    {
      "id": "stop_basak_konutlari",
      "name": "Başak Konutları",
      "mode": "metro",
      "lat": 41.0977803,
      "lng": 28.7914561
    },
    {
      "id": "stop_metrokent",
      "name": "Metrokent",
      "mode": "metro",
      "lat": 41.1082043,
      "lng": 28.8016211
    },
    {
      "id": "stop_onurkent",
      "name": "Onurkent",
      "mode": "metro",
      "lat": 41.1135424,
      "lng": 28.7904668
    },
    {
      "id": "stop_sehir_hastanesi",
      "name": "Şehir Hastanesi",
      "mode": "metro",
      "lat": 41.1032857,
      "lng": 28.7775639
    },
    {
      "id": "stop_toplu_konutlar",
      "name": "Toplu Konutlar",
      "mode": "metro",
      "lat": 41.1077392,
      "lng": 28.768059
    },
    {
      "id": "stop_kayasehir_merkez",
      "name": "Kayaşehir Merkez",
      "mode": "metro",
      "lat": 41.1190274,
      "lng": 28.7663849
    },
    {
      "id": "stop_cobancesme",
      "name": "Çobançeşme",
      "mode": "metro",
      "lat": 40.9997593,
      "lng": 28.822727
    },
    {
      "id": "stop_29_ekim_cumhuriyet",
      "name": "29 Ekim Cumhuriyet",
      "mode": "metro",
      "lat": 41.006234,
      "lng": 28.8188131
    },
    {
      "id": "stop_dogu_sanayi",
      "name": "Doğu Sanayi",
      "mode": "metro",
      "lat": 41.0149429,
      "lng": 28.8181549
    },
    {
      "id": "stop_mimar_sinan",
      "name": "Mimar Sinan",
      "mode": "metro",
      "lat": 41.0250791,
      "lng": 28.8167821
    },
    {
      "id": "stop_15_temmuz",
      "name": "15 Temmuz",
      "mode": "metro",
      "lat": 41.0369237,
      "lng": 28.8142134
    },
    {
      "id": "stop_halkali_caddesi",
      "name": "Halkalı Caddesi",
      "mode": "metro",
      "lat": 41.0451704,
      "lng": 28.8066077
    },
    {
      "id": "stop_ataturk_mahallesi",
      "name": "Atatürk Mahallesi",
      "mode": "metro",
      "lat": 41.0521866,
      "lng": 28.7989581
    },
    {
      "id": "stop_bahariye_2",
      "name": "Bahariye",
      "mode": "metro",
      "lat": 41.0585053,
      "lng": 28.7994906
    },
    {
      "id": "stop_masko",
      "name": "MASKO",
      "mode": "metro",
      "lat": 41.0639891,
      "lng": 28.8042749
    },
    {
      "id": "stop_ziya_gokalp",
      "name": "Ziya Gökalp",
      "mode": "metro",
      "lat": 41.0746891,
      "lng": 28.786412
    },
    {
      "id": "stop_olimpiyat",
      "name": "Olimpiyat",
      "mode": "metro",
      "lat": 41.0796429,
      "lng": 28.7670768
    },
    {
      "id": "stop_mescid_i_selam",
      "name": "Mescid-i Selam",
      "mode": "ankaray",
      "lat": 41.1162428,
      "lng": 28.8511412
    },
    {
      "id": "stop_cebeci",
      "name": "Cebeci",
      "mode": "ankaray",
      "lat": 41.1124107,
      "lng": 28.8575196
    },
    {
      "id": "stop_yeni_mahalle_3",
      "name": "Yeni Mahalle",
      "mode": "ankaray",
      "lat": 41.1002839,
      "lng": 28.8628946
    },
    {
      "id": "stop_haci_sukru",
      "name": "Hacı Şükrü",
      "mode": "ankaray",
      "lat": 41.0933385,
      "lng": 28.8638623
    },
    {
      "id": "stop_50_yil_bastabya",
      "name": "50. Yıl-Baştabya",
      "mode": "ankaray",
      "lat": 41.087787,
      "lng": 28.8669014
    },
    {
      "id": "stop_cumhuriyet_mahallesi",
      "name": "Cumhuriyet Mahallesi",
      "mode": "ankaray",
      "lat": 41.0845661,
      "lng": 28.8715664
    },
    {
      "id": "stop_kiptas_venezia",
      "name": "KİPTAŞ Venezia",
      "mode": "ankaray",
      "lat": 41.0812918,
      "lng": 28.8745733
    },
    {
      "id": "stop_karadeniz",
      "name": "Karadeniz",
      "mode": "ankaray",
      "lat": 41.0751817,
      "lng": 28.8824304
    },
    {
      "id": "stop_taskopru",
      "name": "Taşköprü",
      "mode": "ankaray",
      "lat": 41.0725735,
      "lng": 28.8877129
    },
    {
      "id": "stop_ali_fuat_basgil",
      "name": "Ali Fuat Başgil",
      "mode": "ankaray",
      "lat": 41.0684467,
      "lng": 28.8956044
    },
    {
      "id": "stop_bosna_cukurcesme",
      "name": "Bosna-Çukurçeşme",
      "mode": "ankaray",
      "lat": 41.0618015,
      "lng": 28.9020548
    },
    {
      "id": "stop_uluyol_berec",
      "name": "Uluyol-Bereç",
      "mode": "ankaray",
      "lat": 41.0541152,
      "lng": 28.9102178
    },
    {
      "id": "stop_rami",
      "name": "Rami",
      "mode": "ankaray",
      "lat": 41.0465704,
      "lng": 28.9155264
    },
    {
      "id": "stop_topcular",
      "name": "Topçular",
      "mode": "ankaray",
      "lat": 41.0416106,
      "lng": 28.9195261
    },
    {
      "id": "stop_demirkapi",
      "name": "Demirkapı",
      "mode": "ankaray",
      "lat": 41.0369846,
      "lng": 28.9233484
    },
    {
      "id": "stop_sehitlik",
      "name": "Şehitlik",
      "mode": "ankaray",
      "lat": 41.0341412,
      "lng": 28.9282944
    },
    {
      "id": "stop_edirnekapi",
      "name": "Edirnekapı",
      "mode": "ankaray",
      "lat": 41.0313088,
      "lng": 28.9340531
    },
    {
      "id": "stop_vatan",
      "name": "Vatan",
      "mode": "ankaray",
      "lat": 41.0255685,
      "lng": 28.9292392
    },
    {
      "id": "stop_fetihkapi",
      "name": "Fetihkapı",
      "mode": "ankaray",
      "lat": 41.0215177,
      "lng": 28.9249855
    },
    {
      "id": "stop_haciosman",
      "name": "Hacıosman",
      "mode": "metro",
      "lat": 41.1398775,
      "lng": 29.0303462
    },
    {
      "id": "stop_darussafaka",
      "name": "Darüşşafaka",
      "mode": "metro",
      "lat": 41.1292867,
      "lng": 29.0248677
    },
    {
      "id": "stop_ataturk_oto_sanayi",
      "name": "Atatürk Oto Sanayi",
      "mode": "metro",
      "lat": 41.1181945,
      "lng": 29.0239613
    },
    {
      "id": "stop_itu_ayazaga",
      "name": "İTÜ-Ayazağa",
      "mode": "metro",
      "lat": 41.1082049,
      "lng": 29.0209202
    },
    {
      "id": "stop_sanayi",
      "name": "Sanayi",
      "mode": "metro",
      "lat": 41.0942446,
      "lng": 29.0049849
    },
    {
      "id": "stop_4_levent",
      "name": "4. Levent",
      "mode": "metro",
      "lat": 41.086047,
      "lng": 29.0069725
    },
    {
      "id": "stop_levent",
      "name": "Levent",
      "mode": "otobus",
      "lat": 41.0769862,
      "lng": 29.0135732
    },
    {
      "id": "stop_gayrettepe",
      "name": "Gayrettepe",
      "mode": "otobus",
      "lat": 41.0691324,
      "lng": 29.0110477
    },
    {
      "id": "stop_sisli",
      "name": "Şişli",
      "mode": "metro",
      "lat": 41.0646058,
      "lng": 28.9926418
    },
    {
      "id": "stop_osmanbey",
      "name": "Osmanbey",
      "mode": "metro",
      "lat": 41.0527563,
      "lng": 28.9872434
    },
    {
      "id": "stop_taksim",
      "name": "Taksim",
      "mode": "otobus",
      "lat": 41.0367798,
      "lng": 28.9866658
    },
    {
      "id": "stop_sishane",
      "name": "Şişhane",
      "mode": "metro",
      "lat": 41.0284104,
      "lng": 28.9725882
    },
    {
      "id": "stop_halic",
      "name": "Haliç",
      "mode": "metro",
      "lat": 41.0226507,
      "lng": 28.9665946
    },
    {
      "id": "stop_vezneciler",
      "name": "Vezneciler",
      "mode": "metro",
      "lat": 41.0122579,
      "lng": 28.9595144
    },
    {
      "id": "stop_yildiz",
      "name": "Yıldız",
      "mode": "metro",
      "lat": 41.0540063,
      "lng": 29.0098445
    },
    {
      "id": "stop_fulya",
      "name": "Fulya",
      "mode": "metro",
      "lat": 41.0620788,
      "lng": 29.007826
    },
    {
      "id": "stop_mecidiyekoy",
      "name": "Mecidiyeköy",
      "mode": "metro",
      "lat": 41.0653135,
      "lng": 28.9955607
    },
    {
      "id": "stop_caglayan",
      "name": "Çağlayan",
      "mode": "metro",
      "lat": 41.0707989,
      "lng": 28.9806277
    },
    {
      "id": "stop_kagithane",
      "name": "Kağıthane",
      "mode": "otobus",
      "lat": 41.079665,
      "lng": 28.9731572
    },
    {
      "id": "stop_nurtepe",
      "name": "Nurtepe",
      "mode": "metro",
      "lat": 41.0799595,
      "lng": 28.9632821
    },
    {
      "id": "stop_alibeykoy",
      "name": "Alibeyköy",
      "mode": "metro",
      "lat": 41.0791653,
      "lng": 28.9495879
    },
    {
      "id": "stop_circir_mahallesi",
      "name": "Çırçır Mahallesi",
      "mode": "metro",
      "lat": 41.0802839,
      "lng": 28.9361933
    },
    {
      "id": "stop_veysel_karani_aksemsettin",
      "name": "Veysel Karani-Akşemsettin",
      "mode": "metro",
      "lat": 41.0797574,
      "lng": 28.9281764
    },
    {
      "id": "stop_yesilpinar",
      "name": "Yeşilpınar",
      "mode": "metro",
      "lat": 41.0824149,
      "lng": 28.9183405
    },
    {
      "id": "stop_k_zim_karabekir",
      "name": "Kâzım Karabekir",
      "mode": "metro",
      "lat": 41.0854613,
      "lng": 28.9085465
    },
    {
      "id": "stop_yenimahalle",
      "name": "Yenimahalle",
      "mode": "metro",
      "lat": 41.0839716,
      "lng": 28.8928118
    },
    {
      "id": "stop_karadeniz_mahallesi",
      "name": "Karadeniz Mahallesi",
      "mode": "metro",
      "lat": 41.0813391,
      "lng": 28.8749302
    },
    {
      "id": "stop_giyimkent_tekstilkent",
      "name": "Giyimkent-Tekstilkent",
      "mode": "metro",
      "lat": 41.0713794,
      "lng": 28.8667234
    },
    {
      "id": "stop_oruc_reis_yuzyil",
      "name": "Oruç Reis - Yüzyıl",
      "mode": "metro",
      "lat": 41.0628956,
      "lng": 28.8552786
    },
    {
      "id": "stop_goztepe_2",
      "name": "Göztepe",
      "mode": "metro",
      "lat": 41.0570155,
      "lng": 28.8479518
    },
    {
      "id": "stop_alibeykoy_cep_otogari",
      "name": "Alibeyköy Cep Otogarı",
      "mode": "ankaray",
      "lat": 41.0868716,
      "lng": 28.9439324
    },
    {
      "id": "stop_alibeykoy_metro",
      "name": "Alibeyköy Metro",
      "mode": "ankaray",
      "lat": 41.0784279,
      "lng": 28.9494362
    },
    {
      "id": "stop_alibeykoy_merkez",
      "name": "Alibeyköy Merkez",
      "mode": "ankaray",
      "lat": 41.0737108,
      "lng": 28.945958
    },
    {
      "id": "stop_universite",
      "name": "Üniversite",
      "mode": "ankaray",
      "lat": 41.0699016,
      "lng": 28.9428216
    },
    {
      "id": "stop_silahtaraga_mahallesi",
      "name": "Silahtarağa Mahallesi",
      "mode": "ankaray",
      "lat": 41.0648566,
      "lng": 28.9429308
    },
    {
      "id": "stop_eyupsultan_devlet_hastanesi",
      "name": "Eyüpsultan Devlet Hastanesi",
      "mode": "ankaray",
      "lat": 41.056762,
      "lng": 28.9411459
    },
    {
      "id": "stop_eyupsultan_teleferik",
      "name": "Eyüpsultan Teleferik",
      "mode": "ankaray",
      "lat": 41.0505614,
      "lng": 28.9351644
    },
    {
      "id": "stop_feshane",
      "name": "Feshane",
      "mode": "ankaray",
      "lat": 41.0455401,
      "lng": 28.9378997
    },
    {
      "id": "stop_ayvansaray",
      "name": "Ayvansaray",
      "mode": "ankaray",
      "lat": 41.0395444,
      "lng": 28.9439399
    },
    {
      "id": "stop_balat",
      "name": "Balat",
      "mode": "ankaray",
      "lat": 41.0340207,
      "lng": 28.9480391
    },
    {
      "id": "stop_fener",
      "name": "Fener",
      "mode": "ankaray",
      "lat": 41.0286148,
      "lng": 28.9544538
    },
    {
      "id": "stop_cibali",
      "name": "Cibali",
      "mode": "ankaray",
      "lat": 41.0242282,
      "lng": 28.9602875
    },
    {
      "id": "stop_kucukpazar",
      "name": "Küçükpazar",
      "mode": "ankaray",
      "lat": 41.0209233,
      "lng": 28.9632559
    },
    {
      "id": "stop_halkali_stadi",
      "name": "Halkalı Stadı",
      "mode": "metro",
      "lat": 41.056569,
      "lng": 28.7748859
    },
    {
      "id": "stop_olimpiyatkoy",
      "name": "Olimpiyatköy",
      "mode": "metro",
      "lat": 41.0780764,
      "lng": 28.7699116
    },
    {
      "id": "stop_kayasehir",
      "name": "Kayaşehir",
      "mode": "metro",
      "lat": 41.1173262,
      "lng": 28.7658803
    },
    {
      "id": "stop_ibn_haldun_universitesi",
      "name": "İbn Haldun Üniversitesi",
      "mode": "metro",
      "lat": 41.1394663,
      "lng": 28.793969
    },
    {
      "id": "stop_arnavutkoy_hastane",
      "name": "Arnavutköy Hastane",
      "mode": "metro",
      "lat": 41.1791198,
      "lng": 28.74788
    },
    {
      "id": "stop_tasoluk",
      "name": "Taşoluk",
      "mode": "metro",
      "lat": 41.2070981,
      "lng": 28.7160865
    },
    {
      "id": "stop_kargo_terminali",
      "name": "Kargo Terminali",
      "mode": "metro",
      "lat": 41.2553423,
      "lng": 28.712731
    },
    {
      "id": "stop_istanbul_havalimani",
      "name": "İstanbul Havalimanı",
      "mode": "metro",
      "lat": 41.2558497,
      "lng": 28.7426107
    },
    {
      "id": "stop_ihsaniye",
      "name": "İhsaniye",
      "mode": "metro",
      "lat": 41.2428514,
      "lng": 28.8088272
    },
    {
      "id": "stop_gokturk",
      "name": "Göktürk",
      "mode": "metro",
      "lat": 41.1768557,
      "lng": 28.8836397
    },
    {
      "id": "stop_kemerburgaz",
      "name": "Kemerburgaz",
      "mode": "metro",
      "lat": 41.1590973,
      "lng": 28.9101084
    },
    {
      "id": "stop_hasdal",
      "name": "Hasdal",
      "mode": "metro",
      "lat": 41.1212278,
      "lng": 28.9467385
    },
    {
      "id": "stop_seyrantepe",
      "name": "Seyrantepe",
      "mode": "otobus",
      "lat": 41.1012886,
      "lng": 28.9957442
    },
    {
      "id": "mb_beylikduzu",
      "name": "Beylikdüzü Son Durak",
      "mode": "otobus",
      "lat": 41.0022,
      "lng": 28.6398
    },
    {
      "id": "mb_beykent",
      "name": "Beykent",
      "mode": "otobus",
      "lat": 40.9905,
      "lng": 28.661
    },
    {
      "id": "mb_haramidere",
      "name": "Haramidere",
      "mode": "otobus",
      "lat": 41.005871,
      "lng": 28.676849
    },
    {
      "id": "mb_haramidere_sanayi",
      "name": "Haramidere Sanayi",
      "mode": "otobus",
      "lat": 41.004437,
      "lng": 28.684929
    },
    {
      "id": "mb_sukrubey",
      "name": "Şükrübey",
      "mode": "otobus",
      "lat": 40.9934,
      "lng": 28.7442
    },
    {
      "id": "mb_cennet",
      "name": "Cennet",
      "mode": "otobus",
      "lat": 40.9989,
      "lng": 28.7668
    },
    {
      "id": "mb_avcilar",
      "name": "Avcılar Merkez-Üniversite Kampüsü",
      "mode": "otobus",
      "lat": 40.9878,
      "lng": 28.7215
    },
    {
      "id": "mb_kucukcekmece",
      "name": "Küçükçekmece",
      "mode": "otobus",
      "lat": 41.0045,
      "lng": 28.7895
    },
    {
      "id": "mb_sefakoy",
      "name": "Sefaköy",
      "mode": "otobus",
      "lat": 41.0018,
      "lng": 28.8025
    },
    {
      "id": "mb_yenibosna",
      "name": "Yenibosna",
      "mode": "otobus",
      "lat": 40.9968,
      "lng": 28.8375
    },
    {
      "id": "mb_sirinevler",
      "name": "Şirinevler",
      "mode": "otobus",
      "lat": 41.0022,
      "lng": 28.8435
    },
    {
      "id": "mb_bahcelievler",
      "name": "Bahçelievler",
      "mode": "otobus",
      "lat": 41.0024,
      "lng": 28.8596
    },
    {
      "id": "mb_incirli",
      "name": "İncirli",
      "mode": "otobus",
      "lat": 41.0065,
      "lng": 28.8725
    },
    {
      "id": "mb_zeytinburnu",
      "name": "Zeytinburnu",
      "mode": "otobus",
      "lat": 41.0088,
      "lng": 28.8995
    },
    {
      "id": "mb_merter",
      "name": "Merter",
      "mode": "otobus",
      "lat": 41.0122,
      "lng": 28.8888
    },
    {
      "id": "mb_cevizlibag",
      "name": "Cevizlibağ",
      "mode": "otobus",
      "lat": 41.0168,
      "lng": 28.9105
    },
    {
      "id": "mb_topkapi",
      "name": "Topkapı",
      "mode": "otobus",
      "lat": 41.0215,
      "lng": 28.9188
    },
    {
      "id": "mb_edirnekapi",
      "name": "Edirnekapı",
      "mode": "otobus",
      "lat": 41.0345,
      "lng": 28.9395
    },
    {
      "id": "mb_halicioglu",
      "name": "Halıcıoğlu",
      "mode": "otobus",
      "lat": 41.0502,
      "lng": 28.9448
    },
    {
      "id": "mb_okmeydani",
      "name": "Okmeydanı",
      "mode": "otobus",
      "lat": 41.0585,
      "lng": 28.968
    },
    {
      "id": "mb_caglayan",
      "name": "Çağlayan",
      "mode": "otobus",
      "lat": 41.0702,
      "lng": 28.9825
    },
    {
      "id": "mb_mecidiyekoy",
      "name": "Mecidiyeköy",
      "mode": "otobus",
      "lat": 41.0665,
      "lng": 28.9948
    },
    {
      "id": "mb_zincirlikuyu",
      "name": "Zincirlikuyu",
      "mode": "otobus",
      "lat": 41.0672,
      "lng": 29.0138
    },
    {
      "id": "mb_15_temmuz",
      "name": "15 Temmuz Şehitler Köprüsü",
      "mode": "otobus",
      "lat": 41.0452,
      "lng": 29.0334
    },
    {
      "id": "mb_burhaniye",
      "name": "Burhaniye",
      "mode": "otobus",
      "lat": 41.0274,
      "lng": 29.0472
    },
    {
      "id": "mb_altunizade",
      "name": "Altunizade",
      "mode": "otobus",
      "lat": 41.0219,
      "lng": 29.0462
    },
    {
      "id": "mb_acibadem",
      "name": "Acıbadem",
      "mode": "otobus",
      "lat": 41.0022,
      "lng": 29.0406
    },
    {
      "id": "mb_uzuncayir",
      "name": "Uzunçayır",
      "mode": "otobus",
      "lat": 40.9989,
      "lng": 29.0498
    },
    {
      "id": "mb_fikirtepe",
      "name": "Fikirtepe",
      "mode": "otobus",
      "lat": 40.9932,
      "lng": 29.0552
    },
    {
      "id": "mb_sogutlucesme",
      "name": "Söğütlüçeşme",
      "mode": "otobus",
      "lat": 40.99172,
      "lng": 29.03781
    },
    {
      "id": "bus_142_adnan_kahveci",
      "name": "Adnan Kahveci",
      "mode": "otobus",
      "lat": 41.014,
      "lng": 28.648
    },
    {
      "id": "bus_142_esenyurt",
      "name": "Esenyurt Merkez",
      "mode": "otobus",
      "lat": 41.0345,
      "lng": 28.6785
    },
    {
      "id": "bus_142_esenkent",
      "name": "Esenkent",
      "mode": "otobus",
      "lat": 41.0556,
      "lng": 28.6723
    },
    {
      "id": "stop_etiler",
      "name": "Etiler",
      "mode": "otobus",
      "lat": 41.0807,
      "lng": 29.0338
    },
    {
      "id": "bus_142_kirac",
      "name": "Kıraç",
      "mode": "otobus",
      "lat": 41.055,
      "lng": 28.65
    },
    {
      "id": "bus_142_akcaburgaz",
      "name": "Akçaburgaz",
      "mode": "otobus",
      "lat": 41.0733,
      "lng": 28.6334
    },
    {
      "id": "bus_akcaburgaz_eti",
      "name": "Akçaburgaz Sanayi",
      "mode": "otobus",
      "lat": 41.0786,
      "lng": 28.6362
    },
    {
      "id": "bus_144_haramidere_kuzey",
      "name": "Haramidere Kuzey",
      "mode": "otobus",
      "lat": 41.02,
      "lng": 28.69
    }
  ],
  "transitLines": [
    {
      "id": "T1",
      "name": "T1: Kabataş → Bağcılar",
      "mode": "ankaray",
      "verified": true,
      "source": "OpenStreetMap/Overpass omurga şablonu (ikmapsistanbulanadolu, 2026-09-07) — Avrupa yakası",
      "hatNo": "T1",
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
      ]
    },
    {
      "id": "M1A",
      "name": "M1A: Yenikapı → Atatürk Havalimanı",
      "mode": "metro",
      "verified": true,
      "source": "OpenStreetMap/Overpass omurga şablonu (ikmapsistanbulanadolu, 2026-09-07) — Avrupa yakası",
      "hatNo": "M1A",
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
      ]
    },
    {
      "id": "M1B",
      "name": "M1B: Yenikapı → Kirazlı",
      "mode": "metro",
      "verified": true,
      "source": "OpenStreetMap/Overpass omurga şablonu (ikmapsistanbulanadolu, 2026-09-07) — Avrupa yakası",
      "hatNo": "M1B",
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
      ]
    },
    {
      "id": "B1",
      "name": "Marmaray: Sirkeci → Halkalı",
      "mode": "tren",
      "verified": true,
      "source": "OpenStreetMap/Overpass omurga şablonu (ikmapsistanbulanadolu, 2026-09-07) — Avrupa yakası",
      "hatNo": "B1",
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
      ]
    },
    {
      "id": "M3",
      "name": "M3: Bakırköy Sahil → Kayaşehir Merkez",
      "mode": "metro",
      "verified": true,
      "source": "OpenStreetMap/Overpass omurga şablonu (ikmapsistanbulanadolu, 2026-09-07) — Avrupa yakası",
      "hatNo": "M3",
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
      ]
    },
    {
      "id": "M9",
      "name": "M9: Ataköy → Olimpiyat",
      "mode": "metro",
      "verified": true,
      "source": "OpenStreetMap/Overpass omurga şablonu (ikmapsistanbulanadolu, 2026-09-07) — Avrupa yakası",
      "hatNo": "M9",
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
      ]
    },
    {
      "id": "T4",
      "name": "T4: Mescid-i Selam → Topkapı",
      "mode": "ankaray",
      "verified": true,
      "source": "OpenStreetMap/Overpass omurga şablonu (ikmapsistanbulanadolu, 2026-09-07) — Avrupa yakası",
      "hatNo": "T4",
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
      ]
    },
    {
      "id": "M2",
      "name": "M2: Hacıosman → Yenikapı",
      "mode": "metro",
      "verified": true,
      "source": "OpenStreetMap/Overpass omurga şablonu (ikmapsistanbulanadolu, 2026-09-07) — Avrupa yakası",
      "hatNo": "M2",
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
      ]
    },
    {
      "id": "M7",
      "name": "M7: Yıldız → Mahmutbey",
      "mode": "metro",
      "verified": true,
      "source": "OpenStreetMap/Overpass omurga şablonu (ikmapsistanbulanadolu, 2026-09-07) — Avrupa yakası",
      "hatNo": "M7",
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
      ]
    },
    {
      "id": "T5",
      "name": "T5: Alibeyköy Cep Otogarı → Eminönü",
      "mode": "ankaray",
      "verified": true,
      "source": "OpenStreetMap/Overpass omurga şablonu (ikmapsistanbulanadolu, 2026-09-07) — Avrupa yakası",
      "hatNo": "T5",
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
      ]
    },
    {
      "id": "M11",
      "name": "M11: Halkalı → Gayrettepe",
      "mode": "metro",
      "verified": true,
      "source": "OpenStreetMap/Overpass omurga şablonu (ikmapsistanbulanadolu, 2026-09-07) — Avrupa yakası",
      "hatNo": "M11",
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
      ]
    },
    {
      "id": "M2_SEYRANTEPE",
      "name": "M2 Seyrantepe kolu: Sanayi → Seyrantepe",
      "mode": "metro",
      "verified": true,
      "source": "M2 ana hattından ayrılan kol — Yenikapı ile sahte kenar kurulmasın diye ayrı modül",
      "hatNo": "M2",
      "stopIds": [
        "stop_sanayi",
        "stop_seyrantepe"
      ]
    },
    {
      "id": "METROBUS",
      "name": "Metrobüs: Beylikdüzü → Söğütlüçeşme",
      "mode": "otobus",
      "verified": true,
      "source": "İETT metrobüs omurgası Beylikdüzü–Söğütlüçeşme. Doğu uzantısı aktarma düğümüdür.",
      "hatNo": "34",
      "stopIds": [
        "mb_beylikduzu",
        "mb_beykent",
        "mb_haramidere",
        "mb_haramidere_sanayi",
        "mb_avcilar",
        "mb_sukrubey",
        "mb_cennet",
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
        "mb_zincirlikuyu",
        "mb_15_temmuz",
        "mb_burhaniye",
        "mb_altunizade",
        "mb_acibadem",
        "mb_uzuncayir",
        "mb_fikirtepe",
        "mb_sogutlucesme"
      ]
    },
    {
      "id": "IETT_142",
      "name": "142: Beylikdüzü → Akçaburgaz",
      "mode": "otobus",
      "verified": true,
      "source": "Esenyurt / Akçaburgaz beslemesi — metrobüs Beylikdüzü düğümüne bağlı",
      "hatNo": "142",
      "stopIds": [
        "mb_beylikduzu",
        "bus_142_adnan_kahveci",
        "mb_haramidere_sanayi",
        "bus_142_esenyurt",
        "bus_142_esenkent",
        "bus_142_kirac",
        "bus_142_akcaburgaz",
        "bus_akcaburgaz_eti"
      ]
    },
    {
      "id": "IETT_142ES",
      "name": "142ES: Beylikdüzü → Akçaburgaz",
      "mode": "otobus",
      "verified": true,
      "source": "142 ekspres beslemesi — Esenkent kapısından geçer, Kıraç'ı atlar",
      "hatNo": "142ES",
      "stopIds": [
        "mb_beylikduzu",
        "mb_haramidere_sanayi",
        "bus_142_esenyurt",
        "bus_142_esenkent",
        "bus_142_akcaburgaz",
        "bus_akcaburgaz_eti"
      ]
    },
    {
      "id": "IETT_144",
      "name": "144: Haramidere → Akçaburgaz",
      "mode": "otobus",
      "verified": true,
      "source": "Haramidere metrobüs düğümünden Akçaburgaz sanayiye besleme",
      "hatNo": "144",
      "stopIds": [
        "mb_haramidere",
        "mb_haramidere_sanayi",
        "bus_144_haramidere_kuzey",
        "bus_142_esenyurt",
        "bus_142_akcaburgaz",
        "bus_akcaburgaz_eti"
      ]
    },
    {
      "id": "IETT_43R",
      "name": "43R: Zincirlikuyu → Etiler → Levent",
      "mode": "otobus",
      "verified": true,
      "source": "Etiler kapı beslemesi. Nispetiye otobüsü Levent metrosu ve Zincirlikuyu metrobüsüne bağlanır.",
      "hatNo": "43R",
      "stopIds": [
        "mb_zincirlikuyu",
        "stop_etiler",
        "stop_levent"
      ]
    }
  ],
  "hubStopIds": [
    "bus_142_akcaburgaz",
    "bus_142_esenyurt",
    "bus_akcaburgaz_eti",
    "mb_beylikduzu",
    "mb_haramidere",
    "mb_haramidere_sanayi",
    "bus_142_esenkent",
    "stop_etiler",
    "stop_aksaray",
    "stop_atakoy",
    "stop_bayrampasa_maltepe",
    "stop_eminonu",
    "stop_emniyet_fatih",
    "stop_gayrettepe",
    "stop_halkali",
    "stop_ikitelli_sanayi",
    "stop_kagithane",
    "stop_kirazli",
    "stop_kocatepe",
    "stop_mahmutbey",
    "stop_otogar",
    "stop_sagmalcilar",
    "stop_sanayi",
    "stop_sirkeci",
    "stop_topkapi",
    "stop_topkapi_ulubatli",
    "stop_yenibosna",
    "stop_yenikapi",
    "stop_zeytinburnu"
  ]
};
