# Migrasi Landing Editor ke Inertia React

Dashboard **Admin** (`/admin/...`) sudah full dimigrasi ke Inertia React (`resources/js/Pages/Admin/`). Sekarang giliran **Landing Editor** (`/landing/...`, role `landing-editor`) — 14 modul CRUD yang sekarang masih Blade murni di `resources/views/landingpage-editor/`.

Referensi tampilan lama: buka `http://127.0.0.1:8000/landing/landingpage` (atau modul lain di sidebar landing-editor) untuk lihat behavior yang harus dipertahankan sebelum diubah tampilannya.

## Kenapa 15 "modul" tapi 14 link sidebar?

Sidebar landing-editor (`resources/views/layouts/partials/sidebar.blade.php`, baris 555–567) ternyata punya **bug duplikat** — ada 2 menu item "Previous Conference" yang keduanya nunjuk ke route yang sama (`landing.prevconference.index`). Jadi cuma ada **14 modul nyata**. Biar tetap bisa dibagi rapi 5/5/5 ke 3 orang (15 task) sekaligus sekalian benerin bug-nya, modul **Landing Page** (yang isinya 9 sub-halaman — paling gede sendiri) saya pecah jadi 2 task terpisah. Waktu ngerjain, siapa pun yang megang salah satu Landing Page part tolong sekalian hapus 1 baris duplikat menu "Previous Conference" itu (lihat detail di task masing-masing).

## Fondasi bersama (sudah dibuatkan, jangan bikin ulang)

Supaya Joshua/Jonathan/Rendi gak bikin file yang sama secara paralel dan bentrok pas merge, 2 file fondasi berikut **sudah dibuat** di branch ini, tinggal di-`git pull`:

| File | Fungsi |
|---|---|
| `resources/js/Components/shared/LandingEditorPageLayout.jsx` | Pengganti `AdminPageLayout` khusus landing-editor — sama persis polanya, tinggal `import LandingEditorPageLayout from '../../../Components/shared/LandingEditorPageLayout'` di tiap halaman. |
| `resources/js/Pages/layout/SidebarItemsLandingEditor.js` | Konfigurasi menu sidebar landing-editor (14 modul, sudah dikelompokkan). Kalau nambah sub-halaman baru, cukup edit array di file ini — jangan bikin file config sendiri. |

Kedua file ini **jangan diedit isinya besar-besaran** tanpa koordinasi — kalau butuh nambah 1 baris menu, silakan, tapi jangan restrukturisasi sendirian karena dipakai bareng 3 orang.

## Konvensi folder (WAJIB diikuti biar gak tabrakan)

Setiap modul dapat folder sendiri di bawah `resources/js/Pages/LandingEditor/<NamaModul>/`, isinya:

```
resources/js/Pages/LandingEditor/<NamaModul>/Index.jsx        # list + tombol tambah/edit/hapus
resources/js/Pages/LandingEditor/<NamaModul>/<NamaModul>Form.jsx  # 1 form dipakai buat create & edit (mode="create"|"edit")
```

Ini **beda dari Blade lama** yang punya 3 file terpisah (`index.blade.php`, `create.blade.php`, `edit.blade.php`). Di React, ikuti pola yang sudah dipakai di Admin: **1 form component dipakai ulang untuk create & edit**, ditampilkan sebagai modal/drawer di halaman `Index.jsx` yang sama — bukan halaman/route terpisah. Contoh referensi kode yang sudah ada:
- `resources/js/Pages/Admin/Participants/Index.jsx` + `resources/js/Pages/Admin/Participants/ParticipantForm.jsx`
- `resources/js/Pages/Admin/Symposium/Index.jsx`

Karena tiap orang cuma nulis file **di folder modulnya sendiri-sendiri**, dan folder itu belum ada isinya sama sekali (git gak bisa nyimpen folder kosong, jadi folder ini baru "muncul" pas kalian bikin file pertama di dalamnya) — gak akan ada file yang sama-sama diedit 2 orang. Aman kerja paralel.

Controller yang perlu diubah **hanya method yang return Blade view** (`index`, `create`, `edit`) — ganti jadi `Inertia::render(...)`. Method `store`, `update`, `destroy` **tidak perlu diubah** (tetap `redirect()->back()`, Inertia otomatis refresh data di halaman).

## Pembagian Tugas (5 issue per orang)

| | Joshua | Jonathan | Rendi |
|---|---|---|---|
| 1 | Logo | Landing Page — Part 2 (Deadline, Reg. Fee, Venue, Publications Journal, Contact) | Committee (Steering, Reviewer, Organizing) |
| 2 | Landing Page — Part 1 (Title, About, Speakers, Poster) | Call for Paper (Themes) | Submission Guidelines (Abstract, Fullpaper, Presentation) |
| 3 | Whatsapp | FAQ | Conference Program (Program + Detail) |
| 4 | Instagram | Newsletter | Previous Conference |
| 5 | Setting | Gallery | Payment Guidelines |

Detail lengkap tiap task ada di file terpisah (1 file = 1 issue, tinggal copas isinya ke GitHub Issues):

**Joshua** (`joshua/`)
- [`01-logo.md`](./joshua/01-logo.md)
- [`02-landing-page-part-1.md`](./joshua/02-landing-page-part-1.md)
- [`03-whatsapp.md`](./joshua/03-whatsapp.md)
- [`04-instagram.md`](./joshua/04-instagram.md)
- [`05-setting.md`](./joshua/05-setting.md)

**Jonathan** (`jonathan/`)
- [`01-landing-page-part-2.md`](./jonathan/01-landing-page-part-2.md)
- [`02-call-for-paper.md`](./jonathan/02-call-for-paper.md)
- [`03-faq.md`](./jonathan/03-faq.md)
- [`04-newsletter.md`](./jonathan/04-newsletter.md)
- [`05-gallery.md`](./jonathan/05-gallery.md)

**Rendi** (`rendi/`)
- [`01-committee.md`](./rendi/01-committee.md)
- [`02-submission-guidelines.md`](./rendi/02-submission-guidelines.md)
- [`03-conference-program.md`](./rendi/03-conference-program.md)
- [`04-previous-conference.md`](./rendi/04-previous-conference.md)
- [`05-payment-guidelines.md`](./rendi/05-payment-guidelines.md)

## Alur kerja git (sama untuk semua)

```bash
git checkout development
git pull origin development
git checkout -b feat/<nama-branch-sesuai-task>
# ...kerjain...
git add <file-file-yang-diubah>
git commit -m "feat: <pesan>"
git push origin feat/<nama-branch-sesuai-task>
```

Push lalu buat Pull Request ke branch `development`. Style referensi (warna, font, border-radius) ikutin komponen yang sudah ada di `resources/js/Components/ui/` — semua pakai font **Manrope**, warna biru `#0152EA`, border `#E2E8F0`, radius `8px`.
