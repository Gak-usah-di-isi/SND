# 03. Beranda: integrasi Tanggal penting dan Poster

**Untuk:** Tita  
**Tingkat:** Mudah-Sedang  
**Branch:** `feat/beranda-tanggal-penting`  
**Bergantung pada:** Tidak ada.

## Tujuan

Jalur "Tanggal penting" dan poster/leaflet di beranda memakai data DeadlineDate dan Poster dari database.

## Setup awal

```bash
# 1. Pindah ke development dan ambil perubahan terbaru
git checkout development
git pull origin development

# 2. Buat branch baru khusus task ini
git checkout -b feat/beranda-tanggal-penting
```

### Cara kerja integrasi beranda

- Section sudah jadi dan tampil memakai data contoh dari `resources/js/data/landingDummy.js`.
- Tugasmu: isi method `timelineProps` di `app/Http/Controllers/LandingPageController.php` supaya mengirim key `deadline_date` dan `posters`.
- Begitu key itu dikirim dari controller, data contoh untuk key tersebut otomatis tertimpa data asli. Section lain tidak terpengaruh.
- **Nama key dan nama field harus sama persis** dengan yang ada di `landingDummy.js`, karena komponen membaca nama itu.
- Kalau datanya kosong di database, kirim array kosong `[]` atau `null`. Section akan menyembunyikan diri atau menampilkan pesan kosong. Jangan mengirim data karangan.
- Hanya ambil kolom yang dipakai (pakai `get([...])` atau `only([...])`), jangan kirim seluruh model.

## Data yang dipakai

| Key | Model (Editor Landing) | Field |
|---|---|---|
| `deadline_date` | `DeadlineDate` (Deadline Dates) | `id`, `name`, `date` (tipe date) |
| `posters` | `Poster` (Poster) | `id`, `image`, `link` |

```php
return [
    'deadline_date' => DeadlineDate::where('year', $year)->orderBy('date')->get(['id', 'name', 'date']),
    'posters' => Poster::where('year', $year)->get(['id', 'image', 'link']),
];
```

## Hal yang perlu diperhatikan

- Tanggal harus terkirim sebagai `YYYY-MM-DD`. Kalau model punya cast `date`, Laravel bisa mengirim `2026-12-19T00:00:00.000000Z`. Helper `parseDate` hanya membaca 10 karakter pertama, jadi tetap aman, tapi cek hasilnya di layar.
- Perilaku khusus yang harus dicek:
  - **Diperpanjang:** dua baris dengan `name` sama (misalnya "Batas akhir pengiriman abstrak" tanggal 15 dan 30 November) jadi satu titik, dan tanggal lama dicoret.
  - **Berikutnya:** titik emas dan badge "Berikutnya" ada di tenggat terdekat yang belum lewat.
  - **Sudah lewat:** tenggat yang sudah lewat tampil pudar.
- Tanpa poster, jalur tampil di tengah. Dengan poster, poster muncul di kanan beserta tombol "Unduh leaflet" (memakai `link` kalau ada, kalau tidak memakai file poster).

## File yang diubah

```
app/Http/Controllers/LandingPageController.php   (method timelineProps saja)
```

Komponen: `resources/js/Components/landing/sections/TimelineSection.jsx`.

## Checklist selesai

- [ ] Cek dengan data dari database: isi data di Editor Landing untuk tahun aktif, buka `/`, dan pastikan yang tampil adalah data dari database, bukan data contoh.
- [ ] Tenggat yang diperpanjang tampil satu titik dengan tanggal lama dicoret
- [ ] Badge "Berikutnya" ada di tenggat terdekat yang belum lewat
- [ ] Poster dan tombol "Unduh leaflet" muncul hanya kalau ada poster
- [ ] Tombol "Lihat tanggal penting" di hero menggulir ke section ini

## Commit, push, dan Pull Request

```bash
# 1. Cek file apa saja yang berubah
git status

# 2. Tambahkan hanya file task ini
git add app/Http/Controllers/LandingPageController.php

# 3. Commit
git commit -m "feat(landing): integrasi tanggal penting dan poster di beranda"

# 4. Ambil development terbaru supaya tidak ketinggalan, selesaikan conflict kalau ada
git pull origin development

# 5. Push
git push origin feat/beranda-tanggal-penting
```

Lalu buka GitHub dan buat **Pull Request** dari `feat/beranda-tanggal-penting` ke `development` dengan judul **Beranda: integrasi Tanggal penting dan Poster**. Di deskripsi PR, tulis singkat apa yang dikerjakan dan lampirkan screenshot desktop serta HP.
