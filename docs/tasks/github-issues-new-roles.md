# Daftar GitHub Issues: Role Bendahara, Sekretaris, & Humas

Dokumen ini berisi daftar issue yang siap langsung di-copy-paste ke **GitHub Issues**.
Total issue: **18 Issues** (dibuat per page sesuai kebutuhan pembagian tugas).

---

## 📑 Ringkasan Daftar Issue

| No | Issue Title | Role | Route | Target File |
|---|---|---|---|---|
| 01 | `[FE-Bendahara] Implementasi Halaman Financial Summary` | Bendahara | `/bendahara/summary` | `resources/js/Pages/Bendahara/Summary/Index.jsx` |
| 02 | `[FE-Bendahara] Implementasi Halaman Verifikasi Payments` | Bendahara | `/bendahara/payments` | `resources/js/Pages/Bendahara/Payment/Index.jsx` |
| 03 | `[FE-Sekretaris] Implementasi Halaman Dashboard Summary` | Sekretaris | `/sekretaris/summary` | `resources/js/Pages/Sekretaris/Summary/Index.jsx` |
| 04 | `[FE-Sekretaris] Implementasi Halaman Data Participants & Export` | Sekretaris | `/sekretaris/participants` | `resources/js/Pages/Sekretaris/Participants/Index.jsx` |
| 05 | `[FE-Sekretaris] Implementasi Halaman Data Abstracts (Read-Only)` | Sekretaris | `/sekretaris/abstracts` | `resources/js/Pages/Sekretaris/Abstracts/Index.jsx` |
| 06 | `[FE-Sekretaris] Implementasi Halaman Abstracts Book & Download PDF` | Sekretaris | `/sekretaris/abstract-book` | `resources/js/Pages/Sekretaris/AbstractBook/Index.jsx` |
| 07 | `[FE-Sekretaris] Implementasi Halaman Payments (Read-Only)` | Sekretaris | `/sekretaris/payments` | `resources/js/Pages/Sekretaris/Payments/Index.jsx` |
| 08 | `[FE-Sekretaris] Implementasi Halaman Certificates (Read-Only)` | Sekretaris | `/sekretaris/certificates` | `resources/js/Pages/Sekretaris/Certificates/Index.jsx` |
| 09 | `[FE-Sekretaris] Implementasi Halaman Reviewers (Read-Only)` | Sekretaris | `/sekretaris/reviewers` | `resources/js/Pages/Sekretaris/Reviewers/Index.jsx` |
| 10 | `[FE-Sekretaris] Implementasi Halaman Email CSV (List & Copy)` | Sekretaris | `/sekretaris/email-csv` | `resources/js/Pages/Sekretaris/EmailCsv/Index.jsx` |
| 11 | `[FE-Humas] Implementasi Halaman Dashboard Summary` | Humas | `/humas/summary` | `resources/js/Pages/Humas/Summary/Index.jsx` |
| 12 | `[FE-Humas] Implementasi Halaman Data Participants & Export` | Humas | `/humas/participants` | `resources/js/Pages/Humas/Participants/Index.jsx` |
| 13 | `[FE-Humas] Implementasi Halaman Data Abstracts (Read-Only)` | Humas | `/humas/abstracts` | `resources/js/Pages/Humas/Abstracts/Index.jsx` |
| 14 | `[FE-Humas] Implementasi Halaman Abstracts Book & Download PDF` | Humas | `/humas/abstract-book` | `resources/js/Pages/Humas/AbstractBook/Index.jsx` |
| 15 | `[FE-Humas] Implementasi Halaman Payments (Read-Only)` | Humas | `/humas/payments` | `resources/js/Pages/Humas/Payments/Index.jsx` |
| 16 | `[FE-Humas] Implementasi Halaman Certificates (Read-Only)` | Humas | `/humas/certificates` | `resources/js/Pages/Humas/Certificates/Index.jsx` |
| 17 | `[FE-Humas] Implementasi Halaman Reviewers (Read-Only)` | Humas | `/humas/reviewers` | `resources/js/Pages/Humas/Reviewers/Index.jsx` |
| 18 | `[FE-Humas] Implementasi Halaman Email CSV (List & Copy)` | Humas | `/humas/email-csv` | `resources/js/Pages/Humas/EmailCsv/Index.jsx` |

---

## 💰 KELOMPOK ISSUE ROLE BENDAHARA

---

### Issue 01: `[FE-Bendahara] Implementasi Halaman Financial Summary`

**Deskripsi:**
Membuat tampilan antarmuka halaman Financial Summary untuk role Bendahara. Halaman ini menampilkan ringkasan penerimaan uang pendaftaran konferensi, status pembayaran, dan daftar transaksi terbaru.

- **Route**: `GET /bendahara/summary`
- **Target File**: `resources/js/Pages/Bendahara/Summary/Index.jsx`
- **Referensi Admin**: `resources/js/Pages/Admin/Summary/Index.jsx`
- **Layout Wrapper**: `BendaharaPageLayout` (`import BendaharaPageLayout from '@/Components/ui/shared/BendaharaPageLayout'`)

**Props dari Controller:**
- `stats`: Object `{ totalIncomeIdr, totalIncomeUsd, totalPayments, pendingPayments, verifiedPayments }`
- `recentPayments`: Array transaksi pembayaran terbaru dengan relasi `user.roles`
- `activeYear`: Tahun aktif konferensi saat ini

**To Do / Checklist:**
- [ ] Buat file `resources/js/Pages/Bendahara/Summary/Index.jsx`
- [ ] Tampilkan 4 kartu statistik keuangan (Total Income, Total Pembayaran, Pending Verification, Verified)
- [ ] Tampilkan tabel transaksi terbaru dengan kolom Peserta, Role, Jumlah (Mata Uang & Nominal), Status, dan Tanggal
- [ ] Sediakan tautan shortcut menuju halaman pembayaran lengkap (`/bendahara/payments`)
- [ ] Pastikan responsive di layar desktop dan mobile

---

### Issue 02: `[FE-Bendahara] Implementasi Halaman Verifikasi Payments`

**Deskripsi:**
Membuat tampilan antarmuka verifikasi pembayaran untuk role Bendahara. Role ini bertugas memvalidasi bukti transfer, memverifikasi atau mengembalikan status pembayaran ke pending, serta mengunduh bukti pembayaran.

- **Route**: `GET /bendahara/payments`
- **Aksi Verifikasi**: `PUT /bendahara/payments/{id}/verify` (body: `{ status: 'verified' | 'pending' | 'rejected' }`)
- **Aksi Unduh Bukti**: `GET /bendahara/payments/{id}/download-proof`
- **Target File**: `resources/js/Pages/Bendahara/Payment/Index.jsx`
- **Referensi Admin**: `resources/js/Pages/Admin/Payment/Index.jsx`
- **Layout Wrapper**: `BendaharaPageLayout`

**Props dari Controller:**
- `payments`: Data pagination pembayaran beserta relasi `user.roles`
- `filters`: Object `{ search, status }`
- `stats`: Object `{ total, pending, verified }`

**To Do / Checklist:**
- [ ] Buat file `resources/js/Pages/Bendahara/Payment/Index.jsx`
- [ ] Tampilkan kartu statistik pembayaran (Total, Pending, Verified)
- [ ] Sediakan filter berdasarkan status pembayaran dan input pencarian nama/email peserta
- [ ] Tampilkan tabel pembayaran: Nama, Kategori/Role, Nominal, Bukti Bayar, Status Badge, dan Aksi
- [ ] Sediakan tombol **Preview Bukti** (modal gambar/file) & tombol **Download Bukti**
- [ ] Sediakan tombol aksi **Verifikasi** (mengubah status menjadi verified) dan **Revert** (mengubah kembali menjadi pending)
- [ ] Berikan feedback notifikasi/toast setelah aksi verifikasi berhasil dilakukan

---

## 📑 KELOMPOK ISSUE ROLE SEKRETARIS (Read & Export Only)

---

### Issue 03: `[FE-Sekretaris] Implementasi Halaman Dashboard Summary`

**Deskripsi:**
Membuat halaman dashboard overview untuk role Sekretaris. Berisi statistik operasional konferensi (total peserta, paper abstrak, status pembayaran, dan reviewer) serta tombol ekspor cepat.

- **Route**: `GET /sekretaris/summary`
- **Target File**: `resources/js/Pages/Sekretaris/Summary/Index.jsx`
- **Referensi Admin**: `resources/js/Pages/Admin/Summary/Index.jsx`
- **Layout Wrapper**: `SekretarisPageLayout`

**Props dari Controller:**
- `stats`: Object `{ totalParticipants, totalAbstracts, totalPayments, verifiedPayments }`
- `activeYear`: Tahun aktif saat ini

**To Do / Checklist:**
- [ ] Buat file `resources/js/Pages/Sekretaris/Summary/Index.jsx`
- [ ] Tampilkan kartu statistik jumlah peserta, naskah abstrak, pembayaran masuk, dan pembayaran verified
- [ ] Sediakan tombol cepat **Export Data Peserta (.xlsx)** menuju `/sekretaris/participants/export`
- [ ] Berikan banner info hak akses sekretariat (Read & Export Only)

---

### Issue 04: `[FE-Sekretaris] Implementasi Halaman Data Participants & Export`

**Deskripsi:**
Membuat halaman tabel daftar seluruh peserta konferensi (presenter & participant) beserta tombol ekspor Excel. Halaman ini murni untuk pemantauan dan rekapitulasi data.

- **Route**: `GET /sekretaris/participants`
- **Tautan Export**: `GET /sekretaris/participants/export`
- **Target File**: `resources/js/Pages/Sekretaris/Participants/Index.jsx`
- **Referensi Admin**: `resources/js/Pages/Admin/Participants/Index.jsx`
- **Layout Wrapper**: `SekretarisPageLayout`

**Props dari Controller:**
- `participants`: Data pagination peserta (user dengan relasi `roles`, `abstracts`, `filePayments`)
- `filters`: Object `{ search, role }`
- `canExport`: `true`
- `canEdit`: `false` (Wajib: TIDAK ADA tombol Create/Edit/Delete!)

**To Do / Checklist:**
- [ ] Buat file `resources/js/Pages/Sekretaris/Participants/Index.jsx`
- [ ] Sediakan input pencarian (nama, email, institusi) dan dropdown filter kategori (Indonesia/Foreign Presenter & Participant)
- [ ] Sediakan tombol **Export Excel (.xlsx)** yang mengarah ke `/sekretaris/participants/export`
- [ ] Tampilkan tabel peserta: Nama, Email, Institusi, Kategori Role, Jumlah Abstrak, dan Status Pembayaran
- [ ] Pasang pagination navigasi halaman
- [ ] **PASTIKAN**: Tidak ada tombol tambah peserta, edit user, atau hapus user

---

### Issue 05: `[FE-Sekretaris] Implementasi Halaman Data Abstracts (Read-Only)`

**Deskripsi:**
Membuat tampilan tabel pemantauan naskah abstrak yang diajukan oleh presenter.

- **Route**: `GET /sekretaris/abstracts`
- **Target File**: `resources/js/Pages/Sekretaris/Abstracts/Index.jsx`
- **Referensi Admin**: `resources/js/Pages/Admin/Abstract/Index.jsx`
- **Layout Wrapper**: `SekretarisPageLayout`

**Props dari Controller:**
- `abstracts`: Data pagination naskah abstrak (relasi `user`, `symposium`)
- `filters`: Object `{ search }`
- `canEdit`: `false`

**To Do / Checklist:**
- [ ] Buat file `resources/js/Pages/Sekretaris/Abstracts/Index.jsx`
- [ ] Sediakan input filter pencarian judul naskah abstrak
- [ ] Tampilkan tabel abstrak: Judul, Author & Institusi, Simposium, Status Review (Accepted/Submitted/Rejected), dan Tanggal Pengajuan
- [ ] Sediakan modal untuk membaca abstrak teks secara lengkap (Read-Only)
- [ ] **PASTIKAN**: Tidak ada tombol assign reviewer, ubah status naskah, atau hapus naskah

---

### Issue 06: `[FE-Sekretaris] Implementasi Halaman Abstracts Book & Download PDF`

**Deskripsi:**
Membuat halaman buku kumpulan abstrak (Abstracts Book) yang dikelompokkan per simposium, serta menyediakan tombol pengunduhan file PDF kumpulan abstrak.

- **Route**: `GET /sekretaris/abstract-book`
- **Tautan Unduh PDF**: `GET /sekretaris/abstract-book/download-pdf?type=all` dan `type=verified`
- **Target File**: `resources/js/Pages/Sekretaris/AbstractBook/Index.jsx`
- **Referensi Admin**: `resources/js/Pages/Admin/AbstractBook/Index.jsx`
- **Layout Wrapper**: `SekretarisPageLayout`

**Props dari Controller:**
- `symposiums`: Collection simposium beserta relasi `abstracts` yang telah di-format author & affiliation

**To Do / Checklist:**
- [ ] Buat file `resources/js/Pages/Sekretaris/AbstractBook/Index.jsx`
- [ ] Tampilkan tab / akordion daftar naskah abstrak per kategori simposium
- [ ] Sediakan tombol unduh **Download All Abstracts PDF** dan **Download Verified Abstracts PDF**
- [ ] Tampilkan detail judul, penulis dengan superscript nomor afiliasi, dan isi abstrak

---

### Issue 07: `[FE-Sekretaris] Implementasi Halaman Payments (Read-Only)`

**Deskripsi:**
Membuat halaman pemantauan data pembayaran untuk Sekretaris. Sekretaris hanya membaca status pembayaran peserta tanpa wewenang mengubah status verifikasi.

- **Route**: `GET /sekretaris/payments`
- **Target File**: `resources/js/Pages/Sekretaris/Payments/Index.jsx`
- **Referensi Admin**: `resources/js/Pages/Admin/Payment/Index.jsx`
- **Layout Wrapper**: `SekretarisPageLayout`

**Props dari Controller:**
- `payments`: Data pagination bukti bayar (relasi `user.roles`)
- `filters`: Object `{ search, status }`
- `canVerify`: `false`

**To Do / Checklist:**
- [ ] Buat file `resources/js/Pages/Sekretaris/Payments/Index.jsx`
- [ ] Tampilkan filter status (Pending/Verified/Rejected) dan input pencarian peserta
- [ ] Tampilkan tabel pembayaran: Nama Peserta, Kategori, Nominal Mata Uang, Status Badge, dan Tanggal Unggah
- [ ] Sediakan modal untuk melihat preview bukti pembayaran
- [ ] **PASTIKAN**: Tidak ada tombol aksi verifikasi atau tolak pembayaran (karena verifikasi adalah hak Bendahara)

---

### Issue 08: `[FE-Sekretaris] Implementasi Halaman Certificates (Read-Only)`

**Deskripsi:**
Membuat halaman rekap status sertifikat peserta dan presenter secara read-only.

- **Route**: `GET /sekretaris/certificates`
- **Target File**: `resources/js/Pages/Sekretaris/Certificates/Index.jsx`
- **Referensi Admin**: `resources/js/Pages/Admin/Certificates/Index.jsx`
- **Layout Wrapper**: `SekretarisPageLayout`

**Props dari Controller:**
- `certificates`: Data pagination sertifikat (relasi `user.filePayment`)
- `stats`: Object `{ total, active, inactive }`
- `search`: String
- `type`: String
- `canEdit`: `false`

**To Do / Checklist:**
- [ ] Buat file `resources/js/Pages/Sekretaris/Certificates/Index.jsx`
- [ ] Tampilkan kartu statistik sertifikat (Total, Aktif, Tidak Aktif)
- [ ] Tampilkan filter pencarian dan tipe sertifikat
- [ ] Tampilkan tabel penerima sertifikat, tipe sertifikat, dan status penerbitan
- [ ] **PASTIKAN**: Tombol switch/toggle status sertifikat di-disable atau ditiadakan (Read-Only)

---

### Issue 09: `[FE-Sekretaris] Implementasi Halaman Reviewers (Read-Only)`

**Deskripsi:**
Membuat halaman daftar Chief Editor, Editor, dan Reviewer untuk keperluan koordinasi sekretariat.

- **Route**: `GET /sekretaris/reviewers`
- **Target File**: `resources/js/Pages/Sekretaris/Reviewers/Index.jsx`
- **Referensi Admin**: `resources/js/Pages/Admin/Reviewer/Index.jsx`
- **Layout Wrapper**: `SekretarisPageLayout`

**Props dari Controller:**
- `reviewers`: Data pagination user reviewer (relasi `roles`)
- `filters`: Object `{ search }`
- `canEdit`: `false`

**To Do / Checklist:**
- [ ] Buat file `resources/js/Pages/Sekretaris/Reviewers/Index.jsx`
- [ ] Sediakan input pencarian nama dan email reviewer
- [ ] Tampilkan tabel reviewer: Nama, Email, Institusi, Role Badge (Chief Editor/Editor/Reviewer), Status
- [ ] **PASTIKAN**: Tidak ada tombol tambah reviewer, edit profil, reset password, atau hapus reviewer

---

### Issue 10: `[FE-Sekretaris] Implementasi Halaman Email CSV (List & Copy)`

**Deskripsi:**
Membuat halaman kompilasi alamat email seluruh peserta dalam format teks CSV (dipisahkan tanda koma) agar mudah disalin untuk keperluan korespondensi massal.

- **Route**: `GET /sekretaris/email-csv`
- **Target File**: `resources/js/Pages/Sekretaris/EmailCsv/Index.jsx`
- **Referensi Admin**: `resources/js/Pages/Admin/EmailCsv/Index.jsx`
- **Layout Wrapper**: `SekretarisPageLayout`

**Props dari Controller:**
- `emailCsv`: String email dipisahkan koma
- `totalEmails`: Total jumlah alamat email

**To Do / Checklist:**
- [ ] Buat file `resources/js/Pages/Sekretaris/EmailCsv/Index.jsx`
- [ ] Tampilkan textarea readonly berisi deretan email CSV
- [ ] Sediakan tombol **Salin Semua Email (Copy to Clipboard)** dengan notifikasi feedback jika berhasil tersalin
- [ ] Tampilkan badge jumlah total email yang tersedia

---

## 📢 KELOMPOK ISSUE ROLE HUMAS (Read & Export Only)

---

### Issue 11: `[FE-Humas] Implementasi Halaman Dashboard Summary`

**Deskripsi:**
Membuat halaman dashboard ringkasan statistik keterlibatan peserta konferensi untuk tim Hubungan Masyarakat (Humas).

- **Route**: `GET /humas/summary`
- **Target File**: `resources/js/Pages/Humas/Summary/Index.jsx`
- **Referensi Admin**: `resources/js/Pages/Admin/Summary/Index.jsx`
- **Layout Wrapper**: `HumasPageLayout`

**Props dari Controller:**
- `stats`: Object `{ totalParticipants, totalAbstracts, totalPayments, verifiedPayments }`
- `activeYear`: Tahun aktif saat ini

**To Do / Checklist:**
- [ ] Buat file `resources/js/Pages/Humas/Summary/Index.jsx`
- [ ] Tampilkan kartu statistik jumlah peserta, naskah paper, dan konfirmasi pembayaran
- [ ] Sediakan tombol cepat **Export Data Peserta (.xlsx)** menuju `/humas/participants/export`
- [ ] Sediakan informasi banner hak akses Humas (Read & Export Only)

---

### Issue 12: `[FE-Humas] Implementasi Halaman Data Participants & Export`

**Deskripsi:**
Membuat halaman rekap peserta untuk keperluan relasi publik, presensi, dan publikasi eksternal.

- **Route**: `GET /humas/participants`
- **Tautan Export**: `GET /humas/participants/export`
- **Target File**: `resources/js/Pages/Humas/Participants/Index.jsx`
- **Referensi Admin**: `resources/js/Pages/Admin/Participants/Index.jsx`
- **Layout Wrapper**: `HumasPageLayout`

**Props dari Controller:**
- `participants`: Data pagination peserta (relasi `roles`, `abstracts`, `filePayments`)
- `filters`: Object `{ search, role }`
- `canExport`: `true`
- `canEdit`: `false`

**To Do / Checklist:**
- [ ] Buat file `resources/js/Pages/Humas/Participants/Index.jsx`
- [ ] Sediakan search bar dan filter kategori peserta
- [ ] Sediakan tombol **Export Excel (.xlsx)** yang mengarah ke `/humas/participants/export`
- [ ] Tampilkan tabel peserta: Nama, Email, Institusi, Asal Negara/Kategori, dan Status
- [ ] **PASTIKAN**: Bersifat Read-Only tanpa tombol create/edit/delete

---

### Issue 13: `[FE-Humas] Implementasi Halaman Data Abstracts (Read-Only)`

**Deskripsi:**
Membuat halaman pemantauan paper dan topik ilmiah yang masuk ke ICASVE untuk bahan rilis media dan publikasi konferensi.

- **Route**: `GET /humas/abstracts`
- **Target File**: `resources/js/Pages/Humas/Abstracts/Index.jsx`
- **Referensi Admin**: `resources/js/Pages/Admin/Abstract/Index.jsx`
- **Layout Wrapper**: `HumasPageLayout`

**Props dari Controller:**
- `abstracts`: Data pagination naskah (relasi `user`, `symposium`)
- `filters`: Object `{ search }`
- `canEdit`: `false`

**To Do / Checklist:**
- [ ] Buat file `resources/js/Pages/Humas/Abstracts/Index.jsx`
- [ ] Sediakan input filter pencarian judul paper
- [ ] Tampilkan tabel paper: Judul, Penulis & Asal Universitas/Institusi, Topik Simposium, dan Status
- [ ] Modal baca abstrak singkat (Read-Only)
- [ ] **PASTIKAN**: Tidak ada tombol edit atau manajemen reviewer

---

### Issue 14: `[FE-Humas] Implementasi Halaman Abstracts Book & Download PDF`

**Deskripsi:**
Membuat halaman buku abstrak simposium konferensi dan tombol download PDF untuk arsip publikasi humas.

- **Route**: `GET /humas/abstract-book`
- **Tautan Unduh PDF**: `GET /humas/abstract-book/download-pdf?type=all` dan `type=verified`
- **Target File**: `resources/js/Pages/Humas/AbstractBook/Index.jsx`
- **Referensi Admin**: `resources/js/Pages/Admin/AbstractBook/Index.jsx`
- **Layout Wrapper**: `HumasPageLayout`

**Props dari Controller:**
- `symposiums`: Collection simposium beserta abstrak yang accepted

**To Do / Checklist:**
- [ ] Buat file `resources/js/Pages/Humas/AbstractBook/Index.jsx`
- [ ] Tampilkan pengelompokan naskah per tema simposium
- [ ] Sediakan tombol unduh file PDF kumpulan abstrak lengkap dan abstrak yang telah terverifikasi
- [ ] Tampilkan format penulis dan afiliasi secara rapi

---

### Issue 15: `[FE-Humas] Implementasi Halaman Payments (Read-Only)`

**Deskripsi:**
Membuat halaman pemantauan data pembayaran tiket pendaftaran untuk monitoring partisipasi peserta.

- **Route**: `GET /humas/payments`
- **Target File**: `resources/js/Pages/Humas/Payments/Index.jsx`
- **Referensi Admin**: `resources/js/Pages/Admin/Payment/Index.jsx`
- **Layout Wrapper**: `HumasPageLayout`

**Props dari Controller:**
- `payments`: Data pagination pembayaran (relasi `user.roles`)
- `filters`: Object `{ search, status }`
- `canVerify`: `false`

**To Do / Checklist:**
- [ ] Buat file `resources/js/Pages/Humas/Payments/Index.jsx`
- [ ] Sediakan filter status dan pencarian nama peserta
- [ ] Tampilkan tabel status pembayaran
- [ ] **PASTIKAN**: Tidak ada tombol verifikasi/revert pembayaran (Read-Only)

---

### Issue 16: `[FE-Humas] Implementasi Halaman Certificates (Read-Only)`

**Deskripsi:**
Membuat halaman pemantauan status penerbitan sertifikat peserta dan pemakalah.

- **Route**: `GET /humas/certificates`
- **Target File**: `resources/js/Pages/Humas/Certificates/Index.jsx`
- **Referensi Admin**: `resources/js/Pages/Admin/Certificates/Index.jsx`
- **Layout Wrapper**: `HumasPageLayout`

**Props dari Controller:**
- `certificates`: Data pagination sertifikat
- `stats`: Object `{ total, active, inactive }`
- `search`: String
- `type`: String
- `canEdit`: `false`

**To Do / Checklist:**
- [ ] Buat file `resources/js/Pages/Humas/Certificates/Index.jsx`
- [ ] Tampilkan rekap statistik sertifikat
- [ ] Tampilkan tabel nama pemilik sertifikat, tipe sertifikat, dan status
- [ ] **PASTIKAN**: Tidak ada aksi toggle aktif/nonaktif sertifikat

---

### Issue 17: `[FE-Humas] Implementasi Halaman Reviewers (Read-Only)`

**Deskripsi:**
Membuat halaman informasi dewan editor dan reviewer konferensi ICASVE.

- **Route**: `GET /humas/reviewers`
- **Target File**: `resources/js/Pages/Humas/Reviewers/Index.jsx`
- **Referensi Admin**: `resources/js/Pages/Admin/Reviewer/Index.jsx`
- **Layout Wrapper**: `HumasPageLayout`

**Props dari Controller:**
- `reviewers`: Data pagination reviewer (relasi `roles`)
- `filters`: Object `{ search }`
- `canEdit`: `false`

**To Do / Checklist:**
- [ ] Buat file `resources/js/Pages/Humas/Reviewers/Index.jsx`
- [ ] Sediakan pencarian nama/email reviewer
- [ ] Tampilkan tabel nama, afiliasi, dan jabatan reviewer
- [ ] **PASTIKAN**: Tidak ada aksi tambah, edit, atau hapus

---

### Issue 18: `[FE-Humas] Implementasi Halaman Email CSV (List & Copy)`

**Deskripsi:**
Membuat halaman kompilasi alamat email peserta konferensi untuk media mailing list dan siaran pers eksternal.

- **Route**: `GET /humas/email-csv`
- **Target File**: `resources/js/Pages/Humas/EmailCsv/Index.jsx`
- **Referensi Admin**: `resources/js/Pages/Admin/EmailCsv/Index.jsx`
- **Layout Wrapper**: `HumasPageLayout`

**Props dari Controller:**
- `emailCsv`: String email berformat CSV
- `totalEmails`: Total email yang ditemukan

**To Do / Checklist:**
- [ ] Buat file `resources/js/Pages/Humas/EmailCsv/Index.jsx`
- [ ] Tampilkan textarea readonly berisi daftar email
- [ ] Sediakan tombol **Salin Semua Email (Copy)** dengan feedback saat diklik
- [ ] Tampilkan badge counter total email
