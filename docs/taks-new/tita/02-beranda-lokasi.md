# 02. Beranda: integrasi section Lokasi

**Untuk:** Tita  
**Tingkat:** Mudah  
**Branch:** `feat/beranda-lokasi`  
**Bergantung pada:** Tidak ada.

## Tujuan

Section "Lokasi seminar" (kartu info, foto gedung, peta) memakai data Venue dari database.

## Setup awal

```bash
# 1. Pindah ke development dan ambil perubahan terbaru
git checkout development
git pull origin development

# 2. Buat branch baru khusus task ini
git checkout -b feat/beranda-lokasi
```

### Cara kerja integrasi beranda

- Section sudah jadi dan tampil memakai data contoh dari `resources/js/data/landingDummy.js`.
- Tugasmu: isi method `venueProps` di `app/Http/Controllers/LandingPageController.php` supaya mengirim key `venues`.
- Begitu key itu dikirim dari controller, data contoh untuk key tersebut otomatis tertimpa data asli. Section lain tidak terpengaruh.
- **Nama key dan nama field harus sama persis** dengan yang ada di `landingDummy.js`, karena komponen membaca nama itu.
- Kalau datanya kosong di database, kirim array kosong `[]` atau `null`. Section akan menyembunyikan diri atau menampilkan pesan kosong. Jangan mengirim data karangan.
- Hanya ambil kolom yang dipakai (pakai `get([...])` atau `only([...])`), jangan kirim seluruh model.

## Data yang dipakai

Model `App\Models\Venue` (Editor Landing > Venue), field: `id`, `image_path`, `venue_name`, `address`, `date`, `link_map`, `map`, `conference_mode`, `onsite_programme`, `online_programme`.

```php
return ['venues' => Venue::where('year', $year)->get([
    'id', 'image_path', 'venue_name', 'address', 'date', 'link_map', 'map',
    'conference_mode', 'onsite_programme', 'online_programme',
])];
```

## Hal yang perlu diperhatikan

- Kolom `date` di tabel `venues` bertipe **string**, bukan date. Komponen mencoba memformat tanggal `YYYY-MM-DD` ("2026-12-19" menjadi "19 Desember 2026"). Kalau admin mengetik bebas ("19 December 2026"), teks itu ditampilkan apa adanya. Cek kedua kemungkinan.
- `map` berisi kode `<iframe>` yang ditempel admin dari Google Maps (menu Bagikan > Sematkan peta). Cek bahwa peta tampil penuh di kotaknya. Kalau iframe dari admin membawa `width`/`height` sendiri, CSS di komponen sudah memaksanya mengikuti kotak. Pastikan memang begitu.
- Kalau `image_path` kosong, kartu info harus melebar penuh.

## File yang diubah

```
app/Http/Controllers/LandingPageController.php   (method venueProps saja)
```

Komponen: `resources/js/Components/landing/sections/VenueSection.jsx`.

## Checklist selesai

- [ ] Cek dengan data dari database: isi data di Editor Landing untuk tahun aktif, buka `/`, dan pastikan yang tampil adalah data dari database, bukan data contoh.
- [ ] Tanggal berformat `YYYY-MM-DD` tampil sebagai "19 Desember 2026"
- [ ] Embed peta dari admin tampil penuh di kotaknya
- [ ] Tanpa foto, kartu info melebar penuh
- [ ] Tombol "Buka di Google Maps" membuka `link_map` di tab baru

## Commit, push, dan Pull Request

```bash
# 1. Cek file apa saja yang berubah
git status

# 2. Tambahkan hanya file task ini
git add app/Http/Controllers/LandingPageController.php

# 3. Commit
git commit -m "feat(landing): integrasi section lokasi di beranda"

# 4. Ambil development terbaru supaya tidak ketinggalan, selesaikan conflict kalau ada
git pull origin development

# 5. Push
git push origin feat/beranda-lokasi
```

Lalu buka GitHub dan buat **Pull Request** dari `feat/beranda-lokasi` ke `development` dengan judul **Beranda: integrasi section Lokasi**. Di deskripsi PR, tulis singkat apa yang dikerjakan dan lampirkan screenshot desktop serta HP.
