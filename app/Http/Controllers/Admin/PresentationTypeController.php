<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PresentationType;
use App\Models\AbstractModel;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\Rule;
use App\Traits\FlashAlert;
use Inertia\Inertia;

class PresentationTypeController extends Controller
{
    use FlashAlert;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = (int) $request->input('per_page', 10);
        if ($perPage < 1) {
            $perPage = 10;
        }
        if ($perPage > 50) {
            $perPage = 50;
        }

        $search = $request->input('search', '');

        $presentationTypes = PresentationType::withCount('abstracts')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                          ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->orderBy('id', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Admin/PresentationType/Index', [
            'presentationTypes' => $presentationTypes,
            'search'            => $search,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name'        => ['required', 'string', 'max:255', 'unique:presentation_types,name'],
            'description' => ['nullable', 'string'],
            'is_active'   => ['nullable', 'boolean'],
        ]);

        $validatedData['is_active'] = $request->boolean('is_active', true);

        PresentationType::create($validatedData);

        return redirect()->route('admin.presentation-type.index')->with($this->alertCreated());
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $presentationType = PresentationType::findOrFail($id);

            $validatedData = $request->validate([
                'name'        => ['required', 'string', 'max:255', Rule::unique('presentation_types', 'name')->ignore($presentationType->id)],
                'description' => ['nullable', 'string'],
                'is_active'   => ['nullable', 'boolean'],
            ]);

            $validatedData['is_active'] = $request->boolean('is_active', true);

            $oldName = $presentationType->name;
            $newName = $validatedData['name'];

            // Jika nama tipe presentasi berubah, sinkronkan nilai di tabel abstracts
            if ($oldName !== $newName) {
                AbstractModel::where('presentation_type', $oldName)->update([
                    'presentation_type' => $newName,
                ]);
            }

            $presentationType->update($validatedData);

            return redirect()->route('admin.presentation-type.index')->with($this->alertUpdated());
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.presentation-type.index')->with($this->alertNotFound());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $presentationType = PresentationType::withCount('abstracts')->findOrFail($id);

            if ($presentationType->abstracts_count > 0) {
                return redirect()->route('admin.presentation-type.index')->with([
                    'type'    => 'error',
                    'message' => "Tipe presentasi '{$presentationType->name}' tidak dapat dihapus karena masih digunakan oleh {$presentationType->abstracts_count} abstract.",
                ]);
            }

            $presentationType->delete();

            return redirect()->route('admin.presentation-type.index')->with($this->alertDeleted());
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.presentation-type.index')->with($this->alertNotFound());
        }
    }
}
