# 05. Halaman Panitia Pelaksana

**Untuk:** Sasa  
**Tingkat:** Sedang  
**Branch:** `feat/halaman-panitia-pelaksana`  
**Bergantung pada:** Rafif 01 (layout) sudah di-merge.

## Tujuan

Membuat halaman `/committee/organizing` yang menampilkan Panitia Pelaksana dari database, dikelompokkan per kategori (misalnya Ketua, Sekretaris, Bendahara), lalu mengaktifkan menunya.

## Setup awal

```bash
# 1. Pindah ke development dan ambil perubahan terbaru
git checkout development
git pull origin development

# 2. Buat branch baru khusus task ini
git checkout -b feat/halaman-panitia-pelaksana
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

- Controller: `app/Http/Controllers/Landing/OrganizingCommitteeController.php`, method `showLandingPage($year = null)`. Method lain milik Editor Landing, jangan diubah.
- Model `OrganizingCommittee`, field: `name`, `category`, `year`.
- Route: `/committee/organizing` dan `/committee/organizing/{year}`.

## File yang dibuat / diubah

Buat:

```
resources/js/Pages/Landing/Committee/Organizing.jsx
```

Ubah:

```
app/Http/Controllers/Landing/OrganizingCommitteeController.php   (method showLandingPage saja)
resources/js/Components/landing/landingNav.js
```

## Langkah pengerjaan

1. Kirim data anggota (`id`, `name`, `category`) dan `selectedYear` ke `Inertia::render('Landing/Committee/Organizing', ...)` dengan `LandingLayoutData::props()`.
2. Kelompokkan per `category` di React. Urutan kategori mengikuti urutan pertama kali muncul di data. Contoh:

```js
const groups = members.reduce((acc, m) => {
    (acc[m.category] ??= []).push(m);
    return acc;
}, {});
```

3. Tiap kategori jadi satu blok: judul kategori (`h3`) lalu daftar nama. Kategori dengan satu orang (misalnya Ketua) boleh tampil lebih menonjol.
4. Anggota tanpa kategori masuk ke kelompok "Anggota".
5. Data kosong: "Susunan Panitia Pelaksana tahun ini belum tersedia."
6. Aktifkan menu Panitia Pelaksana di `landingNav.js`.

## Checklist selesai

- [ ] Anggota tampil dikelompokkan per kategori
- [ ] Anggota tanpa kategori masuk kelompok "Anggota"
- [ ] `/committee/organizing/{tahun}` menampilkan tahun yang dipilih
- [ ] Pesan muncul saat data kosong
- [ ] Menu aktif dan rapi di HP 390px

## Commit, push, dan Pull Request

```bash
# 1. Cek file apa saja yang berubah
git status

# 2. Tambahkan hanya file task ini
git add resources/js/Pages/Landing/Committee/Organizing.jsx
git add app/Http/Controllers/Landing/OrganizingCommitteeController.php
git add resources/js/Components/landing/landingNav.js

# 3. Commit
git commit -m "feat(landing): halaman panitia pelaksana"

# 4. Ambil development terbaru supaya tidak ketinggalan, selesaikan conflict kalau ada
git pull origin development

# 5. Push
git push origin feat/halaman-panitia-pelaksana
```

Lalu buka GitHub dan buat **Pull Request** dari `feat/halaman-panitia-pelaksana` ke `development` dengan judul **Halaman Panitia Pelaksana**. Di deskripsi PR, tulis singkat apa yang dikerjakan dan lampirkan screenshot desktop serta HP.
