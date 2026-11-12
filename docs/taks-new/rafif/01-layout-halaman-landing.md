# 01. Layout bersama halaman landing

**Untuk:** Rafif  
**Tingkat:** Sedang (wajib duluan)  
**Branch:** `feat/landing-layout`  
**Bergantung pada:** Tidak ada. **Kerjakan paling awal**, karena semua task "Halaman ..." milik Sasa, Tita, dan kamu sendiri memakai hasil task ini.

## Tujuan

Membuat kerangka yang dipakai semua halaman landing selain beranda: header (logo + menu), footer, judul tab, dan data layout dari backend. Setelah task ini, halaman lain cukup membungkus isinya dengan `<LandingLayout>`.

Task ini tingkatnya sedang, tapi ditaruh di nomor 01 karena menjadi dasar untuk task yang lain. Kerjakan dan buat PR secepatnya.

## Setup awal

```bash
# 1. Pindah ke development dan ambil perubahan terbaru
git checkout development
git pull origin development

# 2. Buat branch baru khusus task ini
git checkout -b feat/landing-layout
```

## Data yang dipakai

Header dan footer butuh data yang sama di semua halaman:

| Key | Sumber |
|---|---|
| `abbreviation` | `ConferenceSetting::first()?->conference_abbreviation` (fallback `'Seminar DAMPAK'`) |
| `year` | `LandingSetting::where('is_active', true)->value('year')` (fallback `date('Y')`) |
| `logo` | `Upload::currentForType('logo')?->file_path` (boleh `null`, header akan memakai logo UB) |
| `sdgs` | `Sdg::orderBy('order')->get(['id', 'code', 'color'])` (untuk pita warna di footer) |

## File yang dibuat / diubah

Buat:

```
app/Support/LandingLayoutData.php
resources/js/Components/landing/LandingLayout.jsx
```

Ubah:

```
resources/js/Components/landing/landingNav.js
resources/js/Pages/Landing/Home.jsx
resources/views/inertia.blade.php
```

## Langkah pengerjaan

1. **`app/Support/LandingLayoutData.php`**: buat class dengan method statis `props(): array` yang mengembalikan:

```php
return [
    'layout' => [
        'abbreviation' => ...,
        'year' => ...,
        'logo' => ...,
        'sdgs' => ...,
    ],
];
```

   Folder `app/Support` belum ada, buat saja. Namespace-nya `App\Support`.

2. **`landingNav.js`**: ubah `buildNav(r)` menjadi `buildNav(r, current)`. Item yang `label`-nya sama dengan `current` mendapat `current: true` (termasuk anak di dalam `children`). Hapus `current: true` yang sekarang ditulis manual di Beranda.

3. **`LandingLayout.jsx`**: pindahkan kerangka yang sekarang ada di `Home.jsx` ke komponen ini:
   - `<Head title={title}>`
   - link "Lewati ke konten"
   - `<LandingHeader ...>` memakai `buildNav(buildRoutes(...), current)`
   - `<main id="konten">{children}</main>`
   - `<LandingFooter ...>`

   Props: `layout` (data dari `LandingLayoutData`), `title` (judul tab), `current` (label menu aktif), `children`. Kalau `title` kosong, pakai `'Seminar Dampak'`.

4. **`Home.jsx`**: ganti kerangkanya dengan `<LandingLayout title="Seminar Dampak" current="Beranda" layout={...}>`. Karena controller beranda belum mengirim `layout`, susun objek `layout` di `Home.jsx` dari data yang sudah ada (`abbreviation`, `year`, `data.logo`, `data.sdgs`). Tampilan beranda **tidak boleh berubah**.

5. **`inertia.blade.php`**: sekarang `<title>` Blade dilewati hanya untuk `Landing/Home`. Ubah supaya berlaku untuk semua halaman yang komponennya diawali `Landing/`:

```blade
@unless (str_starts_with($page['component'] ?? '', 'Landing/'))
```

## Cara cek

- Buka `/`: tampilan sama persis seperti sebelumnya, judul tab "Seminar Dampak", menu Beranda berwarna emas tua.
- Buka dashboard: judul tab dashboard masih seperti biasa.
- Belum ada halaman lain yang memakai layout ini, itu normal. Tulis contoh pemakaiannya di deskripsi PR supaya Sasa dan Tita bisa langsung pakai.

## Checklist selesai

- [ ] `LandingLayoutData::props()` mengembalikan key `layout` berisi abbreviation, year, logo, sdgs
- [ ] `LandingLayout` menerima props `layout`, `title`, `current`, `children`
- [ ] `buildNav` menandai menu aktif lewat parameter `current`
- [ ] Beranda tampil sama persis seperti sebelumnya
- [ ] Judul tab halaman dashboard tidak berubah
- [ ] PR dibuat secepatnya dan Sasa serta Tita diberi tahu di grup

## Commit, push, dan Pull Request

```bash
# 1. Cek file apa saja yang berubah
git status

# 2. Tambahkan hanya file task ini
git add app/Support/LandingLayoutData.php
git add resources/js/Components/landing/LandingLayout.jsx
git add resources/js/Components/landing/landingNav.js
git add resources/js/Pages/Landing/Home.jsx
git add resources/views/inertia.blade.php

# 3. Commit
git commit -m "feat(landing): tambah layout bersama halaman landing"

# 4. Ambil development terbaru supaya tidak ketinggalan, selesaikan conflict kalau ada
git pull origin development

# 5. Push
git push origin feat/landing-layout
```

Lalu buka GitHub dan buat **Pull Request** dari `feat/landing-layout` ke `development` dengan judul **Layout bersama halaman landing**. Di deskripsi PR, tulis singkat apa yang dikerjakan dan lampirkan screenshot desktop serta HP.
