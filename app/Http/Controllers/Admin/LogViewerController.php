<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class LogViewerController extends Controller
{
    protected string $logPath;

    public function __construct()
    {
        $this->logPath = storage_path('logs/laravel.log');
    }

    public function index(Request $request)
    {
        $lines = (int) $request->query('lines', 300);
        $filter = $request->query('q', '');

        $fileSize = 0;
        $lastModified = null;
        $content = [];

        if (File::exists($this->logPath)) {
            $fileSize = File::size($this->logPath);
            $lastModified = date('Y-m-d H:i:s', File::lastModified($this->logPath));

            // Baca baris terakhir secara efisien
            $rawContent = file($this->logPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            if ($rawContent !== false) {
                if ($filter) {
                    $rawContent = array_values(array_filter($rawContent, function ($line) use ($filter) {
                        return stripos($line, $filter) !== false;
                    }));
                }
                $content = array_slice($rawContent, -$lines);
            }
        }

        return view('admin.logs', [
            'logs' => $content,
            'fileSize' => $this->formatBytes($fileSize),
            'lastModified' => $lastModified,
            'lines' => $lines,
            'filter' => $filter,
            'logPath' => $this->logPath,
        ]);
    }

    public function clear()
    {
        if (File::exists($this->logPath)) {
            File::put($this->logPath, '');
        }

        return redirect()->route('admin.logs')->with('success', 'laravel.log berhasil dibersihkan.');
    }

    private function formatBytes($bytes, $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}
