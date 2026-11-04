<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ConferenceSetting;

class ConferenceSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ConferenceSetting::updateOrCreate(
            ['id' => 1],
            [
                'conference_title'              => 'Seminar Nasional Berdampak',
                'conference_abbreviation'       => 'SND',
                'conference_chairperson'        => 'Ketua BPPM Vokasi UB',
                'administrator_email'           => 'admin@ub.ac.id',
                'treasurer_email'               => 'bendahara@ub.ac.id',
                'bank_account'                  => 'Bank BNI 1234567890 a.n. Universitas Brawijaya',
                'max_abstracts_per_participant' => 2,
                'max_words_in_abstract_body'    => 350,
                'attendance_format'             => 'hybrid',
                'payment_instruction'           => 'Biaya pendaftaran saat ini gratis. Jika sistem pembayaran diaktifkan oleh panitia, silakan lakukan pembayaran ke rekening resmi yang tertera.',
                'is_payment_enabled'            => false, // Gratis untuk tahun berjalan
                'open_registration'             => true,
                'open_abstract_submission'      => true,
                'open_full_paper_upload'        => false,
                'enable_publication_selection'  => false,
            ]
        );
    }
}
