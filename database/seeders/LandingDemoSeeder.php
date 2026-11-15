<?php

namespace Database\Seeders;

use App\Models\About;
use App\Models\AbstractGuideline;
use App\Models\ConferenceDetail;
use App\Models\ConferenceProgram;
use App\Models\ConferenceTitle;
use App\Models\Contact;
use App\Models\DeadlineDate;
use App\Models\Faq;
use App\Models\Gallery;
use App\Models\LandingSetting;
use App\Models\OrganizingCommittee;
use App\Models\PresentationGuideline;
use App\Models\Prevconference;
use App\Models\PublicationsJournal;
use App\Models\ReviewerCommittee;
use App\Models\Speaker;
use App\Models\SteeringCommittee;
use App\Models\Theme;
use App\Models\Venue;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

/**
 * Data contoh untuk landing page (khusus lokal/demo, tidak dipanggil DatabaseSeeder).
 *
 *   php artisan db:seed --class=LandingDemoSeeder
 *
 * - Mengisi tahun yang aktif di LandingSetting.
 * - Hanya mengisi tabel yang masih KOSONG untuk tahun itu, jadi data asli dari
 *   Editor Landing tidak pernah ditimpa. Aman dijalankan ulang.
 * - Teks berupa placeholder yang jelas ("Nama Pembicara Utama 1", "panitia@example.com"),
 *   bukan data karangan yang terlihat asli. Ganti lewat Editor Landing.
 * - Gambar disalin ke storage/app/public/landing-demo, sama seperti hasil upload editor.
 */
class LandingDemoSeeder extends Seeder
{
    private int $year;

    public function run(): void
    {
        $this->year = (int) (LandingSetting::where('is_active', true)->value('year') ?? date('Y'));
        $this->command?->info("Mengisi data contoh landing untuk tahun {$this->year}");

        $building = $this->copyImage('images/voks.webp', 'landing-demo/gedung-vokasi.webp');
        $buildingWide = $this->copyImage('images/Lab.jpeg', 'landing-demo/gedung-vokasi-lebar.jpeg');
        $logoUb = $this->copyImage('images/logoub.png', 'landing-demo/logo-ub.png');
        $logoVokasi = $this->copyImage('images/vokasi_ub.png', 'landing-demo/logo-vokasi-ub.png');

        $y = $this->year;

        $this->seedOnce('Judul konferensi', ConferenceTitle::where('year', $y), fn () => ConferenceTitle::create([
            'title' => 'Seminar Nasional Pengabdian kepada Masyarakat dan Inovasi Terapan',
            'description' => 'Diseminasi Aksi Masyarakat, Pengabdian, Aplikasi, dan Karya',
            'year' => $y,
        ]));

        $this->seedOnce('Tentang', About::where('year', $y), fn () => About::create([
            'title' => "Tentang Seminar DAMPAK {$y}",
            'content' => '<p>Seminar DAMPAK diselenggarakan oleh BPPM Fakultas Vokasi Universitas Brawijaya untuk mempertemukan dosen, peneliti, praktisi, dan mahasiswa yang menjalankan pengabdian kepada masyarakat maupun riset terapan.</p>'
                . '<p>Peserta cukup mengirim abstrak, tanpa makalah lengkap. Setiap abstrak dikaitkan dengan satu atau lebih Tujuan Pembangunan Berkelanjutan (SDGs), ditelaah reviewer, lalu yang diterima mendapat LoA, dipresentasikan saat seminar, dan dihimpun dalam Book of Abstracts.</p>',
            'image' => $buildingWide,
            'year' => $y,
        ]));

        $this->seedOnce('Pembicara', Speaker::where('year', $y), function () use ($y) {
            $speakers = [
                ['keynote_speaker', 'Nama Pembicara Utama 1', 'Topik sesi pembicara utama', false],
                ['keynote_speaker', 'Nama Pembicara Utama 2', 'Topik sesi pembicara utama', true],
                ['invited_speaker', 'Nama Pembicara Tamu 1', null, false],
                ['invited_speaker', 'Nama Pembicara Tamu 2', null, false],
                ['invited_speaker', 'Nama Pembicara Tamu 3', null, false],
                ['invited_speaker', 'Nama Pembicara Tamu 4', null, true],
            ];
            foreach ($speakers as [$role, $name, $topic, $pending]) {
                Speaker::create([
                    'role' => $role,
                    'name' => $name,
                    'institution' => 'Instansi pembicara',
                    // Kolom wajib diisi; string kosong = belum ada foto, halaman menampilkan inisial.
                    'image' => '',
                    'country' => 'Indonesia',
                    'session_topic' => $topic,
                    'await_confirmation' => $pending,
                    'year' => $y,
                ]);
            }
        });

        $this->seedOnce('Subtema', Theme::where('year', $y), function () use ($y) {
            $themes = [
                'Inovasi teknologi tepat guna untuk masyarakat',
                'Pemberdayaan ekonomi dan UMKM',
                'Pendidikan, kesehatan, dan sumber daya manusia',
                'Lingkungan, energi, dan ketahanan pangan',
            ];
            foreach ($themes as $title) {
                Theme::create([
                    'title' => $title,
                    'description' => '<p>Deskripsi subtema ini diisi dari menu Call for Paper di Editor Landing.</p>',
                    'year' => $y,
                ]);
            }
        });

        $this->seedOnce('Tanggal penting', DeadlineDate::where('year', $y), function () use ($y) {
            $dates = [
                ['Pengiriman abstrak dibuka', "{$y}-10-01"],
                ['Batas akhir pengiriman abstrak', "{$y}-11-15"],
                // Nama sama dengan tanggal lebih baru = tenggat diperpanjang (tanggal lama dicoret).
                ['Batas akhir pengiriman abstrak', "{$y}-11-30"],
                ['Pengumuman hasil review', "{$y}-12-05"],
                ['Batas unggah revisi abstrak', "{$y}-12-12"],
                ['Pelaksanaan seminar', "{$y}-12-19"],
            ];
            foreach ($dates as [$name, $date]) {
                DeadlineDate::create(['name' => $name, 'date' => $date, 'year' => $y]);
            }
        });

        $this->seedOnce('Lokasi', Venue::where('year', $y), fn () => Venue::create([
            'image_path' => $building,
            'venue_name' => 'Fakultas Vokasi Universitas Brawijaya',
            'address' => 'Jl. Veteran No.12-16, Ketawanggede, Kec. Lowokwaru, Kota Malang, Jawa Timur',
            'date' => "{$y}-12-19",
            'link_map' => 'https://www.google.com/maps/search/?api=1&query=Fakultas+Vokasi+Universitas+Brawijaya',
            'map' => '<iframe src="https://www.google.com/maps/embed?origin=mfe&pb=!1m2!2m1!1sFakultas+Vokasi+Universitas+Brawijaya" title="Peta lokasi seminar" loading="lazy"></iframe>',
            'conference_mode' => 'Hybrid',
            'onsite_programme' => 'Presentasi luring dan diskusi',
            'online_programme' => 'Presentasi daring melalui ruang virtual',
            'year' => $y,
        ]));

        $this->seedOnce('Logo penyelenggara', PublicationsJournal::where('year', $y)->where('image_type', 'hosted_by'), function () use ($y, $logoUb, $logoVokasi) {
            foreach ([$logoUb, $logoVokasi] as $path) {
                PublicationsJournal::create(['image_type' => 'hosted_by', 'image_path' => $path, 'year' => $y]);
            }
        });

        // Tabel faqs tidak punya kolom year; beranda memfilter dari tahun dibuat.
        $this->seedOnce('FAQ', Faq::query(), function () {
            $faqs = [
                ['Apakah saya perlu mengirim makalah lengkap?', 'Tidak. Seminar ini hanya meminta abstrak. Abstrak yang diterima dipresentasikan saat seminar dan diterbitkan di Book of Abstracts.'],
                ['Bolehkah memilih lebih dari satu SDG?', 'Boleh. Saat mengunggah abstrak, pilih semua tujuan SDGs yang relevan dengan kegiatan atau hasil riset Anda.'],
                ['Apa yang terjadi jika abstrak saya perlu revisi?', 'Editor memberi keputusan revisi beserta catatan reviewer. Anda mengunggah abstrak perbaikan dari dasbor, lalu editor memberi keputusan akhir.'],
                ['Apakah seminar ini berbayar?', 'Biaya ditentukan setiap tahun. Jika tahun berjalan berbayar, tagihan baru muncul setelah abstrak dinyatakan diterima, dan LoA terbit setelah pembayaran diverifikasi.'],
            ];
            foreach ($faqs as [$q, $a]) {
                Faq::create(['title' => $q, 'description' => "<p>{$a}</p>"]);
            }
        });

        $this->seedOnce('Kontak', Contact::where('year', $y), fn () => Contact::create([
            'phone1' => '080000000000',
            'phone1_name' => 'Nama Narahubung 1',
            'phone2' => '080000000001',
            'phone2_name' => 'Nama Narahubung 2',
            'email' => 'panitia@example.com',
            'address' => 'BPPM Fakultas Vokasi Universitas Brawijaya, Jl. Veteran No.12-16, Malang',
            'year' => $y,
        ]));

        $this->seedOnce('Komite Pengarah', SteeringCommittee::where('year', $y), function () use ($y) {
            foreach (range(1, 3) as $i) {
                SteeringCommittee::create(['name' => "Nama Komite Pengarah {$i}", 'institution' => 'Instansi anggota', 'country' => 'Indonesia', 'year' => $y]);
            }
        });

        $this->seedOnce('Komite Reviewer', ReviewerCommittee::where('year', $y), function () use ($y) {
            foreach (range(1, 6) as $i) {
                ReviewerCommittee::create(['name' => "Nama Reviewer {$i}", 'institution' => 'Instansi reviewer', 'country' => 'Indonesia', 'year' => $y]);
            }
        });

        $this->seedOnce('Panitia Pelaksana', OrganizingCommittee::where('year', $y), function () use ($y) {
            $members = [
                ['Nama Ketua Panitia', 'Ketua'],
                ['Nama Sekretaris', 'Sekretaris'],
                ['Nama Bendahara', 'Bendahara'],
                ['Nama Anggota Acara 1', 'Seksi Acara'],
                ['Nama Anggota Acara 2', 'Seksi Acara'],
                ['Nama Anggota Publikasi', 'Seksi Publikasi'],
            ];
            foreach ($members as [$name, $category]) {
                OrganizingCommittee::create(['name' => $name, 'category' => $category, 'year' => $y]);
            }
        });

        $this->seedOnce('Panduan abstrak', AbstractGuideline::where('year', $y), fn () => AbstractGuideline::create([
            'year' => $y,
            'content' => '<h2>Ketentuan abstrak</h2><ol><li>Abstrak ditulis dalam bahasa Indonesia.</li><li>Pilih satu atau lebih SDGs yang relevan saat mengunggah.</li><li>Isi panduan lengkap diisi dari menu Submission di Editor Landing.</li></ol>',
            'pdf_file' => null,
        ]));

        $this->seedOnce('Panduan presentasi', PresentationGuideline::where('year', $y), fn () => PresentationGuideline::create([
            'year' => $y,
            'content' => '<h2>Ketentuan presentasi</h2><ul><li>Presenter mengunggah materi dari dasbor.</li><li>Isi panduan lengkap diisi dari menu Submission di Editor Landing.</li></ul>',
            'pdf_file' => null,
        ]));

        $this->seedOnce('Galeri', Gallery::where('year', $y), function () use ($y, $building, $buildingWide) {
            $gallery = Gallery::create(['year' => $y]);
            foreach ([$building, $buildingWide] as $path) {
                $gallery->images()->create(['image_path' => $path]);
            }
        });

        $this->seedOnce('Detail konferensi', ConferenceDetail::where('year', $y), fn () => ConferenceDetail::create([
            'title' => "Seminar DAMPAK {$y}",
            'theme' => 'Diseminasi Aksi Masyarakat, Pengabdian, Aplikasi, dan Karya',
            'university' => 'Universitas Brawijaya',
            'hosted' => 'BPPM Fakultas Vokasi Universitas Brawijaya',
            'date' => "{$y}-12-19",
            'year' => $y,
        ]));

        $this->seedOnce('Program acara', ConferenceProgram::where('year', $y), function () use ($y) {
            $sessions = [
                ['08:00', '08:30', 'Registrasi peserta'],
                ['08:30', '09:00', 'Pembukaan'],
                ['09:00', '10:30', 'Sesi pembicara utama'],
                ['10:30', '12:00', 'Presentasi paralel per subtema'],
                ['12:00', '12:30', 'Penutupan'],
            ];
            foreach ($sessions as [$start, $end, $name]) {
                ConferenceProgram::create([
                    'year' => $y,
                    'day_number' => 1,
                    'date' => "{$y}-12-19",
                    'start_time' => $start,
                    'end_time' => $end,
                    'program_name' => $name,
                    'pic' => 'Nama penanggung jawab',
                ]);
            }
        });

        // Seminar sebelumnya: satu edisi contoh untuk tahun sebelumnya.
        $this->seedOnce('Seminar sebelumnya', Prevconference::query(), fn () => Prevconference::create([
            'image' => $buildingWide,
            'title' => 'Seminar DAMPAK ' . ($y - 1),
            'description' => 'Ringkasan edisi sebelumnya diisi dari menu Prev Conference di Editor Landing.',
            'keynote' => 'Nama pembicara utama edisi sebelumnya',
            'date' => ($y - 1) . '-12-01',
            'location' => 'Fakultas Vokasi Universitas Brawijaya',
            'pdf' => null,
            'year' => $y - 1,
        ]));
    }

    /** Jalankan $create hanya bila $query belum punya data. */
    private function seedOnce(string $label, $query, callable $create): void
    {
        if ($query->exists()) {
            $this->command?->line("  lewati  {$label} (sudah ada data)");

            return;
        }

        $create();
        $this->command?->line("  isi     {$label}");
    }

    /** Salin gambar dari public/ ke disk "public" dan kembalikan path relatifnya. */
    private function copyImage(string $from, string $to): string
    {
        if (! Storage::disk('public')->exists($to)) {
            Storage::disk('public')->put($to, file_get_contents(public_path($from)));
        }

        return $to;
    }
}
