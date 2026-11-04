<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EmailTemplate;
use App\Traits\FlashAlert;
use Inertia\Inertia;

class EmailTemplateController extends Controller
{
    use FlashAlert;

    public function index()
    {
        return Inertia::render('Admin/EmailTemplate/Index', [
            'emailTemplates' => EmailTemplate::all()->keyBy('type'),
        ]);
    }

    public function edit($type)
    {
        $emailTemplate = EmailTemplate::where('type', $type)->firstOrNew([
            'type' => $type
        ]);
        return Inertia::render('Admin/EmailTemplate/Index', [
            'emailTemplates' => EmailTemplate::all()->keyBy('type'),
        ]);
    }

    public function update(Request $request, $type)
    {
        $amountType = null;

        if ($type == 'abstract_invoice_idr') {
            $amountType = 'idr';
        } else if ($type == 'abstract_invoice_usd') {
            $amountType = 'usd';
        }

        $emailTemplate = EmailTemplate::updateOrCreate(
            ['type' => $type],
            [
                'content' => $request->content,
                'amount' => $request->amount,
                'amount_student' => $request->amount_student,
                'amount_type' => $amountType,
            ]
        );

        return redirect()->back()->with($this->alertUpdated());
    }
}
