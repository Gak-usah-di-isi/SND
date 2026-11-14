# Task Landing Page Seminar DAMPAK

Target: beranda tersambung ke database editor landing, dan semua menu di navbar punya halaman sendiri yang juga tersambung ke database.

Ada 24 task, 8 per orang. Di folder masing-masing, task diurutkan dari yang paling mudah (01) sampai yang paling sulit (08). Kerjakan berurutan.

| No | Rafif | Sasa | Tita |
|---|---|---|---|
| 01 | Layout bersama halaman landing (wajib duluan) | Beranda: Penyelenggara | Beranda: Kontak |
| 02 | Beranda: Tentang | Beranda: FAQ | Beranda: Lokasi |
| 03 | Beranda: SDGs | Beranda: Call for Abstract | Beranda: Tanggal penting + poster |
| 04 | Beranda: Hero + logo | Beranda: Pembicara | Halaman Panduan Abstrak |
| 05 | Halaman Komite Pengarah | Halaman Panitia Pelaksana | Halaman Panduan Presentasi |
| 06 | Halaman Komite Reviewer | Halaman FAQ | Halaman Kontak + form |
| 07 | Halaman Galeri | Halaman Detail Subtema | Halaman Program |
| 08 | Finalisasi beranda + test | Halaman Arsip | Halaman Seminar Sebelumnya |

## Urutan dan ketergantungan

- **Rafif 01 dikerjakan paling awal.** Semua task "Halaman ..." memakai `LandingLayout` dari task ini. Sambil menunggu PR Rafif 01 di-merge, Sasa dan Tita mengerjakan task beranda mereka (01 sampai 03 atau 04), yang tidak bergantung pada task lain.
- **Rafif 08 dikerjakan paling akhir**, setelah semua task lain di-merge ke `development`.
- Task beranda masing-masing mengisi method sendiri di `LandingPageController`, dan section-nya sudah dipisah per file. Jadi tiga orang bisa mengerjakan beranda bersamaan tanpa bentrok.

## Aturan kerja

1. Selalu mulai dari `development` terbaru, lalu buat branch baru per task (nama branch sudah ditulis di tiap task).
2. Satu task = satu branch = satu Pull Request ke `development`.
3. Jangan mengubah file milik task orang lain. Kalau perlu, bilang dulu di grup.
4. Sebelum PR, tarik `development` terbaru ke branch kamu (`git pull origin development`). Kalau ada conflict, selesaikan dulu.
5. Pesan commit pakai format `feat(landing): ...` atau `fix(landing): ...`, dalam bahasa Indonesia.

## Peta kode landing

| Yang dicari | Lokasi |
|---|---|
| Halaman beranda | `resources/js/Pages/Landing/Home.jsx` |
| Section beranda (satu file per section) | `resources/js/Components/landing/sections/` |
| Komponen UI (shadcn/ui) | `resources/js/Components/landing/ui/` (button, card, badge, accordion, avatar, form, sheet, navigation-menu) |
| Judul section, stabilo emas, pesan kosong | `resources/js/Components/landing/sections/SectionParts.jsx` (`SectionHeading`, `Mark`, `EmptyNote`) |
| Kelas tata letak | `resources/js/Components/landing/landingStyles.js` (`container`, `section`, `h2`, `lead`) |
| Helper | `resources/js/Components/landing/landingUtils.js` (`assetUrl`, `formatDate`, `initials`, `waLink`) |
| Menu navbar | `resources/js/Components/landing/landingNav.js` |
| Data contoh beranda | `resources/js/data/landingDummy.js` |
| Controller beranda | `app/Http/Controllers/LandingPageController.php` |
| Warna (token `sd-*`) | `resources/css/template.css` |

## Aturan tampilan

- Pakai komponen dari `Components/landing/ui`, jangan dari `Components/ui` (yang itu khusus dashboard).
- Warna hanya dari token `sd-*` (`bg-sd-ink`, `text-sd-muted`, `bg-sd-paper`, `text-sd-gold-ink`, dan seterusnya). Jangan pakai `blue-600` atau warna acak.
- Semua teks dalam bahasa Indonesia. Jangan pakai tanda em dash (—).
- Jangan mengarang data (nama orang, angka, testimoni). Kalau datanya kosong, tampilkan `EmptyNote` dengan kalimat yang jelas, misalnya "Galeri tahun ini belum tersedia."
- Path gambar dari database selalu lewat `assetUrl(path)`.
- Cek tampilan di lebar HP (390px, pakai DevTools) dan pastikan semua tombol atau link bisa dipakai dengan keyboard (Tab, Enter).

## Cara menjalankan

```bash
php artisan serve
npm run dev
```

Data diisi lewat menu **Editor Landing** di dashboard (login dengan akun yang punya akses editor landing). Isi data untuk tahun yang aktif, lalu cek halaman landing.

Untuk form kontak, pastikan `.env` memakai `MAIL_MAILER=log` supaya email tidak benar-benar terkirim saat testing. Email akan tercatat di `storage/logs/laravel.log`.
