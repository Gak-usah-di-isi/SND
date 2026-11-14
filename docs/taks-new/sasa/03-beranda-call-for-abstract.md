# 03. Beranda: integrasi section Call for Abstract

**Untuk:** Sasa  
**Tingkat:** Mudah-Sedang  
**Branch:** `feat/beranda-call-for-abstract`  
**Bergantung pada:** Tidak ada.

## Tujuan

Daftar subtema di section "Call for Abstract" memakai data Theme dari database, dan tiap subtema bisa diklik ke halaman detailnya.

## Setup awal

```bash
# 1. Pindah ke development dan ambil perubahan terbaru
git checkout development
git pull origin development

# 2. Buat branch baru khusus task ini
git checkout -b feat/beranda-call-for-abstract
```

### Cara kerja integrasi beranda

- Section sudah jadi dan tampil memakai data contoh dari `resources/js/data/landingDummy.js`.
- Tugasmu: isi method `themeProps` di `app/Http/Controllers/LandingPageController.php` supaya mengirim key `themes`.
- Begitu key itu dikirim dari controller, data contoh untuk key tersebut otomatis tertimpa data asli. Section lain tidak terpengaruh.
- **Nama key dan nama field harus sama persis** dengan yang ada di `landingDummy.js`, karena komponen membaca nama itu.
- Kalau datanya kosong di database, kirim array kosong `[]` atau `null`. Section akan menyembunyikan diri atau menampilkan pesan kosong. Jangan mengirim data karangan.
- Hanya ambil kolom yang dipakai (pakai `get([...])` atau `only([...])`), jangan kirim seluruh model.

## Data yang dipakai

Model `App\Models\Theme` (Editor Landing > Call for Paper), field: `id`, `title`, `year`. Field `description` tidak dipakai di beranda (dipakai di halaman detail, task 07).

```php
return ['themes' => Theme::where('year', $year)->orderBy('id')->get(['id', 'title', 'year'])];
```

## Hal yang perlu diperhatikan

- Di `Home.jsx`, link ke detail subtema aktif otomatis saat `themes` dikirim dari controller (`linkable={Boolean(props.themes)}`). Jadi setelah task ini, kartu subtema bisa diklik ke `/themes/{id}`.
- Halaman `/themes/{id}` masih Blade lama sampai task 07 selesai. Itu normal.

## File yang diubah

```
app/Http/Controllers/LandingPageController.php   (method themeProps saja)
```

Komponen: `resources/js/Components/landing/sections/ThemesSection.jsx`.

## Langkah pengerjaan

1. `Theme` sudah di-import di controller. Isi `themeProps(int $year)`.
2. Isi 4 subtema di Editor Landing untuk tahun aktif.
3. Cek nomor urut (01, 02, ...) dan klik salah satu: harus membuka `/themes/{id}` yang benar.

## Checklist selesai

- [ ] Cek dengan data dari database: isi data di Editor Landing untuk tahun aktif, buka `/`, dan pastikan yang tampil adalah data dari database, bukan data contoh.
- [ ] Subtema tampil urut dan bernomor
- [ ] Klik subtema membuka `/themes/{id}` yang benar
- [ ] Section hilang saat belum ada subtema

## Commit, push, dan Pull Request

```bash
# 1. Cek file apa saja yang berubah
git status

# 2. Tambahkan hanya file task ini
git add app/Http/Controllers/LandingPageController.php

# 3. Commit
git commit -m "feat(landing): integrasi section call for abstract di beranda"

# 4. Ambil development terbaru supaya tidak ketinggalan, selesaikan conflict kalau ada
git pull origin development

# 5. Push
git push origin feat/beranda-call-for-abstract
```

Lalu buka GitHub dan buat **Pull Request** dari `feat/beranda-call-for-abstract` ke `development` dengan judul **Beranda: integrasi section Call for Abstract**. Di deskripsi PR, tulis singkat apa yang dikerjakan dan lampirkan screenshot desktop serta HP.
