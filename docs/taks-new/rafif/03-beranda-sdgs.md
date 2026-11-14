# 03. Beranda: integrasi section SDGs

**Untuk:** Rafif  
**Tingkat:** Mudah-Sedang  
**Branch:** `feat/beranda-sdgs`  
**Bergantung pada:** Tidak ada.

## Tujuan

Section "Setiap abstrak terhubung ke SDGs" dan pita warna SDGs di hero memakai data dari tabel `sdgs` (seeder `SdgSeeder`).

## Setup awal

```bash
# 1. Pindah ke development dan ambil perubahan terbaru
git checkout development
git pull origin development

# 2. Buat branch baru khusus task ini
git checkout -b feat/beranda-sdgs
```

### Cara kerja integrasi beranda

- Section sudah jadi dan tampil memakai data contoh dari `resources/js/data/landingDummy.js`.
- Tugasmu: isi method `sdgProps` di `app/Http/Controllers/LandingPageController.php` supaya mengirim key `sdgs`.
- Begitu key itu dikirim dari controller, data contoh untuk key tersebut otomatis tertimpa data asli. Section lain tidak terpengaruh.
- **Nama key dan nama field harus sama persis** dengan yang ada di `landingDummy.js`, karena komponen membaca nama itu.
- Kalau datanya kosong di database, kirim array kosong `[]` atau `null`. Section akan menyembunyikan diri atau menampilkan pesan kosong. Jangan mengirim data karangan.
- Hanya ambil kolom yang dipakai (pakai `get([...])` atau `only([...])`), jangan kirim seluruh model.

## Data yang dipakai

Model `App\Models\Sdg`, field yang dipakai: `id`, `order`, `code` (contoh `SDG-1`), `name_id`, `color`.

- `code` dipakai untuk memanggil ikon `public/images/sdgs/{code}.svg`.
- `color` dipakai pita warna di bawah hero dan di atas footer.
- SDGs tidak per tahun, jadi method ini tidak punya parameter `$year`.

```php
return ['sdgs' => Sdg::orderBy('order')->get(['id', 'order', 'code', 'name_id', 'color'])];
```

## File yang diubah

```
app/Http/Controllers/LandingPageController.php   (method sdgProps saja)
```

## Langkah pengerjaan

1. Pastikan tabel `sdgs` sudah terisi: `php artisan db:seed --class=SdgSeeder` (sekali saja, jangan diulang kalau sudah ada).
2. Tambahkan `use App\Models\Sdg;` dan isi `sdgProps()`.
3. Buka `/`: 17 ikon SDGs dan pita warnanya tampil dari database.
4. Uji: ubah sementara `name_id` salah satu SDG di database, refresh, pastikan nama yang tampil ikut berubah. Kembalikan lagi setelahnya.

## Checklist selesai

- [ ] Cek dengan data dari database: isi data di Editor Landing untuk tahun aktif, buka `/`, dan pastikan yang tampil adalah data dari database, bukan data contoh.
- [ ] 17 ikon SDGs tampil urut sesuai `order`
- [ ] Pita warna di hero dan footer sesuai kolom `color`
- [ ] Hanya method `sdgProps` yang berubah di controller

## Commit, push, dan Pull Request

```bash
# 1. Cek file apa saja yang berubah
git status

# 2. Tambahkan hanya file task ini
git add app/Http/Controllers/LandingPageController.php

# 3. Commit
git commit -m "feat(landing): integrasi section sdgs di beranda"

# 4. Ambil development terbaru supaya tidak ketinggalan, selesaikan conflict kalau ada
git pull origin development

# 5. Push
git push origin feat/beranda-sdgs
```

Lalu buka GitHub dan buat **Pull Request** dari `feat/beranda-sdgs` ke `development` dengan judul **Beranda: integrasi section SDGs**. Di deskripsi PR, tulis singkat apa yang dikerjakan dan lampirkan screenshot desktop serta HP.
