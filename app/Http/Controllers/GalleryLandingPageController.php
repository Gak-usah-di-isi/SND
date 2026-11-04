<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Gallery;

class GalleryLandingPageController extends Controller
{
    public function index()
    {
        $gallery = Gallery::all();
        $years = Gallery::select('year')->distinct()->orderBy('year', 'desc')->get();
        return view('landingpage.gallery.gallery', compact('gallery', 'years'));
    }
}
