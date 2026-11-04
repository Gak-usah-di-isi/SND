@extends('layouts.app')
@section('title', 'Edit Contact')
@section('content')
    <div class="container card p-4">
        <h2 class="fs-5">EDIT CONTACT</h2>
        <hr class="border border-secondary">
        <div class="row">
            <form action="{{ route('landing.contact.update', $contact->id) }}" method="POST" id="contactForm">
                @csrf
                @method('PUT')

                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" name="email" class="form-control" required placeholder="Masukkan email Anda" value="{{ $contact->email }}">
                </div>

                <div class="mb-3">
                    <label class="form-label">Phone 1</label>
                    <input type="text" class="form-control" name="phone1" placeholder="Enter phone number" value="{{ $contact->phone1 }}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Phone 1 Owner</label>
                    <input type="text" class="form-control" name="phone1_name" placeholder="Enter name (optional)" value="{{ $contact->phone1_name }}">
                </div>

                <div class="mb-3">
                    <label class="form-label">Phone 2</label>
                    <input type="text" class="form-control" name="phone2" placeholder="Enter phone number" value="{{ $contact->phone2 }}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Phone 2 Owner</label>
                    <input type="text" class="form-control" name="phone2_name" placeholder="Enter name (optional)" value="{{ $contact->phone2_name }}">
                </div>

                <div class="mb-3">
                    <label class="form-label">Address</label>
                    <textarea name="address" class="form-control" required minlength="10" placeholder="Masukkan alamat lengkap">{{ $contact->address }}</textarea>
                </div>

                <div class="mb-3">
                    <label class="form-label">Year</label>
                    <input type="number" name="year" class="form-control" required min="2000" max="{{ date('Y') }}" value="{{ $contact->year }}">
                </div>

                <button type="submit" class="btn btn-success" id="submitBtn" disabled>Update</button>
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
