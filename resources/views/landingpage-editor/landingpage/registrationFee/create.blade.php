@extends('layouts.app')
@section('title', 'New Registration Fee')
@section('content')
    <div class="container card p-4">
        <h2 class="fs-5">Add Registration Fee</h2>
        <hr class="border border-secondary">
        <div class="row">
                <form action="{{ route('landing.registrationFee.store') }}" method="POST">
                    @csrf
                    <div class="mb-3">
                        <label for="role_type" class="form-label">Role <span class="text-danger">*</span></label>
                        <select name="role_type" id="role_type" class="form-control" required>
                            <option value="" disabled selected>-- Select Role --</option>
                            <option value="presenter">Presenter</option>
                            <option value="non_presenter">Non-Presenter</option>
                            <option value="additional_fee">Additional Fee</option>
                        </select>
                        @error('role_type')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="mb-3">
                        <label for="category_name" class="form-label">Category Name <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" name="category_name" id="category_name" placeholder="Enter category (e.g., Student, Professional)" required>
                        @error('category_name')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="mb-3">
                        <label for="domestic_participants" class="form-label">Domestic Participants (optional)</label>
                        <input type="text" class="form-control" name="domestic_participants" id="domestic_participants" placeholder="Enter price in numbers (e.g., 100000)">
                        @error('domestic_participants')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="mb-3">
                        <label for="international_participants" class="form-label">International Participants (optional)</label>
                        <input type="text" class="form-control" name="international_participants" id="international_participants" placeholder="Enter price in numbers (e.g., 200000)">
                        @error('international_participants')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="mb-3">
                        <label for="period_of_payment" class="form-label">Period of Payment (optional)</label>
                        <input type="date" class="form-control" name="period_of_payment" id="period_of_payment">
                        @error('period_of_payment')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="mb-3">
                        <label for="year" class="form-label">Year <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" name="year" id="year" 
                               value="{{ old('year', $latestYear) }}" required placeholder="Enter Year">
                               
                        @error('year')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-success" id="submitBtn">Add</button>
                        <a href="{{ route('landing.registrationFee.index') }}" class="btn btn-danger">Cancel</a>
                    </div> 
                </form>
        </div>
    </div>
@endsection
