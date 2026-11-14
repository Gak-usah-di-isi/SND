# 07. Halaman Program

**Untuk:** Tita  
**Tingkat:** Sulit  
**Branch:** `feat/halaman-program`  
**Bergantung pada:** Rafif 01 (layout) sudah di-merge.

## Tujuan

Membuat halaman `/conference-program` yang menampilkan susunan acara per hari (tab Hari 1, Hari 2, ...) dari database, lalu mengaktifkan menu Program.

## Setup awal

```bash
# 1. Pindah ke development dan ambil perubahan terbaru
git checkout development
git pull origin development

# 2. Buat branch baru khusus task ini
git checkout -b feat/halaman-program
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

- Controller: `app/Http/Controllers/Landing/ConferenceProgramController.php`, method `showLandingPage($year = null)`.
- `ConferenceDetail`: `title`, `theme`, `university`, `hosted`, `date` (info umum acara).
- `ConferenceProgram`: `day_number`, `date`, `start_time`, `end_time`, `program_name`, `pic` (penanggung jawab).
- Route: `/conference-program` dan `/conference-program/{year}`.

Controller sekarang mengirim `programsByDay` sebagai collection hasil `groupBy`, yang di JSON menjadi objek dengan key angka. Lebih mudah dipakai di React kalau dikirim sebagai array:

```php
$days = $programs->groupBy('day_number')->map(fn ($items, $day) => [
    'day' => (int) $day,
    'date' => $items->first()->date,
    'items' => $items->map->only(['id', 'start_time', 'end_time', 'program_name', 'pic'])->values(),
])->values();
```

## Komponen Tabs

Belum ada komponen Tabs untuk landing. Buat versi shadcn/ui di `resources/js/Components/landing/ui/tabs.jsx` memakai `@radix-ui/react-tabs` (sudah terpasang). Contoh struktur dan gaya bisa dilihat di `ui/accordion.jsx`. Warna pakai token `sd-*`. Tab aktif boleh memakai `bg-sd-ink text-white`.

## File yang dibuat / diubah

Buat:

```
resources/js/Components/landing/ui/tabs.jsx
resources/js/Pages/Landing/Program.jsx
```

Ubah:

```
app/Http/Controllers/Landing/ConferenceProgramController.php   (method showLandingPage saja)
resources/js/Components/landing/landingNav.js
```

## Langkah pengerjaan

1. Kirim `conference` (ConferenceDetail pertama tahun itu), `days`, `years`, `selectedYear`.
2. Bagian atas: ringkasan acara dari `conference` (tema, tuan rumah, tanggal).
3. Tabs per hari, label "Hari 1 · 19 Desember 2026" (pakai `formatDate`). Tab default = hari ini kalau tanggalnya cocok, kalau tidak hari pertama.
4. Isi tab: daftar sesi berurutan. Kolom kiri jam (`08.00–09.00`, format `HH.mm` ala Indonesia, buang detiknya), kolom kanan nama acara dan PIC. Sesi yang sedang berlangsung (cek jam sekarang, hanya di hari yang sama) diberi penanda "Sedang berlangsung".
5. Di HP, jam tampil di atas nama acara (satu kolom).
6. Belum ada program: "Susunan acara tahun ini belum tersedia."
7. Aktifkan menu Program.

## Checklist selesai

- [ ] Tabs per hari berfungsi dengan klik dan tombol panah keyboard
- [ ] Jam tampil format Indonesia tanpa detik
- [ ] Penanda "Sedang berlangsung" hanya muncul di sesi yang benar
- [ ] Data dikirim sebagai array (`days`), bukan objek
- [ ] Pesan muncul saat program kosong
- [ ] Rapi di HP 390px

## Commit, push, dan Pull Request

```bash
# 1. Cek file apa saja yang berubah
git status

# 2. Tambahkan hanya file task ini
git add resources/js/Components/landing/ui/tabs.jsx
git add resources/js/Pages/Landing/Program.jsx
git add app/Http/Controllers/Landing/ConferenceProgramController.php
git add resources/js/Components/landing/landingNav.js

# 3. Commit
git commit -m "feat(landing): halaman program acara per hari"

# 4. Ambil development terbaru supaya tidak ketinggalan, selesaikan conflict kalau ada
git pull origin development

# 5. Push
git push origin feat/halaman-program
```

Lalu buka GitHub dan buat **Pull Request** dari `feat/halaman-program` ke `development` dengan judul **Halaman Program**. Di deskripsi PR, tulis singkat apa yang dikerjakan dan lampirkan screenshot desktop serta HP.
