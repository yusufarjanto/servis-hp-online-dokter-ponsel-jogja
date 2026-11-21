# NexaFix — Website Jasa Servis HP + Booking WhatsApp

Proyek **Next.js App Router + TypeScript + Tailwind CSS 4** untuk usaha ganti LCD, baterai, dan servis smartphone. Cocok sebagai MVP (versi pertama) website client.

> PENTING: Nama **NexaFix**, alamat, layanan, durasi, dan nominal harga masih **contoh**. **Nomor WhatsApp sengaja dikosongkan** agar booking tidak salah kirim. Sebelum website diluncurkan, sesuaikan file `data/site.ts`.

## Fitur

- Landing page responsif (desktop & HP)
- Katalog layanan + filter kategori
- Tombol tambah servis ke keranjang
- Ubah jumlah dan hapus servis dari keranjang
- Ringkasan estimasi harga awal
- Form nama pelanggan, WhatsApp, merek/tipe HP, keluhan, tanggal/jam kunjungan
- Menyusun pesan dan membuka WhatsApp admin (pelanggan sendiri menekan **Kirim** di WhatsApp)
- Menyimpan **keranjang saja** di `localStorage` browser, tanpa database
- Siap deploy ke Vercel melalui GitHub

## 1. Install alat di laptop

Gunakan Windows 10/11, macOS, atau Linux.

1. Install **Node.js 22 LTS** dari https://nodejs.org/ (Node 20.9+ didukung, disarankan 22 LTS).
2. Install **Visual Studio Code** dari https://code.visualstudio.com/.
3. Install **Git** dari https://git-scm.com/downloads.
4. Siapkan akun **GitHub** (https://github.com/) dan **Vercel** (https://vercel.com/).
5. Tutup dan buka ulang VS Code setelah instalasi.

Cek versi lewat Terminal VS Code (menu **Terminal > New Terminal**):

```powershell
node -v
npm -v
git --version
```

Jika `node`/`npm` tidak dikenali, pastikan Node.js ditambahkan ke PATH dan restart terminal.

## 2. Jalankan proyek dari file ZIP

1. Ekstrak `servis-hp-online.zip` ke folder yang mudah ditemukan, misalnya `Documents/servis-hp-online`.
2. Buka VS Code > **File > Open Folder** > pilih folder `servis-hp-online` yang berisi `package.json`.
3. Buka terminal di VS Code.
4. Jalankan:

```powershell
npm install
npm run dev
```

5. Buka browser: http://localhost:3000
6. Hentikan server dengan `Ctrl + C` jika selesai.

**Catatan:** `npm install` perlu internet; instalasi pertama dapat memakan waktu karena mengunduh dependensi. Jika Windows PowerShell memblokir perintah npm, coba ubah terminal VS Code menjadi **Command Prompt**, lalu ulangi.

## 3. Ubah identitas toko dan nomor WhatsApp (WAJIB)

Buka `data/site.ts`. Ganti:

```ts
export const siteConfig = {
  businessName: "Nama Toko Client",
  tagline: "Servis HP cepat dan terpercaya.",
  description: "Deskripsi toko yang sesuai kondisi asli.",
  whatsappNumber: "6281234567890", // GANTI dengan nomor ASLI admin
  address: "Alamat asli toko client",
  openingHours: "Senin–Sabtu, 09.00–18.00 WIB",
  instagramUrl: "https://instagram.com/akunclient",
  currency: "IDR",
} as const;
```

Nomor WA **harus 62 di depan, tanpa `+`, spasi, atau nol awal**:

- `081234567890` → `6281234567890`
- `+62 812-3456-7890` → `6281234567890`

Ganti pula daftar `services` dalam file yang sama: `name`, `description`, `category`, `priceFrom`, `duration`, `popular`, dan `icon`. Harga awal di proyek hanya angka contoh.

Apabila durasi dan harga belum diketahui, minta ke client lebih dahulu. **Jangan mempublikasikan harga contoh sebagai harga asli.**

### Ganti warna dan tampilan

- `app/globals.css` — warna, ukuran, tombol, kartu, responsivitas.
- `components/ServiceStore.tsx` — komponen dan fungsi interaktif.
- `app/layout.tsx` — metadata judul SEO dan deskripsi otomatis dari `siteConfig`.
- `public/favicon.svg` — ikon di tab browser.

## 4. Uji fitur sebelum upload

1. Buka http://localhost:3000.
2. Klik **Layanan**, filter misalnya **Baterai**.
3. Klik tombol **+** pada beberapa kartu layanan.
4. Scroll ke **Booking Servis**. Tambah/kurangi jumlah layanan.
5. Isi semua kolom yang wajib (ditandai `*`).
6. Tekan **Lanjut Booking via WhatsApp**.
7. Jika nomor sudah diisi, WhatsApp harus terbuka dengan draft pesan berisi data pelanggan, keluhan, layanan, dan estimasi biaya.
8. Periksa isi pesan. Pesan **belum dikirim** sampai pengguna mengirimnya sendiri di WhatsApp.
9. Cek di mode mobile (Chrome DevTools > Toggle Device Toolbar).

**Penting:** booking di sini adalah **permintaan booking**, bukan slot yang otomatis dikonfirmasi. Konfirmasi jadwal dan harga final dilakukan oleh admin melalui chat.

## 5. Periksa build produksi

Matikan `npm run dev` bila perlu, lalu jalankan:

```powershell
npm run build
```

Jika sukses, proyek siap dideploy. Opsional menguji versi produksi:

```powershell
npm run start
```

Buka kembali http://localhost:3000.

## 6. Upload ke GitHub

1. Buka https://github.com/new.
2. Repository name: `servis-hp-online` (atau nama pilihanmu).
3. Pilih **Private** jika pekerjaan client belum boleh dilihat umum, atau **Public** jika diperbolehkan.
4. **Jangan** centang "Add a README file" karena proyek sudah punya `README.md`.
5. Klik **Create repository**.
6. Masih di folder proyek, jalankan perintah berikut di terminal VS Code:

```powershell
git init
git add .
git commit -m "Website servis HP versi awal"
git branch -M main
git remote add origin https://github.com/USERNAME/servis-hp-online.git
git push -u origin main
```

Ganti `USERNAME` sesuai akun GitHub. Jika Git meminta nama/email, konfigurasikan dengan:

```powershell
git config --global user.name "Nama Kamu"
git config --global user.email "email-github@example.com"
```

Lalu ulangi `git add .`, `git commit ...`, dan `git push ...`. Saat autentikasi, ikuti popup login browser GitHub. Kata sandi akun tidak digunakan sebagai password Git HTTPS biasa.

Untuk memastikan kode sudah terupload, refresh halaman repository GitHub dan periksa apakah folder `app`, `components`, dan `data` terlihat.

## 7. Publish ke Vercel

1. Masuk ke https://vercel.com/ menggunakan akun GitHub.
2. Dari Dashboard pilih **Add New > Project** (atau **New Project**).
3. Hubungkan akun GitHub/beri izin akses repository jika diminta.
4. Di daftar repo cari `servis-hp-online`, lalu klik **Import**.
5. Pengaturan umumnya otomatis:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (jangan ubah)
   - **Build Command:** default (`next build` / `npm run build`)
   - **Install Command:** default (`npm install`)
6. Klik **Deploy**.
7. Setelah status **Ready**, klik tautan domain `*.vercel.app` yang diberikan Vercel.
8. Coba booking dari domain online dan cek di HP asli.

> **PENTING UNTUK PROJECT CLIENT / USAHA KOMERSIAL:** Paket **Vercel Hobby (gratis) hanya untuk penggunaan pribadi/non-komersial** menurut ketentuan Vercel. Untuk website usaha yang digunakan secara komersial, gunakan paket **Vercel Pro atau Enterprise** sesuai kebutuhan dan biaya yang berlaku, atau pilih penyedia hosting lain yang mengizinkan penggunaan komersial. Baca: https://vercel.com/legal/terms dan https://vercel.com/docs/limits/fair-use-guidelines.

**Catatan:** link domain baru diberikan Vercel setelah deployment berhasil. Proyek ZIP ini **belum** otomatis diupload ke akunmu.

## 8. Cara update website setelah sudah online

Edit file proyek dan simpan, kemudian:

```powershell
git add .
git commit -m "Update layanan dan harga"
git push origin main
```

Vercel yang terhubung ke repository akan otomatis membuat deployment baru dari push ke branch production. Tunggu hingga status **Ready** di dashboard dan refresh halaman online.

## 9. Error yang sering muncul

- **`npm is not recognized`:** instal Node.js, restart VS Code/terminal.
- **`npm.ps1 cannot be loaded`:** gunakan terminal **Command Prompt** alih-alih PowerShell.
- **`next is not recognized`:** jalankan `npm install` dari folder tempat `package.json` berada.
- **`Port 3000 is in use`:** Next dapat memilih port lain, misalnya `http://localhost:3001`. Baca URL di terminal.
- **`git is not recognized`:** instal Git lalu restart terminal.
- **`Author identity unknown`:** set `git config --global user.name` dan `user.email`.
- **`remote origin already exists`:** periksa `git remote -v`, lalu gunakan `git remote set-url origin URL_REPO_BENAR` bila perlu.
- **Push ditolak karena riwayat repo berbeda:** pastikan membuat repository kosong tanpa README di awal. Jangan gunakan `git push --force` secara sembarangan.
- **WhatsApp tidak berjalan:** isi nomor valid dengan format `62...` di `data/site.ts`, lalu tes ulang.
- **Vercel gagal build:** lakukan `npm run build` lokal; baca error log di tab deployment Vercel.

## 10. Struktur folder

```text
servis-hp-online/
├── app/
│   ├── globals.css         # Styling Tailwind & CSS
│   ├── layout.tsx          # Layout + metadata SEO
│   └── page.tsx            # Halaman beranda
├── components/
│   └── ServiceStore.tsx    # Katalog, keranjang, form, integrasi WhatsApp
├── data/
│   └── site.ts             # NAMA TOKO, NOMOR WA, DAFTAR SERVIS & HARGA
├── public/
│   └── favicon.svg
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

## Batasan MVP

- **Belum ada dashboard admin**, database, akun pelanggan, pembayaran online, atau pelacakan servis.
- Data form hanya ada di browser sampai user menekan tombol dan membuka WhatsApp; **pesan tidak otomatis dikirim**.
- Keranjang disimpan di browser (`localStorage`) dan bukan sinkron lintas perangkat.
- Harga dan durasi awal adalah contoh, bukan janji biaya/waktu final.
- Booking yang diajukan bukan berarti jadwal sudah disetujui admin.
- Jangan masukkan token, sandi, API key rahasia, atau data pribadi client ke repository.

Dibuat sebagai starter project yang mudah disesuaikan untuk usaha servis smartphone.
