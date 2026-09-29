# İstanbul Avrupa Yakası Güvenlik Projeleri

Ankara `ikmapsv2` harita ve eşleştirme iskeletinin Avrupa yakası güvenlik sürümü. Proje portföyü henüz boştur; ilçe listesi, omurga hatları ve güvenlik kart şeması hazırdır.

## Çalıştırma

```bash
npm start
```

Uygulama `http://127.0.0.1:8812` adresinde açılır. Python vekili için `npm run start:py`. Rota duman testi: `npm test`.

Harita Leaflet ile **41.05, 28.90** merkezinde ve **zoom 11** ile açılır. Karolar OpenStreetMap’tendir.

## Sol panel

25 Avrupa yakası ilçesi ve mahalle açılır listeleri aday çıkış noktasıdır. Süre ve pozisyon filtreleri (Silahlı Güvenlik, Silahsız Güvenlik, Danışma, Gözetim) sonuç listesini daraltır.

## Rota motoru

`routing_engine` Ankara graf mantığını korur:

- Hat-durumlu Dijkstra (aynı hatta sahte aktarma yok)
- Hedef durağa kilitlenme: 150 m kapı bandı
- Yürüme seçimde 1.5× cezalı, gösterilen süre gerçek yürüyüş
- Canlı sefer yoksa bekleme = sefer aralığı / 2

Omurga hatları: M1A, M1B, M2, M3, M7, M9, M11, T1, T4, T5, Marmaray (Sirkeci–Halkalı), İETT metrobüs (Beylikdüzü–Zincirlikuyu). Tam İETT otobüs ağı bu iskelette yoktur.

## Güvenlik proje şeması

`SECURITY_PROJECT_FIELDS` / `createSecurityProject`: pozisyon, silahlı/silahsız, danışma/gözetim, vardiya `8/16` veya `12/36`, yol, yemek, servis imkanı. Kayıtlar tarayıcıda saklanır.
