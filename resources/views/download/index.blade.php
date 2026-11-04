@extends('layouts.app')

@section('title', 'Downloads')

@section('content')
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Download Center</h4>
                <p class="card-description">Download verified documents</p>

                @if (session('success'))
                    <div class="alert alert-success">
                        {{ session('success') }}
                    </div>
                @endif

                @if (session('error'))
                    <div class="alert alert-danger">
                        {{ session('error') }}
                    </div>
                @endif

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <div class="card">
                            <div class="card-body text-center">
                                <i class="fas fa-file-pdf fa-3x text-primary mb-3"></i>
                                <h5>Full Papers</h5>
                                <p class="text-muted">Download all verified full papers in a ZIP file</p>
                                <a href="{{ route('download.fullpaper') }}" class="btn btn-primary download-btn">
                                    <i class="fas fa-download"></i> Download All Full Papers
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6 mb-3">
                        <div class="card">
                            <div class="card-body text-center">
                                <i class="fas fa-receipt fa-3x text-success mb-3"></i>
                                <h5>Payment Proofs</h5>
                                <p class="text-muted">Download all verified payment proofs in a ZIP file</p>
                                <a href="{{ route('download.paymentProof') }}" class="btn btn-success download-btn">
                                    <i class="fas fa-download"></i> Download All Payment Proofs
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-4">
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle"></i>
                        <strong>Note:</strong> Downloads may take several minutes depending on the number of files. Please
                        be patient and do not refresh the page during download.
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Add loading state to download buttons
            const downloadButtons = document.querySelectorAll('.download-btn');

            downloadButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing Download...';
                    this.classList.add('disabled');
                    this.style.pointerEvents = 'none';

                    // Re-enable button after 60 seconds in case of issues
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.classList.remove('disabled');
                        this.style.pointerEvents = 'auto';
                    }, 60000);
                });
            });
        });
    </script>
@endpush
