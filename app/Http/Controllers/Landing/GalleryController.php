<?php

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Gallery;
use App\Models\GalleryImage;
use Inertia\Inertia;

class GalleryController extends Controller
{
    public function index()
    {
        $galleries = Gallery::with('images')->orderBy('year', 'desc')->get();
        return Inertia::render('LandingEditor/Gallery/Index', [
            'galleries' => $galleries,
        ]);
    }

    public function create()
    {
        return view('landingpage-editor.gallery.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'year' => ['required', 'integer'],
            'images.*' => ['required', 'file', 'image', 'max:2048', 'mimes:jpeg,png,jpg,svg']
        ]);

        // Simpan tahun ke tabel Gallery
        $gallery = Gallery::create(['year' => $request->year]);

        // Simpan setiap gambar ke GalleryImage
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('gallery', 'public');
                GalleryImage::create([
                    'gallery_id' => $gallery->id,
                    'image_path' => $path
                ]);
            }
        }

        return redirect()->route('landing.gallery.index')->with('success', 'Gallery created successfully.');
    }

    public function edit($id)
    {
        $gallery = Gallery::with('images')->findOrFail($id);
        return view('landingpage-editor.gallery.edit', compact('gallery'));
    }

    public function update(Request $request, $id)
    {
        $gallery = Gallery::findOrFail($id);
        
        $request->validate([
            'year' => ['required', 'integer'],
            'images.*' => ['file', 'image', 'max:2048', 'mimes:jpeg,png,jpg,svg']
        ]);

        // Update tahun
        $gallery->update(['year' => $request->year]);

        // Jika ada gambar baru, tambahkan ke gallery_images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('gallery', 'public');
                GalleryImage::create([
                    'gallery_id' => $gallery->id,
                    'image_path' => $path
                ]);
            }
        }

        return redirect()->route('landing.gallery.index')->with('success', 'Gallery updated successfully.');
    }

    public function destroy($id)
    {
        $gallery = Gallery::findOrFail($id);

        // Hapus semua gambar terkait dari penyimpanan
        foreach ($gallery->images as $image) {
            Storage::disk('public')->delete($image->image_path);
            $image->delete();
        }

        // Hapus gallery
        $gallery->delete();

        return redirect()->route('landing.gallery.index')->with('success', 'Gallery deleted successfully.');
    }

    public function showLandingPage($year = null)
{
    // Ambil tahun-tahun unik dari tabel galleries
    $years = Gallery::select('year')->distinct()->orderBy('year', 'desc')->get();

    // Ambil semua gallery images beserta relasi gallery-nya
    $galleryImages = GalleryImage::with('gallery')->get()->map(function($img) {
        // Tambahkan properti 'year' dari gallery parent
        $img->year = $img->gallery->year;
        return $img;
    });

    // Kirim data ke view landing page
    return view('landingpage.gallery.gallery', [
        'years' => $years,
        'gallery' => $galleryImages,
        'selectedYear' => $year,
    ]);
}

    public function destroyImage(GalleryImage $galleryImage)
    {
        Storage::disk('public')->delete($galleryImage->image_path);
        $galleryImage->delete();
        return redirect()->back()->with('success', 'Image deleted successfully.');
    }

}
