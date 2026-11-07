# Ruang Karya — Baseline Core dan Desain

| Atribut | Nilai |
| --- | --- |
| ID baseline | `RK-CORE-01` |
| Revisi dokumen | `1.6` |
| Tanggal | 7 November 2026 |
| Dasar penerimaan | Pemilik menyatakan: “Sementara untuk corenya sudah oke.” |
| Cakupan | Core, tata ruang, perjalanan, dan tampilan implementasi saat baseline dibuat |
| Referensi | Prinsip objek Anatomy; bahasa visual Linear dari awesome-design-md |

Dokumen ini mencatat **implementasi yang sudah diterima**, bukan target render fotorealistis pada storyboard. Desain saat ini adalah default yang harus dipertahankan untuk pekerjaan berikutnya. Instruksi pengguna yang secara eksplisit meminta perubahan tetap berlaku pada bagian yang diminta.

## 1. Identitas pengalaman

Portofolio merupakan perjalanan orang pertama menuju ruang kerja pribadi. Ruangan memakai kayu gelap, dinding graphite hangat, logam, kursi berlapis, lampu hangat, tanaman, dan pencahayaan lembut. Portofolio di dalam laptop memakai charcoal, teks terang, garis tipis, ruang kosong yang terukur, serta aksen lavender terbatas.

Pertahankan gaya 3D prosedural yang sudah ada. Jangan mengubahnya menjadi ilustrasi datar, wireframe, ruangan futuristis dengan neon, atau scene isometrik sebagai efek samping pekerjaan lain.

## 2. Urutan pengalaman yang dipertahankan

| Tahap | Perilaku |
| --- | --- |
| 01 | Kamera di luar ruangan, menghadap pintu tertutup. |
| 02 | Klik pintu atau tombol masuk membuka pintu pada engsel kiri. |
| 03 | Setelah pintu terbuka, pengunjung mendapat petunjuk scroll. |
| 04 | Scroll menggerakkan kamera masuk melalui pintu. |
| 05 | Kamera berbelok ke kanan dan mendekati meja serta kursi. |
| 06 | Kamera turun ke tinggi mata saat duduk. |
| 07 | Tutup laptop membuka pada engselnya; layar menyala. |
| 08 | Kamera mendekati layar dan menyelaraskan arah pandang dengannya. |
| 09 | Transisi menampilkan portofolio HTML yang dapat dibaca dan digunakan. |

Pintu dibuka lewat klik; progres perjalanan berikutnya mengikuti scroll/touch. Jangan menggantinya dengan autoplay seluruh perjalanan atau menambah klik wajib di setiap tahap. Scroll balik membalik perjalanan. Setelah pengunjung sudah bergerak maju lalu kembali sepenuhnya ke awal, kamera berada di luar dan pintu menutup dengan animasi. Setelah penutupan selesai, tahap pertama dan tombol masuk kembali tampil; scroll perjalanan terkunci sampai pintu diklik lagi. Replay juga tetap mereset ke pintu tertutup.

### Kontrol dan kontinuitas

- Tombol masuk memiliki keadaan loading dan tidak bisa dipicu berulang saat membuka.
- **Lewati intro** dan tautan skip keyboard langsung membuka konten; pemuatan scene terlambat tidak boleh menarik pengunjung kembali.
- **Kembali ke ruangan** mereset posisi scroll, kamera, pintu, laptop, dan tahap pertama.
- Scroll balik sebagian tidak mereset pintu: pengunjung tetap dapat maju kembali. Posisi nol sesaat setelah pembukaan pertama tidak memicu penutupan.
- Saat penutupan, cegah pembukaan ganda dan reset berulang akibat momentum scroll. Skip dan fallback dapat mengambil alih tanpa callback penutupan mengembalikan intro secara terlambat.
- Anchor `#portfolio`, `#pengalaman`, `#proyek`, `#tentang`, dan `#kontak` tetap didukung, termasuk saat URL dimuat langsung.
- Konten tersembunyi/transisi memakai `inert`; konten dapat diakses setelah fase membaca.
- Portofolio menggunakan HTML, bukan seluruh konten yang dibakar ke tekstur 3D.

## 3. Tata ruang dan objek

Sumber utama: `src/scene.ts`.

- Sumbu dunia: `+x` adalah kanan dari arah masuk; interior berada pada `z` negatif.
- Pintu berada dekat `z = 0`, dengan engsel di `x = -0.95`.
- Workspace berada di `[2.7, 0, -3.5]`, berotasi `-π/2` pada sumbu Y: meja tetap di sisi kanan ruangan.
- Pertahankan jendela belakang dengan kisi, rak dinding, dekorasi, karpet, dan lampu sebagai komposisi ruang yang sudah ada.
- Pertahankan engsel, handle, kusen, ambang pintu, ketebalan meja, laci, kaki kursi/caster, lampu, cangkir, notebook, keyboard, trackpad, dan bezel laptop.
- Lampu dan objek harus memiliki dudukan serta sambungan yang masuk akal. Jangan menambah detail acak atau objek melayang.
- Scene tidak memakai avatar. Berjalan dan duduk diwakili gerak kamera.

### Parameter gerak baseline

| Parameter | Nilai saat baseline |
| --- | --- |
| Pembukaan pintu | Rotasi Y `1.48` radian, `1.8` detik, `power2.inOut` |
| Penutupan setelah scroll balik penuh (revisi 1.1) | Rotasi Y kembali ke `0`, `1.8` detik, `power2.inOut`; reset/replay tetap memakai posisi awal yang sama |
| Awal kamera | Posisi `[0, 1.6, 4.15]`, target `[0, 1.35, 0]` |
| Titik progres kamera | `0`, `0.16`, `0.36`, `0.53`, `0.66`, `0.79`, `0.88`, `1` |
| Pembukaan laptop | Progres `0.66–0.79`, rotasi tutup X hingga `-1.88` radian |
| Pendekatan mengikuti normal layar | Mulai progres `0.88` |
| Transisi HTML | Mulai setelah `0.915`; opacity penuh pada `0.985` |
| Fase membaca interaktif | Progres `>= 0.9998` |
| FOV | `43°` desktop; `57°` ketika lebar `< 700px` |
| Tinggi perjalanan | `640svh`; pada CSS lebar `<= 700px`: `570svh` |
| Tahap sebelum pintu terbuka | Tinggi `100svh`, scroll dikunci |

Angka di atas mencatat konfigurasi yang diterima. Jangan mengubah tempo, lintasan, skala objek, atau framing untuk pekerjaan konten. Bug fix yang memang membutuhkan perubahan angka harus tetap mempertahankan pengalaman dan diperiksa pada tahap yang terdampak.

## 4. Sistem visual aktual

Sumber utama: `src/style.css`, `src/scene.ts`, dan `src/textures.ts`. Referensi Linear memberi arah; nilai yang sudah diterapkan di proyek tidak boleh ditimpa dengan token upstream.

| Peran | Nilai baseline |
| --- | --- |
| Latar aplikasi | `#101112` |
| Latar portofolio | `#0b0b0e` |
| Teks utama umum | `#f7f8f8` |
| Judul hero portofolio | `#efedf6` |
| Teks sekunder umum | `#929298` |
| Garis pemisah | `#26262c` |
| Aksen umum | `#a89ade` |
| Tombol utama | `#7564b4`; hover `#8875c7` |
| Fokus keyboard | `#b6a4ec` |
| Kayu meja | Tekstur prosedural dasar `#654630` |
| Kayu pintu | Tekstur prosedural dasar `#4d3324` |
| Dinding interior | Tekstur prosedural dasar `#69625b` |
| Dinding luar | Tekstur prosedural dasar `#514e48` |
| Pelapis kursi | Tekstur prosedural dasar `#343735` |

Pertahankan hierarki terang/gelap dan pencahayaan hangat. Aksen lavender digunakan pada tombol, indikator, dan detail terpilih; jangan menambah warna dominan atau glow berlebihan.

### Tipografi dan komponen

- Font utama: `Inter, "Segoe UI", Arial, sans-serif`; tanpa pengunduhan font eksternal.
- Metadata/caption: monospace, kecil, dengan tracking renggang.
- Judul memakai bobot ringan–sedang dan tracking rapat.
- Judul intro desktop: `clamp(32px, 3.6vw, 64px)`; mobile: `38px`.
- Judul hero portofolio pada baseline awal: `clamp(46px, 6.4vw, 88px)`; mobile: `48px`. Revisi 1.2 menyesuaikan khusus judul profil yang lebih panjang menjadi `clamp(40px, 4.9vw, 70px)`, lebar maksimum `1100px`, mobile `37px`; font, bobot, dan warna tetap sama.
- Tombol intro berbentuk pill dengan ikon lingkaran; tombol portofolio memakai radius `7px` dan tinggi minimum `44px`.
- Kartu proyek memakai border tipis, radius `9px`, ilustrasi preview, metadata, judul, dan ikon menuju detail.
- Detail proyek tetap dalam dialog yang dapat ditutup melalui tombol, backdrop, atau Escape.
- Revisi 1.6 menambahkan respons klik preview (skala `1 → 0.985 → 1`, 150 ms), pembukaan dialog dengan fade/translate 14 px/skala 0.97 selama 280 ms, dan penutupan 180 ms. Backdrop mengikuti fade. Reduced motion menonaktifkan gerakan; fokus kembali ke kartu setelah dialog ditutup. Tata letak dan ilustrasi kartu dipertahankan.

## 5. Layout yang dipertahankan

- Intro: wordmark kiri atas, skip kanan atas, copy kiri bawah/tengah pada desktop, pintu sebagai pusat perhatian.
- Caption perjalanan di kiri bawah, indikator sembilan tahap di kanan, petunjuk scroll di bawah tengah, progress bar di tepi bawah.
- Portofolio: navigasi, hero identitas, pengalaman profesional, proyek yang pernah dikerjakan, tentang/keahlian dan pendidikan, kontak, lalu footer. Revisi 1.3 menempatkan pengalaman sebelum proyek untuk pembaca HR. Komponen dan sistem visual tetap dipertahankan.
- Lebar konten maksimum `1440px`; gutter dasar `6vw`, mobile `7vw`.
- Hero mempertahankan ornamen orbit lavender yang samar, hierarki judul, deskripsi, dan dua CTA.
- Grid proyek desktop tiga kolom; mobile satu kolom.
- Tentang memakai dua kolom desktop, satu kolom mobile.
- Breakpoint CSS yang sudah ada: `>=1600px`, `<=1000px`, `<=700px`.
- Pertahankan adaptasi navigasi, ukuran teks, vignette, dan caption pada mobile. Jangan menyembunyikan konten utama atau menimbulkan scroll horizontal.

## 6. Batas konten dan desain

| Kebutuhan | Lokasi utama | Batas perubahan |
| --- | --- | --- |
| Nama, peran, intro, tentang, teknologi, kontak | `src/content.ts` | Ganti data tanpa merombak layout atau palet. |
| Proyek dan URL | `src/content.ts` | Gunakan struktur kartu/detail yang sudah ada. |
| Pratinjau profil dalam laptop | `src/textures.ts` membaca `profile` | Pertahankan sinkronisasi dengan data profil dan keterbacaan layar. |
| Teks tahap intro/perjalanan | `src/main.ts` | Ubah hanya jika diminta; jaga panjang dan makna tahap. |
| Bug interaksi | `src/main.ts` / `src/portfolio.ts` | Pertahankan urutan pengalaman dan kontrol lain. |
| CSS, scene, material, kamera | `src/style.css` / `src/scene.ts` | Bagian desain terlindungi; ubah hanya bila diminta atau diperlukan untuk perbaikan terkait. |

Pada baseline awal, nama, pengalaman, kontak, dan proyek merupakan placeholder. Revisi 1.2 menggantinya dengan profil Rizky Hermawan, pengalaman PT. KAHAPTEX (2022–sekarang menurut CV), pendidikan, kontak, serta tiga proyek dari CV bertanggal 29 Juli 2026. Keahlian dikelompokkan menjadi Backend, Frontend, Database, dan Infrastruktur & Workflow. Jangan menambahkan klaim hasil, metrik, masa pendidikan, atau URL proyek yang tidak tersedia pada sumber.

Revisi 1.3 memprioritaskan informasi untuk HR: headline berisi nama dan profesi, ringkasan pengalaman faktual, CTA **Lihat Pengalaman**, judul bagian profesional yang langsung, serta kontak untuk informasi pengalaman dan kualifikasi. Hindari slogan penawaran jasa, janji manfaat produk, atau klaim sedang mencari pekerjaan tanpa informasi pemilik. Deskripsi proyek menjelaskan peran serta kontribusi pemilik dengan teknologi yang benar-benar digunakan.

Revisi 1.4 memakai sudut pandang pertama agar profil terbaca seperti perkenalan pemilik. Ringkasan pembuka menyebut fokus backend dan pekerjaan di PT. KAHAPTEX; bagian tentang menjelaskan pengalaman frontend serta infrastruktur tanpa mengulang pembuka. Deskripsi proyek langsung menjelaskan pekerjaan, tanpa mengulang jabatan dan perusahaan pada setiap kartu. Teknologi lengkap tetap tercantum pada stack. Keterangan ilustrasi ditampilkan sekali pada bagian proyek, tanpa narasi penyusunan halaman dari CV. Kalimat kontak mengarahkan pembaca untuk membahas pengalaman kerja dan posisi yang relevan. Fakta, keahlian, dan PDF sumber dipertahankan; periode pekerjaan ditampilkan sebagai “2022 sampai sekarang”.

Revisi 1.6 menyelaraskan teks situs dengan CV yang diperbarui pada revisi 1.5: industri manufaktur, modul ERP Purchasing/Sales/Inventory/Production/HRIS, jadwal mesin, sinkronisasi absensi dan rekap payroll, optimasi database, serta tiga node Proxmox VE dengan load balancing dan failover MariaDB MaxScale. Grafana pada bagian tentang dan keahlian bersumber dari penjelasan langsung pemilik. Docker tetap disebut untuk containerisasi; deskripsi proyek menjelaskan cakupan kontribusi tanpa menambahkan angka hasil atau URL yang tidak tersedia. PDF revisi 1.5 tidak diubah.

Ruby dan Ruby on Rails ditambahkan pada Backend; TypeScript pada Frontend, berdasarkan instruksi langsung pemilik setelah CV diberikan. Jangan menganggap tiga keterampilan ini tercantum di PDF asli, digunakan di proyek terdahulu, atau telah dikuasai selama empat tahun. Durasi, level penguasaan, dan pengalaman proyek baru tidak ditambahkan. PDF CV asli tetap diunduh tanpa modifikasi. Teks pada layar laptop mengikuti identitas dan CTA yang sama, dengan ringkasan dibungkus dan ukuran font diukur agar tidak terpotong.

Ketiga ilustrasi proyek diberi keterangan skema konsep; tidak boleh disajikan sebagai screenshot aplikasi sebenarnya. Header, warna, border, gaya kartu, dan modal tetap mengikuti sistem Linear yang sudah dipakai. Pratinjau laptop mengambil nama dan headline dari profil yang sama, memakai pengukuran ukuran font dan pembungkusan ringkasan agar teks tetap terbaca. Material prosedural ruangan tidak diubah.

Penambahan konten boleh mengubah tinggi halaman dan jumlah kartu secara wajar, tanpa mengganti sistem desain. Jika teks baru tidak muat, perbaiki keterbacaan di komponen terkait; jangan mengecilkan seluruh antarmuka.

## 7. Kontrak teknis dan aksesibilitas

- Vite + TypeScript + Three.js + GSAP ScrollTrigger; HTML/CSS untuk portofolio.
- Build statis di `dist/`, `base: './'`, dan workflow `.github/workflows/pages.yml` untuk GitHub Pages.
- Domain utama dan subfolder repository harus tetap bekerja; jangan memakai path aset absolut dari root domain.
- Tidak ada backend, API key, CDN runtime, atau font eksternal yang diwajibkan.
- Reduced motion dan kegagalan/kehilangan WebGL tetap memberikan halaman HTML yang dapat digunakan.
- Pertahankan render adaptif, penggunaan ulang geometri/material, serta penghentian render ketika membaca atau tab tersembunyi.
- Tombol **Unduh CV** mengunduh file PDF asli dari `public/cv/Rizky_Hermawan_CV_2026_07_29.pdf` melalui atribut `download`. URL memakai `import.meta.env.BASE_URL`, tidak memakai alamat `file:///` atau path lokal Windows. Jangan mengganti unduhan dengan cetak atau PDF hasil generasi. CSS cetak manual browser tetap didukung.
- Jangan menghapus fokus keyboard, label aksesibilitas, navigasi anchor, semantik, atau dukungan touch untuk mengejar kesamaan visual.

## 8. Memeriksa perubahan berikutnya

Ikuti [AGENTS.md](AGENTS.md). Untuk perubahan visual/perilaku, bandingkan kondisi sebelum dan sesudah pada desktop `1440 × 900` serta mobile `390 × 844`.

Periksa pintu tertutup/terbuka, masuk, meja di kanan, duduk, tutup laptop, layar, transisi HTML, scroll balik, replay, dan isi portofolio. Tambahkan pemeriksaan reduced motion, fallback WebGL, serta subfolder Pages bila lapisan tersebut terdampak.

`npm run build` memeriksa TypeScript dan build. `npm test` berisi dua belas skenario fungsi browser, termasuk reset scroll penuh, klik ulang, scroll balik sebagian, interupsi penutupan, swipe balik mobile, isi profil, kontak, dan unduhan CV asli. Uji unduhan memeriksa nama file, header PDF, serta SHA-256 terhadap hash sumber asli, termasuk ketika dilayani dari subfolder GitHub Pages. Keduanya belum membandingkan kesamaan piksel. `scripts/capture.mjs` menghasilkan screenshot perjalanan untuk pemeriksaan manual ketika dev server berjalan di `http://127.0.0.1:5173/`; tes konten juga menghasilkan screenshot desktop/mobile `cv-*.png`. Hasil sementara berada di `output/preview/` dan diabaikan Git. Hasil capture baru tidak otomatis menggantikan baseline.

## 9. Sidik file saat baseline dibuat

SHA-256 berikut merupakan catatan source awal untuk mendeteksi perubahan byte. Hash bukan kunci file, bukan snapshot cadangan, dan bukan bukti bahwa perubahan tertentu mengubah tampilan. Perubahan yang diminta tetap boleh dilakukan sesuai batas di atas.

| File | SHA-256 baseline |
| --- | --- |
| `index.html` | `C153B71E9F1214F89B943D18030680130421883527762ED8632B41EFD4D6179E` |
| `src/main.ts` | `F973A648C2F1F39A85A109841FC7913D897FECF7F80E059A9A92F70542FECADE` |
| `src/scene.ts` | `8D44BD06DE35DE99EC61962E00F0AA6D0839ED8F6AA6BA531AC4F20A877F1A53` |
| `src/textures.ts` | `20E9651BCB5A16FB36A95E17C97BD69220F019C9A0C61D0A892C145EFF785198` |
| `src/portfolio.ts` | `FAF54F45BAD86C876C7EF3881A19DA053FADB0A4C26F3F1C16A6A1A5BC59FA3C` |
| `src/style.css` | `D5EFCA56E417D868C2F9BDCB4E08DCB59B9EE8FE02C030AD4BE2E1D9D96D522D` |
| `vite.config.ts` | `300734542115EDB9E6C1B943239EB9462D5C3CEE2D3064E8A7C45B5CE523936E` |
| `.github/workflows/pages.yml` | `BF56062D8497B00F4602AEB55E3F44617E1E921A105AC4B130888E561F482756` |

`src/content.ts` sengaja tidak dimasukkan sebagai file desain terlindungi karena merupakan titik perubahan profil sehari-hari. Untuk melihat hash file melalui PowerShell, gunakan `Get-FileHash -LiteralPath src/scene.ts -Algorithm SHA256`.

## 10. Catatan revisi

| Revisi | Tanggal | Perubahan |
| --- | --- | --- |
| `1.0 / RK-CORE-01` | 7 November 2026 | Mencatat core dan desain saat ini setelah penerimaan pemilik; hanya menambah dokumentasi. |
| `1.1 / penyesuaian perilaku` | 7 November 2026 | Atas permintaan pemilik, scroll balik penuh menutup pintu dan mewajibkan klik ulang. Reset dipakai bersama oleh scroll dan replay. Tata ruang, material, CSS, lintasan kamera, serta konfigurasi GitHub Pages dipertahankan. Hash pada bagian 9 tetap merekam baseline awal 1.0. |
| `1.2 / profil berdasarkan CV` | 7 November 2026 | Mengisi profil, tiga proyek, pengalaman, pendidikan, keahlian, dan kontak dari CV; memperbarui isi layar laptop serta mengganti tombol cetak dengan unduhan PDF asli. Penyesuaian CSS dibatasi pada konten portofolio. Ruangan, lintasan, kontrol perjalanan, reset scroll, dan konfigurasi Pages dipertahankan. |
| `1.3 / profil untuk HR` | 7 November 2026 | Mengganti slogan dengan identitas serta pengalaman, mendahulukan pengalaman profesional, menyelaraskan teks layar laptop, dan menambahkan Ruby, Ruby on Rails, serta TypeScript atas informasi pemilik. Menambahkan dukungan anchor langsung `#pengalaman`. CSS, scene, animasi, dan PDF asli dipertahankan. |
| `1.4 / penyuntingan teks` | 7 November 2026 | Menerapkan usulan humanizer: perkenalan pribadi, ringkasan dan bagian tentang yang saling melengkapi, kontribusi proyek yang langsung, satu keterangan ilustrasi, dan kontak yang lebih singkat. Nama, profesi, stack proyek, keahlian, urutan bagian, CSS, core perjalanan, dan PDF asli dipertahankan. Layar laptop membaca teks terbaru melalui data profil yang sama. |
| `1.5 / implementasi CV PDF` | 7 November 2026 | Memperbarui dokumen CV PDF di `public/cv/Rizky_Hermawan_CV_2026_07_29.pdf` dengan tata letak 1 halaman (gaya visual Linear + Cambria typography): posisi Backend/Software Engineer generalis, modul ERP (Purchasing, Sales, Inventory, Production, HRIS tanpa ACM), pembersihan duplikasi skill, perbaikan typo `CodeIgniter`, penajaman dampak database dan kluster Proxmox VE / MariaDB MaxScale. Hash SHA-256 dan uji unduhan otomatis diperbarui. |
| `1.6 / konten CV dan animasi proyek` | 7 November 2026 | Menyelaraskan profil, pengalaman, dan detail proyek dengan CV terbaru; menambahkan Grafana dari informasi pemilik. Menambahkan respons klik kartu serta animasi buka/tutup dialog dan backdrop, dengan keyboard, pengembalian fokus, dan reduced motion. Build, tes konten dan dialog desktop/mobile, perjalanan utama, serta subfolder Pages diperiksa. Core ruangan, susunan halaman, ilustrasi, dan PDF revisi 1.5 dipertahankan. |
