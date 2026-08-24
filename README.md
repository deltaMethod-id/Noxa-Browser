# Noxa Browser — versi terpisah

Struktur:
- `index.html` — halaman utama (pencarian)
- `result.html` — halaman hasil pencarian
- `tab.html` — halaman tab (tab baru & ganti tab)
- `style.css` — semua tampilan (sama persis dengan versi sebelumnya)
- `js/common.js` — util bersama (URL, escape, penyimpanan tab)
- `js/home.js`, `js/result.js`, `js/tab.js` — logika tiap halaman
- `api/search.js` — backend Exa search (butuh env `EXA_API_KEY`)

Fitur tab: tab strip, tombol `+` untuk tab baru, klik tab untuk ganti, `×` untuk tutup,
tab tersimpan di localStorage, dan tombol "Tab" di halaman utama & hasil pencarian.
