## Migrasi Tampilan Email Template ke Inertia React

Halaman **Email Template** (`/admin/email-template/index`) saat ini masih menggunakan Blade PHP lama. Task ini adalah mengganti tampilan front end-nya ke Inertia React, mengikuti pola yang sudah ada di halaman Symposium, dengan tampilan referensi dari `http://127.0.0.1:8000/template/pengaturan/compliance`.

Tidak ada perubahan logic backend, tidak ada fitur baru — **hanya ganti tampilan front end**.

---

## 🚀 Setup Awal

```bash
# 1. Pastikan di branch development dan update terbaru
git checkout development
git pull origin development

# 2. Buat branch fitur baru
git checkout -b feat/email-template-ui
```

---

## 🎯 Yang Harus Dikerjakan

### Tampilan Index — `/admin/email-template/index`

Mirip halaman Compliance di referensi template. Strukturnya:

- **Judul halaman**: `Email Template`
- **Button "Tambah Dokumen"** di kanan atas — tampilkan saja, **tidak perlu difungsikan** (disabled)
- **2 tab** di bawah judul:
  - `Template Email` ← tab aktif default
  - `Template Invoice`
- **Tab "Template Email"** menampilkan card:
  - `Email Template Abstract Accepted` → edit ke `/admin/email-template/abstract_accepted/edit`
  - `Email Template Full Paper Accepted` → edit ke `/admin/email-template/fullpaper_accepted/edit`
- **Tab "Template Invoice"** menampilkan card:
  - `Email Template Abstract Invoice IDR` → edit ke `/admin/email-template/abstract_invoice_idr/edit`
  - `Email Template Abstract Invoice USD` → edit ke `/admin/email-template/abstract_invoice_usd/edit`

### Tampilan Edit — `/admin/email-template/{type}/edit`

Mirip halaman detail Compliance. Strukturnya:

- **Back button** + judul nama template (misal: `Abstract Accepted`)
- **Card/panel** berisi:
  - `FloatInput` multiline (textarea) berlabel `Custom Pesan` — untuk semua tipe
  - `FloatInput` berlabel `Total Pembayaran` — **hanya muncul** untuk tipe `abstract_invoice_idr` dan `abstract_invoice_usd`
- **Validasi tampilan** — jika field `Custom Pesan` kosong saat submit, tampilkan `helperText` error di bawah field (gunakan prop `error` dan `helperText` dari `FloatInput`). Jika tipe invoice dan field `Total Pembayaran` kosong, tampilkan error juga. Jangan submit jika ada field yang wajib kosong.
- **FormActions** di bawah: tombol `Batal` (kembali ke index) dan `Simpan`
- Submit via `router.post` ke `/admin/email-template/{type}/update` dengan:
  - `onSuccess` → toast sukses `'Template berhasil disimpan.'`
  - `onError` → set error ke field yang sesuai dari response Laravel

---

## 📁 File yang Perlu Dibuat / Diubah

### Buat (file baru):

```
resources/js/Pages/Admin/EmailTemplate/Index.jsx
resources/js/Pages/Admin/EmailTemplate/Edit.jsx
```

### Ubah (file yang sudah ada):

```
app/Http/Controllers/Admin/EmailTemplateController.php
```

Perubahan di controller:

```php
// method index() — ganti return view(...) ke:
return Inertia::render('Admin/EmailTemplate/Index');

// method edit() — ganti return view(...) ke:
return Inertia::render('Admin/EmailTemplate/Edit', [
    'emailTemplate' => $emailTemplate,
]);
```

Tambah import di atas controller:

```php
use Inertia\Inertia;
```

---

## 🧩 Komponen yang Dipakai

Semua dari `resources/js/Components/` — **tidak boleh buat komponen baru**.

| Komponen | Path | Kegunaan |
|---|---|---|
| `AdminPageLayout` | `Components/shared/AdminPageLayout.jsx` | wrapper layout halaman |
| `Card` | `Components/ui/card.jsx` | card tiap template |
| `FloatInput` | `Components/ui/FloatInput.jsx` | input textarea & number |
| `FormActions` | `Components/ui/FormActions.jsx` | tombol Batal & Simpan |
| `BackButton` | `Components/ui/BackButton.jsx` | tombol kembali |
| `ToastContainer`, `useToast` | `Components/ui/Toast.jsx` | notifikasi sukses/error |

**Referensi pola lengkap** ada di `resources/js/Pages/Admin/Symposium/Index.jsx` — ikuti persis cara import, cara submit `router.post`, cara handle `onError` dan `onSuccess`, cara pakai `toast.success(...)`.

---

## ✅ Checklist Selesai

- [ ] Halaman index muncul dengan 2 tab (Template Email & Template Invoice)
- [ ] Button "Tambah Dokumen" tampil tapi tidak bisa diklik (disabled)
- [ ] Klik card/tombol edit masuk ke halaman edit yang benar sesuai type
- [ ] Form edit tampil dengan input yang sesuai tipe (invoice ada field Total Pembayaran)
- [ ] Field `Custom Pesan` kosong saat submit → muncul helperText merah di bawah field, form tidak dikirim
- [ ] Field `Total Pembayaran` kosong pada tipe invoice → muncul helperText merah, form tidak dikirim
- [ ] Submit form berhasil simpan dan muncul toast sukses
- [ ] Error dari server muncul sebagai toast error (bukan modal)
- [ ] Semua hover, style mengikuti halaman Symposium

---

## 📤 Selesai — Commit & Push

```bash
git add resources/js/Pages/Admin/EmailTemplate/Index.jsx
git add resources/js/Pages/Admin/EmailTemplate/Edit.jsx
git add app/Http/Controllers/Admin/EmailTemplateController.php

git commit -m "feat: migrasi tampilan email template ke inertia react"

git push origin feat/email-template-ui
```

Setelah push, buat **Pull Request** ke branch `development`.
