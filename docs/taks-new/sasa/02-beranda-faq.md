# 02. Beranda: integrasi section FAQ

**Untuk:** Sasa  
**Tingkat:** Mudah  
**Branch:** `feat/beranda-faq`  
**Bergantung pada:** Tidak ada.

## Tujuan

Section "Pertanyaan yang sering diajukan" di beranda menampilkan FAQ dari database (maksimal 3, sama seperti ICASVE).

## Setup awal

```bash
# 1. Pindah ke development dan ambil perubahan terbaru
git checkout development
git pull origin development

# 2. Buat branch baru khusus task ini
git checkout -b feat/beranda-faq
```

### Cara kerja integrasi beranda

- Section sudah jadi dan tampil memakai data contoh dari `resources/js/data/landingDummy.js`.
- Tugasmu: isi method `faqProps` di `app/Http/Controllers/LandingPageController.php` supaya mengirim key `faqs`.
- Begitu key itu dikirim dari controller, data contoh untuk key tersebut otomatis tertimpa data asli. Section lain tidak terpengaruh.
- **Nama key dan nama field harus sama persis** dengan yang ada di `landingDummy.js`, karena komponen membaca nama itu.
- Kalau datanya kosong di database, kirim array kosong `[]` atau `null`. Section akan menyembunyikan diri atau menampilkan pesan kosong. Jangan mengirim data karangan.
- Hanya ambil kolom yang dipakai (pakai `get([...])` atau `only([...])`), jangan kirim seluruh model.

## Data yang dipakai

Model `App\Models\Faq` (Editor Landing > FAQ), field: `id`, `title` (pertanyaan), `description` (jawaban, HTML).

Tabel FAQ tidak punya kolom `year`. ICASVE memfilter berdasarkan tahun dibuat:

```php
$faqs = Faq::whereYear('created_at', $year)->latest('id')->limit(3)->get(['id', 'title', 'description']);
```

## File yang diubah

```
app/Http/Controllers/LandingPageController.php   (method faqProps saja)
```

Komponen: `resources/js/Components/landing/sections/FaqSection.jsx` (sudah jadi, pakai Accordion).

## Langkah pengerjaan

1. Isi `faqProps(int $year)`.
2. Tambah 4 FAQ di Editor Landing. Pastikan yang tampil hanya 3.
3. Klik pertanyaan: jawaban terbuka. Tekan Tab ke pertanyaan berikutnya lalu Enter: harus bisa dibuka dengan keyboard.
4. Jawaban yang berisi format (tebal, list) dari editor harus tampil rapi.

## Checklist selesai

- [ ] Cek dengan data dari database: isi data di Editor Landing untuk tahun aktif, buka `/`, dan pastikan yang tampil adalah data dari database, bukan data contoh.
- [ ] Maksimal 3 FAQ tampil
- [ ] Accordion bisa dibuka dengan klik dan keyboard
- [ ] Jawaban HTML (tebal, list) tampil rapi
- [ ] Section FAQ hilang saat belum ada FAQ

## Commit, push, dan Pull Request

```bash
# 1. Cek file apa saja yang berubah
git status

# 2. Tambahkan hanya file task ini
git add app/Http/Controllers/LandingPageController.php

# 3. Commit
git commit -m "feat(landing): integrasi section faq di beranda"

# 4. Ambil development terbaru supaya tidak ketinggalan, selesaikan conflict kalau ada
git pull origin development

# 5. Push
git push origin feat/beranda-faq
```

Lalu buka GitHub dan buat **Pull Request** dari `feat/beranda-faq` ke `development` dengan judul **Beranda: integrasi section FAQ**. Di deskripsi PR, tulis singkat apa yang dikerjakan dan lampirkan screenshot desktop serta HP.
