# 06. Halaman FAQ

**Untuk:** Sasa  
**Tingkat:** Sedang-Sulit  
**Branch:** `feat/halaman-faq`  
**Bergantung pada:** Rafif 01 (layout) sudah di-merge. Lebih mudah setelah task 02 (beranda FAQ).

## Tujuan

Membuat halaman `/faq` yang menampilkan **semua** FAQ dari database dengan pencarian, lalu mengaktifkan menu FAQ.

## Setup awal

```bash
# 1. Pindah ke development dan ambil perubahan terbaru
git checkout development
git pull origin development

# 2. Buat branch baru khusus task ini
git checkout -b feat/halaman-faq
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

- Controller: `app/Http/Controllers/FaqLandingController.php`, method `index()`. Sekarang memakai `Faq::all()`.
- Model `Faq`: `id`, `title`, `description` (HTML).
- Route: `/faq`.

## File yang dibuat / diubah

Buat:

```
resources/js/Pages/Landing/Faq.jsx
```

Ubah:

```
app/Http/Controllers/FaqLandingController.php
resources/js/Components/landing/landingNav.js
```

## Langkah pengerjaan

1. Kirim `faqs` (`id`, `title`, `description`, urut terbaru) ke `Inertia::render('Landing/Faq', ...)`.
2. Pakai `Accordion` dari `Components/landing/ui/accordion` (contoh pemakaian ada di `sections/FaqSection.jsx`).
3. Tambahkan pencarian di atas daftar: filter berdasarkan pertanyaan dan jawaban. Jawaban berupa HTML, jadi buang tag-nya dulu sebelum dicocokkan (`description.replace(/<[^>]+>/g, '')`).
4. Pencarian tanpa hasil: "Tidak ada pertanyaan yang cocok. Hubungi panitia lewat halaman Kontak." dengan link ke `/contact`.
5. Di bawah daftar, tambahkan ajakan singkat ke halaman Kontak untuk pertanyaan lain.
6. Aktifkan menu FAQ di `landingNav.js`.

## Checklist selesai

- [ ] Semua FAQ tampil sebagai accordion
- [ ] Pencarian memfilter pertanyaan dan jawaban
- [ ] Pesan dan link ke Kontak muncul saat pencarian kosong
- [ ] Accordion bisa dipakai dengan keyboard
- [ ] Menu FAQ aktif dan rapi di HP 390px

## Commit, push, dan Pull Request

```bash
# 1. Cek file apa saja yang berubah
git status

# 2. Tambahkan hanya file task ini
git add resources/js/Pages/Landing/Faq.jsx
git add app/Http/Controllers/FaqLandingController.php
git add resources/js/Components/landing/landingNav.js

# 3. Commit
git commit -m "feat(landing): halaman faq"

# 4. Ambil development terbaru supaya tidak ketinggalan, selesaikan conflict kalau ada
git pull origin development

# 5. Push
git push origin feat/halaman-faq
```

Lalu buka GitHub dan buat **Pull Request** dari `feat/halaman-faq` ke `development` dengan judul **Halaman FAQ**. Di deskripsi PR, tulis singkat apa yang dikerjakan dan lampirkan screenshot desktop serta HP.
