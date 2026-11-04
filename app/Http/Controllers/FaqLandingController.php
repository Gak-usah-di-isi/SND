<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Faq;

class FaqLandingController extends Controller
{
    public function index()
    {
        $faqs = Faq::all();
        return view('landingpage.faq.faq', compact('faqs'));
    }
}
