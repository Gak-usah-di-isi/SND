<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FullPaper;
use App\Models\FilePayment;
use ZipArchive;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Models\Year;

class DownloadController extends Controller
{
    public function index()
    {
        $activeYear = Year::where('is_active', true)->first();
        $uploads = $activeYear
            ? \App\Models\Upload::where('year', $activeYear->year)->get()->keyBy('type')
            : collect();

        return \Inertia\Inertia::render('Admin/Files/Index', [
            'uploads' => $uploads,
        ]);
    }

    public function debugFiles()
    {
        $activeYear = Year::where('is_active', true)->first();

        if (!$activeYear) {
            return response()->json(['error' => 'No active year set']);
        }

        $fullPapers = FullPaper::where('status', 'accepted')
            ->whereYear('created_at', $activeYear->year)
            ->whereHas('abstract', function ($query) {
                $query->whereHas('user', function ($subQuery) {
                    $subQuery->whereHas('filePayment', function ($paymentQuery) {
                        $paymentQuery->where('status', 'verified');
                    });
                });
            })
            ->get();

        $debug = [
            'active_year' => $activeYear->year,
            'total_papers' => $fullPapers->count(),
            'files_status' => []
        ];

        foreach ($fullPapers as $paper) {
            $filePath = storage_path('app/public/' . $paper->file_path);
            $debug['files_status'][] = [
                'id' => $paper->id,
                'file_path' => $paper->file_path,
                'full_path' => $filePath,
                'exists' => file_exists($filePath),
                'readable' => file_exists($filePath) ? is_readable($filePath) : false,
                'size' => file_exists($filePath) ? filesize($filePath) : 0
            ];
        }

        return response()->json($debug);
    }

    public function downloadFullPaper()
    {
        try {
            // Set execution time limit for large downloads
            set_time_limit(300); // 5 minutes
            ini_set('memory_limit', '512M');

            $activeYear = Year::where('is_active', true)->first();

            if (!$activeYear) {
                return back()->with('error', 'No active year set.');
            }

            $fullPapers = FullPaper::where('status', 'accepted')
                ->whereYear('created_at', $activeYear->year)
                ->whereHas('abstract', function ($query) {
                    $query->whereHas('user', function ($subQuery) {
                        $subQuery->whereHas('filePayment', function ($paymentQuery) {
                            $paymentQuery->where('status', 'verified');
                        });
                    });
                })
                ->get();

            if ($fullPapers->isEmpty()) {
                return back()->with('error', 'No verified full papers available for download.');
            }

            $zipFileName = 'verified_full_papers_' . date('Y-m-d_H-i-s') . '.zip';
            $zip = new ZipArchive;

            $zipPath = storage_path('app/public/' . $zipFileName);

            // Ensure the directory exists
            $directory = dirname($zipPath);
            if (!file_exists($directory)) {
                mkdir($directory, 0755, true);
            }

            $result = $zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE);

            if ($result !== TRUE) {
                Log::error('Failed to create ZIP file: ' . $result);
                return back()->with('error', 'Failed to create ZIP file. Error code: ' . $result);
            }

            $addedFiles = 0;
            foreach ($fullPapers as $paper) {
                // Try both storage methods
                $filePath = storage_path('app/public/' . $paper->file_path);

                // Check if file exists using Laravel Storage
                if (Storage::disk('public')->exists($paper->file_path)) {
                    $filePath = Storage::disk('public')->path($paper->file_path);
                }

                if (file_exists($filePath) && is_readable($filePath)) {
                    // Create unique filename to avoid conflicts
                    $fileName = $paper->id . '_' . basename($filePath);
                    $zip->addFile($filePath, $fileName);
                    $addedFiles++;
                } else {
                    Log::warning('File not found or not readable: ' . $filePath . ' (Original: ' . $paper->file_path . ')');
                }
            }

            $zip->close();

            if ($addedFiles === 0) {
                if (file_exists($zipPath)) {
                    unlink($zipPath);
                }
                return back()->with('error', 'No valid files found to download.');
            }

            // Verify the ZIP file was created successfully
            if (!file_exists($zipPath) || filesize($zipPath) === 0) {
                return back()->with('error', 'Failed to create ZIP file.');
            }

            return response()->download($zipPath)->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            Log::error('Download Full Paper Error: ' . $e->getMessage());
            return back()->with('error', 'An error occurred while creating the download: ' . $e->getMessage());
        }
    }


    public function downloadPaymentProof()
    {
        try {
            // Set execution time limit for large downloads
            set_time_limit(300); // 5 minutes
            ini_set('memory_limit', '512M');

            $activeYear = Year::where('is_active', true)->first();

            if (!$activeYear) {
                return back()->with('error', 'No active year set.');
            }

            $paymentProofs = FilePayment::where('status', 'verified')
                ->whereYear('created_at', $activeYear->year)
                ->get();

            if ($paymentProofs->isEmpty()) {
                return back()->with('error', 'No verified payment proofs available for download.');
            }

            $zipFileName = 'verified_payment_proofs_' . date('Y-m-d_H-i-s') . '.zip';
            $zip = new ZipArchive;

            $zipPath = storage_path('app/public/' . $zipFileName);

            // Ensure the directory exists
            $directory = dirname($zipPath);
            if (!file_exists($directory)) {
                mkdir($directory, 0755, true);
            }

            $result = $zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE);

            if ($result !== TRUE) {
                Log::error('Failed to create ZIP file: ' . $result);
                return back()->with('error', 'Failed to create ZIP file. Error code: ' . $result);
            }

            $addedFiles = 0;
            foreach ($paymentProofs as $proof) {
                // Try both storage methods
                $filePath = storage_path('app/public/' . $proof->file_path);

                // Check if file exists using Laravel Storage
                if (Storage::disk('public')->exists($proof->file_path)) {
                    $filePath = Storage::disk('public')->path($proof->file_path);
                }

                if (file_exists($filePath) && is_readable($filePath)) {
                    // Create unique filename to avoid conflicts
                    $fileName = $proof->id . '_' . basename($filePath);
                    $zip->addFile($filePath, $fileName);
                    $addedFiles++;
                } else {
                    Log::warning('File not found or not readable: ' . $filePath . ' (Original: ' . $proof->file_path . ')');
                }
            }

            $zip->close();

            if ($addedFiles === 0) {
                if (file_exists($zipPath)) {
                    unlink($zipPath);
                }
                return back()->with('error', 'No valid files found to download.');
            }

            // Verify the ZIP file was created successfully
            if (!file_exists($zipPath) || filesize($zipPath) === 0) {
                return back()->with('error', 'Failed to create ZIP file.');
            }

            return response()->download($zipPath)->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            Log::error('Download Payment Proof Error: ' . $e->getMessage());
            return back()->with('error', 'An error occurred while creating the download: ' . $e->getMessage());
        }
    }
}
