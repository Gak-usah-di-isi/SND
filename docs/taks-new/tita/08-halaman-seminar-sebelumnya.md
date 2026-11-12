# 08. Halaman Seminar Sebelumnya

**Untuk:** Tita  
**Tingkat:** Paling sulit  
**Branch:** `feat/halaman-seminar-sebelumnya`  
**Bergantung pada:** Rafif 01 (layout) sudah di-merge.

## Tujuan

Membuat halaman `/previous-conference` yang menampilkan edisi-edisi Seminar DAMPAK sebelumnya (gambar, judul, tanggal, lokasi, pembicara utama, deskripsi, unduhan), lalu mengaktifkan menu Seminar Sebelumnya.

## Setup awal

```bash
# 1. Pindah ke development dan ambil perubahan terbaru
git checkout development
git pull origin development

# 2. Buat branch baru khusus task ini
git checkout -b feat/halaman-seminar-sebelumnya
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

- Controller: `app/Http/Controllers/PreviousConferences.php`, method `index()`. **Jangan ubah `downloadAllPdf`.**
- Model `Prevconference` (Editor Landing > Prev Conference), field: `id`, `image`, `title`, `description`, `keynote`, `date`, `location`, `pdf`, `year`.
- Unduh semua abstrak satu tahun: route `GET /abstract-download-all-pdf?year={tahun}` (nama `downloadAllPdf`).

## Hal yang perlu diperhatikan

- Method `index()` sekarang mengambil banyak data yang **tidak dipakai** (semua `Venue`, `Speaker`, `ConferenceDetail`, `Poster`, `AbstractModel`). Data itu berat dan ikut terkirim ke browser. Bersihkan: cukup kirim `prevconferences` (urut tahun terbaru) dan `years`.
- `description` dan `keynote` bisa panjang. Tampilkan ringkas dulu (3 baris, `line-clamp-3`) dengan tombol "Baca selengkapnya" yang membuka isi lengkap. Tombol harus `<button>` dengan `aria-expanded`.
- `pdf` adalah file (misalnya Book of Abstracts edisi itu). Tombolnya "Unduh Book of Abstracts".
- Tombol "Unduh semua abstrak" memakai route `downloadAllPdf`. Proses ini bisa lama, jadi beri teks pengingat di dekat tombol.

## File yang dibuat / diubah

Buat:

```
resources/js/Pages/Landing/PreviousConference.jsx
```

Ubah:

```
app/Http/Controllers/PreviousConferences.php   (method index saja)
resources/js/Components/landing/landingNav.js
```

## Langkah pengerjaan

1. Bersihkan `index()` dan render `Landing/PreviousConference` dengan `LandingLayoutData::props()`.
2. Tampilkan tiap edisi sebagai blok besar bergantian (gambar kiri-teks kanan, lalu sebaliknya) atau sebagai jalur waktu per tahun. Pilih salah satu dan jelaskan alasannya di PR.
3. Tiap edisi: tahun (besar), judul, tanggal dan lokasi, pembicara utama, deskripsi ringkas plus "Baca selengkapnya", tombol unduhan.
4. Gambar `loading="lazy"` dengan `alt` berisi judul edisi.
5. Belum ada data: "Arsip seminar sebelumnya belum tersedia."
6. Aktifkan menu Seminar Sebelumnya.

## Checklist selesai

- [ ] Controller hanya mengirim data yang dipakai (cek tab Network, ukuran respons kecil)
- [ ] Tiap edisi tampil lengkap dengan gambar, tanggal, lokasi, pembicara
- [ ] "Baca selengkapnya" bisa dibuka dan ditutup dengan keyboard
- [ ] Tombol unduh Book of Abstracts dan unduh semua abstrak berfungsi
- [ ] Pesan muncul saat data kosong
- [ ] Rapi di HP 390px

## Commit, push, dan Pull Request

```bash
# 1. Cek file apa saja yang berubah
git status

# 2. Tambahkan hanya file task ini
git add resources/js/Pages/Landing/PreviousConference.jsx
git add app/Http/Controllers/PreviousConferences.php
git add resources/js/Components/landing/landingNav.js

# 3. Commit
git commit -m "feat(landing): halaman seminar sebelumnya"

# 4. Ambil development terbaru supaya tidak ketinggalan, selesaikan conflict kalau ada
git pull origin development

# 5. Push
git push origin feat/halaman-seminar-sebelumnya
```

Lalu buka GitHub dan buat **Pull Request** dari `feat/halaman-seminar-sebelumnya` ke `development` dengan judul **Halaman Seminar Sebelumnya**. Di deskripsi PR, tulis singkat apa yang dikerjakan dan lampirkan screenshot desktop serta HP.
