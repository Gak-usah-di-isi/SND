# 08. Finalisasi beranda, bersih-bersih, dan test

**Untuk:** Rafif  
**Tingkat:** Paling sulit  
**Branch:** `feat/landing-finalisasi`  
**Bergantung pada:** **Semua task lain sudah di-merge ke `development`.** Kerjakan paling akhir.

## Tujuan

Menutup pekerjaan landing: beranda tidak lagi memakai data contoh, semua menu aktif, Blade landing lama dihapus, dan ada test otomatis yang memastikan semua halaman landing bisa dibuka.

## Setup awal

```bash
# 1. Pindah ke development dan ambil perubahan terbaru
git checkout development
git pull origin development

# 2. Buat branch baru khusus task ini
git checkout -b feat/landing-finalisasi
```

## Langkah pengerjaan

1. **Matikan data contoh di beranda.** Di `Home.jsx`, `data` sekarang `{ ...landingDummy, ...props }`. Ganti menjadi `props` saja, lalu hapus import `landingDummy`. Setelah itu buka `/` dengan database kosong untuk tahun aktif: tidak boleh error. Section tanpa data harus hilang atau menampilkan pesan kosong.
2. Hapus `resources/js/data/landingDummy.js`, tapi pindahkan dulu daftar "Key -> model" di komentar atas file itu ke komentar di atas `LandingPageController@index`, supaya dokumentasinya tidak hilang.
3. **Beranda pakai `LandingLayoutData`.** Gabungkan `LandingLayoutData::props()` ke props beranda dan hapus penyusunan `layout` manual di `Home.jsx` dari task 01. Pastikan `heroProps` tidak dobel mengambil logo.
4. **Cek semua menu** di `landingNav.js`: tidak boleh ada lagi `disabled: true`. Kalau masih ada, tanyakan ke pemilik task-nya.
5. **Hapus Blade landing lama** yang sudah digantikan halaman React. Sebelum menghapus, cari dulu apakah masih dipakai:

```bash
grep -rn "landingpage.committee\|landingpage.submission\|landingpage.gallery\|landingpage.conference\|landingpage.archives\|landingpage.prevconference\|landingpage.faq\|landingpage.contact\|landingpage.theme_detail" app routes resources
```

   Hapus hanya yang sudah tidak dipakai. Jangan hapus `landingpage/submission/fullpaper.blade.php`, `payment_guidelines`, dan `information-hotel` kecuali sudah dipastikan tidak dipakai.
6. **Test otomatis.** Buat `tests/Feature/LandingPagesTest.php` yang membuka semua halaman landing dan memastikan status 200 serta komponen Inertia-nya benar:

```php
$this->get('/committee/steering')
    ->assertOk()
    ->assertInertia(fn ($page) => $page->component('Landing/Committee/Steering'));
```

   Daftar URL: `/`, `/committee/steering`, `/committee/reviewer`, `/committee/organizing`, `/submission/abstract`, `/submission/presentation`, `/gallery`, `/conference-program`, `/archives`, `/previous-conference`, `/faq`, `/contact`. Test hanya membaca, jangan menulis data ke database.

7. Jalankan `php artisan test --filter=LandingPagesTest` sampai hijau.

## File yang diubah / dihapus

```
resources/js/Pages/Landing/Home.jsx
resources/js/data/landingDummy.js                 (dihapus)
app/Http/Controllers/LandingPageController.php
resources/js/Components/landing/landingNav.js     (kalau masih ada menu disabled)
resources/views/landingpage/...                   (yang sudah tidak dipakai)
tests/Feature/LandingPagesTest.php                (baru)
```

## Checklist selesai

- [ ] Beranda tidak memakai data contoh lagi dan tidak error saat database kosong
- [ ] Tidak ada menu `disabled` di `landingNav.js`
- [ ] Blade landing yang sudah tidak dipakai dihapus
- [ ] `LandingPagesTest` hijau untuk semua URL landing
- [ ] Semua halaman dicek manual di HP 390px

## Commit, push, dan Pull Request

```bash
# 1. Cek file apa saja yang berubah
git status

# 2. Tambahkan hanya file task ini
git add resources/js/Pages/Landing/Home.jsx
git add resources/js/data/landingDummy.js
git add app/Http/Controllers/LandingPageController.php
git add resources/js/Components/landing/landingNav.js
git add resources/views/landingpage
git add tests/Feature/LandingPagesTest.php

# 3. Commit
git commit -m "feat(landing): finalisasi beranda, hapus blade lama, tambah test"

# 4. Ambil development terbaru supaya tidak ketinggalan, selesaikan conflict kalau ada
git pull origin development

# 5. Push
git push origin feat/landing-finalisasi
```

Lalu buka GitHub dan buat **Pull Request** dari `feat/landing-finalisasi` ke `development` dengan judul **Finalisasi beranda, bersih-bersih, dan test**. Di deskripsi PR, tulis singkat apa yang dikerjakan dan lampirkan screenshot desktop serta HP.
