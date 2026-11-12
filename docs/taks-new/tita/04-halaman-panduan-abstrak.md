# 04. Halaman Panduan Abstrak

**Untuk:** Tita  
**Tingkat:** Sedang  
**Branch:** `feat/halaman-panduan-abstrak`  
**Bergantung pada:** Rafif 01 (layout) sudah di-merge.

## Tujuan

Membuat halaman `/submission/abstract` yang menampilkan panduan penulisan abstrak dari database (teks + unduhan PDF template), lalu mengaktifkan menu Submisi > Panduan Abstrak.

## Setup awal

```bash
# 1. Pindah ke development dan ambil perubahan terbaru
git checkout development
git pull origin development

# 2. Buat branch baru khusus task ini
git checkout -b feat/halaman-panduan-abstrak
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

- Controller: `app/Http/Controllers/Landing/AbstractGuidelineController.php`, method `showLandingPage($year = null)`. Method lain milik Editor Landing, jangan diubah.
- Model `AbstractGuideline`, field: `year`, `content` (HTML), `pdf_file` (path di storage).
- Route: `/submission/abstract` dan `/submission/abstract/{year}`.

## File yang dibuat / diubah

Buat:

```
resources/js/Pages/Landing/Submission/AbstractGuideline.jsx
```

Ubah:

```
app/Http/Controllers/Landing/AbstractGuidelineController.php   (method showLandingPage saja)
resources/js/Components/landing/landingNav.js
```

## Langkah pengerjaan

1. Kirim `guideline` (`content`, `pdf_file`, `year`) dan `selectedYear` ke `Inertia::render('Landing/Submission/AbstractGuideline', ...)`.
2. Layout halaman: dua kolom di desktop.
   - Kiri: isi panduan (`dangerouslySetInnerHTML`). Beri gaya untuk elemen dari editor: judul, list bernomor, list titik, tebal, tabel. Contoh kelas: `[&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_h2]:text-xl [&_h2]:font-bold`.
   - Kanan: kartu kecil yang tetap terlihat saat digulir (`lg:sticky lg:top-28`) berisi tombol "Unduh template abstrak (PDF)" (hanya kalau `pdf_file` ada) dan tombol "Daftar dan kirim abstrak" ke `/register`.
3. Tambahkan pengingat singkat bahwa seminar ini **hanya meminta abstrak, tanpa makalah lengkap**.
4. Panduan kosong: "Panduan abstrak tahun ini belum tersedia."
5. Aktifkan menu Panduan Abstrak di `landingNav.js`.

## Checklist selesai

- [ ] Isi panduan dari editor tampil rapi (judul, list, tebal, tabel)
- [ ] Tombol unduh PDF hanya muncul kalau `pdf_file` ada, dan mengunduh file yang benar
- [ ] Kartu samping tetap terlihat saat digulir di desktop
- [ ] Pesan muncul saat panduan kosong
- [ ] Menu Submisi > Panduan Abstrak aktif

## Commit, push, dan Pull Request

```bash
# 1. Cek file apa saja yang berubah
git status

# 2. Tambahkan hanya file task ini
git add resources/js/Pages/Landing/Submission/AbstractGuideline.jsx
git add app/Http/Controllers/Landing/AbstractGuidelineController.php
git add resources/js/Components/landing/landingNav.js

# 3. Commit
git commit -m "feat(landing): halaman panduan abstrak"

# 4. Ambil development terbaru supaya tidak ketinggalan, selesaikan conflict kalau ada
git pull origin development

# 5. Push
git push origin feat/halaman-panduan-abstrak
```

Lalu buka GitHub dan buat **Pull Request** dari `feat/halaman-panduan-abstrak` ke `development` dengan judul **Halaman Panduan Abstrak**. Di deskripsi PR, tulis singkat apa yang dikerjakan dan lampirkan screenshot desktop serta HP.
