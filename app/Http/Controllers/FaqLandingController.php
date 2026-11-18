<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use App\Support\LandingLayoutData;
use Inertia\Inertia;

class FaqLandingController extends Controller
{
    public function index()
    {
        $faqs = Faq::query()
            ->latest('id')
            ->get(['id', 'title', 'description']);

        return Inertia::render('Landing/Faq', array_merge(LandingLayoutData::props(), [
            'faqs' => $faqs,
        ]));
    }
}
