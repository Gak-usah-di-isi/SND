# 05. Halaman Panduan Presentasi

**Untuk:** Tita  
**Tingkat:** Sedang  
**Branch:** `feat/halaman-panduan-presentasi`  
**Bergantung pada:** Rafif 01 (layout) sudah di-merge. Kerjakan setelah task 04 (polanya hampir sama).

## Tujuan

Membuat halaman `/submission/presentation` yang menampilkan panduan presentasi dari database, lalu mengaktifkan menu Submisi > Panduan Presentasi.

## Setup awal

```bash
# 1. Pindah ke development dan ambil perubahan terbaru
git checkout development
git pull origin development

# 2. Buat branch baru khusus task ini
git checkout -b feat/halaman-panduan-presentasi
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

- Controller: `app/Http/Controllers/Landing/PresentationGuidelineController.php`, method `showLandingPage($year = null)`.
- Model `PresentationGuideline`, field: `year`, `content` (HTML), `pdf_file`.
- Route: `/submission/presentation` dan `/submission/presentation/{year}`.

## Hal yang perlu diperhatikan

Halaman ini hampir sama dengan Panduan Abstrak (task 04). Supaya tidak menulis kode dua kali, **pindahkan bagian yang sama ke satu komponen** lalu pakai di dua halaman:

```
resources/js/Components/landing/GuidelineContent.jsx
```

Props-nya misalnya: `content`, `pdfUrl`, `pdfLabel`, `emptyText`, dan `aside` (isi tambahan kartu samping). Setelah itu, ubah halaman Panduan Abstrak supaya ikut memakai komponen ini. Tampilannya tidak boleh berubah.

## File yang dibuat / diubah

Buat:

```
resources/js/Components/landing/GuidelineContent.jsx
resources/js/Pages/Landing/Submission/PresentationGuideline.jsx
```

Ubah:

```
resources/js/Pages/Landing/Submission/AbstractGuideline.jsx   (pakai GuidelineContent)
app/Http/Controllers/Landing/PresentationGuidelineController.php   (method showLandingPage saja)
resources/js/Components/landing/landingNav.js
```

## Langkah pengerjaan

1. Render `Landing/Submission/PresentationGuideline` dengan data `guideline` dan `selectedYear`.
2. Buat `GuidelineContent.jsx`, lalu pindahkan isi Panduan Abstrak ke sana.
3. Halaman presentasi: tombol unduh "Unduh template presentasi (PDF)". Kartu samping berisi tombol "Masuk ke dasbor" (`/login`), karena presenter mengunggah materi dari dasbor.
4. Aktifkan menu Panduan Presentasi.

## Checklist selesai

- [ ] Halaman panduan presentasi tampil dari database
- [ ] Panduan Abstrak dan Panduan Presentasi memakai `GuidelineContent` yang sama
- [ ] Tampilan Panduan Abstrak tidak berubah
- [ ] Menu Submisi > Panduan Presentasi aktif
- [ ] Rapi di HP 390px

## Commit, push, dan Pull Request

```bash
# 1. Cek file apa saja yang berubah
git status

# 2. Tambahkan hanya file task ini
git add resources/js/Components/landing/GuidelineContent.jsx
git add resources/js/Pages/Landing/Submission/PresentationGuideline.jsx
git add resources/js/Pages/Landing/Submission/AbstractGuideline.jsx
git add app/Http/Controllers/Landing/PresentationGuidelineController.php
git add resources/js/Components/landing/landingNav.js

# 3. Commit
git commit -m "feat(landing): halaman panduan presentasi dan komponen panduan bersama"

# 4. Ambil development terbaru supaya tidak ketinggalan, selesaikan conflict kalau ada
git pull origin development

# 5. Push
git push origin feat/halaman-panduan-presentasi
```

Lalu buka GitHub dan buat **Pull Request** dari `feat/halaman-panduan-presentasi` ke `development` dengan judul **Halaman Panduan Presentasi**. Di deskripsi PR, tulis singkat apa yang dikerjakan dan lampirkan screenshot desktop serta HP.
