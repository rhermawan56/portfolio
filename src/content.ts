// Profile follows the revised CV supplied on 9 November 2026.
// Ruby, Ruby on Rails and TypeScript were added from the owner's later instructions.
export const profile = {
  name: 'Rizky Hermawan',
  initials: 'RH',
  role: 'Fullstack & Backend · Laravel',
  headline: 'Rizky Hermawan\nFullstack & Backend Engineer',
  intro: "Saya Rizky Hermawan, Fullstack & Backend Engineer dengan pengalaman pengembangan aplikasi sejak 2018. Saya mengembangkan aplikasi operasional manufaktur, mulai dari ERP dan perencanaan produksi hingga integrasi mesin presensi, timbangan, serta pemindaian QR. Pekerjaan saya mencakup frontend, backend, optimasi database, pengujian otomatis, dan deployment.\n\nDi PT Kahaptex Indonesia, saya bekerja bersama tim mengembangkan ERP untuk sekitar 302 pengguna aktif harian di tiga lokasi. Saya menangani modul operasional dan optimasi laporan yang menurunkan waktu pemrosesan dari rata-rata lebih dari satu menit menjadi sekitar 10 sampai 15 detik. Saya juga mengembangkan aplikasi presensi untuk sekitar 2.500 karyawan.",
  screenIntro: "Pengembangan aplikasi sejak 2018: ERP manufaktur, optimasi database, dan integrasi perangkat. Menangani frontend, backend, pengujian otomatis, serta deployment.",
  about: 'Saya menangani frontend dan backend, pengujian otomatis, deployment, serta pemeliharaan aplikasi. Saya menggunakan Vue.js dan Inertia.js untuk antarmuka, Ruby dan Cucumber untuk pengujian ERP, serta Python untuk integrasi timbangan. Pekerjaan saya juga mencakup infrastruktur Linux, Docker, Proxmox VE, HAProxy, MariaDB MaxScale, dan Grafana.',
  email: 'rhermawan56@gmail.com', // Example: hello@your-domain.com
  github: 'https://github.com/rhermawan56', // Example: https://github.com/your-username
  linkedin: 'https://www.linkedin.com/in/rizky-hermawan-29a15a154/',
  location: 'Gunung Putri, Jawa Barat, Indonesia',
  experienceLabel: 'Pengembangan aplikasi sejak 2018',
  skillGroups: [
    { title: 'Backend', items: ['PHP', 'Laravel', 'CodeIgniter', 'Python', 'Ruby', 'Ruby on Rails', 'RESTful API', 'JWT Authentication', 'OOP & SOLID', 'MVC', 'Authentication & Authorization'] },
    { title: 'Frontend', items: ['Vue.js', 'Inertia.js', 'JavaScript', 'TypeScript', 'jQuery', 'DataTables', 'HTML5 & CSS3', 'Bootstrap', 'Tailwind CSS', 'Metronic'] },
    { title: 'Database', items: ['SQL', 'MySQL / MariaDB', 'PostgreSQL', 'Eloquent ORM', 'Database Design & Migration', 'Query & Index Optimization', 'Database Transactions', 'Alokasi Stok', 'Stored Procedures & Triggers'] },
    { title: 'Infrastruktur & Workflow', items: ['Docker & Docker Compose', 'Proxmox VE', 'HAProxy', 'MariaDB MaxScale', 'Grafana', 'Linux Server', 'Nginx & Apache', 'Git & Git Flow', 'Cucumber', 'Code Review', 'Deployment via Git Hooks'] },
    { title: 'Integrasi Perangkat', items: ['Fingerspot API', 'Solution X100-C', 'Timbangan', 'Pemindaian QR'] },
  ],
  experience: [{
    company: 'PT Kahaptex Indonesia', role: 'Fullstack Developer', period: 'Oktober 2022 sampai sekarang', location: 'Gunung Putri, Jawa Barat',
    responsibilities: [
      "Menggali kebutuhan aplikasi bersama pengguna dan kepala bagian untuk mendukung operasional manufaktur.",
      "Mengembangkan dan memelihara frontend, backend, database, serta integrasi perangkat pada aplikasi operasional perusahaan.",
      "Menyusun skenario dan kode pengujian otomatis ERP menggunakan Ruby dan Cucumber. Pengujian mencakup alur input transaksi, perhitungan, kesesuaian data, serta hak akses berbasis peran (RBAC), dengan hasil pengujian dalam laporan Excel.",
      "Memeriksa perubahan kode sebelum merge, melakukan deployment melalui Git hooks, serta menangani pemeliharaan dan gangguan aplikasi setelah digunakan.",
      "Menangani konfigurasi infrastruktur Linux, Proxmox, Docker, HAProxy, dan MariaDB MaxScale, serta pemantauan server melalui Grafana.",
      "Membagi tugas, membimbing programmer, memberikan pelatihan kepada pengguna, dan sesekali melakukan wawancara kandidat karyawan.",
    ],
  }, {
    company: 'PT Mitrahasanah Sukadamai', role: 'IT Programmer', period: '2018 sampai 2022', location: 'Nagreg, Jawa Barat',
    responsibilities: [
      'Mengembangkan sistem presensi menggunakan Laravel dan MySQL, terhubung dengan mesin Solution X100-C untuk sekitar 100 karyawan. Sistem menggantikan rekap kehadiran manual melalui Excel.',
      'Mengembangkan aplikasi inventaris untuk barang masuk, barang keluar, stok operasional, dan laporan mutasi barang.',
      'Membangun website profil perusahaan yang responsif.',
    ],
  }],
  education: { degree: 'Sarjana Komputer, Teknik Informatika', institution: 'Universitas Sangga Buana', location: 'Bandung · Lulus 2019' },
  training: ['Digital Marketing Program, ReVOU.', 'Ruby Web Development Course, Progate.', 'Pernah memperoleh sertifikasi MikroTik Certified Network Associate (MTCNA), MikroTik.'],
  personalProject: { title: 'Amertanala', url: 'https://github.com/rhermawan56/amertanala-landingpage', description: 'Saya mengembangkan editor undangan digital berbasis kanvas untuk membuat desain undangan yang ditampilkan sebagai website. Editor sudah berfungsi dan masih dalam pengembangan.' },
  projects: [
    {"number": "01", "title": "Enterprise Resource Planning", "category": "ENTERPRISE APPLICATION", "year": "ERP", "kind": "erp", "description": "Bersama tim, mengembangkan ERP manufaktur yang digunakan sekitar 302 pengguna aktif harian di Jakarta, Gunung Putri, dan Bandung. Bertanggung jawab atas modul operasional Purchasing, Produksi, Inventory, Sales, Komponen Biaya, dan Bill of Materials (BOM), serta mengerjakan Master Data bersama tim. Rekan programmer mengembangkan modul finance. Mengoptimalkan query dan indeks laporan Stok serta Sisa Order. Waktu pemrosesan turun dari rata-rata lebih dari satu menit menjadi sekitar 10 sampai 15 detik. Memasang Proxmox, Docker, dan Grafana serta mengonfigurasi Docker, HAProxy, dan MariaDB MaxScale. Menangani konfigurasi satu master dan lima replica database pada tiga server fisik, masing-masing dua instance. Menguji failover otomatis ketika master mati dan sinkronisasi ulang replica setelah dinyalakan kembali. Replica yang masih aktif dapat mengambil alih sebagai master.", "stack": ["Laravel", "MariaDB", "Vue.js", "Inertia.js", "Docker", "Proxmox VE", "HAProxy", "MariaDB MaxScale", "Grafana"], "url": "", "summary": "ERP manufaktur bersama tim untuk sekitar 302 pengguna aktif harian di tiga lokasi."},
    {"number": "02", "title": "Manufacturing Planning System", "category": "MANUFACTURING SYSTEM", "year": "PLANNING", "kind": "planning", "description": "Mengembangkan sistem perencanaan dan antrean produksi berbasis Laravel dan MySQL untuk sekitar 250 mesin. Sistem menentukan prioritas berdasarkan tenggat pengiriman dan memberi peringatan atau membatasi pencatatan ketika order prioritas dilewati. Berdasarkan pengamatan operasional, kejadian mendahulukan order bertenggat lebih jauh tidak ditemukan kembali setelah sistem diterapkan.", "stack": ["Laravel", "MySQL"], "url": "", "summary": "Perencanaan dan antrean produksi berdasarkan tenggat pengiriman untuk sekitar 250 mesin."},
    {"number": "03", "title": "Human Resource & Attendance", "category": "API INTEGRATION", "year": "HR", "kind": "attendance", "description": "Mengembangkan aplikasi presensi untuk sekitar 2.500 karyawan menggunakan Laravel, Vue.js, Inertia.js, dan API Fingerspot. Sistem menggantikan layanan vendor dan mengurangi biaya operasional tahunan sekitar 83%.", "stack": ["Laravel", "Vue.js", "Inertia.js", "Fingerspot API"], "url": "", "summary": "Aplikasi presensi untuk sekitar 2.500 karyawan, menggantikan layanan vendor."},
    {"number": "04", "title": "Validasi Pengiriman QR", "category": "LOGISTICS SYSTEM", "year": "QR", "kind": "shipping", "description": "Membangun sistem validasi pengiriman melalui pemindaian QR pada perangkat mobile. Setelah pemindaian selesai, sistem menerbitkan surat jalan yang siap dicetak melalui ERP lama. Volume pengiriman sekitar 100 sampai 200 surat jalan per hari dan dapat melampaui 400 saat ramai. Menerapkan validasi yang menolak kain tidak sesuai pesanan. Pengalihan alokasi barang antar konsumen memerlukan persetujuan pengawas, PIC, dan sales melalui ERP. Sejak digunakan sekitar Maret 2023, belum ada kejadian salah kirim jenis kain yang diketahui.", "stack": ["Pemindaian QR", "Integrasi ERP"], "url": "", "summary": "Validasi kain dan penerbitan surat jalan melalui pemindaian QR pada perangkat mobile."},
    {"number": "05", "title": "Integrasi Timbangan", "category": "DEVICE INTEGRATION", "year": "2025", "kind": "weighing", "description": "Memperbarui aplikasi pembaca timbangan dari VB ke Python pada 2025, dengan pengiriman hasil timbang ke aplikasi web melalui API. Aturan pengolahan hasil timbang dipusatkan di database sehingga perubahan aturan tidak lagi memerlukan pembaruan aplikasi satu per satu pada lebih dari 50 komputer.", "stack": ["Python", "API", "Database"], "url": "", "summary": "Pembaca timbangan Python dengan pengiriman data melalui API dan aturan terpusat di database."},
  ],
};
