# 02. Beranda: integrasi section Tentang

**Untuk:** Rafif  
**Tingkat:** Mudah  
**Branch:** `feat/beranda-tentang`  
**Bergantung pada:** Tidak ada.

## Tujuan

Section "Tentang" di beranda menampilkan data dari tabel `abouts` (menu Editor Landing > About), bukan data contoh lagi.

## Setup awal

```bash
# 1. Pindah ke development dan ambil perubahan terbaru
git checkout development
git pull origin development

# 2. Buat branch baru khusus task ini
git checkout -b feat/beranda-tentang
```

### Cara kerja integrasi beranda

- Section sudah jadi dan tampil memakai data contoh dari `resources/js/data/landingDummy.js`.
- Tugasmu: isi method `aboutProps` di `app/Http/Controllers/LandingPageController.php` supaya mengirim key `about`.
- Begitu key itu dikirim dari controller, data contoh untuk key tersebut otomatis tertimpa data asli. Section lain tidak terpengaruh.
- **Nama key dan nama field harus sama persis** dengan yang ada di `landingDummy.js`, karena komponen membaca nama itu.
- Kalau datanya kosong di database, kirim array kosong `[]` atau `null`. Section akan menyembunyikan diri atau menampilkan pesan kosong. Jangan mengirim data karangan.
- Hanya ambil kolom yang dipakai (pakai `get([...])` atau `only([...])`), jangan kirim seluruh model.

## Data yang dipakai

Model `App\Models\About`, field: `title`, `content` (HTML dari editor), `image` (path di storage), `year`.

Ambil satu data terbaru untuk tahun aktif:

```php
$about = About::where('year', $year)->latest('id')->first();

return ['about' => $about?->only(['id', 'title', 'content', 'image'])];
```

## File yang diubah

```
app/Http/Controllers/LandingPageController.php   (method aboutProps saja)
```

Komponen section sudah ada di `resources/js/Components/landing/sections/AboutSection.jsx`, tidak perlu diubah kecuali ada yang rusak saat memakai data asli.

## Langkah pengerjaan

1. Tambahkan `use App\Models\About;` di atas controller.
2. Isi method `aboutProps(int $year)` seperti contoh di atas.
3. Isi data About untuk tahun aktif di Editor Landing, termasuk gambar.
4. Buka `/` dan cek section Tentang.

## Checklist selesai

- [ ] Cek dengan data dari database: isi data di Editor Landing untuk tahun aktif, buka `/`, dan pastikan yang tampil adalah data dari database, bukan data contoh.
- [ ] Gambar About tampil (path lewat `assetUrl`, bukan URL rusak)
- [ ] Kalau About tahun aktif belum diisi, section Tentang hilang tanpa error
- [ ] Hanya method `aboutProps` yang berubah di controller

## Commit, push, dan Pull Request

```bash
# 1. Cek file apa saja yang berubah
git status

# 2. Tambahkan hanya file task ini
git add app/Http/Controllers/LandingPageController.php

# 3. Commit
git commit -m "feat(landing): integrasi section tentang di beranda"

# 4. Ambil development terbaru supaya tidak ketinggalan, selesaikan conflict kalau ada
git pull origin development

# 5. Push
git push origin feat/beranda-tentang
```

Lalu buka GitHub dan buat **Pull Request** dari `feat/beranda-tentang` ke `development` dengan judul **Beranda: integrasi section Tentang**. Di deskripsi PR, tulis singkat apa yang dikerjakan dan lampirkan screenshot desktop serta HP.
