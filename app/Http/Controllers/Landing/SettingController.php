<?php

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LandingSetting;
use App\Traits\FlashAlert;
use Inertia\Inertia;

class SettingController extends Controller
{
    use FlashAlert;

    public function index()
    {
        $years = LandingSetting::orderBy('year', 'desc')->get();
        return Inertia::render('LandingEditor/Setting/Index', [
            'years' => $years,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['year' => 'required|integer|unique:landing_settings,year']);
        LandingSetting::create(['year' => $request->year, 'is_active' => false]);
        return redirect()->back()->with($this->alertCreated());
    }

    public function setActive($id)
    {
        LandingSetting::query()->update(['is_active' => false]);
        LandingSetting::where('id', $id)->update(['is_active' => true]);
        return redirect()->back()->with($this->alertUpdated());
    }
}
