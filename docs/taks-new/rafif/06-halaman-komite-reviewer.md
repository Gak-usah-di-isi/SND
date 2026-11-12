# 06. Halaman Komite Reviewer

**Untuk:** Rafif  
**Tingkat:** Sedang-Sulit  
**Branch:** `feat/halaman-komite-reviewer`  
**Bergantung pada:** Rafif 01 (layout) sudah di-merge. Lebih enak dikerjakan setelah task 05 (polanya sama).

## Tujuan

Membuat halaman `/committee/reviewer` yang menampilkan daftar Komite Reviewer dari database, lalu mengaktifkan menu Komite > Komite Reviewer.

## Setup awal

```bash
# 1. Pindah ke development dan ambil perubahan terbaru
git checkout development
git pull origin development

# 2. Buat branch baru khusus task ini
git checkout -b feat/halaman-komite-reviewer
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

- Controller: `app/Http/Controllers/Landing/ReviewerCommitteeController.php`, method `showLandingPage($year = null)`. **Jangan ubah method `index`, `store`, dan lainnya** (itu dipakai Editor Landing).
- Model `ReviewerCommittee`, field: `name`, `institution`, `country`, `year`.
- Route: `/committee/reviewer` dan `/committee/reviewer/{year}`.

## File yang dibuat / diubah

Buat:

```
resources/js/Pages/Landing/Committee/Reviewer.jsx
```

Ubah:

```
app/Http/Controllers/Landing/ReviewerCommitteeController.php   (method showLandingPage saja)
resources/js/Components/landing/landingNav.js
```

## Langkah pengerjaan

1. Ganti `return view(...)` di `showLandingPage` menjadi `Inertia::render('Landing/Committee/Reviewer', ...)` dengan `LandingLayoutData::props()`.
2. Reviewer biasanya lebih banyak dari komite pengarah. Tampilkan sebagai **daftar/tabel ringkas** (nama, institusi, negara), bukan kartu besar.
3. Tambahkan kotak pencarian nama/institusi di atas daftar (filter di sisi React dengan `useState`, tanpa request ke server). Pakai `Input` dan `Label` dari `Components/landing/ui/form`.
4. Saat pencarian tidak menemukan apa pun, tampilkan "Tidak ada reviewer yang cocok dengan pencarian."
5. Aktifkan menu Komite Reviewer di `landingNav.js`.

## Checklist selesai

- [ ] Daftar reviewer tampil dari database
- [ ] Pencarian memfilter berdasarkan nama dan institusi
- [ ] Pesan muncul saat pencarian kosong dan saat data kosong
- [ ] Halaman Editor Landing > Reviewer tetap berfungsi seperti biasa
- [ ] Menu aktif dan rapi di HP 390px

## Commit, push, dan Pull Request

```bash
# 1. Cek file apa saja yang berubah
git status

# 2. Tambahkan hanya file task ini
git add resources/js/Pages/Landing/Committee/Reviewer.jsx
git add app/Http/Controllers/Landing/ReviewerCommitteeController.php
git add resources/js/Components/landing/landingNav.js

# 3. Commit
git commit -m "feat(landing): halaman komite reviewer"

# 4. Ambil development terbaru supaya tidak ketinggalan, selesaikan conflict kalau ada
git pull origin development

# 5. Push
git push origin feat/halaman-komite-reviewer
```

Lalu buka GitHub dan buat **Pull Request** dari `feat/halaman-komite-reviewer` ke `development` dengan judul **Halaman Komite Reviewer**. Di deskripsi PR, tulis singkat apa yang dikerjakan dan lampirkan screenshot desktop serta HP.
