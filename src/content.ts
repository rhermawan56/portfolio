// Profile transcribed from the supplied CV dated 29 July 2026.
// Ruby, Ruby on Rails and TypeScript were added from the owner's later instructions.
export const profile = {
  name: 'Rizky Hermawan',
  initials: 'RH',
  role: 'Backend Development · Laravel',
  headline: 'Rizky Hermawan\nSoftware Engineer',
  intro: 'Saya Rizky Hermawan, Software Engineer dengan pengalaman lebih dari empat tahun mengembangkan aplikasi untuk industri manufaktur. Fokus saya adalah pengembangan backend menggunakan Laravel dan CodeIgniter. Di PT. KAHAPTEX, saya mengembangkan ERP, sistem perencanaan produksi tekstil, serta integrasi absensi karyawan.',
  about: 'Selain backend, saya menggunakan Vue.js dan Inertia.js untuk pengembangan antarmuka. Pekerjaan saya juga mencakup containerisasi menggunakan Docker dan pemantauan server melalui Grafana.',
  email: 'rhermawan56@gmail.com', // Example: hello@your-domain.com
  github: 'https://github.com/rhermawan56', // Example: https://github.com/your-username
  linkedin: 'https://www.linkedin.com/in/rizky-hermawan-29a15a154/',
  location: 'Gunung Putri, Jawa Barat, Indonesia',
  experienceLabel: '4+ tahun pengalaman',
  skillGroups: [
    { title: 'Backend', items: ['PHP', 'Laravel', 'CodeIgniter', 'Ruby', 'Ruby on Rails', 'RESTful API', 'OOP & SOLID', 'MVC', 'Authentication & Authorization'] },
    { title: 'Frontend', items: ['Vue.js', 'Inertia.js', 'JavaScript', 'TypeScript', 'jQuery', 'DataTables', 'HTML5 & CSS3', 'Bootstrap', 'Tailwind CSS'] },
    { title: 'Database', items: ['MySQL / MariaDB', 'PostgreSQL', 'Eloquent ORM', 'Database Design & Migration', 'Query & Index Optimization', 'Stored Procedures & Triggers'] },
    { title: 'Infrastruktur & Workflow', items: ['Docker & Docker Compose', 'Proxmox VE', 'MariaDB MaxScale', 'Grafana', 'Linux Server', 'Nginx & Apache', 'Git & Git Flow'] },
  ],
  experience: {
    company: 'PT. KAHAPTEX', role: 'Software Engineer (Backend Laravel)', period: '2022 sampai sekarang',
    responsibilities: [
      'Merancang dan mengembangkan ERP yang mencakup Purchasing, Sales, Inventory, Production, dan HRIS.',
      'Mengembangkan sistem perencanaan produksi tekstil untuk memetakan alur kerja, menyusun jadwal mesin, dan memantau tahapan produksi.',
      'Mengintegrasikan FingerSpot Biometric API untuk sinkronisasi absensi harian dan rekap data payroll.',
      'Mengoptimalkan MySQL dan PostgreSQL melalui peninjauan indeks, perbaikan query, dan penyempurnaan stored procedure.',
      'Mengonfigurasi tiga node server Proxmox VE serta menerapkan load balancing dan failover database menggunakan MariaDB MaxScale.',
    ],
  },
  education: { degree: 'Bachelor of Informatics Engineering (S.T)', institution: 'Universitas Sangga Buana (USB) YPKP', location: 'Bandung' },
  projects: [
    { number: '01', title: 'Enterprise Resource Planning', category: 'ENTERPRISE APPLICATION', year: 'ERP', kind: 'erp', description: 'Saya mengembangkan ERP end-to-end yang mencakup Purchasing, Sales, Inventory, Production, dan HRIS untuk mengintegrasikan alur operasional perusahaan. Sistem ini menggunakan Laravel, MariaDB, Vue.js, dan Inertia.js, dengan Docker untuk deployment.', stack: ['Laravel', 'MariaDB', 'Vue.js', 'Inertia.js', 'Docker'], url: '' },
    { number: '02', title: 'Manufacturing Planning System', category: 'MANUFACTURING SYSTEM', year: 'PLANNING', kind: 'planning', description: 'Saya mengembangkan sistem perencanaan produksi tekstil untuk memetakan alur kerja, menyusun jadwal mesin, dan memantau tahapan produksi. Sistem ini dibangun menggunakan CodeIgniter, MySQL, dan JavaScript.', stack: ['CodeIgniter', 'MySQL', 'JavaScript'], url: '' },
    { number: '03', title: 'Human Resource & Attendance', category: 'API INTEGRATION', year: 'HR', kind: 'attendance', description: 'Saya mengembangkan sistem HR dan absensi menggunakan Laravel, MySQL, Vue.js, dan Inertia.js. Integrasi FingerSpot Biometric API digunakan untuk sinkronisasi presensi harian karyawan dan rekap data payroll.', stack: ['Laravel', 'MySQL', 'Vue.js', 'Inertia.js', 'FingerSpot API'], url: '' },
  ],
};
