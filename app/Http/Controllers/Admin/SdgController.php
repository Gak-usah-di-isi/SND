<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sdg;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\Rule;
use App\Traits\FlashAlert;
use Inertia\Inertia;

class SdgController extends Controller
{
    use FlashAlert;

    /**
     * Display a listing of SDGs with abstract counts.
     */
    public function index(Request $request)
    {
        $perPage = (int) $request->input('per_page', 20);
        if ($perPage < 1) {
            $perPage = 20;
        }
        if ($perPage > 100) {
            $perPage = 100;
        }

        $search = $request->input('search', '');

        $baseQuery = Sdg::withCount('abstracts')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('code', 'like', "%{$search}%")
                        ->orWhere('name_id', 'like', "%{$search}%")
                        ->orWhere('name_en', 'like', "%{$search}%");
                });
            })
            ->orderBy('order', 'asc');

        $maxAbstracts = (int) (((clone $baseQuery)->get()->max('abstracts_count')) ?? 0);
        $sdgs = $baseQuery->paginate($perPage)->withQueryString();

        return Inertia::render('Admin/Sdgs/Index', [
            'sdgs' => $sdgs,
            'maxAbstracts' => $maxAbstracts,
            'search' => $search,
        ]);
    }

    /**
     * Store a newly created SDG in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order'   => ['required', 'integer', 'min:1'],
            'code'    => ['required', 'string', 'max:20', 'unique:sdgs,code'],
            'name_id' => ['required', 'string', 'max:255'],
            'name_en' => ['required', 'string', 'max:255'],
            'color'   => ['required', 'string', 'max:30'],
            'icon'    => ['nullable', 'string', 'max:255'],
        ]);

        Sdg::create($validated);

        return redirect()->route('admin.sdgs.index')->with($this->alertCreated());
    }

    /**
     * Update the specified SDG in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $sdg = Sdg::findOrFail($id);

            $validated = $request->validate([
                'order'   => ['required', 'integer', 'min:1'],
                'code'    => ['required', 'string', 'max:20', Rule::unique('sdgs', 'code')->ignore($sdg->id)],
                'name_id' => ['required', 'string', 'max:255'],
                'name_en' => ['required', 'string', 'max:255'],
                'color'   => ['required', 'string', 'max:30'],
                'icon'    => ['nullable', 'string', 'max:255'],
            ]);

            $sdg->update($validated);

            return redirect()->route('admin.sdgs.index')->with($this->alertUpdated());
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.sdgs.index')->with($this->alertNotFound());
        }
    }

    /**
     * Remove the specified SDG from storage.
     */
    public function destroy($id)
    {
        try {
            $sdg = Sdg::withCount('abstracts')->findOrFail($id);

            if ($sdg->abstracts_count > 0) {
                return redirect()->route('admin.sdgs.index')->with([
                    'type' => 'danger',
                    'message' => "SDG {$sdg->code} tidak dapat dihapus karena sudah dikaitkan dengan {$sdg->abstracts_count} abstrak.",
                ]);
            }

            $sdg->delete();

            return redirect()->route('admin.sdgs.index')->with($this->alertDeleted());
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.sdgs.index')->with($this->alertNotFound());
        }
    }
}
