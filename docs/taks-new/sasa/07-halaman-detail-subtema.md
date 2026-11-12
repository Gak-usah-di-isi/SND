# 07. Halaman Detail Subtema

**Untuk:** Sasa  
**Tingkat:** Sulit  
**Branch:** `feat/halaman-detail-subtema`  
**Bergantung pada:** Rafif 01 (layout) dan Sasa 03 (Call for Abstract) sudah di-merge.

## Tujuan

Mengganti halaman Blade `/themes/{id}` menjadi React: judul dan deskripsi lengkap satu subtema, ditambah navigasi ke subtema lain di tahun yang sama.

## Setup awal

```bash
# 1. Pindah ke development dan ambil perubahan terbaru
git checkout development
git pull origin development

# 2. Buat branch baru khusus task ini
git checkout -b feat/halaman-detail-subtema
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

- Controller: `app/Http/Controllers/LandingPageController.php`, method `showTheme($id)`. (Controller ini juga dipakai beranda, jadi **ubah method `showTheme` saja**.)
- Model `Theme`: `id`, `title`, `description` (HTML), `year`.
- Route: `/themes/{id}` (nama `themes.show`).

## File yang dibuat / diubah

Buat:

```
resources/js/Pages/Landing/ThemeDetail.jsx
```

Ubah:

```
app/Http/Controllers/LandingPageController.php   (method showTheme saja)
```

Tidak ada menu navbar untuk halaman ini (`current` boleh `"Beranda"` atau dikosongkan).

## Langkah pengerjaan

1. Kirim `theme` (`id`, `title`, `description`, `year`) dan `otherThemes` (subtema lain di tahun yang sama, tanpa yang sedang dibuka) ke `Inertia::render('Landing/ThemeDetail', ...)`.
2. Tampilkan:
   - link "Kembali ke beranda" yang menuju `/#call-for-abstract`
   - nomor urut subtema (posisinya di antara semua subtema tahun itu) dan judul
   - deskripsi HTML (`dangerouslySetInnerHTML`) dengan jarak paragraf yang rapi
   - tombol "Daftar dan kirim abstrak" ke `/register`
   - daftar "Subtema lain" berupa kartu yang bisa diklik
3. `<Head title>` berisi judul subtema.
4. Id yang tidak ada harus menampilkan 404 (sudah ditangani `findOrFail`, pastikan tetap begitu).

## Checklist selesai

- [ ] Klik subtema di beranda membuka halaman React yang baru
- [ ] Deskripsi HTML tampil rapi
- [ ] "Subtema lain" tidak memuat subtema yang sedang dibuka
- [ ] Id yang tidak ada menghasilkan 404
- [ ] Judul tab berisi nama subtema
- [ ] Rapi di HP 390px

## Commit, push, dan Pull Request

```bash
# 1. Cek file apa saja yang berubah
git status

# 2. Tambahkan hanya file task ini
git add resources/js/Pages/Landing/ThemeDetail.jsx
git add app/Http/Controllers/LandingPageController.php

# 3. Commit
git commit -m "feat(landing): halaman detail subtema"

# 4. Ambil development terbaru supaya tidak ketinggalan, selesaikan conflict kalau ada
git pull origin development

# 5. Push
git push origin feat/halaman-detail-subtema
```

Lalu buka GitHub dan buat **Pull Request** dari `feat/halaman-detail-subtema` ke `development` dengan judul **Halaman Detail Subtema**. Di deskripsi PR, tulis singkat apa yang dikerjakan dan lampirkan screenshot desktop serta HP.
