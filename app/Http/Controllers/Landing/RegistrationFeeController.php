<?php

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RegistrationFee;
use Illuminate\Validation\Rule;
use App\Models\Year;
use Inertia\Inertia;

class RegistrationFeeController extends Controller
{
    public function index(Request $request)
    {
        $years = Year::orderByDesc('year')->get(); // Ambil semua tahun yang tersedia
        $query = RegistrationFee::query();

        if ($request->has('year') && $request->year != '') {
            $query->where('year', $request->year);
        }

        $registrationFees = $query->orderByDesc('year')->get();

        return Inertia::render('LandingEditor/LandingPage/RegistrationFee/Index', [
            'registrationFees' => $registrationFees,
            'years' => $years,
            'filters' => ['year' => $request->year],
        ]);
    }
    




    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'category_name' => ['required', 'string', 'min:3', 'max:255', 'regex:/[a-zA-Z]/'],
            'domestic_participants' => ['nullable', 'string', function ($attribute, $value, $fail) {
                if ($value !== 'TBA' && !is_numeric($value)) {
                    $fail($attribute . ' must be a number or TBA.');
                }
            }],
            'international_participants' => ['nullable', 'string', function ($attribute, $value, $fail) {
                if ($value !== 'TBA' && !is_numeric($value)) {
                    $fail($attribute . ' must be a number or TBA.');
                }
            }],
            'period_of_payment' => ['nullable', 'string'],
            'role_type' => ['required', Rule::in(['presenter', 'non_presenter', 'additional_fee'])],
            'year' => ['required', 'integer', Rule::exists('years', 'year')], // Pastikan tahun ada di database
        ], [
            'category_name.required' => 'Category name is required.',
            'category_name.min' => 'Category name must be at least 3 characters.',
            'category_name.regex' => 'Category name must contain at least one letter.',
            'role_type.required' => 'Role type is required.',
            'year.required' => 'Year is required.',
            'year.exists' => 'Selected year is not valid.',
        ]);

        $validatedData['category_name'] = strip_tags($validatedData['category_name']);
        $validatedData['domestic_participants'] = $validatedData['domestic_participants'] ?? 'TBA';
        $validatedData['international_participants'] = $validatedData['international_participants'] ?? 'TBA';
        $validatedData['period_of_payment'] = $validatedData['period_of_payment'] ?? 'TBA';

        RegistrationFee::create($validatedData);

        return redirect()->route('landing.registrationFee.index')->with('success', 'Registration Fee created successfully.');
    }



    public function update(Request $request, $id)
    {
        $registrationFee = RegistrationFee::findOrFail($id);

        $validatedData = $request->validate([
            'category_name' => ['required', 'string', 'min:3', 'max:255', 'regex:/[a-zA-Z]/'],
            'domestic_participants' => ['nullable', 'string', function ($attribute, $value, $fail) {
                if ($value !== 'TBA' && !is_numeric($value)) {
                    $fail($attribute . ' must be a number or TBA.');
                }
            }],
            'international_participants' => ['nullable', 'string', function ($attribute, $value, $fail) {
                if ($value !== 'TBA' && !is_numeric($value)) {
                    $fail($attribute . ' must be a number or TBA.');
                }
            }],
            'period_of_payment' => ['nullable', 'string'],
            'role_type' => ['required', Rule::in(['presenter', 'non_presenter', 'additional_fee'])],
            'year' => ['required', 'integer', Rule::exists('years', 'year')], // Validasi tahun
        ], [
            'category_name.required' => 'Category name is required.',
            'category_name.min' => 'Category name must be at least 3 characters.',
            'category_name.regex' => 'Category name must contain at least one letter.',
            'role_type.required' => 'Role type is required.',
            'year.required' => 'Year is required.',
            'year.exists' => 'Selected year is not valid.',
        ]);

        $validatedData['category_name'] = strip_tags($validatedData['category_name']);
        $validatedData['domestic_participants'] = $validatedData['domestic_participants'] ?? 'TBA';
        $validatedData['international_participants'] = $validatedData['international_participants'] ?? 'TBA';
        $validatedData['period_of_payment'] = $validatedData['period_of_payment'] ?? 'TBA';

        $registrationFee->update($validatedData);
        return redirect()->route('landing.registrationFee.index')->with('success', 'Registration Fee updated successfully.');
    }

    public function destroy($id)
    {
        $registrationFee = RegistrationFee::findOrFail($id);
        $registrationFee->delete();
        return redirect()->route('landing.registrationFee.index')->with('success', 'Registration Fee deleted successfully.');
    }
}
