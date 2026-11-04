<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Year;
use App\Traits\FlashAlert;

class YearController extends Controller
{
    use FlashAlert;

    public function index()
    {
        $years = Year::all();
        return view('years.index', compact('years'));
    }

    public function store(Request $request)
    {
        $request->validate(['year' => 'required|integer|unique:years,year']);
        Year::create(['year' => $request->year, 'is_active' => false]);
        return redirect()->back()->with($this->alertCreated());
    }

    public function setActive($id)
    {
        Year::query()->update(['is_active' => false]);
        Year::where('id', $id)->update(['is_active' => true]);
        Year::forgetActiveYear();
        return redirect()->back()->with($this->alertUpdated());
    }
}
