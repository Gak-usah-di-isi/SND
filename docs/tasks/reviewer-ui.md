## Migrasi Tampilan Reviewer ke Inertia React

Halaman **Reviewer** (`/admin/reviewer`) saat ini masih menggunakan Blade PHP lama. Task ini adalah mengganti tampilan front end-nya ke Inertia React, mengikuti pola yang sudah ada di halaman Symposium, dengan tampilan referensi dari `http://127.0.0.1:8000/template/pasien`.

Tidak ada perubahan logic backend — **hanya ganti tampilan front end**.

---

## 🚀 Setup Awal

```bash
# 1. Pastikan di branch development dan update terbaru
git checkout development
git pull origin development

# 2. Buat branch fitur baru
git checkout -b feat/reviewer-ui
```

---

## 🎯 Yang Harus Dikerjakan

### Tampilan Index — `/admin/reviewer`

Referensi visual: `http://127.0.0.1:8000/template/pasien`

Struktur halaman:

- **Judul halaman**: `Reviewer`
- **Baris toolbar** (di bawah judul):
  - Kiri: tombol **Filter** (gunakan `FilterPopover`) — filter berdasarkan **Jabatan** dengan 3 pilihan: `Chief Editor`, `Editor`, `Reviewer`
  - Kanan: tombol **Export File** (trigger download Excel ke `/admin/reviewer-excel`), tombol **+ Register** (navigasi ke halaman tambah), input **Cari Reviewer**
- **Tabel** (gunakan `DataTable`) dengan kolom:
  - `REVIEWER` — avatar inisial (`InitialBadge`) + nama + email (dua baris, mirip kolom PATIENT di referensi)
  - `INSTITUSI`
  - `JABATAN` — tampilkan sebagai badge (gunakan `StatusBadge`)
  - `ACTION` — icon edit (biru) + icon delete (merah), **cursor pointer saat hover**
- **Pagination** di bawah tabel (gunakan `TablePagination`)
- Klik icon **delete** → muncul `ConfirmDialog` dengan teks: `Hapus reviewer {nama}?`
- Klik icon **edit** → navigasi ke `/admin/reviewer/{id}/edit`

> Catatan: data reviewer dari backend tidak memiliki field nomor telepon. Pada kolom `REVIEWER`, di bawah nama tampilkan nomor telepon dummy hardcode `'08xxxxxxxxxx'` dengan warna abu-abu (`color: #9CA3AF`), persis seperti tampilan dua baris nama + nomor di kolom pada referensi template.

### Tampilan Tambah Reviewer — `/admin/reviewer/create`

Referensi visual: halaman tambah pasien di template.

Struktur halaman:

- **Back button** (`BackButton`) + judul `Tambah Reviewer`
- **Card** berisi form dengan field:
  - `FloatInput` berlabel `Nama Lengkap *`
  - `FloatInput` berlabel `Email *`
  - `FloatInput` berlabel `Institusi *`
  - `FloatSelect` berlabel `Jabatan *` — opsi: `Chief Editor`, `Editor`, `Reviewer`
  - `FloatInput` berlabel `Password *` (type password)
  - `FloatInput` berlabel `Konfirmasi Password *` (type password)
- **Validasi tampilan** — jika field kosong saat submit, tampilkan `helperText` error di bawah field (gunakan prop `error` dan `helperText` dari `FloatInput` / `FloatSelect`). Jangan submit jika ada field kosong.
- **FormActions** di bawah: tombol `Batal` (kembali ke index) + tombol `Simpan`
- Submit via `router.post('/admin/reviewer', {...})` dengan:
  - `onSuccess` → toast sukses `'Reviewer berhasil ditambahkan.'` + kembali ke list
  - `onError` → set error ke field yang sesuai dari response Laravel

### Tampilan Edit Reviewer — `/admin/reviewer/{id}/edit`

Sama persis dengan halaman tambah, kecuali:

- Judul: `Edit Reviewer`
- Field terisi dari data reviewer yang sudah ada (dari props Inertia)
- Field **Password** dan **Konfirmasi Password** tidak wajib — jika dikosongkan, password tidak diubah
- Submit via `router.put('/admin/reviewer/{id}', {...})`
- `onSuccess` → toast sukses `'Reviewer berhasil diperbarui.'`

---

## 📁 File yang Perlu Dibuat / Diubah

### Buat (file baru):

```
resources/js/Pages/Admin/Reviewer/Index.jsx
resources/js/Pages/Admin/Reviewer/Create.jsx
resources/js/Pages/Admin/Reviewer/Edit.jsx
```

### Ubah (file yang sudah ada):

```
app/Http/Controllers/Admin/ReviewerController.php
```

Perubahan di controller — tambah import dan ganti return view:

```php
use Inertia\Inertia;

// index() — ganti return view(...) ke:
return Inertia::render('Admin/Reviewer/Index', [
    'users' => $users,
]);

// create() — ganti return view(...) ke:
return Inertia::render('Admin/Reviewer/Create', [
    'roles' => $roles,
]);

// edit() — ganti return view(...) ke:
return Inertia::render('Admin/Reviewer/Edit', [
    'user'  => $user,
    'roles' => $roles,
]);
```

---

## 🧩 Komponen yang Dipakai

Semua dari `resources/js/Components/` — **tidak boleh buat komponen baru**.

| Komponen | Path | Kegunaan |
|---|---|---|
| `AdminPageLayout` | `Components/shared/AdminPageLayout.jsx` | wrapper layout halaman |
| `DataTable` | `Components/ui/DataTable.jsx` | tabel data reviewer |
| `TablePagination` | `Components/ui/TablePagination.jsx` | pagination bawah tabel |
| `FilterPopover` | `Components/ui/FilterPopover.jsx` | filter jabatan |
| `InitialBadge` | `Components/ui/InitialBadge.jsx` | avatar inisial nama |
| `StatusBadge` | `Components/ui/StatusBadge.jsx` | badge jabatan |
| `ConfirmDialog` | `Components/ui/ConfirmDialog.jsx` | konfirmasi hapus |
| `Card` | `Components/ui/card.jsx` | wrapper form |
| `FloatInput` | `Components/ui/FloatInput.jsx` | semua input teks/password |
| `FloatSelect` | `Components/ui/FloatSelect.jsx` | dropdown jabatan |
| `FormActions` | `Components/ui/FormActions.jsx` | tombol Batal & Simpan |
| `BackButton` | `Components/ui/BackButton.jsx` | tombol kembali |
| `ToastContainer`, `useToast` | `Components/ui/Toast.jsx` | notifikasi sukses/error |

**Referensi pola lengkap** ada di `resources/js/Pages/Admin/Symposium/Index.jsx` — ikuti persis cara import, cara submit `router.post`, cara handle `onError` dan `onSuccess`, cara pakai `toast.success(...)`, cara pakai `ConfirmDialog`.

---

## ✅ Checklist Selesai

- [ ] Halaman index tampil dengan tabel kolom: Reviewer, Institusi, Jabatan, Action
- [ ] Filter jabatan berfungsi (Chief Editor / Editor / Reviewer)
- [ ] Tombol Export File trigger download Excel
- [ ] Icon edit dan delete muncul, cursor berubah jadi tangan saat hover
- [ ] Klik delete muncul `ConfirmDialog`, konfirmasi hapus data + toast sukses
- [ ] Klik edit navigasi ke halaman edit dengan data terisi
- [ ] Halaman tambah: semua field tampil dengan validasi (field kosong → helperText merah)
- [ ] Submit tambah berhasil → toast sukses + kembali ke list
- [ ] Submit edit berhasil → toast sukses + kembali ke list
- [ ] Pagination berfungsi

---

## 📤 Selesai — Commit & Push

```bash
git add resources/js/Pages/Admin/Reviewer/Index.jsx
git add resources/js/Pages/Admin/Reviewer/Create.jsx
git add resources/js/Pages/Admin/Reviewer/Edit.jsx
git add app/Http/Controllers/Admin/ReviewerController.php

git commit -m "feat: migrasi tampilan reviewer ke inertia react"

git push origin feat/reviewer-ui
```

Setelah push, buat **Pull Request** ke branch `development`.
