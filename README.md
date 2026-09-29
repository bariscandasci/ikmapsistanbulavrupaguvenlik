# İstanbul Avrupa Yakası Güvenlik Projeleri

Ankara `ikmapsv2` harita ve eşleştirme iskeletinin Avrupa yakası güvenlik sürümü. Proje portföyü `PROJE_KONUM` tablosundaki 7 kayıttır.

## Çalıştırma

```bash
npm start
```

Uygulama `http://127.0.0.1:8820` adresinde açılır. Ankara projesi 8812 portunda kaldığı için bu iskelet 8820 kullanır. Python vekili için `npm run start:py`. Rota duman testi: `npm test`.

Harita Leaflet ile **41.04, 28.82** merkezinde ve **zoom 10.4** ile açılır. Karolar OpenStreetMap’tendir. Arayüz, filtreler ve rota çizimi Ankara `ikmapsv2` kodunun kendisidir.

## Yerleşim

Sol panelde başlık, aksiyon butonları, sekmeler, sonuç kartları ve TEPE Kurumsal logosu durur. İlçe/mahalle, adres arama, süre ve pozisyon filtreleri haritanın üstündeki yatay çubuktadır.

## Veri

Projeler `data.js` içinde 7 İstanbul güvenlik kaydıdır. Durak ve hatlar `transit_network.json` dosyasındadır: M1A, M1B, M2, M3, M7, M9, M11, T1, T4, T5, Marmaray, Metrobüs (Beylikdüzü–Söğütlüçeşme) ve 142 / 142ES / 144. Çizgi, Ankara’daki `rideShapeLatLngs` ile biniş ve iniş arasındaki istasyonları sırayla bağlar.
