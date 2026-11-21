/**
 * EDIT FILE INI SEBELUM WEBSITE DIPUBLIKASIKAN.
 * Harga berikut HANYA DATA CONTOH, bukan harga resmi dari client.
 * Nomor WhatsApp menggunakan format 62..., TANPA tanda + dan spasi.
 */

export const siteConfig = {
  businessName: "Dokter Ponsel Jogja",
  tagline: "Solusi cepat untuk servis HP kesayanganmu di Jogja.",
  description:
    "Servis smartphone dengan proses jelas, estimasi biaya di depan, dan konsultasi mudah lewat WhatsApp di Dokter Ponsel Jogja.",
  whatsappNumber: "621276768181", // WAJIB diisi, contoh: "6281234567890"
  address: "Jl. Kopral Samiyo, Krikilan, Tegaltirto, Kec. Berbah, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55573",
  openingHours: "Sabtu-Kamis, 08.00–20.00 WIB",
  instagramUrl: "https://www.instagram.com/service_hp_jogja_berpengalaman/", // Opsional. Contoh: "https://instagram.com/namatoko"
  currency: "IDR",
} as const;

export type Category = "Layar" | "Baterai" | "Hardware" | "Software";

export type Service = {
  id: string;
  name: string;
  description: string;
  category: Category;
  priceFrom: number;
  duration: string;
  popular?: boolean;
  icon: "screen" | "battery" | "plug" | "camera" | "speaker" | "software" | "water" | "diagnosis";
};

/** UBAH daftar serta estimasi harga sesuai informasi asli dari client. */
export const services: Service[] = [
  {
    id: "ganti-lcd",
    name: "Ganti LCD / Layar",
    description: "Layar pecah, bergaris, blank, atau touchscreen tidak responsif.",
    category: "Layar",
    priceFrom: 250000,
    duration: "1–3 jam*",
    popular: true,
    icon: "screen",
  },
  {
    id: "ganti-baterai",
    name: "Ganti Baterai",
    description: "Baterai cepat habis, kembung, atau HP sering mati sendiri.",
    category: "Baterai",
    priceFrom: 150000,
    duration: "30–90 menit*",
    popular: true,
    icon: "battery",
  },
  {
    id: "port-charger",
    name: "Servis Port Charger",
    description: "HP sulit dicas, konektor longgar, atau pengisian tidak stabil.",
    category: "Hardware",
    priceFrom: 100000,
    duration: "1–2 jam*",
    icon: "plug",
  },
  {
    id: "kamera",
    name: "Servis Kamera",
    description: "Kamera buram, tidak fokus, bergetar, atau tidak bisa dibuka.",
    category: "Hardware",
    priceFrom: 120000,
    duration: "1–3 jam*",
    icon: "camera",
  },
  {
    id: "speaker",
    name: "Servis Speaker / Mic",
    description: "Suara pecah, tidak terdengar, atau mikrofon bermasalah.",
    category: "Hardware",
    priceFrom: 100000,
    duration: "1–2 jam*",
    icon: "speaker",
  },
  {
    id: "software",
    name: "Perbaikan Software",
    description: "HP bootloop, lemot, aplikasi error, atau gagal pembaruan.",
    category: "Software",
    priceFrom: 75000,
    duration: "1–3 jam*",
    icon: "software",
  },
  {
    id: "water-damage",
    name: "Penanganan Kena Air",
    description: "Pengecekan dan penanganan awal HP yang terkena cairan.",
    category: "Hardware",
    priceFrom: 150000,
    duration: "Tergantung kondisi",
    icon: "water",
  },
  {
    id: "diagnosa",
    name: "Diagnosa Kerusakan",
    description: "Pemeriksaan awal untuk menentukan penyebab kerusakan HP.",
    category: "Hardware",
    priceFrom: 50000,
    duration: "30–60 menit*",
    icon: "diagnosis",
  },
];
