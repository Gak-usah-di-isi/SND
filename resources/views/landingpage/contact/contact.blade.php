@extends('layouts.landing')
@section('title', 'Contact Us')
@section('content')

@php
    $latestContact = $contacts->sortByDesc('created_at')->first();
    $emailTo = $latestContact ? $latestContact->email : 'contact@example.com';
@endphp

<div class="container py-5">
    <!-- Header Section -->
    <div class="text-center mb-5">
        <h1 class="display-4 fw-bold">Contact Us</h1>
        <p class="lead text-muted">If you have any questions, feel free to reach out to us.</p>
    </div>

    <div class="row">
        <!-- Contact Form Section -->
        <div class="col-md-6 mb-4">
            <div class="card rounded-none" style="border-top: 5px solid #0d6efd;">
                <div class="card-body p-4">
                    <h4 class="card-title mb-4">Send Us a Message</h4>
                    <form id="contactForm">
                        <div class="mb-3">
                            <label class="form-label">Your Name</label>
                            <input type="text" class="form-control form-control-lg fs-6" id="name" placeholder="Enter your name" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Email Address</label>
                            <input type="email" class="form-control form-control-lg fs-6" id="email" placeholder="you@example.com" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Message</label>
                            <textarea class="form-control form-control-lg fs-6" id="message" rows="4" placeholder="Write your message here" required></textarea>
                        </div>
                        <button type="button" class="btn btn-primary w-100" onclick="sendEmail()">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
        
        <!-- Contact Information Section -->
        <div class="col-md-6 mb-4">
            <div class="card rounded-none" style="border-top: 5px solid #0d6efd;">
                <div class="card-body p-4">
                    <h4 class="card-title mb-4">Our Contact Information</h4>
                    @if ($latestContact)
                        <address class="mb-4">
                            <p class="mb-2">
                                <i class="bi bi-geo-alt me-2"></i>
                                <strong>Address:</strong> {{ $latestContact->address }}
                            </p>
                            <p class="mb-2">
                                <i class="bi bi-envelope me-2"></i>
                                <strong>Email:</strong> {{ $latestContact->email }}
                            </p>
                            <p class="mb-2">
                                <i class="bi bi-telephone me-2"></i>
                                <strong>Phone 1:</strong> +62{{ ltrim($latestContact->phone1, '0') }} 
                                @if($latestContact->phone1_name)
                                    ({{ $latestContact->phone1_name }})
                                @endif
                            </p>
                            @if ($latestContact->phone2)
                                <p class="mb-2">
                                    <i class="bi bi-telephone me-2"></i>
                                    <strong>Phone 2:</strong> +62{{ ltrim($latestContact->phone2, '0') }}
                                    @if($latestContact->phone2_name)
                                        ({{ $latestContact->phone2_name }})
                                    @endif
                                </p>
                            @endif
                        </address>
                    @else
                        <p class="text-muted">No contact information available.</p>
                    @endif
                
                    <hr class="my-4">
                    
                    <h5 class="fw-bold mb-3">Follow Us</h5>
                    <div class="d-flex">
                        @php
                           $instagram = \App\Models\Instagram::first();
                        @endphp

                        @if ($instagram == null)
                            <a href="#" class="btn btn-outline-danger btn-sm">
                                <i class="bi bi-instagram me-1"></i> Instagram
                            </a>
                        @else
                            <a href="{{ $instagram->link }}" class="btn btn-outline-danger btn-sm">
                                <i class="bi bi-instagram me-1"></i> Instagram
                            </a>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    function sendEmail() {
        let name = document.getElementById("name").value.trim();
        let email = document.getElementById("email").value.trim();
        let message = document.getElementById("message").value.trim();
        let emailTo = "{{ $emailTo }}"; // Ambil email dari backend

        if (!name || !email || !message) {
            alert("Please fill out all fields before sending.");
            return;
        }

        let subject = `Contact Us - ${name}`;
        let body = `Dear Support Team,\n\n` +
                   `My Name: ${name}\n` +
                   `My Email: ${email}\n\n` +
                   `Message:\n${message}\n\n` +
                   `Best regards,\n${name}`;

        let mailtoLink = `mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.location.href = mailtoLink;
    }
</script>


@endsection
