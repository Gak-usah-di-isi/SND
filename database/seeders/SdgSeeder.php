<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Sdg;

class SdgSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sdgs = [
            [
                'order' => 1,
                'code' => 'SDG-1',
                'name_en' => 'No Poverty',
                'name_id' => 'Tanpa Kemiskinan',
                'color' => '#E5243B',
                'icon' => 'solar:hand-heart-bold',
            ],
            [
                'order' => 2,
                'code' => 'SDG-2',
                'name_en' => 'Zero Hunger',
                'name_id' => 'Tanpa Kelaparan',
                'color' => '#DDA63A',
                'icon' => 'solar:bowl-bold',
            ],
            [
                'order' => 3,
                'code' => 'SDG-3',
                'name_en' => 'Good Health and Well-being',
                'name_id' => 'Kehidupan Sehat dan Sejahtera',
                'color' => '#4C9F38',
                'icon' => 'solar:heart-pulse-bold',
            ],
            [
                'order' => 4,
                'code' => 'SDG-4',
                'name_en' => 'Quality Education',
                'name_id' => 'Pendidikan Berkualitas',
                'color' => '#C5192D',
                'icon' => 'solar:book-bookmark-bold',
            ],
            [
                'order' => 5,
                'code' => 'SDG-5',
                'name_en' => 'Gender Equality',
                'name_id' => 'Kesetaraan Gender',
                'color' => '#FF3A21',
                'icon' => 'solar:users-group-rounded-bold',
            ],
            [
                'order' => 6,
                'code' => 'SDG-6',
                'name_en' => 'Clean Water and Sanitation',
                'name_id' => 'Air Bersih dan Sanitasi Layak',
                'color' => '#26BDE2',
                'icon' => 'solar:drop-bold',
            ],
            [
                'order' => 7,
                'code' => 'SDG-7',
                'name_en' => 'Affordable and Clean Energy',
                'name_id' => 'Energi Bersih dan Terjangkau',
                'color' => '#FCC30B',
                'icon' => 'solar:sun-bold',
            ],
            [
                'order' => 8,
                'code' => 'SDG-8',
                'name_en' => 'Decent Work and Economic Growth',
                'name_id' => 'Pekerjaan Layak & Pertumbuhan Ekonomi',
                'color' => '#A21942',
                'icon' => 'solar:graph-up-bold',
            ],
            [
                'order' => 9,
                'code' => 'SDG-9',
                'name_en' => 'Industry, Innovation and Infrastructure',
                'name_id' => 'Industri, Inovasi & Infrastruktur',
                'color' => '#FD6925',
                'icon' => 'solar:buildings-bold',
            ],
            [
                'order' => 10,
                'code' => 'SDG-10',
                'name_en' => 'Reduced Inequalities',
                'name_id' => 'Berkurangnya Kesenjangan',
                'color' => '#DD1367',
                'icon' => 'solar:transfer-horizontal-bold',
            ],
            [
                'order' => 11,
                'code' => 'SDG-11',
                'name_en' => 'Sustainable Cities and Communities',
                'name_id' => 'Kota & Komunitas Berkelanjutan',
                'color' => '#FD9D24',
                'icon' => 'solar:city-bold',
            ],
            [
                'order' => 12,
                'code' => 'SDG-12',
                'name_en' => 'Responsible Consumption and Production',
                'name_id' => 'Konsumsi & Produksi Bertanggung Jawab',
                'color' => '#BF8B2E',
                'icon' => 'solar:restart-bold',
            ],
            [
                'order' => 13,
                'code' => 'SDG-13',
                'name_en' => 'Climate Action',
                'name_id' => 'Penanganan Perubahan Iklim',
                'color' => '#3F7E44',
                'icon' => 'solar:leaf-bold',
            ],
            [
                'order' => 14,
                'code' => 'SDG-14',
                'name_en' => 'Life Below Water',
                'name_id' => 'Ekosistem Lautan',
                'color' => '#0A97D9',
                'icon' => 'solar:water-sun-bold',
            ],
            [
                'order' => 15,
                'code' => 'SDG-15',
                'name_en' => 'Life on Land',
                'name_id' => 'Ekosistem Daratan',
                'color' => '#56C02B',
                'icon' => 'solar:tree-bold',
            ],
            [
                'order' => 16,
                'code' => 'SDG-16',
                'name_en' => 'Peace, Justice and Strong Institutions',
                'name_id' => 'Perdamaian, Keadilan & Kelembagaan Tangguh',
                'color' => '#00689D',
                'icon' => 'solar:shield-check-bold',
            ],
            [
                'order' => 17,
                'code' => 'SDG-17',
                'name_en' => 'Partnerships for the Goals',
                'name_id' => 'Kemitraan untuk Mencapai Tujuan',
                'color' => '#19486A',
                'icon' => 'solar:handshake-bold',
            ],
        ];

        foreach ($sdgs as $sdg) {
            Sdg::updateOrCreate(
                ['order' => $sdg['order']],
                $sdg
            );
        }
    }
}
