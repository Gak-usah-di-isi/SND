# 04. Beranda: integrasi Hero dan logo

**Untuk:** Rafif  
**Tingkat:** Sedang  
**Branch:** `feat/beranda-hero`  
**Bergantung pada:** Rafif 01 (layout) sudah di-merge, karena logo juga dipakai header.

## Tujuan

Hero beranda (judul besar, tagline, singkatan dan tahun) dan logo di header memakai data dari database.

## Setup awal

```bash
# 1. Pindah ke development dan ambil perubahan terbaru
git checkout development
git pull origin development

# 2. Buat branch baru khusus task ini
git checkout -b feat/beranda-hero
```

### Cara kerja integrasi beranda

- Section sudah jadi dan tampil memakai data contoh dari `resources/js/data/landingDummy.js`.
- Tugasmu: isi method `heroProps` di `app/Http/Controllers/LandingPageController.php` supaya mengirim key `conference_title`, `conference_abbreviation`, dan `logo`.
- Begitu key itu dikirim dari controller, data contoh untuk key tersebut otomatis tertimpa data asli. Section lain tidak terpengaruh.
- **Nama key dan nama field harus sama persis** dengan yang ada di `landingDummy.js`, karena komponen membaca nama itu.
- Kalau datanya kosong di database, kirim array kosong `[]` atau `null`. Section akan menyembunyikan diri atau menampilkan pesan kosong. Jangan mengirim data karangan.
- Hanya ambil kolom yang dipakai (pakai `get([...])` atau `only([...])`), jangan kirim seluruh model.

## Data yang dipakai

| Key | Model | Field |
|---|---|---|
| `conference_title` | `ConferenceTitle` (Editor Landing > Judul) | `id`, `title`, `description`, `year` |
| `conference_abbreviation` | `ConferenceSetting` (Admin > Pengaturan Konferensi) | `conference_abbreviation` |
| `logo` | `Upload::currentForType('logo')` (Editor Landing > Logo) | `file_path` |

```php
$title = ConferenceTitle::where('year', $year)->first(['id', 'title', 'description', 'year']);

return [
    'conference_title' => $title,
    'conference_abbreviation' => ConferenceSetting::first()?->conference_abbreviation,
    'logo' => Upload::currentForType('logo')?->file_path,
];
```

## Hal yang perlu diperhatikan

- Kalau `conference_title` tahun aktif belum diisi, `HeroSection` akan error karena membaca `title.title`. Tambahkan pengaman di `resources/js/Components/landing/sections/HeroSection.jsx`: kalau `title` kosong, tampilkan nama seminar dari `abbreviation` sebagai judul.
- Kalau `conference_abbreviation` kosong, jangan kirim `null` (nanti hero menampilkan "null 2026"). Kirim key itu hanya kalau ada isinya, atau pakai fallback `'Seminar DAMPAK'`.
- Logo `null` = header memakai logo UB. Itu memang perilaku yang diinginkan.

## File yang diubah

```
app/Http/Controllers/LandingPageController.php            (method heroProps saja)
resources/js/Components/landing/sections/HeroSection.jsx  (pengaman judul kosong)
```

## Checklist selesai

- [ ] Cek dengan data dari database: isi data di Editor Landing untuk tahun aktif, buka `/`, dan pastikan yang tampil adalah data dari database, bukan data contoh.
- [ ] Judul, tagline, singkatan, dan tahun di hero sesuai database
- [ ] Logo di header berganti saat logo diunggah di Editor Landing, dan kembali ke logo UB saat kosong
- [ ] Beranda tidak error saat Judul Konferensi tahun aktif kosong
- [ ] Tidak ada teks "null" atau "undefined" di hero

## Commit, push, dan Pull Request

```bash
# 1. Cek file apa saja yang berubah
git status

# 2. Tambahkan hanya file task ini
git add app/Http/Controllers/LandingPageController.php
git add resources/js/Components/landing/sections/HeroSection.jsx

# 3. Commit
git commit -m "feat(landing): integrasi hero dan logo di beranda"

# 4. Ambil development terbaru supaya tidak ketinggalan, selesaikan conflict kalau ada
git pull origin development

# 5. Push
git push origin feat/beranda-hero
```

Lalu buka GitHub dan buat **Pull Request** dari `feat/beranda-hero` ke `development` dengan judul **Beranda: integrasi Hero dan logo**. Di deskripsi PR, tulis singkat apa yang dikerjakan dan lampirkan screenshot desktop serta HP.
