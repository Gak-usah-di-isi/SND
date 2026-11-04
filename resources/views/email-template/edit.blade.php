@extends('layouts.app')

@section('title', 'Edit Email Template')

@section('content')
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-header bg-primary text-white">
                <h4 class="mb-0">Edit Email Template</h4>
            </div>
            <div class="card-body">
                <form action="{{ route('admin.email-template.update', $emailTemplate->type) }}" method="POST">
                    @csrf

                    <div class="mb-3">
                        <label for="content" class="form-label"><strong>Custom Pesan:</strong></label>
                        <textarea name="content" class="form-control" rows="14" required>{{ old('content', $emailTemplate->content) }}</textarea>
                    </div>

                    @if ($emailTemplate->type === 'abstract_invoice_idr' || $emailTemplate->type === 'abstract_invoice_usd')
                        <div class="mb-3">
                            <label for="amount" class="form-label"><strong>Total Pembayaran :</strong></label>
                            <input type="number" step="0.01" name="amount" class="form-control"
                                value="{{ old('amount', $emailTemplate->amount) }}" required>
                        </div>
                    @endif

                    <div class="d-flex justify-content-between">
                        <a href="{{ route('admin.email-template.index') }}" class="btn btn-secondary">
                            <i class="fas fa-arrow-left"></i> Back
                        </a>
                        <button type="submit" class="btn btn-success">
                            <i class="fas fa-save"></i> Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection
