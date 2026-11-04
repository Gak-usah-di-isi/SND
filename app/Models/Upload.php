<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Upload extends Model
{
    use HasFactory;

    protected $table = 'uploads';

    protected $fillable = [
        'type', 'file_path', 'year',
    ];

    // Falls back to the latest upload of that type if nothing matches the active year.
    public static function currentForType(string $type): ?self
    {
        $year = Year::where('is_active', true)->value('year');

        $upload = self::where('type', $type)
            ->when($year, fn($query) => $query->where('year', $year))
            ->latest()
            ->first();

        return $upload ?: self::where('type', $type)->latest()->first();
    }

    public static function getFilePath($type)
    {
        $upload = self::currentForType($type);
        return $upload ? asset('storage/' . $upload->file_path) : null;
    }

    /**
     * Path lokal ke versi resize (di-cache) dari upload ini, dipakai buat
     * embed gambar di DomPDF. Tanpa ini, admin yang upload gambar
     * beresolusi sangat besar (mis. beberapa ribu piksel lebar) bikin
     * generate PDF jadi puluhan detik bahkan sampai timeout — DomPDF
     * lambat banget nge-decode gambar segede itu, padahal ditampilkan
     * kecil di PDF-nya. Cache di-invalidate otomatis kalau file aslinya
     * diganti (upload baru).
     */
    public static function getResizedFilePath(string $type, int $maxWidth = 1600): ?string
    {
        $upload = self::currentForType($type);
        if (!$upload) {
            return null;
        }

        $originalPath = storage_path('app/public/' . $upload->file_path);
        if (!file_exists($originalPath)) {
            return null;
        }

        $size = @getimagesize($originalPath);
        if (!$size || $size[0] <= $maxWidth) {
            return $originalPath;
        }

        [$width, $height] = $size;
        $cachedPath = storage_path('app/public/resized/' . md5($upload->file_path . '|' . $maxWidth) . '.png');

        if (!file_exists($cachedPath) || filemtime($cachedPath) < filemtime($originalPath)) {
            $source = self::loadGdImage($originalPath, $size[2]);
            if (!$source) {
                return $originalPath;
            }

            if (!is_dir(dirname($cachedPath))) {
                mkdir(dirname($cachedPath), 0755, true);
            }

            $newHeight = (int) round($height * ($maxWidth / $width));
            $resized = imagecreatetruecolor($maxWidth, $newHeight);
            imagealphablending($resized, false);
            imagesavealpha($resized, true);
            imagecopyresampled($resized, $source, 0, 0, 0, 0, $maxWidth, $newHeight, $width, $height);
            imagepng($resized, $cachedPath);
            imagedestroy($resized);
            imagedestroy($source);
        }

        return $cachedPath;
    }

    private static function loadGdImage(string $path, int $imagetype)
    {
        return match ($imagetype) {
            IMAGETYPE_JPEG => @imagecreatefromjpeg($path),
            IMAGETYPE_PNG => @imagecreatefrompng($path),
            IMAGETYPE_GIF => @imagecreatefromgif($path),
            default => null,
        };
    }

    /**
     * Resize an image to a max width using GD (pure PHP, no Imagick)
     * and return it as a Base64 data URI.
     * Prevents DomPDF memory exhaustion (OOM) on high-resolution uploads.
     */
    public static function pathToBase64Uri(?string $path, int $maxWidth = 800): ?string
    {
        if (!$path) {
            return null;
        }

        // Handle full storage URL if passed
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            $path = storage_path('app/public/' . ltrim(str_replace(asset('storage'), '', $path), '/'));
        }

        if (!file_exists($path)) {
            return null;
        }

        $info = @getimagesize($path);
        if (!$info) {
            return null;
        }

        [$origW, $origH, $type] = $info;

        $src = match ($type) {
            IMAGETYPE_JPEG => @imagecreatefromjpeg($path),
            IMAGETYPE_PNG  => @imagecreatefrompng($path),
            IMAGETYPE_WEBP => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($path) : null,
            IMAGETYPE_GIF  => @imagecreatefromgif($path),
            default        => null,
        };

        if (!$src) {
            $mime = image_type_to_mime_type($type);
            return 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($path));
        }

        if ($origW > $maxWidth) {
            $newH = (int) round($origH * ($maxWidth / $origW));
            $dst  = imagecreatetruecolor($maxWidth, $newH);

            if ($type === IMAGETYPE_PNG || $type === IMAGETYPE_WEBP) {
                imagealphablending($dst, false);
                imagesavealpha($dst, true);
                $transparent = imagecolorallocatealpha($dst, 0, 0, 0, 127);
                imagefilledrectangle($dst, 0, 0, $maxWidth, $newH, $transparent);
            }

            imagecopyresampled($dst, $src, 0, 0, 0, 0, $maxWidth, $newH, $origW, $origH);
            imagedestroy($src);
            $src = $dst;
        }

        ob_start();
        imagepng($src, null, 6);
        $data = ob_get_clean();
        imagedestroy($src);

        return 'data:image/png;base64,' . base64_encode($data);
    }

    /**
     * Get the active upload for a type as a resized Base64 data URI.
     */
    public static function getBase64Image(string $type, int $maxWidth = 800): ?string
    {
        $upload = self::currentForType($type);
        if (!$upload) {
            return null;
        }

        $originalPath = storage_path('app/public/' . $upload->file_path);
        return self::pathToBase64Uri($originalPath, $maxWidth);
    }
}
