# 01. Beranda: integrasi section Penyelenggara

**Untuk:** Sasa  
**Tingkat:** Mudah  
**Branch:** `feat/beranda-penyelenggara`  
**Bergantung pada:** Tidak ada.

## Tujuan

Deretan logo "Penyelenggara", "Mitra penyelenggara", dan "Didukung oleh" di beranda memakai logo yang diunggah di Editor Landing, bukan data contoh lagi.

## Setup awal

```bash
# 1. Pindah ke development dan ambil perubahan terbaru
git checkout development
git pull origin development

# 2. Buat branch baru khusus task ini
git checkout -b feat/beranda-penyelenggara
```

### Cara kerja integrasi beranda

- Section sudah jadi dan tampil memakai data contoh dari `resources/js/data/landingDummy.js`.
- Tugasmu: isi method `hostProps` di `app/Http/Controllers/LandingPageController.php` supaya mengirim key `hosted_by`, `co_hosted_by`, dan `supported_by`.
- Begitu key itu dikirim dari controller, data contoh untuk key tersebut otomatis tertimpa data asli. Section lain tidak terpengaruh.
- **Nama key dan nama field harus sama persis** dengan yang ada di `landingDummy.js`, karena komponen membaca nama itu.
- Kalau datanya kosong di database, kirim array kosong `[]` atau `null`. Section akan menyembunyikan diri atau menampilkan pesan kosong. Jangan mengirim data karangan.
- Hanya ambil kolom yang dipakai (pakai `get([...])` atau `only([...])`), jangan kirim seluruh model.

## Data yang dipakai

Model `App\Models\PublicationsJournal` (Editor Landing > Publications Journal), field: `image_type`, `image_path`, `year`.

| Key | `image_type` |
|---|---|
| `hosted_by` | `hosted_by` |
| `co_hosted_by` | `co_hosted_by` |
| `supported_by` | `supported_by` |

Logo dengan `image_type` `publications_journal` **tidak dipakai** (bagian Publications memang tidak ada di landing ini).

Contoh:

```php
$logos = PublicationsJournal::where('year', $year)
    ->whereIn('image_type', ['hosted_by', 'co_hosted_by', 'supported_by'])
    ->get(['id', 'image_type', 'image_path']);

return [
    'hosted_by' => $logos->where('image_type', 'hosted_by')->values(),
    // co_hosted_by dan supported_by dengan pola yang sama
];
```

Perhatikan `->values()`: tanpa itu, Laravel mengirim objek, bukan array, dan `.map()` di React akan error.

## File yang diubah

```
app/Http/Controllers/LandingPageController.php   (method hostProps saja)
```

Komponen: `resources/js/Components/landing/sections/HostsSection.jsx` (sudah jadi).

## Langkah pengerjaan

1. Tambahkan `use App\Models\PublicationsJournal;`.
2. Isi `hostProps(int $year)`.
3. Unggah minimal dua logo `hosted_by` di Editor Landing untuk tahun aktif, lalu cek `/`.
4. Coba kosongkan `co_hosted_by`: grup "Mitra penyelenggara" harus hilang, grup lain tetap tampil.

## Checklist selesai

- [ ] Cek dengan data dari database: isi data di Editor Landing untuk tahun aktif, buka `/`, dan pastikan yang tampil adalah data dari database, bukan data contoh.
- [ ] Ketiga grup logo terisi dari database sesuai `image_type`
- [ ] Grup tanpa logo tidak tampil
- [ ] Tidak ada error `.map is not a function` di console browser
- [ ] Hanya method `hostProps` yang berubah

## Commit, push, dan Pull Request

```bash
# 1. Cek file apa saja yang berubah
git status

# 2. Tambahkan hanya file task ini
git add app/Http/Controllers/LandingPageController.php

# 3. Commit
git commit -m "feat(landing): integrasi section penyelenggara di beranda"

# 4. Ambil development terbaru supaya tidak ketinggalan, selesaikan conflict kalau ada
git pull origin development

# 5. Push
git push origin feat/beranda-penyelenggara
```

Lalu buka GitHub dan buat **Pull Request** dari `feat/beranda-penyelenggara` ke `development` dengan judul **Beranda: integrasi section Penyelenggara**. Di deskripsi PR, tulis singkat apa yang dikerjakan dan lampirkan screenshot desktop serta HP.
