# Catatan Update Production

SQL yang perlu dijalankan langsung di database production (tanpa `php artisan migrate`).

---

## Tabel `symposiums` — Tambah kolom `description` dan soft delete

```sql
ALTER TABLE symposiums
ADD COLUMN description TEXT NULL AFTER abbreviation,
ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL AFTER updated_at;
```

Verifikasi:

```sql
DESCRIBE symposiums;
```

Pastikan kolom `description` dan `deleted_at` sudah muncul.

---

## Tabel `abstracts` — Tambah soft delete

```sql
ALTER TABLE abstracts
ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL AFTER updated_at;
```

Verifikasi:

```sql
DESCRIBE abstracts;
```

Pastikan kolom `deleted_at` sudah muncul.

---

## Tabel `users` — Tambah kolom `name_certificate` (jika belum ada)

```sql
ALTER TABLE users
ADD COLUMN name_certificate VARCHAR(255) NULL AFTER name;
```

Verifikasi:

```sql
DESCRIBE users;
```

Pastikan kolom `name_certificate` sudah muncul. (Migration `2025_07_31_040827` mungkin sudah tercatat di tabel `migrations` namun kolomnya belum ada jika DB di-restore dari dump lama.)

---