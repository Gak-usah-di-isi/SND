<?php

namespace Tests\Feature;

use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class LandingPagesTest extends TestCase
{
    /**
     * URL landing yang harus bisa dibuka pengunjung.
     *
     * @return array<string, array{0: string}>
     */
    public static function landingUrls(): array
    {
        return [
            'beranda' => ['/'],
            'komite pengarah' => ['/committee/steering'],
            'komite reviewer' => ['/committee/reviewer'],
            'panitia pelaksana' => ['/committee/organizing'],
            'panduan abstrak' => ['/submission/abstract'],
            'panduan presentasi' => ['/submission/presentation'],
            'galeri' => ['/gallery'],
            'program' => ['/conference-program'],
            'arsip' => ['/archives'],
            'seminar sebelumnya' => ['/previous-conference'],
            'faq' => ['/faq'],
            'kontak' => ['/contact'],
        ];
    }

    /**
     * URL landing yang sudah dirender React lewat Inertia.
     *
     * @return array<string, array{0: string, 1: string}>
     */
    public static function inertiaPages(): array
    {
        return [
            'beranda' => ['/', 'Landing/Home'],
            'komite pengarah' => ['/committee/steering', 'Landing/Committee/Steering'],
            'komite reviewer' => ['/committee/reviewer', 'Landing/Committee/Reviewer'],
            'galeri' => ['/gallery', 'Landing/Gallery'],
        ];
    }

    #[DataProvider('landingUrls')]
    public function test_halaman_landing_bisa_dibuka(string $url): void
    {
        $this->get($url)->assertOk();
    }

    #[DataProvider('inertiaPages')]
    public function test_halaman_landing_dirender_dengan_komponen_inertia(string $url, string $component): void
    {
        $this->get($url)->assertOk()->assertInertia(fn ($page) => $page->component($component));
    }
}
