# İstanbul Avrupa Yakası Güvenlik Projeleri

Ankara `ikmapsv2` harita ve eşleştirme iskeletinin Avrupa yakası güvenlik sürümü. Proje portföyü `PROJE_KONUM` tablosundaki 7 kayıttır.

## Çalıştırma

```bash
npm start
```

Uygulama `http://127.0.0.1:8820` adresinde açılır. Ankara projesi 8812 portunda kaldığı için bu iskelet 8820 kullanır. Python vekili için `npm run start:py`. Rota duman testi: `npm test`.

Harita Leaflet ile **41.03, 28.85** merkezinde ve **zoom 10** ile tüm Avrupa yakasını kapsayacak kadrajda açılır. Karolar OpenStreetMap’tendir.

## Yerleşim

Sol panelde başlık, aksiyon butonları, sekmeler, sonuç kartları ve TEPE Kurumsal logosu durur. İlçe/mahalle, adres arama, süre ve pozisyon filtreleri haritanın üstündeki yatay çubuktadır.

## Rota motoru

`routing_engine` Ankara graf mantığını korur:

- Hat-durumlu Dijkstra (aynı hatta sahte aktarma yok)
- Hedef durağa kilitlenme: 150 m kapı bandı
- Yürüme seçimde 1.5× cezalı, gösterilen süre gerçek yürüyüş
- Canlı sefer yoksa bekleme = sefer aralığı / 2

Omurga hatları: M1A, M1B, M2, M3, M7, M9, M11, T1, T4, T5, Marmaray (Sirkeci–Halkalı), İETT metrobüs (Beylikdüzü–Zincirlikuyu). Tam İETT otobüs ağı bu iskelette yoktur.

## Güvenlik proje şeması

`SECURITY_PROJECT_FIELDS` / `createSecurityProject`: pozisyon, silahlı/silahsız, danışma/gözetim, vardiya `8/16`, `12/36` veya `2+2+2`, yol, yemek, servis, maaş, yaş sınırı, lojman. Tablodaki 7 projenin koordinatı konum linklerinden alınır. Kayıt düzenlemeleri tarayıcıda saklanır.
