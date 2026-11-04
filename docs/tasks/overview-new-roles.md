# Panduan & Arsitektur Implementasi Role Baru: Bendahara, Sekretaris, & Humas

Dokumen ini adalah panduan arsitektur untuk tim frontend/adek tingkat dalam mengimplementasikan antarmuka (UI) untuk 3 role baru pada sistem ICASVE:
1. **Bendahara**: Verifikasi pembayaran dan ringkasan keuangan.
2. **Sekretaris**: Read & Export Only seluruh administrasi konferensi (tanpa menu Settings, Broadcast, Files).
3. **Humas**: Read & Export Only seluruh publikasi & data peserta (tanpa menu Settings, Broadcast, Files).

---

## 🏗️ Backend & Arsitektur yang Sudah Disiapkan
Backend sudah **100% selesai dan siap pakai**. Rekan-rekan frontend tidak perlu mengubah routing atau database:
- ✅ **Database Migration & Seeder**: Role `bendahara`, `sekretaris`, dan `humas` sudah aktif di database dan Laratrust.
- ✅ **Controller**:
  - `app/Http/Controllers/Bendahara/BendaharaController.php`
  - `app/Http/Controllers/Sekretaris/SekretarisController.php`
  - `app/Http/Controllers/Humas/HumasController.php`
- ✅ **Routing (`routes/web.php`)**: Prefix `/bendahara`, `/sekretaris`, dan `/humas` sudah terdaftar dengan middleware role masing-masing.
- ✅ **Auth Redirect**: Saat login dengan akun bendahara/sekretaris/humas, sistem otomatis me-redirect ke dashboard masing-masing.
- ✅ **Sidebar & Shared Layout**:
  - `resources/js/Pages/layout/SidebarItemsBendahara.js`
  - `resources/js/Pages/layout/SidebarItemsSekretaris.js`
  - `resources/js/Pages/layout/SidebarItemsHumas.js`
  - `resources/js/Components/ui/shared/BendaharaPageLayout.jsx`
  - `resources/js/Components/ui/shared/SekretarisPageLayout.jsx`
  - `resources/js/Components/ui/shared/HumasPageLayout.jsx`
- ✅ **Struktur Folder View**: Sudah disiapkan folder kosong siap isi di `resources/js/Pages/Bendahara/`, `resources/js/Pages/Sekretaris/`, dan `resources/js/Pages/Humas/`.

---

## 🔒 Aturan Hak Akses & Constraints (PENTING!)

### 1. Role Bendahara
- **Menu**: Hanya memiliki 2 menu: **DASHBOARD (Summary)** dan **PAYMENTS (Payments)**.
- **Aksi yang Diizinkan**:
  - Melihat ringkasan keuangan & statistik pembayaran.
  - Memfilter dan mencari bukti pembayaran peserta.
  - **Memverifikasi pembayaran** (`PUT /bendahara/payments/{id}/verify`).
  - **Revert status pembayaran** kembali ke pending.
  - **Mengunduh bukti transfer** (`GET /bendahara/payments/{id}/download-proof`).

### 2. Role Sekretaris & Humas
- **Menu yang Tersedia**:
  - `DASHBOARD`: Summary
  - `PARTICIPANTS`: Participants, Abstracts
  - `SYMPOSIUM`: Abstracts Book
  - `PAYMENTS`: Payments, Certificates
  - `REVIEWERS`: Reviewers, Email CSV
- **Menu yang DILARANG / DIHAPUS**:
  - ❌ `Settings` (Pengaturan Konferensi & Tahun)
  - ❌ `Broadcast` (Kirim Undangan, Reminder, Parallel Session)
  - ❌ `Files` (File Manager / Upload File)
- **Aksi yang Diizinkan**:
  - ✅ **READ ONLY**: Melihat data tabel, statistik, dan detail naskah/pembayaran.
  - ✅ **EXPORT ONLY**: Mengunduh rekap Excel (`/export`), mengunduh PDF (`/abstract-book/download-pdf`), dan menyalin daftar email CSV.
- **Aksi yang DILARANG**:
  - ❌ **TIDAK BOLEH** ada tombol Create (Tambah Data Baru).
  - ❌ **TIDAK BOLEH** ada tombol Edit / Update data.
  - ❌ **TIDAK BOLEH** ada tombol Delete (Hapus Data).
  - ❌ **TIDAK BOLEH** ada tombol Toggle Status Sertifikat atau Verifikasi Pembayaran.

---

## 🚀 Panduan Workflow Git untuk Adek Tingkat

Setiap pengerjaan halaman/issue, silakan buat branch baru dari `develop`:

```bash
# 1. Update branch develop lokal
git checkout develop
git pull origin develop

# 2. Buat branch fitur sesuai issue
git checkout -b feat/bendahara-summary
# atau
git checkout -b feat/sekretaris-participants

# 3. Buat file tampilan .jsx di folder yang sudah disiapkan
# 4. Test tampilan di browser
# 5. Commit dan push ke repository
git add .
git commit -m "feat(bendahara): implementasi halaman financial summary"
git push origin feat/bendahara-summary
```

---

## 💡 Cara Mudah Mengerjakan (Copy & Adapt dari Admin)

Sebagian besar tampilan halaman untuk Sekretaris dan Humas persis seperti halaman Admin, hanya **dihilangkan tombol aksinya (Create/Edit/Delete)** dan layout-nya dibungkus dengan layout role masing-masing:

Contoh implementasi halaman:
```jsx
import SekretarisPageLayout from '@/Components/ui/shared/SekretarisPageLayout';

export default function SekretarisParticipants({ participants, filters, canExport }) {
  return (
    <SekretarisPageLayout currentPath="/sekretaris/participants">
      {/* Tampilan tabel data peserta (Read & Export Only) */}
    </SekretarisPageLayout>
  );
}
```
