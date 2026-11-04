@extends('layouts.app')

@section('content')
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card shadow">
            <div class="card-body">
                <h4 class="card-title border-bottom pb-3">Payment Information</h4>

                <div class="payment-details my-4">
                    <p class="card-description font-italic mb-3">
                        Please make your payment through the following details:
                    </p>

                    <p class="mb-2">Please transfer your registration fee to:</p>
                    <h5 class="font-weight-bold text-primary mb-4">Universitas Brawijaya</h5>

                    <div class="payment-options">
                        @if (!empty($conferenceSetting->bank_account))
                            @php
                                $bankAccounts = explode(',', $conferenceSetting->bank_account);
                            @endphp

                            @foreach ($bankAccounts as $index => $bankAccount)
                                <div class="payment-method mb-3">
                                    <p class="py-3 px-4 bg-light rounded border">
                                        <span class="font-weight-bold">{{ trim($bankAccount) }}</span>
                                    </p>
                                </div>

                                @if ($index !== count($bankAccounts) - 1)
                                    <p class="text-center">OR</p>
                                @endif
                            @endforeach
                        @else
                            <p class="text-center text-danger">No payment methods available</p>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card shadow">
            <div class="card-body">
                <h4 class="card-title border-bottom pb-3">Payment Instruction</h4>
                <div class="payment-details my-4">
                    <p class="card-description font-italic mb-3">
                        Please make your payment through the following details:
                    </p>
                    @php
                        $instructions = explode("\n", $conferenceSetting->payment_instruction);
                    @endphp
                    @if (count($instructions) > 0 && $instructions[0] !== '')
                        <ol class="mb-2">
                            @foreach ($instructions as $instruction)
                                <li>{{ $instruction }}</li>
                            @endforeach
                        </ol>
                    @else
                        <p>No payment instructions available.</p>
                    @endif

                    </ol>

                </div>
            </div>
        </div>
    </div>

    <div class="col-lg-12 grid-margin stretch-card mt-4">
        <div class="card shadow-sm">
            <div class="card-body">
                <h4 class="card-title border-bottom pb-3">
                    <i class="fas fa-file-upload mr-2"></i>Payment Details
                </h4>

                @if ($existingPayment && $existingPayment->amount)
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle mr-2"></i>
                        File uploaded successfully and Payment amount:
                        <span id="existingAmount">
                            @if ($existingPayment->currency == 'USD')
                                ${{ number_format($existingPayment->amount, 2, '.', ',') }}
                            @else
                                Rp {{ number_format($existingPayment->amount, 0, ',', '.') }}
                            @endif
                            has been {{ $existingPayment->status }}
                        </span>
                    </div>
                @endif

                <form action="{{ route('filepayments.store') }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    @if (!$existingPayment || $existingPayment->status !== 'verified')
                        <div class="form-group mb-4">
                            <label for="currency">Select Currency</label>
                            <select class="form-control" id="currency" name="currency">
                                <option value="IDR"
                                    {{ old('currency', $existingPayment->currency ?? 'IDR') == 'IDR' ? 'selected' : '' }}>
                                    Rupiah (IDR)</option>
                                <option value="USD"
                                    {{ old('currency', $existingPayment->currency ?? 'IDR') == 'USD' ? 'selected' : '' }}>
                                    Dollar (USD)</option>
                            </select>
                            @error('currency')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                        <div class="form-group mb-4">
                            <label for="amount">Payment Amount</label>
                            <input type="text" class="form-control @error('amount') is-invalid @enderror" id="amount"
                                name="amount" value="{{ old('amount') }}" placeholder="Example: 100000"
                                @if (!$existingPayment) required @endif>
                            <small class="form-text text-muted">
                                Enter the amount without dots or commas
                            </small>
                            @error('amount')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="input-group mb-3">
                            <div class="custom-file">
                                <input type="file" class="custom-file-input @error('file') is-invalid @enderror"
                                    name="file" @if (!$existingPayment) required @endif id="file"
                                    accept="image/*">
                                <label class="custom-file-label" for="file" id="fileLabel">Choose file</label>
                            </div>
                        </div>

                        <small class="form-text text-muted">
                            Accepted formats: JPG, JPEG, PNG | Max: 2MB
                        </small>
                    @endif

                    <div class="input-group-append mt-3">
                        @if (!$existingPayment || $existingPayment->status !== 'verified')
                            <button type="submit" class="btn btn-primary mr-3">
                                <i class="fas fa-save mr-1"></i>
                                {{ $existingPayment ? 'Update' : 'Save' }}
                            </button>
                        @endif
                        @if ($existingPayment && $existingPayment->file_path)
                            <a href="{{ asset('storage/' . $existingPayment->file_path) }}" class="btn btn-light"
                                target="_blank">
                                <i class="fas fa-file mr-1"></i>
                                View File
                            </a>
                        @endif
                        @if ($existingPayment && $existingPayment->status === 'verified')
                            <a href="{{ route('filepayments.receipt', $existingPayment->id) }}" target="_blank"
                                class="btn btn-outline-primary ml-2">
                                Digital PDF
                            </a>
                        @endif
                    </div>
                    @if (session('success'))
                        <div class="alert alert-success alert-dismissible fade show mt-3" role="alert">
                            <i class="fas fa-check-circle mr-2"></i> {{ session('success') }}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    @endif

                    @error('file')
                        <div class="invalid-feedback d-block">{{ $message }}</div>
                    @enderror
                </form>

                <script>
                    document.getElementById('file').addEventListener('change', function() {
                        var fileName = this.files[0] ? this.files[0].name : 'Choose file';
                        document.getElementById('fileLabel').innerText = fileName;
                    });

                    document.querySelector('form').addEventListener('submit', function(e) {
                        let amountInput = document.getElementById('amount');
                        amountInput.value = amountInput.value.replace(/\D/g, '');
                        if (isNaN(amountInput.value) || amountInput.value === '') {
                            e.preventDefault();
                            alert('Please enter a valid amount.');
                        }
                    });
                </script>
            </div>
        </div>
    </div>
@endsection
