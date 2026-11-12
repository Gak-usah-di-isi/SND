# 05. Halaman Komite Pengarah

**Untuk:** Rafif  
**Tingkat:** Sedang  
**Branch:** `feat/halaman-komite-pengarah`  
**Bergantung pada:** Rafif 01 (layout) sudah di-merge.

## Tujuan

Membuat halaman `/committee/steering` dengan React (Inertia) yang menampilkan daftar Komite Pengarah dari database, lalu mengaktifkan menu Komite > Komite Pengarah.

## Setup awal

```bash
# 1. Pindah ke development dan ambil perubahan terbaru
git checkout development
git pull origin development

# 2. Buat branch baru khusus task ini
git checkout -b feat/halaman-komite-pengarah
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

- Controller: `app/Http/Controllers/SteeringLandingPageController.php`, method `index($year = null)`. Query-nya sudah ada, tinggal ganti `return view(...)`.
- Model `SteeringCommittee`, field: `name`, `institution`, `country`, `year`.
- Route: `/committee/steering` dan `/committee/steering/{year}` (sudah ada, nama `committee.steering`).

## File yang dibuat / diubah

Buat:

```
resources/js/Pages/Landing/Committee/Steering.jsx
```

Ubah:

```
app/Http/Controllers/SteeringLandingPageController.php
resources/js/Components/landing/landingNav.js
```

## Langkah pengerjaan

1. Di controller, ganti `return view('landingpage.committee.steering', ...)` menjadi:

```php
return Inertia::render('Landing/Committee/Steering', array_merge(LandingLayoutData::props(), [
    'members' => $steeringCommittee->map->only(['id', 'name', 'institution', 'country']),
    'selectedYear' => (int) $selectedYear,
]));
```

2. Buat `Steering.jsx` dengan `LandingLayout` (`title="Komite Pengarah"`, `current="Komite Pengarah"`).
3. Tampilkan anggota sebagai grid kartu (`Card` dari `Components/landing/ui/card`): nama tebal, institusi dan negara di bawahnya. Bisa pakai `Avatar` dengan inisial seperti section pembicara di beranda (`initials()` dari `landingUtils`).
4. Kalau `members` kosong, tampilkan `EmptyNote`: "Daftar Komite Pengarah tahun ini belum tersedia."
5. Di `landingNav.js`: tambahkan `steering: '/committee/steering'` di `buildRoutes`, lalu aktifkan menu Komite Pengarah.

## Checklist selesai

- [ ] Menu Komite > Komite Pengarah membuka halaman baru
- [ ] Data anggota tampil dari database tahun aktif
- [ ] `/committee/steering/2025` menampilkan data tahun 2025
- [ ] Data kosong menampilkan pesan, bukan halaman kosong
- [ ] Menu Komite Pengarah berwarna aktif saat dibuka
- [ ] Rapi di lebar HP 390px

## Commit, push, dan Pull Request

```bash
# 1. Cek file apa saja yang berubah
git status

# 2. Tambahkan hanya file task ini
git add resources/js/Pages/Landing/Committee/Steering.jsx
git add app/Http/Controllers/SteeringLandingPageController.php
git add resources/js/Components/landing/landingNav.js

# 3. Commit
git commit -m "feat(landing): halaman komite pengarah"

# 4. Ambil development terbaru supaya tidak ketinggalan, selesaikan conflict kalau ada
git pull origin development

# 5. Push
git push origin feat/halaman-komite-pengarah
```

Lalu buka GitHub dan buat **Pull Request** dari `feat/halaman-komite-pengarah` ke `development` dengan judul **Halaman Komite Pengarah**. Di deskripsi PR, tulis singkat apa yang dikerjakan dan lampirkan screenshot desktop serta HP.
