@extends('layouts.app')
@section('title', 'Manual Receipt')
@section('content')
    <div class="col-lg-12 grid-margin stretch-card mt-4">
        <div class="card shadow-sm">
            <div class="card-body">
                <h4 class="card-title border-bottom pb-3">
                    <i class="fa fa-file-text mr-2"></i>Manual Receipt
                </h4>
                <div class="py-2 px-3 rounded border mb-3 alert alert-info">
                    <p>Unless in emergency situation, issuing receipt manually is NOT recommended.</p>
                </div>
                <form action="{{ route('admin.manual-receipt.store') }}" method="POST" enctype="multipart/form-data">
                    @csrf

                    @if (session('success'))
                        <div class="alert alert-success alert-dismissible fade show mt-3" role="alert">
                            <i class="fas fa-check-circle mr-2"></i> {{ session('success') }}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    @endif

                    <div class="form-outline mb-4">
                        <label class="form-label" for="user_id">Participants Name</label>
                        <select name="user_id" id="attendance" class="form-select @error('attendance') is-invalid @enderror"
                            required>
                            @foreach ($users as $user)
                                <option value="{{ $user->id }}" {{ old('user_id') == $user->id ? 'selected' : '' }}>
                                    {{ $user->name }}
                                </option>
                            @endforeach
                        </select>
                        @error('user_id')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="form-group mb-4">
                        <label for="currency">Select Currency</label>
                        <select class="form-control" id="currency" name="currency">
                            <option value="IDR">Rupiah (IDR)</option>
                            <option value="USD">Dollar (USD)</option>
                        </select>
                    </div>

                    <div class="form-group mb-4">
                        <label for="amount">Payment Amount (Rp)</label>
                        <input type="text" class="form-control @error('amount') is-invalid @enderror" id="amount"
                            name="amount" value="{{ old('amount') }}" placeholder="Example: 100000"
                            @if ($users->where('id', old('attendance'))->first()?->hasPayment) required @endif>
                        <small class="form-text text-muted">
                            Enter the amount without dots or commas
                        </small>
                        @error('amount')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="input-group">
                        <div class="custom-file">
                            <input type="file" class="custom-file-input @error('file') is-invalid @enderror"
                                name="file" id="file">
                            <label class="custom-file-label" for="file" id="fileLabel">Choose file</label>
                        </div>
                    </div>
                    @error('file')
                        <div class="invalid-feedback d-block">
                            {{ $message }}
                        </div>
                    @enderror
                    <small class="form-text text-muted mb-3">
                        Accepted formats: JPG, JPEG, PNG, PDF | Max: 2MB
                    </small>

                    <button type="submit" class="btn btn-primary">Make Receipt</button>
                </form>
            </div>
            <script>
                document.getElementById('file').addEventListener('change', function() {
                    var fileName = this.files[0] ? this.files[0].name : 'Choose file';
                    document.getElementById('fileLabel').innerText = fileName;
                });
                document.getElementById('currency').addEventListener('change', function() {
                    let currencySymbol = this.value === 'USD' ? '$' : 'Rp';
                    document.getElementById('currency-symbol').innerText = currencySymbol;
                });
            </script>
        </div>
    </div>
@endsection
