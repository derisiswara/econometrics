# Belajar Ekonometrika · Learning Econometrics

Repositori **buku teks interaktif** ekonometrika untuk belajar dan mengajar, **dwibahasa** (Bahasa Indonesia dan English). Buku ini merupakan bacaan mandiri dengan ilustrasi yang dapat dicoba langsung di peramban, termasuk di ponsel. Setiap bab dipecah menjadi beberapa halaman pendek.

Situs dibangun dengan [Quarto](https://quarto.org). Versi yang telah diuji: Quarto 1.6.42.

## Struktur

```
.
├── _quarto.yml                konfigurasi situs: menu bahasa, sidebar per bahasa, tema, daftar pustaka
├── index.qmd                  halaman pilih bahasa
├── referensi.bib              daftar pustaka bersama (BibTeX)
├── docs/                      hasil render (situs statis siap terbit)
├── id/                        Bahasa Indonesia (lang: id di _metadata.yml)
│   ├── index.qmd              beranda dan daftar materi
│   └── book/
│       ├── index.qmd          pengantar buku, notasi, dan padanan istilah
│       ├── _template-bab.qmd  templat halaman baru (tidak ikut dirender)
│       └── ch01/              Bab 1: index.qmd (tujuan dan peta bab) + 6 halaman pendek
├── en/                        English (lang: en), nama berkas sama persis dengan id/
├── assets/
│   ├── rv.js                  pustaka ilustrasi: menggambar, bahasa (RV.t, RV.fmt), versi cetak (RV.print)
│   ├── widgets/ch01.js        semua ilustrasi Bab 1, dipakai bersama oleh halaman id/ dan en/
│   ├── widget.css             gaya ilustrasi untuk tema terang, gelap, dan cetak
│   ├── lang-switch.html       tombol bahasa yang membuka halaman padanan
│   └── vendor/qrcode.js       pembuat kode QR (MIT, Kazuhiko Arase) untuk versi cetak
└── .github/workflows/
    └── publish.yml            render dan terbit otomatis ke GitHub Pages (opsional)
```

## Menjalankan di komputer sendiri

1. Pasang Quarto dari <https://quarto.org/docs/get-started/>. Di VS Code, pasang juga ekstensi **Quarto**.
2. Dari folder repositori, jalankan:

   ```bash
   quarto preview      # pratinjau langsung; halaman diperbarui otomatis saat berkas disimpan
   quarto render       # membangun situs lengkap ke folder docs/
   ```

## Menerbitkan

Hasil `quarto render` di folder `docs/` adalah situs statis biasa (HTML, CSS, JS), sehingga dapat diletakkan di layanan hosting statis mana pun.

- **GitHub Pages (otomatis)**: unggah repositori ke GitHub, lalu buka *Settings → Pages → Build and deployment* dan pilih *Source: GitHub Actions*. Setiap *push* ke cabang `main` akan merender dan menerbitkan situs melalui `.github/workflows/publish.yml`. Versi action di berkas tersebut sebaiknya dicek ulang terhadap dokumentasi terbaru.
- **GitHub Pages (dari folder `docs/`)**: render di komputer sendiri, *commit* folder `docs/`, lalu pada *Settings → Pages* pilih *Source: Deploy from a branch*, cabang `main`, folder `/docs`. Dengan cara ini workflow `.github/workflows/publish.yml` tidak diperlukan.
- **Hosting lain** (server sendiri, Netlify, subfolder situs pribadi): salin isi `docs/` ke lokasi tujuan. Semua tautan bersifat relatif.

Jika tidak memakai GitHub Pages, folder `.github/` dapat dihapus.

## Cara kerja dwibahasa

- Folder `id/` dan `en/` memiliki **struktur dan nama berkas yang sama**. Tombol "Bahasa Indonesia" / "English" di menu atas (`assets/lang-switch.html`) membuka halaman padanan dengan mengganti `/id/` menjadi `/en/` pada alamat, dan sebaliknya.
- Bahasa halaman diatur oleh `_metadata.yml` di masing-masing folder. Quarto memakainya untuk label antarmuka ("Di halaman ini" / "On this page"), dan `rv.js` memakainya untuk teks ilustrasi serta format angka (0,957 / 0.957).
- Kerangka HTML ilustrasi (judul, label tombol) ditulis di setiap halaman dalam bahasanya. Skrip ilustrasi ditulis **sekali** di `assets/widgets/chNN.js` dengan teks `RV.t("Indonesia", "English")`, sehingga perubahan logika atau data otomatis berlaku untuk kedua bahasa.
- Pencarian situs mencakup kedua bahasa sekaligus.

## Menambah bab atau halaman

1. Buat folder `id/book/chNN/` dan `en/book/chNN/` dengan nama berkas yang sama, misalnya `index.qmd`, `1-topik.qmd`, `2-topik.qmd`. Gunakan `id/book/_template-bab.qmd` sebagai titik awal.
2. Daftarkan halaman-halaman tersebut di kedua sidebar (`id` dan `en`) pada `_quarto.yml`.
3. Perbarui tabel daftar materi di `id/index.qmd` dan `en/index.qmd`, serta daftar bab di `id/book/index.qmd` dan `en/book/index.qmd`.
4. Tambahkan rujukan baru ke `referensi.bib`, lalu kutip di teks dengan `@kunci` atau `[@kunci]`.

Usahakan setiap halaman memuat satu gagasan dan satu sampai tiga ilustrasi agar tidak terlalu panjang digulir.

## Menulis ilustrasi interaktif

Setiap ilustrasi terdiri dari:

1. **Kerangka HTML** di halaman `.qmd`: `<div class="rv" id="rv-nama">` berisi judul, kontrol, satu atau lebih `<svg viewBox="...">`, dan `<p class="rv-out">` untuk teks penjelasan. `id` harus sama di versi `id/` dan `en/`.
2. **Skrip** di `assets/widgets/chNN.js`, dengan pola: fungsi gambar `paint(svg, keadaan)`, lalu interaksi layar, lalu `RV.print(root, panel, opsi)` untuk versi cetak. Lihat komentar di awal `assets/rv.js` untuk daftar fungsi.
3. **Versi cetak**: pilih bentuk statis sesuai jenis interaksi (panel berjajar untuk *slider*, papan cerita untuk langkah, jejak tumpuk untuk simulasi, anotasi untuk klik, soal untuk tantangan), lalu tulis satu *pesan inti* di `opsi.note`.

Ketentuan:

- Di awal setiap halaman berilustrasi, muat `assets/vendor/qrcode.js`, `assets/rv.js`, dan `assets/widgets/chNN.js` dengan jalur relatif (contoh di `id/book/ch01/1-regression.qmd`).
- Jangan sisakan baris kosong di dalam kerangka `<div class="rv">`, karena baris kosong mengakhiri blok HTML di Markdown.
- Gunakan kelas warna yang tersedia (`rv-pt`, `rv-line`, `rv-res`, `rv-dot`, dan seterusnya) agar ilustrasi menyesuaikan tema terang, gelap, dan cetak.

## Catatan sumber

Isi bab merupakan parafrase dan penyederhanaan dari buku teks ekonometrika standar yang tercantum di `referensi.bib`. Data dalam contoh dan ilustrasi bersifat hipotetis. Edisi dan tahun terbit pada daftar pustaka perlu diverifikasi sebelum materi dipublikasikan. Terjemahan bahasa Inggris perlu ditinjau oleh penulis materi.
