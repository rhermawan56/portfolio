# Ruang Karya

Portofolio statis dengan perjalanan orang pertama: klik pintu, scroll masuk ruangan, mendekati meja kanan, duduk, membuka laptop, lalu masuk ke halaman portofolio.

## Baseline desain

Core dan desain saat ini dicatat sebagai **RK-CORE-01** di [DESIGN.md](DESIGN.md). Aturan untuk pekerjaan berikutnya ada di [AGENTS.md](AGENTS.md). Perubahan profil melalui `src/content.ts` tetap diperbolehkan; pertahankan desain dan perilaku di luar bagian yang secara eksplisit diminta untuk diubah. Dokumentasi ini merupakan pedoman pemeliharaan, bukan penguncian teknis file.

## Jalankan

Gunakan Node.js 22.12+ (Node 22 LTS direkomendasikan).

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview
```

Build ada di `dist/`. Jalankan lewat HTTP, bukan membuka `index.html` dengan `file://`.

## Sesuaikan profil

Edit `src/content.ts`: nama, inisial, peran, deskripsi, kelompok keahlian, pengalaman, pendidikan, email, GitHub, LinkedIn, proyek, dan tautan proyek. Profil Rizky Hermawan dan tiga proyek saat ini bersumber dari CV yang diberikan pemilik, bertanggal 29 Juli 2026. Ilustrasi kartu merupakan skema konsep, bukan screenshot aplikasi. URL proyek yang belum diberikan tetap kosong; tidak ada tautan demo atau hasil kuantitatif yang dibuat-buat.

Halaman ditujukan untuk HR: identitas dan ringkasan diikuti pengalaman profesional, proyek, keahlian/pendidikan, dan kontak. CTA utama **Lihat Pengalaman** menuju `#pengalaman`; anchor ini juga dapat dibuka langsung. Ruby, Ruby on Rails, dan TypeScript merupakan informasi tambahan langsung dari pemilik, tanpa asumsi durasi/tingkat penguasaan atau penggunaan pada proyek terdahulu. Penambahan keahlian di website tidak mengubah PDF asli.

Teks profil menggunakan sudut pandang pertama. Ringkasan memperkenalkan fokus pekerjaan; bagian tentang melengkapi pengalaman frontend dan infrastruktur. Deskripsi proyek menyebut pekerjaan secara langsung, dengan teknologi lengkap tetap pada stack. Pertahankan fakta yang tersedia dan hindari pembuka berulang, janji hasil, atau klaim kesiapan bekerja yang belum diberikan pemilik.

Tombol **Unduh CV** mengunduh PDF asli `public/cv/Rizky_Hermawan_CV_2026_07_29.pdf`, bukan mencetak halaman. File disalin tanpa modifikasi; SHA-256 sumber dan salinan: `8cf95e4b3afa3f9759b2c51539326b1768279157740a97c8fe76da5aa8130f3e`. Konfigurasi nama file dan URL ada di `src/cv.ts`; URL memakai `import.meta.env.BASE_URL` sehingga bekerja di root dan subfolder GitHub Pages. Bila memperbarui CV, salin PDF baru ke `public/cv/`, sesuaikan `src/cv.ts`, konten profil, dan hash yang diharapkan pada tes. CSS cetak tetap tersedia untuk perintah cetak manual browser.

Pratinjau layar laptop dibuat melalui Canvas di `src/textures.ts` dan mengambil profil dari file yang sama. Tampilan utama memakai HTML yang dapat diseleksi, dicari, dicetak, dan diakses keyboard.

## GitHub Pages

1. Buat repository GitHub, lalu push isi folder ini ke branch `main` atau `master`.
2. Buka repository **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Workflow `.github/workflows/pages.yml` membangun dan menerbitkan `dist/` setelah push, atau jalankan lewat **Actions → Deploy portfolio to GitHub Pages → Run workflow**.
4. Alamatnya `https://USERNAME.github.io/REPOSITORY/`. Repository `USERNAME.github.io` memakai `https://USERNAME.github.io/`.

Vite memakai `base: './'`: aset mendukung domain utama, subfolder repository, dan custom domain tanpa mengganti konfigurasi. Tidak ada backend, API key, CDN runtime, font eksternal, atau aset berbayar. Belum terhubung ke repository/hosting GitHub secara otomatis dari folder lokal ini.

## Kontrol dan aksesibilitas

- Klik pintu atau tombol **Klik untuk masuk**, lalu scroll/touch swipe. Tombol petunjuk scroll juga menggerakkan perjalanan.
- **Lewati intro** membuka portofolio; **Kembali ke ruangan** mengulang pengalaman.
- Scroll balik sampai awal menutup pintu dan mengunci perjalanan; klik pintu lagi untuk masuk. Scroll balik sebagian tetap dapat dilanjutkan maju.
- Anchor `#portfolio`, `#pengalaman`, `#proyek`, `#tentang`, `#kontak` langsung membuka konten.
- Preferensi `prefers-reduced-motion: reduce`, kegagalan WebGL, atau kehilangan GPU context menampilkan halaman portofolio langsung.
- Kualitas render adaptif, geometri/material dipakai ulang, dan render berhenti ketika portofolio dibaca atau tab tersembunyi.

## Verifikasi

```sh
npx playwright install chromium
npm test
```

Tes browser menguji interaksi pintu dan scroll, pengulangan, detail proyek, keyboard skip, tampilan ponsel, reduced motion, fallback WebGL, profil CV, serta build dari subfolder GitHub Pages. Unduhan PDF diuji melalui klik tombol dan dibandingkan SHA-256-nya dengan CV asli pada domain root, subfolder repository, dan viewport mobile. Screenshot konten disimpan di `output/preview/cv-*.png` untuk pemeriksaan manual; gambar ini bukan perbandingan piksel otomatis.

## Arah visual

Ruang kerja memakai detail benda fisik dari prinsip Anatomy: engsel nyata, ketebalan, sambungan, keyboard, lampu, dan bayangan kontak. Perspektif dan depth dikelola Three.js; kit SVG/isometrik Anatomy tidak dipakai karena pengalaman membutuhkan kamera berjalan di dalam ruangan. UI mengikuti referensi Linear dari awesome-design-md: charcoal, garis tipis, tipografi bersih, dan aksen lavender. Adegan dibuat secara prosedural, sehingga hasilnya bergaya 3D dan bukan render fotorealistis seperti storyboard.
