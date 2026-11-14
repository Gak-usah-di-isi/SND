# 01. Beranda: integrasi section Kontak

**Untuk:** Tita  
**Tingkat:** Mudah  
**Branch:** `feat/beranda-kontak`  
**Bergantung pada:** Tidak ada.

## Tujuan

Section "Hubungi panitia" di beranda (alamat, WhatsApp, email) memakai data Contact dari database, bukan data contoh lagi.

## Setup awal

```bash
# 1. Pindah ke development dan ambil perubahan terbaru
git checkout development
git pull origin development

# 2. Buat branch baru khusus task ini
git checkout -b feat/beranda-kontak
```

### Cara kerja integrasi beranda

- Section sudah jadi dan tampil memakai data contoh dari `resources/js/data/landingDummy.js`.
- Tugasmu: isi method `contactProps` di `app/Http/Controllers/LandingPageController.php` supaya mengirim key `contacts`.
- Begitu key itu dikirim dari controller, data contoh untuk key tersebut otomatis tertimpa data asli. Section lain tidak terpengaruh.
- **Nama key dan nama field harus sama persis** dengan yang ada di `landingDummy.js`, karena komponen membaca nama itu.
- Kalau datanya kosong di database, kirim array kosong `[]` atau `null`. Section akan menyembunyikan diri atau menampilkan pesan kosong. Jangan mengirim data karangan.
- Hanya ambil kolom yang dipakai (pakai `get([...])` atau `only([...])`), jangan kirim seluruh model.

## Data yang dipakai

Model `App\Models\Contact` (Editor Landing > Contact), field: `id`, `phone1`, `phone1_name`, `phone2`, `phone2_name`, `email`, `address`, `year`.

Komponen hanya memakai kontak pertama (`contacts[0]`), tapi kirim tetap sebagai array supaya sama dengan data contoh:

```php
return ['contacts' => Contact::where('year', $year)->get(['id', 'phone1', 'phone1_name', 'phone2', 'phone2_name', 'email', 'address'])];
```

## Hal yang perlu diperhatikan

- Nomor telepon boleh ditulis `0812...` atau `62812...`. Helper `waLink()` dan `displayPhone()` di `landingUtils.js` sudah mengubahnya ke format WhatsApp dan format tampilan. Cek dua-duanya.
- `phone2` boleh kosong. Baris WhatsApp kedua harus hilang, bukan tampil kosong.

## File yang diubah

```
app/Http/Controllers/LandingPageController.php   (method contactProps saja)
```

Komponen: `resources/js/Components/landing/sections/ContactSection.jsx`.

## Langkah pengerjaan

1. Tambahkan `use App\Models\Contact;`, isi `contactProps(int $year)`.
2. Isi kontak tahun aktif di Editor Landing.
3. Klik nomor WhatsApp: membuka `wa.me` dengan nomor yang benar. Klik email: membuka `mailto:` (cukup hover dan lihat link di pojok bawah browser, tidak perlu benar-benar membuka aplikasi email).

## Checklist selesai

- [ ] Cek dengan data dari database: isi data di Editor Landing untuk tahun aktif, buka `/`, dan pastikan yang tampil adalah data dari database, bukan data contoh.
- [ ] Link WhatsApp benar untuk nomor berawalan 0 maupun 62
- [ ] Baris WhatsApp kedua hilang saat `phone2` kosong
- [ ] Section hilang saat kontak tahun aktif belum diisi
- [ ] Hanya method `contactProps` yang berubah

## Commit, push, dan Pull Request

```bash
# 1. Cek file apa saja yang berubah
git status

# 2. Tambahkan hanya file task ini
git add app/Http/Controllers/LandingPageController.php

# 3. Commit
git commit -m "feat(landing): integrasi section kontak di beranda"

# 4. Ambil development terbaru supaya tidak ketinggalan, selesaikan conflict kalau ada
git pull origin development

# 5. Push
git push origin feat/beranda-kontak
```

Lalu buka GitHub dan buat **Pull Request** dari `feat/beranda-kontak` ke `development` dengan judul **Beranda: integrasi section Kontak**. Di deskripsi PR, tulis singkat apa yang dikerjakan dan lampirkan screenshot desktop serta HP.
