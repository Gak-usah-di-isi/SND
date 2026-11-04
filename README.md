# ICASVE

Aplikasi ICASVE berbasis Laravel 11 dengan Vite untuk asset frontend.

## Persyaratan

- PHP `^8.2`
- Composer `^2`
- Node.js `>= 18`
- NPM
- MySQL/MariaDB (atau database lain yang kompatibel Laravel)

## Instalasi

1. Clone repository dan masuk ke folder project.
2. Install dependency backend:

	```bash
	composer install
	```

3. Install dependency frontend:

	```bash
	npm install
	```

4. Buat file environment:

	```bash
	cp .env.example .env
	```

5. Atur konfigurasi database di file `.env` (`DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).

6. Generate app key:

	```bash
	php artisan key:generate
	```

7. Jalankan migrasi database:

	```bash
	php artisan migrate
	```

8. (Opsional) Jika ada seeder awal:

	```bash
	php artisan db:seed
	```

## Menjalankan Project (Development)

Paling praktis (backend + queue + log + vite sekaligus):

```bash
composer run dev
```

Atau jalankan manual di terminal terpisah:

```bash
php artisan serve
php artisan queue:listen --tries=1
npm run dev
```

## Build Asset untuk Production

```bash
npm run build
```

## Testing

```bash
php artisan test
```

## Catatan

- Folder `template/` berisi template frontend terpisah.
- Pastikan ekstensi PHP yang dibutuhkan Laravel aktif (`mbstring`, `openssl`, `pdo`, `tokenizer`, `xml`, `ctype`, `json`, dll).
