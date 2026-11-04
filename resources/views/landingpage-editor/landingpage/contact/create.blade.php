@extends('layouts.app')
@section('title', 'Add Contact')
@section('content')
    <div class="container card p-4">
        <h2 class="fs-5">ADD CONTACT</h2>
        <hr class="border border-secondary">
        <div class="row">
            <form action="{{ route('landing.contact.store') }}" method="POST" id="contactForm">
                @csrf
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" name="email" class="form-control" required placeholder="Masukkan email Anda">
                </div>
                <div class="mb-3">
                    <label class="form-label">Phone 1</label>
                    <input type="text" class="form-control" name="phone1" placeholder="Enter phone number">
                </div>
                <div class="mb-3">
                    <label class="form-label">Phone 1 Owner</label>
                    <input type="text" class="form-control" name="phone1_name" placeholder="Enter name (optional)">
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Phone 2</label>
                    <input type="text" class="form-control" name="phone2" placeholder="Enter phone number">
                </div>
                <div class="mb-3">
                    <label class="form-label">Phone 2 Owner</label>
                    <input type="text" class="form-control" name="phone2_name" placeholder="Enter name (optional)">
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Address</label>
                    <textarea name="address" class="form-control" required minlength="10" placeholder="Masukkan alamat lengkap (contoh: Jl. Merdeka No. 10, Jakarta)"></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">Year</label>
                    <input type="number" name="year" class="form-control" required min="2000" max="{{ date('Y') }}" value="{{ date('Y') }}">
                </div>
                <button type="submit" class="btn btn-success" id="submitBtn" disabled>Save</button>
                <a href="{{ route('landing.contact.index') }}" class="btn btn-danger">Back</a>
            </form>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const form = document.getElementById('contactForm');
            const submitBtn = document.getElementById('submitBtn');
            const inputs = form.querySelectorAll('input[required], textarea[required]');

            function validateForm() {
                let valid = true;
                inputs.forEach(input => {
                    if (input.value.trim().length < (input.minLength || 1) || 
                        (input.type === "number" && (input.value < input.min || input.value > input.max))) {
                        valid = false;
                    }
                });
                submitBtn.disabled = !valid;
            }

            inputs.forEach(input => {
                input.addEventListener('keyup', validateForm);
                input.addEventListener('change', validateForm);
            });

            validateForm();
        });
    </script>
@endsection
