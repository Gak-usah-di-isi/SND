# 04. Beranda: integrasi section Pembicara

**Untuk:** Sasa  
**Tingkat:** Sedang  
**Branch:** `feat/beranda-pembicara`  
**Bergantung pada:** Tidak ada.

## Tujuan

Bagan pembicara (pembicara utama dan pembicara tamu) di beranda memakai data Speaker dari database, termasuk foto.

## Setup awal

```bash
# 1. Pindah ke development dan ambil perubahan terbaru
git checkout development
git pull origin development

# 2. Buat branch baru khusus task ini
git checkout -b feat/beranda-pembicara
```

### Cara kerja integrasi beranda

- Section sudah jadi dan tampil memakai data contoh dari `resources/js/data/landingDummy.js`.
- Tugasmu: isi method `speakerProps` di `app/Http/Controllers/LandingPageController.php` supaya mengirim key `keynoteSpeakers` dan `invitedSpeakers`.
- Begitu key itu dikirim dari controller, data contoh untuk key tersebut otomatis tertimpa data asli. Section lain tidak terpengaruh.
- **Nama key dan nama field harus sama persis** dengan yang ada di `landingDummy.js`, karena komponen membaca nama itu.
- Kalau datanya kosong di database, kirim array kosong `[]` atau `null`. Section akan menyembunyikan diri atau menampilkan pesan kosong. Jangan mengirim data karangan.
- Hanya ambil kolom yang dipakai (pakai `get([...])` atau `only([...])`), jangan kirim seluruh model.

## Data yang dipakai

Model `App\Models\Speaker` (Editor Landing > Speakers), field: `id`, `role`, `name`, `institution`, `image`, `country`, `session_topic`, `await_confirmation`.

Nilai `role` di database tidak seragam (ada `keynote_speaker` dan `Keynote Speaker`). Pakai `whereIn`, sama seperti ICASVE:

```php
$fields = ['id', 'name', 'institution', 'image', 'country', 'session_topic', 'await_confirmation'];

$keynote = Speaker::whereIn('role', ['keynote_speaker', 'Keynote Speaker'])
    ->where('year', $year)->get($fields);
// invitedSpeakers: role 'invited_speaker' atau 'Invited Speaker'
```

Pastikan `await_confirmation` terkirim sebagai boolean `true`/`false`, bukan `"0"`/`"1"`. Kalau masih string, tambahkan cast di model `Speaker`: `protected $casts = ['await_confirmation' => 'boolean'];`.

## File yang diubah

```
app/Http/Controllers/LandingPageController.php   (method speakerProps saja)
app/Models/Speaker.php                           (hanya kalau cast diperlukan)
```

Komponen: `resources/js/Components/landing/sections/SpeakersSection.jsx` (bagan dengan garis, CSS-nya di `template.css` kelas `.sd-tree`).

## Langkah pengerjaan

1. Isi `speakerProps(int $year)`.
2. Isi 2 pembicara utama (satu dengan foto, satu tanpa foto) dan 4 pembicara tamu di Editor Landing.
3. Cek garis bagan dengan jumlah berbeda: 1 pembicara utama, 3 pembicara utama, dan 0 pembicara utama. Garis harus tetap menyambung rapi. Kalau ada yang tidak rapi, screenshot dan laporkan di PR.
4. Pembicara dengan "menunggu konfirmasi" dicentang harus menampilkan badge "Menunggu konfirmasi".

## Checklist selesai

- [ ] Cek dengan data dari database: isi data di Editor Landing untuk tahun aktif, buka `/`, dan pastikan yang tampil adalah data dari database, bukan data contoh.
- [ ] Foto tampil, dan pembicara tanpa foto menampilkan inisial
- [ ] Badge "Menunggu konfirmasi" hanya muncul kalau dicentang
- [ ] Garis bagan rapi untuk 1, 2, dan 3 pembicara utama
- [ ] Rapi di HP (bagan berubah jadi vertikal)

## Commit, push, dan Pull Request

```bash
# 1. Cek file apa saja yang berubah
git status

# 2. Tambahkan hanya file task ini
git add app/Http/Controllers/LandingPageController.php
git add app/Models/Speaker.php

# 3. Commit
git commit -m "feat(landing): integrasi section pembicara di beranda"

# 4. Ambil development terbaru supaya tidak ketinggalan, selesaikan conflict kalau ada
git pull origin development

# 5. Push
git push origin feat/beranda-pembicara
```

Lalu buka GitHub dan buat **Pull Request** dari `feat/beranda-pembicara` ke `development` dengan judul **Beranda: integrasi section Pembicara**. Di deskripsi PR, tulis singkat apa yang dikerjakan dan lampirkan screenshot desktop serta HP.
