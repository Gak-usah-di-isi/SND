# 08. Halaman Arsip

**Untuk:** Sasa  
**Tingkat:** Paling sulit  
**Branch:** `feat/halaman-arsip`  
**Bergantung pada:** Rafif 01 (layout) sudah di-merge.

## Tujuan

Membuat halaman `/archives` yang menampilkan abstrak yang diterima (`accepted`) per tahun, dengan pilihan tahun, pencarian, dan unduhan PDF per abstrak, lalu mengaktifkan menu Arsip.

## Setup awal

```bash
# 1. Pindah ke development dan ambil perubahan terbaru
git checkout development
git pull origin development

# 2. Buat branch baru khusus task ini
git checkout -b feat/halaman-arsip
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

- Controller: `app/Http/Controllers/ArchiveController.php`, method `index(Request $request)` dan `show(Request $request, $year)`. **Jangan ubah `downloadPdf`.**
- Model `AbstractModel`, field yang ditampilkan: `id`, `title`, `authors`, `presentation_type`. Tahun diambil dari `created_at`.
- Route: `/archives` (nama `archives.index`), `/archives/{year}` (`archives.show`), unduh PDF `/download-abstract/{id}` (`download.abstract`).

## Hal yang perlu diperhatikan

- `index` dan `show` sekarang mengembalikan view yang sama dengan data berbeda (`show` tidak mengirim `years`). Rapikan supaya keduanya mengirim data yang sama: `years`, `selectedYear`, `abstracts`. Paling rapi: `show` memanggil satu private method yang juga dipakai `index`.
- Field `authors` bisa berisi penanda afiliasi seperti `Budi[1], Sari[2]`. Tampilkan angka itu sebagai superscript di React, jangan pakai `dangerouslySetInnerHTML` untuk data yang diketik peserta. Contoh: pecah string dengan regex `/\[(\d+)\]/` lalu render bagian angka di dalam `<sup>`.
- Abstrak bisa ratusan. Kirim hanya kolom yang perlu, dan pertimbangkan `->paginate(20)` (komponen paginasi bisa sederhana: tombol Sebelumnya/Berikutnya).

## File yang dibuat / diubah

Buat:

```
resources/js/Pages/Landing/Archives.jsx
```

Ubah:

```
app/Http/Controllers/ArchiveController.php   (index dan show)
resources/js/Components/landing/landingNav.js
```

## Langkah pengerjaan

1. Rapikan controller seperti di atas, render `Landing/Archives` dengan `LandingLayoutData::props()`.
2. Pilihan tahun berupa tombol (pola sama seperti halaman Galeri). Klik tahun = ke `/archives/{tahun}`.
3. Tiap abstrak: judul, penulis (dengan superscript), jenis presentasi (`Badge`), dan tombol "Unduh PDF" (`<a href={'/download-abstract/' + id}>`).
4. Pencarian judul/penulis di sisi React (atau di server kalau kamu memakai paginasi).
5. Tahun tanpa abstrak: "Belum ada abstrak yang diterima pada tahun ini."
6. Aktifkan menu Arsip.

## Checklist selesai

- [ ] Hanya abstrak berstatus `accepted` yang tampil
- [ ] `/archives` dan `/archives/{tahun}` mengirim data dengan bentuk yang sama
- [ ] Penanda afiliasi `[1]` tampil sebagai superscript tanpa `dangerouslySetInnerHTML`
- [ ] Tombol Unduh PDF mengunduh abstrak yang benar
- [ ] Pencarian dan pilihan tahun berfungsi
- [ ] Rapi di HP 390px

## Commit, push, dan Pull Request

```bash
# 1. Cek file apa saja yang berubah
git status

# 2. Tambahkan hanya file task ini
git add resources/js/Pages/Landing/Archives.jsx
git add app/Http/Controllers/ArchiveController.php
git add resources/js/Components/landing/landingNav.js

# 3. Commit
git commit -m "feat(landing): halaman arsip abstrak"

# 4. Ambil development terbaru supaya tidak ketinggalan, selesaikan conflict kalau ada
git pull origin development

# 5. Push
git push origin feat/halaman-arsip
```

Lalu buka GitHub dan buat **Pull Request** dari `feat/halaman-arsip` ke `development` dengan judul **Halaman Arsip**. Di deskripsi PR, tulis singkat apa yang dikerjakan dan lampirkan screenshot desktop serta HP.
