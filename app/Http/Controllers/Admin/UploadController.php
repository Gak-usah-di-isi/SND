<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Upload;
use Illuminate\Support\Facades\Storage;
use App\Models\Year;
use App\Traits\FlashAlert;

class UploadController extends Controller
{
    use FlashAlert;

    public function index()
    {
        $activeYear = Year::where('is_active', true)->first();

        if (!$activeYear) {
            return back()->with($this->alertDanger());
        }
        $uploads = Upload::where('year', $activeYear->year)->get();
        return view('upload.index', compact('uploads'));
    }

    public function store(Request $request)
    {
        $mimeTypes = [
            'letter_header' => 'png',
            'signature' => 'jpg',
            'certificate_presenter' => 'pdf',
            'certificate_participant' => 'pdf',
            'reviewer_certificate' => 'pdf',
            'logo' => 'png,jpg',
            'commitment_letter' => 'docx',
            'pararel_session_template' => 'pdf',
            'bg_zoom_template' => 'jpg,jpeg,png',
            'auth_background' => 'jpg,jpeg,png,webp',
        ];

        $request->validate([
            'type' => 'required|in:' . implode(',', array_keys($mimeTypes)),
            'file' => 'required|mimes:' . $mimeTypes[$request->type] . '|max:5120',
            'logo' => 'nullable|mimes:png,jpg|max:5120'
        ]);

        $activeYear = Year::where('is_active', true)->first();

        if (!$activeYear) {
            return back()->with($this->alertDanger());
        }

        // Simpan file
        $file = $request->file('file');
        $filePath = $file->store('uploads', 'public');

        Upload::updateOrCreate(
            ['type' => $request->type, 'year' => $activeYear->year],
            ['file_path' => $filePath],
        );

        return redirect()->back()->with($this->alertCreated());
    }


    public function show($type)
    {
        $activeYear = Year::where('is_active', true)->first();

        if (!$activeYear) {
            return redirect()->back()->with($this->alertDanger());
        }

        $upload = Upload::where('type', $type)
            ->where('year', $activeYear->year)
            ->first();
        if (!$upload) {
            return redirect()->back()->with($this->alertNotFound());
        }

        return redirect(Storage::url($upload->file_path));
    }
}
