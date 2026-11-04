<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AbstractModel;
use App\Models\Symposium;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\FullPaper;
use setasign\Fpdi\Fpdi;
use App\Models\Certificate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Crypt;
use App\Models\Upload;
use App\Models\ConferenceSetting;
use Illuminate\Support\Facades\File;
use Laratrust\Traits\HasRolesAndPermissions;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Traits\FlashAlert;
use App\Models\Year;
use App\Models\PresentationType;
use Illuminate\Validation\Rule;
use App\Support\ViewingYear;
use Inertia\Inertia;
use App\Models\Sdg;

class AbstractController extends Controller
{
    use HasRolesAndPermissions;
    use FlashAlert;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Peserta bisa melihat arsip tahun sebelumnya; default tahun aktif.
        $viewingYear = ViewingYear::current();
        $isArchive = ViewingYear::isReadOnly();

        $abstracts = AbstractModel::with([
            'sdgs',
            'symposium',
            'fullPaper.fullPaperReviews.reviewer',
            'reviewers',
            // Pembayaran tahun yang sedang dilihat — relasi filePayment sendiri
            // terkunci ke tahun aktif, jadi tidak cocok untuk mode arsip.
            'user.filePayments' => fn ($q) => $q->when($viewingYear, fn ($qq) => $qq->where('year', $viewingYear)),
        ])
            ->where('user_id', Auth::id())
            ->when($viewingYear, fn ($q) => $q->whereYear('created_at', $viewingYear))
            ->paginate(10);

        // Frontend membaca `abstract.user.file_payment`; isikan dari hasil di atas.
        $abstracts->getCollection()->each(function ($abstract) {
            if ($abstract->user) {
                $abstract->user->setRelation('filePayment', $abstract->user->filePayments->first());
                $abstract->user->unsetRelation('filePayments');
            }
        });
        $conferenceSetting = ConferenceSetting::first();

        // Saat melihat arsip, semua aksi submit/upload ditutup — data baru
        // hanya boleh masuk ke tahun aktif.
        $openAbstractSubmission = !$isArchive && ($conferenceSetting->open_abstract_submission ?? false);
        $openFullPaperUpload = !$isArchive && ($conferenceSetting->open_full_paper_upload ?? false);

        $activeYear = Year::where('is_active', true)->first();
        $symposiums = $activeYear ? Symposium::whereYear('created_at', $activeYear->year)->get() : [];
        $presentationTypes = PresentationType::where('is_active', true)->orderBy('id')->get(['id', 'name']);
        $enablePublicationSelection = $conferenceSetting ? (bool) ($conferenceSetting->enable_publication_selection ?? false) : false;
        $allSdgs = Sdg::orderBy('order')->get();
        $isPaymentEnabled = (bool) ($conferenceSetting->is_payment_enabled ?? false);

        return Inertia::render('User/Abstracts/Index', [
            'abstracts'                  => $abstracts,
            'openAbstractSubmission'     => $openAbstractSubmission,
            'openFullPaperUpload'        => $openFullPaperUpload,
            'enablePublicationSelection' => $enablePublicationSelection,
            'symposiums'                 => $symposiums,
            'presentationTypes'          => $presentationTypes,
            'sdgs'                       => $allSdgs,
            'isPaymentEnabled'           => $isPaymentEnabled,
            'maxAbstracts'               => (int) ($conferenceSetting->max_abstracts_per_participant ?? 1),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        try {
            if (
                request()->user()->hasRole('presenter') ||
                request()->user()->hasRole('indonesia-presenter') ||
                request()->user()->hasRole('foreign-presenter')
            ) {
                $conferenceSetting = ConferenceSetting::first();
                if (!$conferenceSetting || !$conferenceSetting->open_abstract_submission) {
                    return redirect()->route('abstracts.index')->with($this->alertAbstractClosed());
                }
                $maxAbstracts = $conferenceSetting->max_abstracts_per_participant;

                // Kuota per tahun konferensi — lihat catatan yang sama di store().
                $activeYear = Year::activeYear();
                $currentAbstracts = AbstractModel::where('user_id', Auth::id())
                    ->when($activeYear, fn ($q) => $q->whereYear('created_at', $activeYear))
                    ->count();

                if ($currentAbstracts >= $maxAbstracts) {
                    return redirect()->route('abstracts.index')->with($this->alertAbstractLimit("You have reached the maximum limit of $maxAbstracts abstracts."));
                }
                // Create form now lives inline on abstracts.index (no dedicated page).
                return redirect()->route('abstracts.index');
            } else {
                return redirect()->route('abstracts.index')->with($this->permissionDenied());
            }
        } catch (ModelNotFoundException $e) {
            return redirect()->route('abstracts.index')->with($this->alertAbstractClosed());
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $conferenceSetting = ConferenceSetting::first();
        if (!$conferenceSetting || !$conferenceSetting->open_abstract_submission) {
            return redirect()->route('abstracts.index')->with($this->alertAbstractClosed());
        }

        $maxAbstracts = $conferenceSetting->max_abstracts_per_participant;

        // Kuota berlaku per tahun konferensi. Tanpa filter ini, peserta yang
        // sudah submit di tahun sebelumnya tidak akan pernah bisa ikut lagi.
        $activeYear = Year::activeYear();
        $currentAbstracts = AbstractModel::where('user_id', Auth::id())
            ->when($activeYear, fn ($q) => $q->whereYear('created_at', $activeYear))
            ->count();

        if ($currentAbstracts >= $maxAbstracts) {
            return redirect()->route('abstracts.index')->with('error', "You have reached the maximum limit of $maxAbstracts abstracts.");
        }

        $maxWords = $conferenceSetting->max_words_in_abstract_body;

        $abstractWordCount = str_word_count($request->abstract);

        if ($abstractWordCount > $maxWords) {
            return redirect()->back()->withInput()->withErrors(['abstract' => "Abstract must not exceed $maxWords words. Currently: $abstractWordCount words."]);
        }

        $hasPresentationTypes = PresentationType::where('is_active', true)->exists();
        $presentationRule = $hasPresentationTypes
            ? ['required', 'string', Rule::exists('presentation_types', 'name')->where('is_active', true)]
            : ['required', 'string', 'in:Oral presentation,Poster presentation'];

        $enablePublication = $conferenceSetting ? (bool) ($conferenceSetting->enable_publication_selection ?? true) : true;
        $publicationRule = $enablePublication
            ? 'required|in:Journal Publication,Proceedings Indexed in EBSCO'
            : 'nullable|string';

        $request->validate([
            'title' => 'required|string|max:500',
            'authors' => 'required',
            'affiliations' => 'required',
            'corresponding_email' => 'required|email',
            'abstract' => 'required',
            'keyword' => 'required',
            'presentation_type' => $presentationRule,
            'publication' => $publicationRule,
            'symposium_id' => 'nullable|exists:symposiums,id',
            'sdg_ids' => 'required|array|min:1',
            'sdg_ids.*' => 'exists:sdgs,id',
        ]);

        $abstract = AbstractModel::create([
            'user_id' => Auth::id(),
            'symposium_id' => $request->symposium_id,
            'title' => $request->title,
            'authors' => $request->authors,
            'affiliations' => $request->affiliations,
            'corresponding_email' => $request->corresponding_email,
            'abstract' => $request->abstract,
            'keyword' => $request->keyword,
            'presentation_type' => $request->presentation_type,
            'publication' => $enablePublication ? $request->publication : null,
            'status' => 'open',
        ]);

        $abstract->sdgs()->sync($request->sdg_ids);

        $abstract->update(['slug' => AbstractModel::generateUniqueSlug($abstract->title)]);

        try {
            $this->generateCertificate($abstract);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("Gagal auto generate certificate saat submit abstract: " . $e->getMessage());
        }

        return redirect()->route('abstracts.index')->with($this->alertCreated());
    }

    public function generateCertificate(AbstractModel $abstract)
    {
        try {
            $user = $abstract->user;
            $role = $user->roles->first()?->name;

            $templateUrl = Upload::getFilePath('certificate_presenter');
            if (!$templateUrl) {
                return;
            }

            $templatePath = storage_path('app/public/' . str_replace(asset('storage/'), '', $templateUrl));

            if (!file_exists($templatePath)) {
                return;
            }

            $pdf = new Fpdi();
            $pdf->setSourceFile($templatePath);

            $template = $pdf->importPage(1);
            $size = $pdf->getTemplateSize($template);
            $pdf->addPage($size['orientation'], [$size['width'], $size['height']]);
            $pdf->useTemplate($template);

            $pdf->SetFont('Times', 'B', 45);

            $nameToPrint = $user->name_certificate ?: $user->name;
            $nameWidth = $pdf->GetStringWidth($nameToPrint);
            $nameX = ($size['width'] - $nameWidth) / 2;
            $pdf->SetXY($nameX, 150);
            $pdf->Write(0, $nameToPrint);

            $pdf->Line($nameX, 155, $nameX + $nameWidth, 155);

            $roleText = ($abstract->presentation_type == "Oral presentation") ? "Oral presenter" : "Poster presenter";

            $roleWidth = $pdf->GetStringWidth($roleText);
            $roleX = ($size['width'] - $roleWidth) / 2;
            $pdf->SetXY($roleX, 195);
            $pdf->Write(0, $roleText);

            $pdf->SetFont('Times', 'I', 35);
            $pdf->SetXY(30, 230);
            $pdf->MultiCell($size['width'] - 60, 20, $abstract->title, 0, 'C');

            Storage::disk('public')->makeDirectory('certificates');
            $certificateName = Str::random(20) . '.pdf';
            $certificatePath = 'certificates/' . $certificateName;
            $pdf->Output(storage_path('app/public/' . $certificatePath), 'F');

            Certificate::create([
                'user_id' => $user->id,
                'year' => Year::activeYear(),
                'certificate_type' => 'presenter',
                'certificate_path' => $certificatePath,
            ]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("Gagal generate certificate abstract {$abstract->id}: " . $e->getMessage());
        }
    }

    public function viewCertificate($encryptedId, $type)
    {
        try {
            $id = Crypt::decrypt($encryptedId);
        } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
            return abort(404);
        }

        $abstract = AbstractModel::with('user')->findOrFail($id);
        // Sertifikat harus dari tahun abstract-nya. Tanpa ini, peserta lama
        // yang membuka sertifikat abstract 2026 bisa mendapat sertifikat 2025.
        $certificate = Certificate::where('user_id', $abstract->user_id)
            ->where('certificate_type', $type)
            ->where('year', optional($abstract->created_at)->year)
            ->first();

        if ($certificate) {
            return response()->file(storage_path('app/public/' . $certificate->certificate_path));
        } else {
            return redirect()->route('abstracts.show', $id)->with('error', 'Certificate not generated yet.');
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(AbstractModel $abstract)
    {
        try {
            if (
                $abstract->user_id === request()->user()->id
            ) {
                $formattedAuthors = $this->formatAuthors($abstract->authors);
                $formattedAffiliations = $this->formatAffiliations($abstract->affiliations);
                return Inertia::render('User/Abstracts/Show', [
                    'abstract' => $abstract->load('symposium'),
                    'formattedAuthors' => $formattedAuthors,
                    'formattedAffiliations' => $formattedAffiliations,
                ]);
            } else {
                return redirect()->route('abstracts.index')->with($this->permissionDenied());
            }
        } catch (ModelNotFoundException $e) {
            return redirect()->route('abstracts.index')->with($this->alertNotFound());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AbstractModel $abstract)
    {
        // Edit form now lives inline on abstracts.index (no dedicated page).
        return redirect()->route('abstracts.index');
    }

    /**
     * Abstract dari tahun konferensi yang bukan tahun aktif bersifat arsip
     * read-only. Tanpa ini, abstract lama yang kelupaan masih berstatus
     * 'open'/'revision' tetap bisa diedit/dihapus kapan pun lewat URL langsung,
     * walau peserta sedang berada di tahun aktif menurut session.
     */
    private function belongsToActiveYear(AbstractModel $abstract): bool
    {
        $activeYear = Year::activeYear();

        return $activeYear === null || optional($abstract->created_at)->year === $activeYear;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AbstractModel $abstract)
    {
        try {
            if (
                $abstract->user_id === request()->user()->id
            ) {
                if (!in_array($abstract->status, ['open', 'revision'])) {
                    return back()->with($this->alertAbstractNotEdit());
                }

                if (!$this->belongsToActiveYear($abstract)) {
                    return back()->with($this->alertArchivedYear());
                }

                $conferenceSetting = ConferenceSetting::first();
                $enablePublication = $conferenceSetting ? (bool) ($conferenceSetting->enable_publication_selection ?? true) : true;
                $publicationRule = $enablePublication
                    ? 'required|in:Journal Publication,Proceedings Indexed in EBSCO'
                    : 'nullable|string';

                $request->validate([
                    'title' => 'required|string|max:500',
                    'authors' => 'required',
                    'affiliations' => 'required',
                    'corresponding_email' => 'required|email',
                    'abstract' => 'required',
                    'keyword' => 'required',
                    'presentation_type' => $presentationRule,
                    'publication' => $publicationRule,
                    'symposium_id' => 'nullable|exists:symposiums,id',
                    'sdg_ids' => 'required|array|min:1',
                    'sdg_ids.*' => 'exists:sdgs,id',
                ]);

                $updateData = $request->only([
                    'title', 'authors', 'affiliations', 'corresponding_email', 'abstract', 'keyword', 'presentation_type', 'symposium_id'
                ]);

                if ($enablePublication) {
                    $updateData['publication'] = $request->publication;
                }

                // Jika status sebelumnya 'revision', pengiriman pembaruan otomatis mengembalikan ke 'under review'
                if ($abstract->status === 'revision') {
                    $updateData['status'] = 'under review';
                }

                $abstract->update($updateData);
                $abstract->sdgs()->sync($request->sdg_ids);

                return redirect()->route('abstracts.index')->with($this->alertUpdated());
            }
        } catch (ModelNotFoundException $e) {
            return redirect()->route('abstracts.index')->with($this->alrtNotFound());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AbstractModel $abstract)
    {
        try {
            if (
                $abstract->user_id === request()->user()->id
            ) {
                if ($abstract->status != 'open') {
                    return back()->with($this->alertAbstractNotDelete());
                }

                if (!$this->belongsToActiveYear($abstract)) {
                    return back()->with($this->alertArchivedYear());
                }

                $user = $abstract->user;
                // Sertifikat yang dihapus harus dari tahun abstract ini juga —
                // tanpa filter year, menghapus abstract tahun aktif bisa ikut
                // menghapus sertifikat presenter arsip tahun sebelumnya.
                $certificate = $user->certificates()
                    ->where('certificate_type', 'presenter')
                    ->where('year', optional($abstract->created_at)->year)
                    ->first();

                if ($certificate) {
                    $certificatePath = $certificate->certificate_path;
                    if (Storage::disk('public')->exists($certificatePath)) {
                        Storage::disk('public')->delete($certificatePath);
                    }
                    $certificate->delete();
                }

                if ($abstract->fullPaper) {
                    $fullPaperPath = $abstract->fullPaper->file_path;

                    if (Storage::disk('public')->exists($fullPaperPath)) {
                        Storage::disk('public')->delete($fullPaperPath);
                    }

                    $abstract->fullPaper->delete();
                }
                $abstract->delete();

                return redirect()->route('abstracts.index')->with($this->alertDeleted());
            } else {
                return redirect()->route('abstracts.index')->with($this->permissionDenied());
            }
        } catch (ModelNotFoundException $e) {
            return redirect()->route('abstracts.index')->with($this->alertNotFound());
        }
    }



    private function formatAuthors($authors)
    {
        return preg_replace('/\[(\d+)\]/', '<sup>$1</sup>', $authors);
    }


    private function formatAffiliations($affiliations)
    {
        $formattedAffiliations = preg_replace('/\[(\d+)\]/', '<sup>$1</sup>', $affiliations);
        return nl2br($formattedAffiliations);
    }

    public function downloadPdf($id)
    {
        try {
            $abstract = AbstractModel::with('symposium')->findOrFail($id);
            if (
                $abstract->user_id === request()->user()->id
            ) {
                $formattedAuthors = $this->formatAuthors($abstract->authors);
                $formattedAffiliations = $this->formatAffiliations($abstract->affiliations);

                $pdf = PDF::loadView('abstracts.pdf', compact('abstract', 'formattedAuthors', 'formattedAffiliations'));

                return $pdf->stream('abstract-detail.pdf');
            } else {
                return redirect()->route('abstracts.index')->with($this->permissionDenied());
            }
        } catch (ModelNotFoundException $e) {
            return redirect()->route('abstracts.index')->with($this->alertNotFound());
        }
    }

    public function acceptancePdf($id)
    {
        try {
            $abstract = AbstractModel::with(['user.file_payment'])->findOrFail($id);
            if (
                $abstract->user_id === request()->user()->id
            ) {
                if ($abstract->status !== 'accepted' || optional($abstract->user->file_payment)->status !== 'verified') {
                    return redirect()->route('abstracts.index')->with($this->permissionDenied());
                }

                @ini_set('memory_limit', '512M');

                $conferenceSetting = ConferenceSetting::first();
                $conferenceChairPerson = $conferenceSetting ? $conferenceSetting->conference_chairperson : null;
                $conferenceTitle       = $conferenceSetting ? $conferenceSetting->conference_title : null;

                $letterHeader = Upload::getBase64Image('letter_header', 800);
                $signature    = Upload::getBase64Image('signature', 300);

                $pdf = PDF::loadView('abstracts.acceptance', compact('abstract', 'letterHeader', 'signature', 'conferenceChairPerson', 'conferenceTitle', 'conferenceSetting'));
                $pdf->getDomPDF()->set_option('dpi', 96);
                $pdf->getDomPDF()->set_option('isPhpEnabled', false);

                return $pdf->stream('abstract-acceptance.pdf');
            } else {
                return redirect()->route('abstracts.index')->with($this->permissionDenied());
            }
        } catch (ModelNotFoundException $e) {
            return redirect()->route('abstracts.index')->with($this->alertNotFound());
        }
    }
}
