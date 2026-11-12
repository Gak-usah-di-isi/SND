# 07. Halaman Galeri

**Untuk:** Rafif  
**Tingkat:** Sulit  
**Branch:** `feat/halaman-galeri`  
**Bergantung pada:** Rafif 01 (layout) sudah di-merge.

## Tujuan

Membuat halaman `/gallery` yang menampilkan foto kegiatan per tahun, dengan pilihan tahun dan tampilan foto besar saat diklik.

## Setup awal

```bash
# 1. Pindah ke development dan ambil perubahan terbaru
git checkout development
git pull origin development

# 2. Buat branch baru khusus task ini
git checkout -b feat/halaman-galeri
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

- Controller: `app/Http/Controllers/Landing/GalleryController.php`, method `showLandingPage($year = null)`. Method lain dipakai Editor Landing, jangan diubah.
- Model `Gallery` (`year`) punya banyak `GalleryImage` (`gallery_id`, `image_path`) lewat relasi `images()`.
- Route: `/gallery` dan `/gallery/{year}`.

Query sekarang mengambil **semua** gambar semua tahun. Perbaiki supaya hanya mengambil tahun terpilih:

```php
$years = Gallery::orderByDesc('year')->distinct()->pluck('year');
$selectedYear = $year ?? $years->first();
$images = GalleryImage::whereHas('gallery', fn ($q) => $q->where('year', $selectedYear))
    ->get(['id', 'image_path']);
```

## File yang dibuat / diubah

Buat:

```
resources/js/Pages/Landing/Gallery.jsx
```

Ubah:

```
app/Http/Controllers/Landing/GalleryController.php   (method showLandingPage saja)
resources/js/Components/landing/landingNav.js
```

## Langkah pengerjaan

1. Kirim `years`, `selectedYear`, dan `images` ke `Inertia::render('Landing/Gallery', ...)`.
2. Pilihan tahun: deretan tombol tahun. Tahun terpilih memakai `Button variant="default"`, sisanya `variant="outline"`. Klik tahun = pindah ke `/gallery/{tahun}` (pakai `<Link>` dari `@inertiajs/react` agar tidak reload penuh).
3. Grid foto: 2 kolom di HP, 3 di tablet, 4 di desktop. Gambar `loading="lazy"` dengan `aspect-square object-cover rounded-2xl`.
4. Klik foto membuka tampilan besar. Pakai `Dialog` dari `@radix-ui/react-dialog` (sudah terpasang; contoh pemakaiannya ada di `Components/landing/ui/sheet.jsx`). Harus bisa ditutup dengan Escape dan tombol tutup. Kalau mau, tambahkan tombol sebelumnya/berikutnya.
5. Setiap foto diberi `alt` yang jelas, misalnya "Dokumentasi Seminar DAMPAK 2025, foto 3".
6. Tahun tanpa foto: "Galeri tahun ini belum tersedia."
7. Aktifkan menu Galeri.

## Checklist selesai

- [ ] Hanya foto tahun terpilih yang diambil dari database
- [ ] Pindah tahun berfungsi tanpa reload penuh
- [ ] Foto besar bisa dibuka dan ditutup (klik, Escape)
- [ ] Semua foto punya `alt`
- [ ] Grid rapi di HP, tablet, dan desktop
- [ ] Halaman Editor Landing > Gallery tetap berfungsi

## Commit, push, dan Pull Request

```bash
# 1. Cek file apa saja yang berubah
git status

# 2. Tambahkan hanya file task ini
git add resources/js/Pages/Landing/Gallery.jsx
git add app/Http/Controllers/Landing/GalleryController.php
git add resources/js/Components/landing/landingNav.js

# 3. Commit
git commit -m "feat(landing): halaman galeri"

# 4. Ambil development terbaru supaya tidak ketinggalan, selesaikan conflict kalau ada
git pull origin development

# 5. Push
git push origin feat/halaman-galeri
```

Lalu buka GitHub dan buat **Pull Request** dari `feat/halaman-galeri` ke `development` dengan judul **Halaman Galeri**. Di deskripsi PR, tulis singkat apa yang dikerjakan dan lampirkan screenshot desktop serta HP.
