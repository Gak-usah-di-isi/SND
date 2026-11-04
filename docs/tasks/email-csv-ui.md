## Buat Komponen CsvBox untuk Halaman Email CSV

Halaman **Email CSV** (`/admin/email-csv`) menampilkan kotak textarea read-only berisi daftar email peserta dalam format CSV. Task ini adalah membuat **komponen React baru** `CsvBox` lalu menggunakannya di halaman Email CSV yang sudah ada.

---

## 🚀 Setup Awal

```bash
# 1. Pastikan di branch development dan update terbaru
git checkout development
git pull origin development

# 2. Buat branch fitur baru
git checkout -b feat/email-csv-ui
```

---

## 🎯 Yang Harus Dikerjakan

### 1. Buat Komponen `CsvBox`

Letak file:
```
resources/js/Components/ui/CsvBox.jsx
```

Komponen ini menampilkan kotak textarea read-only + tombol salin. Props yang diterima:

| Prop | Tipe | Keterangan |
|---|---|---|
| `value` | `string` | isi teks CSV yang ditampilkan |
| `description` | `string` | teks deskripsi di atas kotak (opsional) |
| `rows` | `number` | tinggi textarea, default `10` |

Tampilan komponen (lihat referensi di `https://icasve.ub.ac.id/admin/email-csv`):

- Teks deskripsi abu-abu di atas kotak jika prop `description` ada
- Kotak textarea dengan background `#F8FAFC`, border `#E2E8F0`, border-radius 8px
- Textarea **read-only**, font Manrope, tidak bisa di-resize
- Tombol **Salin** di pojok kanan bawah dalam kotak:
  - Warna biru `#0152EA` dengan teks putih
  - Klik → `navigator.clipboard.writeText(value)` → tombol berubah jadi hijau dengan teks `Tersalin!` selama 2 detik, lalu kembali normal
  - Tombol punya icon copy (sebelum salin) dan icon centang (setelah salin)
- Style konsisten dengan komponen lain: font `Manrope`, border-radius `8px`, transisi smooth

### 2. Migrasi Halaman Email CSV ke Inertia React

Buat file halaman baru:
```
resources/js/Pages/Admin/EmailCsv/Index.jsx
```

Struktur halaman:
- `AdminPageLayout` sebagai wrapper
- Judul `Email CSV`
- `Card` berisi komponen `CsvBox` dengan:
  - `value` dari props Inertia `emailCsv`
  - `description` = `"Jika ingin mengirim email ke peserta tertentu, salin daftar berikut (sudah dalam format CSV) dan gunakan sebagai BCC untuk privasi."`
  - `rows={10}`

Ubah controller:
```
app/Http/Controllers/Admin/EmailCsvController.php
```

```php
use Inertia\Inertia;

// index() — ganti return view(...) ke:
return Inertia::render('Admin/EmailCsv/Index', [
    'emailCsv' => $emailCsv,
]);
```

---

## 📁 Ringkasan File

| Aksi | File |
|---|---|
| **Buat baru** | `resources/js/Components/ui/CsvBox.jsx` |
| **Buat baru** | `resources/js/Pages/Admin/EmailCsv/Index.jsx` |
| **Ubah** | `app/Http/Controllers/Admin/EmailCsvController.php` |

---

## 🧩 Komponen yang Dipakai di Halaman

| Komponen | Path | Kegunaan |
|---|---|---|
| `AdminPageLayout` | `Components/shared/AdminPageLayout.jsx` | wrapper layout |
| `Card` | `Components/ui/card.jsx` | wrapper konten |
| `CsvBox` | `Components/ui/CsvBox.jsx` | komponen yang kamu buat |

**Referensi style** lihat komponen lain di `Components/ui/` — font Manrope, warna border `#E2E8F0`, biru `#0152EA`, border-radius `8px`, semua harus konsisten.

---

## ✅ Checklist Selesai

- [ ] Komponen `CsvBox` dibuat di `Components/ui/CsvBox.jsx`
- [ ] Textarea read-only menampilkan isi `value`
- [ ] Tombol Salin berfungsi menyalin ke clipboard
- [ ] Tombol berubah jadi `Tersalin!` (hijau) selama 2 detik setelah diklik
- [ ] Halaman `Admin/EmailCsv/Index.jsx` dibuat dan menggunakan `CsvBox`
- [ ] Controller sudah pakai `Inertia::render`
- [ ] Tampilan konsisten (font, warna, radius) dengan komponen lain

---

## 📤 Selesai — Commit & Push

```bash
git add resources/js/Components/ui/CsvBox.jsx
git add resources/js/Pages/Admin/EmailCsv/Index.jsx
git add app/Http/Controllers/Admin/EmailCsvController.php

git commit -m "feat: buat komponen CsvBox dan migrasi halaman email csv ke inertia react"

git push origin feat/email-csv-ui
```

Setelah push, buat **Pull Request** ke branch `development`.
