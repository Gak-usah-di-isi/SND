# 06. Halaman Kontak dan form pesan

**Untuk:** Tita  
**Tingkat:** Sedang-Sulit  
**Branch:** `feat/halaman-kontak`  
**Bergantung pada:** Rafif 01 (layout) dan Tita 01 (beranda Kontak) sudah di-merge.

## Tujuan

Membuat halaman `/contact` dengan info kontak dan **form pesan yang dikirim lewat server** (bukan membuka aplikasi email pengunjung), lalu memakai form yang sama di section Kontak beranda.

## Setup awal

```bash
# 1. Pindah ke development dan ambil perubahan terbaru
git checkout development
git pull origin development

# 2. Buat branch baru khusus task ini
git checkout -b feat/halaman-kontak
```

### Pola halaman landing (sama untuk semua halaman)

1. Controller: ganti `return view('landingpage....')` menjadi `return Inertia::render('Landing/NamaHalaman', [...])`, lalu gabungkan data layout lewat `LandingLayoutData::props()` (dibuat di task Rafif 01). Tambahkan `use Inertia\Inertia;` dan `use App\Support\LandingLayoutData;` di bagian atas controller.
2. Halaman React baru di `resources/js/Pages/Landing/`, dibungkus `LandingLayout`:

```jsx
import LandingLayout from '../../Components/landing/LandingLayout';
import { SectionHeading, Mark, EmptyNote } from '../../Components/landing/sections/SectionParts';
import { container, section } from '../../Components/landing/landingStyles';

export default function NamaHalaman({ layout, ...data }) {
    return (
        <LandingLayout layout={layout} title="Judul Tab" current="Label Menu">
            <section className={section}>
                <div className={container}>
                    <SectionHeading id="judul">Judul <Mark>halaman</Mark></SectionHeading>
                    {/* isi halaman */}
                </div>
            </section>
        </LandingLayout>
    );
}
```

   Contoh di atas untuk file langsung di `Pages/Landing/`. Kalau file ada di subfolder (misalnya `Pages/Landing/Committee/Steering.jsx`), tambah satu tingkat: `'../../../Components/landing/...'`.

3. Aktifkan menunya di `resources/js/Components/landing/landingNav.js`: tambahkan path di `buildRoutes` lalu ganti `{ label: '...', disabled: true }` menjadi `{ label: '...', href: r.namaRute }`.
4. File Blade lama di `resources/views/landingpage/...` **jangan dihapus dulu**. Penghapusan dilakukan di task finalisasi supaya PR tetap kecil.

## Data yang dipakai

- Controller: `app/Http/Controllers/Landing/ContactController.php`
  - `showLandingpage()`: halaman kontak
  - `sendEmail(Request $request)`: menerima form (route `POST /contact/send`, nama `contact.send`)
- Model `Contact`: `phone1`, `phone1_name`, `phone2`, `phone2_name`, `email`, `address`, `year`.

## Masalah di backend yang harus diperbaiki

1. **`showLandingpage` memakai model `Year`**, sedangkan halaman landing lain memakai `LandingSetting`. Samakan dengan `LandingSetting::where('is_active', true)->value('year')`. Jangan `return back()` saat tahun aktif tidak ada; tampilkan halaman dengan data kosong.
2. **Penerima email di-hardcode `admin@example.com`.** Ganti menjadi email dari Contact tahun aktif, dengan fallback `config('mail.from.address')`.
3. **Flash tidak sampai ke React.** Project ini membagikan flash lewat key `type` dan `message` (lihat `app/Http/Middleware/HandleInertiaRequests.php`). Ganti `->with('success', '...')` menjadi:

```php
return back()->with(['type' => 'success', 'message' => 'Pesan Anda sudah terkirim. Panitia akan membalas lewat email.']);
```

4. Tambahkan field `subject` (Perihal) di validasi, karena form landing punya field Perihal. Tampilkan juga di template `resources/views/emails/contact.blade.php` kalau perlu.

## Form di React

Pakai `useForm` dari `@inertiajs/react`:

```jsx
const form = useForm({ name: '', email: '', subject: '', message: '' });

const submit = (e) => {
    e.preventDefault();
    form.post('/contact/send', { preserveScroll: true, onSuccess: () => form.reset() });
};
```

- Tombol kirim disabled dan bertuliskan "Mengirim..." saat `form.processing`.
- Error validasi (`form.errors.email`, dan lainnya) tampil merah di bawah field masing-masing.
- Pesan sukses diambil dari `usePage().props.flash.message` dan tampil di bawah tombol.

## File yang dibuat / diubah

Buat:

```
resources/js/Components/landing/ContactForm.jsx
resources/js/Pages/Landing/Contact.jsx
```

Ubah:

```
app/Http/Controllers/Landing/ContactController.php   (showLandingpage dan sendEmail saja)
resources/js/Components/landing/sections/ContactSection.jsx   (ganti form mailto dengan ContactForm)
resources/views/emails/contact.blade.php             (kalau menambah subject)
```

Menu Kontak sudah aktif, tidak perlu mengubah `landingNav.js`.

## Langkah pengerjaan

1. Perbaiki backend sesuai daftar di atas.
2. Buat `ContactForm.jsx` dengan `useForm`, lalu pakai di halaman Kontak dan di section Kontak beranda. Hapus form `mailto` lama dari `ContactSection.jsx`.
3. Halaman `/contact`: info kontak (bisa memakai ulang tampilan dari `ContactSection`) dan form, ditambah embed peta Venue tahun aktif kalau ada.
4. **Testing tanpa mengirim email sungguhan:** pastikan `.env` memakai `MAIL_MAILER=log`. Email yang "terkirim" tercatat di `storage/logs/laravel.log`.

## Checklist selesai

- [ ] Halaman `/contact` tampil dengan info kontak tahun aktif
- [ ] Form mengirim ke `POST /contact/send` tanpa membuka aplikasi email
- [ ] Error validasi tampil per field
- [ ] Pesan sukses tampil setelah kirim dan form dikosongkan
- [ ] Email tercatat di `laravel.log` dengan penerima email Contact tahun aktif
- [ ] Form di beranda memakai `ContactForm` yang sama
- [ ] Halaman tidak error saat tahun aktif belum diatur

## Commit, push, dan Pull Request

```bash
# 1. Cek file apa saja yang berubah
git status

# 2. Tambahkan hanya file task ini
git add resources/js/Components/landing/ContactForm.jsx
git add resources/js/Pages/Landing/Contact.jsx
git add app/Http/Controllers/Landing/ContactController.php
git add resources/js/Components/landing/sections/ContactSection.jsx
git add resources/views/emails/contact.blade.php

# 3. Commit
git commit -m "feat(landing): halaman kontak dan form pesan lewat server"

# 4. Ambil development terbaru supaya tidak ketinggalan, selesaikan conflict kalau ada
git pull origin development

# 5. Push
git push origin feat/halaman-kontak
```

Lalu buka GitHub dan buat **Pull Request** dari `feat/halaman-kontak` ke `development` dengan judul **Halaman Kontak dan form pesan**. Di deskripsi PR, tulis singkat apa yang dikerjakan dan lampirkan screenshot desktop serta HP.
