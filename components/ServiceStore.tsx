"use client";

import {
  ArrowRight,
  ArrowUpRight,
  BatteryCharging,
  BadgeCheck,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Cpu,
  Droplets,
  Headphones,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Plus,
  SearchCheck,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Trash2,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import { services, siteConfig, type Category, type Service } from "@/data/site";

type CartItem = { serviceId: string; quantity: number };
type BookingForm = {
  customerName: string;
  customerPhone: string;
  deviceBrand: string;
  deviceModel: string;
  description: string;
  preferredDate: string;
  preferredTime: string;
};

const initialForm: BookingForm = {
  customerName: "",
  customerPhone: "",
  deviceBrand: "",
  deviceModel: "",
  description: "",
  preferredDate: "",
  preferredTime: "",
};

const categoryOptions: ("Semua" | Category)[] = ["Semua", "Layar", "Baterai", "Hardware", "Software"];

const serviceIcon = {
  screen: Smartphone,
  battery: BatteryCharging,
  plug: Zap,
  camera: Camera,
  speaker: Headphones,
  software: Cpu,
  water: Droplets,
  diagnosis: SearchCheck,
};

function rupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function todayLocal() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function waLink(message: string) {
  const phone = siteConfig.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function BrandMark({ inverted = false }: { inverted?: boolean }) {
  return (
    <div className="inline-flex items-center gap-3">
      <div className="relative h-11 w-11 overflow-hidden rounded-2xl bg-transparent">
        <Image
          src="/logo-dokter-ponsel-jogja.png"
          alt="Logo Dokter Ponsel Jogja"
          fill
          sizes="44px"
          className="object-contain"
          priority
        />
      </div>
      <span className={`text-[21px] font-extrabold tracking-[-0.9px] ${inverted ? "text-white" : "text-slate-900"}`}>
        {siteConfig.businessName}
      </span>
    </div>
  );
}

export function ServiceStore() {
  const [category, setCategory] = useState<"Semua" | Category>("Semua");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [form, setForm] = useState<BookingForm>(initialForm);
  const [feedback, setFeedback] = useState("");
  const [minimumDate, setMinimumDate] = useState("");

  useEffect(() => {
    setMinimumDate(todayLocal());
    try {
      const saved = localStorage.getItem("dokter-ponsel-jogja-cart");
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const recovered = parsed
            .filter((entry): entry is CartItem =>
              typeof entry === "object" && entry !== null &&
              "serviceId" in entry && typeof entry.serviceId === "string" &&
              "quantity" in entry && typeof entry.quantity === "number" &&
              Number.isInteger(entry.quantity) && entry.quantity > 0 &&
              services.some((s) => s.id === entry.serviceId)
            )
            .map((entry) => ({ serviceId: entry.serviceId, quantity: Math.min(entry.quantity, 10) }));
          setCart(recovered);
        }
      }
    } catch {
      // Tetap bisa digunakan bila localStorage diblokir atau data lama rusak.
    }
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      localStorage.setItem("dokter-ponsel-jogja-cart", JSON.stringify(cart));
    } catch {
      // Booking tetap bisa digunakan tanpa penyimpanan lokal.
    }
  }, [cart, storageReady]);

  const visibleServices = useMemo(
    () => (category === "Semua" ? services : services.filter((s) => s.category === category)),
    [category]
  );
  const cartDetail = cart.flatMap((item) => {
    const service = services.find((s) => s.id === item.serviceId);
    return service ? [{ ...service, quantity: item.quantity }] : [];
  });
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const priceEstimate = cartDetail.reduce((sum, item) => sum + item.priceFrom * item.quantity, 0);

  function addService(service: Service) {
    setCart((prev) => {
      const existing = prev.find((item) => item.serviceId === service.id);
      if (existing) {
        return prev.map((item) => item.serviceId === service.id
          ? { ...item, quantity: Math.min(10, item.quantity + 1) }
          : item);
      }
      return [...prev, { serviceId: service.id, quantity: 1 }];
    });
    setFeedback(`${service.name} ditambahkan ke booking.`);
  }

  function changeQuantity(serviceId: string, change: number) {
    setCart((prev) => prev
      .map((item) => item.serviceId === serviceId
        ? { ...item, quantity: Math.max(0, Math.min(10, item.quantity + change)) }
        : item)
      .filter((item) => item.quantity > 0));
    setFeedback("");
  }

  function removeService(serviceId: string) {
    setCart((prev) => prev.filter((item) => item.serviceId !== serviceId));
    setFeedback("");
  }

  function updateForm<K extends keyof BookingForm>(key: K, value: BookingForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFeedback("");
  }

  function handleBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (cartCount === 0) {
      setFeedback("Pilih minimal satu layanan servis terlebih dahulu.");
      return;
    }
    const number = siteConfig.whatsappNumber.replace(/\D/g, "");
    if (!/^62\d{8,13}$/.test(number)) {
      setFeedback("Nomor WhatsApp toko belum diatur. Isi whatsappNumber di data/site.ts terlebih dahulu.");
      return;
    }
    if (form.preferredDate && form.preferredDate < todayLocal()) {
      setFeedback("Tanggal booking tidak boleh di masa lalu.");
      return;
    }

    const serviceLines = cartDetail.map(
      (item, index) => `${index + 1}. ${item.name} (${item.quantity}x) — mulai ${rupiah(item.priceFrom * item.quantity)}`
    ).join("\n");
    const message = [
      `Halo *${siteConfig.businessName}*, saya ingin booking servis HP.`,
      "",
      "*DATA PELANGGAN*",
      `Nama: ${form.customerName.trim()}`,
      `No. HP: ${form.customerPhone.trim()}`,
      "",
      "*DATA PERANGKAT*",
      `Merek: ${form.deviceBrand}`,
      `Tipe: ${form.deviceModel.trim()}`,
      `Keluhan: ${form.description.trim() || "Belum dijelaskan"}`,
      "",
      "*LAYANAN DIPILIH*",
      serviceLines,
      "",
      `Total harga awal (contoh): ${rupiah(priceEstimate)}`,
      `Tanggal kunjungan: ${form.preferredDate || "Fleksibel / diskusi dengan admin"}`,
      `Waktu kunjungan: ${form.preferredTime || "Fleksibel / diskusi dengan admin"}`,
      "",
      "Mohon konfirmasi ketersediaan sparepart, estimasi harga final, dan jadwal servis. Terima kasih!",
    ].join("\n");

    // Hanya membuka WhatsApp; tidak menyimpan data pelanggan di server.
    window.location.href = waLink(message);
  }

  const waReady = /^62\d{8,13}$/.test(siteConfig.whatsappNumber.replace(/\D/g, ""));

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#16233a]">
      <div className="announcement">
        <span className="announcement-dot" /> Booking servis kini lebih mudah — pilih layanan dan konsultasi lewat WhatsApp
        <Sparkles size={13} className="hidden sm:block" />
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-100/80 bg-white/95 backdrop-blur-xl">
        <div className="container-site flex h-[78px] items-center justify-between gap-5">
          <a href="#beranda" aria-label="Ke beranda" onClick={() => setMobileMenuOpen(false)}><BrandMark /></a>
          <nav aria-label="Navigasi utama" className="hidden items-center gap-9 md:flex">
            <a className="nav-link" href="#beranda">Beranda</a>
            <a className="nav-link" href="#layanan">Layanan</a>
            <a className="nav-link" href="#keunggulan">Keunggulan</a>
            <a className="nav-link" href="#kontak">Kontak</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href="#booking" className="header-cart" aria-label={`Lihat booking, ${cartCount} layanan terpilih`}>
              <ShoppingBag size={19} /><span className="header-cart-count">{cartCount}</span>
            </a>
            <a href="#booking" className="btn-primary hidden sm:inline-flex">Booking Servis <ArrowUpRight size={16} /></a>
            <button aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"} aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((current) => !current)}
              className="rounded-xl p-2 text-slate-800 md:hidden">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <nav aria-label="Navigasi mobile" className="flex flex-col gap-1 border-t border-slate-100 bg-white px-5 py-3 md:hidden">
            {[["Beranda", "#beranda"], ["Layanan", "#layanan"], ["Keunggulan", "#keunggulan"], ["Kontak", "#kontak"], ["Booking Servis", "#booking"]].map(([label, target]) => (
              <a key={target} href={target} onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-3 font-medium hover:bg-slate-50">{label}</a>
            ))}
          </nav>
        )}
      </header>

      <main>
        <section id="beranda" className="hero-section scroll-mt-24">
          <div className="container-site relative z-10 grid items-center gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:py-24">
            <div className="max-w-2xl">
              <div className="hero-eyebrow"><span className="hero-eyebrow-dot" /> SERVIS SMARTPHONE LEBIH MUDAH <Zap size={14} fill="currentColor" /></div>
              <h1 className="mt-7 text-[clamp(2.65rem,5.7vw,4.75rem)] leading-[1.08] font-extrabold tracking-[-0.065em] text-white">
                HP Bermasalah?<br /><span className="hero-gradient-text">Kami Bantu Beres.</span>
              </h1>
              <p className="mt-6 max-w-[540px] text-[16px] leading-8 text-slate-300 sm:text-[18px]">
                {siteConfig.tagline} Pilih jenis perbaikan, isi detail perangkat, lalu kirim permintaan servis tanpa ribet.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#layanan" className="btn-mint">Lihat Layanan <ArrowRight size={18} /></a>
                <a href="#booking" className="btn-ghost">Booking Sekarang <ChevronRight size={17} /></a>
              </div>
              <div className="mt-12 grid max-w-[575px] grid-cols-3 gap-4 border-t border-white/15 pt-7">
                <div className="hero-stat"><ShieldCheck size={20} /><span>Proses<br />jelas</span></div>
                <div className="hero-stat"><Clock3 size={20} /><span>Booking<br />praktis</span></div>
                <div className="hero-stat"><MessageCircle size={20} /><span>Konsultasi<br />via WhatsApp</span></div>
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="hero-orbit hero-orbit-one" />
              <div className="hero-orbit hero-orbit-two" />
              <div className="floating-tag floating-tag-top"><span className="floating-tag-icon"><BadgeCheck size={19} /></span><span><b>Konsultasi mudah</b><small>Langsung via WhatsApp</small></span></div>
              <div className="mock-phone">
                <div className="phone-camera" />
                <div className="phone-content">
                  <div className="phone-top"><div className="phone-logo"><Wrench size={17} /></div><span>dokter ponsel</span><span className="phone-menu">•••</span></div>
                  <div className="phone-banner"><span>HELLO, THERE! 👋</span><strong>Perbaiki HP-mu<br />tanpa drama.</strong><span className="phone-banner-button">Booking Servis <ArrowUpRight size={12} /></span></div>
                  <span className="phone-heading">Layanan populer</span>
                  <div className="phone-service"><div className="phone-service-icon"><Smartphone size={21} /></div><div><strong>Ganti LCD</strong><small>Layar kembali nyaman</small></div><Plus size={15} /></div>
                  <div className="phone-service"><div className="phone-service-icon"><BatteryCharging size={21} /></div><div><strong>Ganti Baterai</strong><small>HP lebih optimal</small></div><Plus size={15} /></div>
                  <div className="phone-bottom"><span>⌂</span><span>▦</span><span>♧</span><span>◉</span></div>
                </div>
              </div>
              <div className="floating-tag floating-tag-bottom"><span className="floating-tag-icon floating-tag-mint"><Check size={19} /></span><span><b>Booking terkirim?</b><small>Konfirmasi oleh admin</small></span></div>
            </div>
          </div>
        </section>

        <div className="relative z-10 container-site -mt-7">
          <div className="trust-strip">
            <div><BadgeCheck size={22} /><span>Estimasi biaya di awal</span></div>
            <div><Wrench size={22} /><span>Layanan servis lengkap</span></div>
            <div><MessageCircle size={22} /><span>Booking via WhatsApp</span></div>
          </div>
        </div>

        <section id="layanan" className="container-site scroll-mt-28 py-20 sm:py-24">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <div className="section-kicker"><span /> APA YANG BISA KAMI BANTU?</div>
              <h2 className="section-title mt-4">Layanan servis <span>untuk HP-mu.</span></h2>
              <p className="mt-3 max-w-[620px] leading-7 text-slate-500">Pilih layanan sesuai kendala perangkat. Jika belum yakin dengan kerusakannya, pilih diagnosa terlebih dahulu.</p>
            </div>
            <a href="#booking" className="text-sm font-bold text-teal-700 hover:text-teal-900">Lihat booking saya <ArrowUpRight className="inline" size={16} /></a>
          </div>

          <div className="mb-8 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Filter jenis layanan">
            {categoryOptions.map((option) => (
              <button key={option} type="button" aria-pressed={category === option}
                onClick={() => setCategory(option)} className={`category-pill ${category === option ? "category-active" : ""}`}>
                {option}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {visibleServices.map((service) => {
              const Icon = serviceIcon[service.icon];
              const alreadyInCart = cart.some((item) => item.serviceId === service.id);
              return (
                <article key={service.id} className="service-card flex min-h-[320px] flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="service-icon"><Icon size={27} strokeWidth={1.8} /></div>
                    {service.popular && <span className="popular-label"><Zap size={11} fill="currentColor" /> POPULER</span>}
                  </div>
                  <div className="mt-6 flex-1">
                    <span className="text-[11px] font-bold tracking-[0.09em] text-teal-600 uppercase">{service.category}</span>
                    <h3 className="mt-1.5 text-[19px] font-extrabold tracking-[-0.03em]">{service.name}</h3>
                    <p className="mt-3 text-[13px] leading-[1.75] text-slate-500">{service.description}</p>
                  </div>
                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <span className="text-[11px] text-slate-400">Estimasi mulai dari</span>
                    <div className="mt-1 flex items-end justify-between gap-2">
                      <strong className="text-[21px] font-extrabold tracking-[-0.04em] text-slate-900">{rupiah(service.priceFrom)}</strong>
                      <button onClick={() => addService(service)} aria-label={`Tambah ${service.name}`} title={`Tambah ${service.name}`}
                        className={`add-service ${alreadyInCart ? "add-service-active" : ""}`}>
                        {alreadyInCart ? <Check size={19} /> : <Plus size={20} />}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="mt-5 text-[12px] leading-6 text-slate-500">* Semua harga dan durasi di website contoh ini adalah <strong>data demo</strong>. Sesuaikan dengan harga toko sebelum dipublikasikan. Harga akhir tergantung tipe HP, kondisi, dan ketersediaan sparepart.</p>
        </section>

        <section id="keunggulan" className="scroll-mt-24 bg-white py-20 sm:py-24">
          <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <div className="section-kicker"><span /> KENAPA PILIH KAMI?</div>
              <h2 className="section-title mt-4">Perbaikan yang<br /><span>lebih tenang.</span></h2>
              <p className="mt-5 max-w-xl leading-8 text-slate-500">Tidak perlu bingung harus mulai dari mana. Kami bantu dari pemilihan layanan sampai konsultasi sebelum perbaikan.</p>
              <div className="mt-9 grid gap-5 sm:grid-cols-2">
                {[
                  { icon: ClipboardCheck, title: "Alur jelas", description: "Isi detail kendala agar admin mudah menindaklanjuti." },
                  { icon: ShieldCheck, title: "Harga transparan", description: "Tanyakan estimasi akhir sebelum menyetujui servis." },
                  { icon: Clock3, title: "Booking fleksibel", description: "Pilih tanggal dan waktu kunjungan yang diinginkan." },
                  { icon: Headphones, title: "Respons personal", description: "Diskusikan kendala langsung dengan admin toko." },
                ].map(({ icon: Icon, title, description }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="feature-icon shrink-0"><Icon size={20} /></div>
                    <div><h3 className="font-bold">{title}</h3><p className="mt-1 text-[13px] leading-6 text-slate-500">{description}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="steps-card">
              <div className="flex items-center justify-between gap-2"><span className="text-[12px] font-extrabold tracking-[0.17em] text-teal-500">CARA BOOKING</span><span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/65">3 LANGKAH</span></div>
              <h3 className="mt-4 text-[29px] font-extrabold tracking-[-0.05em] text-white">Sesimpel itu.</h3>
              <p className="mt-2 text-sm text-slate-300">Dari website, lanjut ngobrol dengan admin.</p>
              <div className="mt-9 grid gap-2">
                {[
                  { number: "01", title: "Pilih layanan", desc: "Tambahkan servis yang kamu butuhkan." },
                  { number: "02", title: "Isi detail HP", desc: "Ceritakan kerusakan dan jadwal yang diinginkan." },
                  { number: "03", title: "Kirim ke WhatsApp", desc: "Periksa pesan lalu kirim ke admin untuk dikonfirmasi." },
                ].map((step, index) => (
                  <div key={step.number} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.055] p-5">
                    <div className="step-number">{step.number}</div>
                    <div className="flex-1"><h4 className="font-bold text-white">{step.title}</h4><p className="mt-1 text-[13px] leading-6 text-slate-300">{step.desc}</p></div>
                    {index < 2 ? <ChevronRight size={17} className="mt-1 text-teal-300" /> : <CheckCircle2 size={20} className="mt-1 text-teal-300" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="booking" className="container-site scroll-mt-28 py-20 sm:py-24">
          <div className="mb-9">
            <div className="section-kicker"><span /> BOOKING ONLINE</div>
            <h2 className="section-title mt-4">Siap servis HP <span>sekarang?</span></h2>
            <p className="mt-3 text-slate-500">Cek layanan pilihanmu, isi data, dan lanjutkan ke WhatsApp.</p>
          </div>
          <div className="grid gap-7 lg:grid-cols-[0.86fr_1.14fr]">
            <div className="booking-panel h-fit">
              <div className="flex items-center justify-between gap-3"><h3 className="text-lg font-extrabold">Layanan terpilih</h3><span className="cart-badge">{cartCount} layanan</span></div>
              {cartDetail.length === 0 ? (
                <div className="py-14 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400"><ShoppingBag size={30} /></div>
                  <h4 className="mt-4 font-bold">Keranjang masih kosong</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Pilih layanan terlebih dahulu untuk mulai booking.</p>
                  <a href="#layanan" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-teal-700">Pilih layanan <ArrowRight size={15} /></a>
                </div>
              ) : (
                <div className="mt-5 divide-y divide-slate-100">
                  {cartDetail.map((item) => {
                    const Icon = serviceIcon[item.icon];
                    return (
                      <div className="flex gap-3 py-4 first:pt-0" key={item.id}>
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><Icon size={22} /></div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-[14px] font-bold">{item.name}</h4>
                          <p className="mt-1 text-xs text-slate-500">Mulai {rupiah(item.priceFrom)}</p>
                          <div className="mt-3 flex items-center gap-2">
                            <button className="quantity-button" type="button" onClick={() => changeQuantity(item.id, -1)} aria-label={`Kurangi ${item.name}`}><Minus size={14} /></button>
                            <span className="w-5 text-center text-sm font-bold">{item.quantity}</span>
                            <button className="quantity-button" type="button" onClick={() => changeQuantity(item.id, 1)} aria-label={`Tambah ${item.name}`}><Plus size={14} /></button>
                          </div>
                        </div>
                        <button type="button" aria-label={`Hapus ${item.name}`} onClick={() => removeService(item.id)} className="h-fit rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="mt-3 rounded-2xl bg-[#f2f7f6] px-5 py-5">
                <div className="flex items-center justify-between gap-2 text-sm text-slate-500"><span>Total estimasi mulai</span><span>{cartCount} layanan</span></div>
                <p className="mt-2 text-[28px] font-extrabold tracking-[-0.06em] text-slate-900">{rupiah(priceEstimate)}</p>
                <p className="mt-1 text-[11px] leading-5 text-slate-500">Hanya harga awal contoh, belum menjadi penawaran final dari toko.</p>
              </div>
            </div>

            <form onSubmit={handleBooking} className="booking-panel" noValidate={false}>
              <div className="mb-7 flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><ClipboardCheck size={22} /></div><div><h3 className="text-lg font-extrabold">Formulir booking</h3><p className="mt-0.5 text-[12px] text-slate-500">Data akan disiapkan sebagai pesan WhatsApp.</p></div></div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="form-label">Nama lengkap <span>*</span>
                  <input className="form-input" type="text" required minLength={2} maxLength={80} autoComplete="name" value={form.customerName} onChange={(e) => updateForm("customerName", e.target.value)} placeholder="Nama kamu" />
                </label>
                <label className="form-label">Nomor HP / WhatsApp <span>*</span>
                  <input className="form-input" type="tel" required inputMode="tel" minLength={9} maxLength={20} autoComplete="tel" value={form.customerPhone} onChange={(e) => updateForm("customerPhone", e.target.value)} placeholder="08xxxxxxxxxx" />
                </label>
                <label className="form-label">Merek HP <span>*</span>
                  <select className="form-input" required value={form.deviceBrand} onChange={(e) => updateForm("deviceBrand", e.target.value)}>
                    <option value="">Pilih merek</option>
                    {["Samsung", "iPhone", "Xiaomi / Redmi / POCO", "OPPO", "vivo", "realme", "Infinix", "TECNO", "ASUS", "Lainnya"].map((brand) => <option key={brand}>{brand}</option>)}
                  </select>
                </label>
                <label className="form-label">Tipe HP <span>*</span>
                  <input className="form-input" type="text" required maxLength={80} value={form.deviceModel} onChange={(e) => updateForm("deviceModel", e.target.value)} placeholder="Contoh: Redmi Note 12" />
                </label>
                <label className="form-label">Tanggal kunjungan
                  <input className="form-input" type="date" min={minimumDate || undefined} value={form.preferredDate} onChange={(e) => updateForm("preferredDate", e.target.value)} />
                </label>
                <label className="form-label">Waktu kunjungan
                  <select className="form-input" value={form.preferredTime} onChange={(e) => updateForm("preferredTime", e.target.value)}>
                    <option value="">Fleksibel</option>
                    {["09.00", "10.00", "11.00", "12.00", "13.00", "14.00", "15.00", "16.00", "17.00"].map((time) => <option key={time} value={`${time} WIB`}>{time} WIB</option>)}
                  </select>
                </label>
                <label className="form-label sm:col-span-2">Jelaskan keluhan HP
                  <textarea className="form-input min-h-[110px] resize-y" maxLength={600} rows={4} value={form.description} onChange={(e) => updateForm("description", e.target.value)} placeholder="Contoh: LCD retak setelah jatuh, layar masih menyala..." />
                </label>
              </div>
              {feedback && <p role="status" aria-live="polite" className={`mt-5 rounded-xl px-4 py-3 text-[13px] ${feedback.includes("ditambahkan") ? "bg-teal-50 text-teal-800" : "bg-amber-50 text-amber-900"}`}>{feedback}</p>}
              {!waReady && <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] leading-6 text-amber-900"><strong>Mode demo:</strong> nomor WhatsApp admin belum diisi. Ubah <code>whatsappNumber</code> dalam file <code>data/site.ts</code> agar tombol booking dapat digunakan.</div>}
              <button type="submit" className="submit-button mt-6"><MessageCircle size={20} /> Lanjut Booking via WhatsApp <ArrowUpRight size={17} /></button>
              <p className="mt-4 text-center text-[11px] leading-5 text-slate-400">Dengan melanjutkan, WhatsApp akan terbuka dengan pesan yang telah disiapkan. Pesan baru terkirim setelah kamu menekan <strong>Kirim</strong> di WhatsApp.</p>
            </form>
          </div>
        </section>

        <section id="kontak" className="footer-section scroll-mt-24">
          <div className="container-site grid gap-12 py-14 md:grid-cols-[1.25fr_1fr_1fr]">
            <div><BrandMark inverted /><p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">{siteConfig.description}</p><div className="mt-5 flex gap-3">{siteConfig.instagramUrl && <a className="social-circle" href={siteConfig.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a>}</div></div>
            <div><h3 className="text-sm font-bold text-white">Navigasi</h3><div className="mt-5 flex flex-col gap-3 text-sm text-slate-400"><a href="#beranda">Beranda</a><a href="#layanan">Daftar layanan</a><a href="#keunggulan">Cara booking</a><a href="#booking">Booking servis</a></div></div>
            <div><h3 className="text-sm font-bold text-white">Informasi toko</h3><div className="mt-5 flex flex-col gap-4 text-sm leading-6 text-slate-400"><p className="flex items-start gap-3"><MapPin size={18} className="mt-1 shrink-0 text-teal-300" />{siteConfig.address}</p><p className="flex items-start gap-3"><Clock3 size={18} className="mt-1 shrink-0 text-teal-300" />{siteConfig.openingHours}</p></div></div>
          </div>
          <div className="border-t border-white/10"><div className="container-site flex flex-wrap justify-between gap-3 py-6 text-xs text-slate-500"><p>© {new Date().getFullYear()} {siteConfig.businessName}. All rights reserved.</p><p>Dibuat untuk mempermudah booking servis HP.</p></div></div>
        </section>
      </main>

      {cartCount > 0 && <a className="mobile-cart-bar lg:hidden" href="#booking" aria-label={`Lihat ${cartCount} layanan di booking`}><span><ShoppingBag size={19} /> {cartCount} layanan dipilih</span><strong>Lanjut booking <ArrowRight size={16} /></strong></a>}
    </div>
  );
}
