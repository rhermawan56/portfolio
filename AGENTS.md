# Aturan proyek Ruang Karya

## Baca sebelum mengubah

1. Baca [DESIGN.md](DESIGN.md). Baseline `RK-CORE-01` mencatat core dan desain implementasi yang diterima pemilik pada 7 November 2026.
2. Baca [README.md](README.md) untuk cara menjalankan, mengisi profil, dan deployment.
3. Batasi perubahan pada permintaan pengguna. Pertahankan core, desain, dan perilaku di luar cakupannya.

## Kontrak pemeliharaan

- Permintaan mengisi profil, menambah proyek, memperbaiki bug, atau meningkatkan performa **bukan izin untuk mendesain ulang**.
- Isi profil melalui `src/content.ts`. Pertahankan komponen, palet, tipografi, proporsi, dan susunan halaman yang sudah ada.
- Pertahankan perjalanan sembilan tahap, klik pembuka pintu, scroll setelah pintu terbuka, meja di kanan pintu, kamera orang pertama, dan transisi laptop ke HTML.
- Jangan mengganti kamera perspektif dengan gambar latar, video, atau proyeksi isometrik.
- Pertahankan skip, replay, keyboard, touch, anchor langsung, mode cetak, reduced motion, serta fallback WebGL.
- Pertahankan frontend statis dan dukungan GitHub Pages di domain utama maupun subfolder repository. Jangan menambah kebutuhan backend atau rahasia runtime tanpa permintaan terkait.
- Lakukan perubahan pada lapisan paling sempit yang bertanggung jawab. Hindari refactor, upgrade dependency, pemformatan massal, atau penggantian aset yang tidak diperlukan.
- Jangan memperbarui baseline hanya untuk menyamarkan perbedaan yang tidak diminta.

## Perubahan desain yang memang diminta

Permintaan langsung pengguna yang mengubah bagian desain merupakan otorisasi untuk bagian tersebut. Tidak perlu meminta persetujuan ulang untuk perubahan yang sudah jelas diminta. Tetap pertahankan bagian lain. Jika permintaan ambigu antara perubahan konten dan desain, kerjakan bagian yang jelas dan klarifikasi hanya perbedaan yang berdampak pada hasil.

Setelah perubahan desain yang diminta selesai dan diverifikasi, perbarui bagian relevan di `DESIGN.md`, nomor revisi, dan catatan perubahannya. Simpan catatan baseline sebelumnya; jangan menyebut hasil yang belum diperiksa sebagai baseline yang disetujui pengguna.

## Penggunaan skill

- `awesome-design-md`: gunakan referensi **Linear yang sudah dipilih**. Nilai aktual di proyek dan `DESIGN.md` menjadi acuan; jangan menyalin ulang seluruh referensi atau memilih gaya baru tanpa permintaan desain.
- `anatomy`: pertahankan detail benda fisik, ketebalan, sambungan, material, dan gerak yang masuk akal. Proyek memakai Three.js untuk perspektif dan depth; jangan memaksakan kit SVG/isometrik atau kuota detail baru ke core yang telah diterima.
- `caveman`: gunakan komunikasi singkat ketika diminta. Dokumentasi dan kode tetap lengkap serta mudah dibaca.

## Verifikasi sesuai perubahan

- Dokumentasi saja: periksa fakta dan tautan lokal; pastikan source aplikasi tidak berubah. Tidak perlu menjalankan ulang build/browser.
- Konten atau kode: jalankan `npm run build`. Untuk perubahan perilaku, jalankan skenario terkait di `tests/experience.spec.ts`; seluruh `npm test` bila perubahan menyentuh alur utama.
- Perubahan visual atau konten yang memengaruhi ukuran: periksa desktop 1440 × 900 dan ponsel 390 × 844. Pastikan tidak ada clipping, overflow horizontal, atau pergeseran desain di luar cakupan.
- Perubahan scene/timeline: periksa pintu tertutup dan terbuka, masuk, mendekati meja, duduk, membuka laptop, zoom, transisi ke HTML, scroll balik, dan replay.
- Perubahan build/path: pertahankan uji build produksi pada subfolder GitHub Pages.
- Tes saat ini menguji fungsi; belum ada perbandingan screenshot otomatis. Jangan menyebut tes fungsi sebagai bukti kesamaan piksel.

Markdown ini mengarahkan pekerjaan berikutnya, bukan mengunci file secara teknis. Jangan mengubah permission file, menambah hook, atau membuat gate baru tanpa kebutuhan yang diminta.
