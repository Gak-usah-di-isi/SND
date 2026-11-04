-- =====================================================================
-- SQL manual pengganti migration untuk fitur Broadcast (Send Invitation,
-- Send Parallel Session, Send Reminder) — dipakai kalau `php artisan
-- migrate` tidak bisa dijalankan langsung di production.
--
-- Mencakup migration:
--   2026_08_17_090000_create_invitation_templates_table
--   2026_08_17_100000_add_venue_date_theme_to_invitation_templates_table
--   2026_08_17_110000_add_rundown_header_fields_to_invitation_templates_table
--   2026_08_17_090001_create_invitation_rundown_items_table
--   2026_08_17_090002_create_invitation_broadcast_logs_table
--   2026_08_18_120000_create_reminder_templates_table
--   2026_08_18_120001_create_reminder_broadcast_logs_table
--   2026_08_19_090000_create_parallel_session_templates_table
--   2026_08_19_090001_create_parallel_session_broadcast_logs_table
--
-- Cara pakai: jalankan seluruh file ini sekali di database production
-- (phpMyAdmin / mysql client / dbForge, dll). Aman dijalankan cuma
-- sekali — kalau nanti kamu run `php artisan migrate` juga, 9
-- migration di atas TIDAK akan dijalankan ulang karena baris
-- INSERT INTO `migrations` di paling bawah sudah menandainya "selesai".
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. invitation_templates (skema akhir, gabungan create + 2 alter)
-- ---------------------------------------------------------------------
CREATE TABLE `invitation_templates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `subject` varchar(255) NOT NULL,
  `zoom_url` varchar(255) NULL,
  `zoom_id` varchar(255) NULL,
  `zoom_pass` varchar(255) NULL,
  `venue` varchar(255) NULL,
  `letter_date` date NULL,
  `pdf_theme_paragraph` longtext NULL,
  `rundown_edition` varchar(255) NULL,
  `organizer` varchar(255) NULL,
  `event_date_label` varchar(255) NULL,
  `created_at` timestamp NULL,
  `updated_at` timestamp NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. invitation_rundown_items
-- ---------------------------------------------------------------------
CREATE TABLE `invitation_rundown_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `time_label` varchar(255) NOT NULL,
  `program` text NOT NULL,
  `pic` text NOT NULL,
  `is_section_header` tinyint(1) NOT NULL DEFAULT 0,
  `sort_order` int unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL,
  `updated_at` timestamp NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. invitation_broadcast_logs
-- ---------------------------------------------------------------------
CREATE TABLE `invitation_broadcast_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NULL,
  `abstract_id` bigint unsigned NULL,
  `status` varchar(255) NOT NULL,
  `error_message` text NULL,
  `is_test` tinyint(1) NOT NULL DEFAULT 0,
  `sent_at` timestamp NULL,
  `created_at` timestamp NULL,
  `updated_at` timestamp NULL,
  PRIMARY KEY (`id`),
  KEY `invitation_broadcast_logs_status_index` (`status`),
  KEY `invitation_broadcast_logs_user_id_foreign` (`user_id`),
  KEY `invitation_broadcast_logs_abstract_id_foreign` (`abstract_id`),
  CONSTRAINT `invitation_broadcast_logs_user_id_foreign`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `invitation_broadcast_logs_abstract_id_foreign`
    FOREIGN KEY (`abstract_id`) REFERENCES `abstracts` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. reminder_templates
-- ---------------------------------------------------------------------
CREATE TABLE `reminder_templates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `subject` varchar(255) NOT NULL,
  `payment_deadline` date NULL,
  `created_at` timestamp NULL,
  `updated_at` timestamp NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. reminder_broadcast_logs
-- ---------------------------------------------------------------------
CREATE TABLE `reminder_broadcast_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NULL,
  `role` varchar(255) NULL,
  `status` varchar(255) NOT NULL,
  `error_message` text NULL,
  `is_test` tinyint(1) NOT NULL DEFAULT 0,
  `sent_at` timestamp NULL,
  `created_at` timestamp NULL,
  `updated_at` timestamp NULL,
  PRIMARY KEY (`id`),
  KEY `reminder_broadcast_logs_user_id_status_index` (`user_id`, `status`),
  CONSTRAINT `reminder_broadcast_logs_user_id_foreign`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. parallel_session_templates
-- ---------------------------------------------------------------------
CREATE TABLE `parallel_session_templates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `subject` varchar(255) NOT NULL,
  `important_notes` text NULL,
  `online_guidelines` text NULL,
  `submission_form_url` varchar(255) NULL,
  `created_at` timestamp NULL,
  `updated_at` timestamp NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 7. parallel_session_broadcast_logs
-- ---------------------------------------------------------------------
CREATE TABLE `parallel_session_broadcast_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NULL,
  `role` varchar(255) NULL,
  `status` varchar(255) NOT NULL,
  `error_message` text NULL,
  `is_test` tinyint(1) NOT NULL DEFAULT 0,
  `sent_at` timestamp NULL,
  `created_at` timestamp NULL,
  `updated_at` timestamp NULL,
  PRIMARY KEY (`id`),
  KEY `parallel_session_broadcast_logs_user_id_status_index` (`user_id`, `status`),
  CONSTRAINT `parallel_session_broadcast_logs_user_id_foreign`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 8. Tandai 9 migration ini "sudah dijalankan" di tabel migrations,
--    supaya `php artisan migrate` nanti tidak mengulang CREATE TABLE
--    di atas (yang bakal error karena tabelnya sudah ada).
--    Batch number otomatis dihitung dari batch terakhir + 1.
-- ---------------------------------------------------------------------
INSERT INTO `migrations` (`migration`, `batch`) VALUES
('2026_08_17_090000_create_invitation_templates_table', (SELECT b FROM (SELECT COALESCE(MAX(batch), 0) + 1 AS b FROM `migrations`) AS t)),
('2026_08_17_090001_create_invitation_rundown_items_table', (SELECT b FROM (SELECT COALESCE(MAX(batch), 0) + 1 AS b FROM `migrations`) AS t)),
('2026_08_17_090002_create_invitation_broadcast_logs_table', (SELECT b FROM (SELECT COALESCE(MAX(batch), 0) + 1 AS b FROM `migrations`) AS t)),
('2026_08_17_100000_add_venue_date_theme_to_invitation_templates_table', (SELECT b FROM (SELECT COALESCE(MAX(batch), 0) + 1 AS b FROM `migrations`) AS t)),
('2026_08_17_110000_add_rundown_header_fields_to_invitation_templates_table', (SELECT b FROM (SELECT COALESCE(MAX(batch), 0) + 1 AS b FROM `migrations`) AS t)),
('2026_08_18_120000_create_reminder_templates_table', (SELECT b FROM (SELECT COALESCE(MAX(batch), 0) + 1 AS b FROM `migrations`) AS t)),
('2026_08_18_120001_create_reminder_broadcast_logs_table', (SELECT b FROM (SELECT COALESCE(MAX(batch), 0) + 1 AS b FROM `migrations`) AS t)),
('2026_08_19_090000_create_parallel_session_templates_table', (SELECT b FROM (SELECT COALESCE(MAX(batch), 0) + 1 AS b FROM `migrations`) AS t)),
('2026_08_19_090001_create_parallel_session_broadcast_logs_table', (SELECT b FROM (SELECT COALESCE(MAX(batch), 0) + 1 AS b FROM `migrations`) AS t));
