<footer id="footer" class="footer dark-background">
    <div class="container footer-top">
        <div class="row gy-4">
            <!-- Footer About / Contact Information -->
            <div class="col-lg-4 col-md-6 footer-about">
                <a href="{{ url('/') }}" class="logo d-flex align-items-center">
                    <span class="sitename">ICASVE {{ date('Y') }}</span>
                </a>
                <div class="footer-contact pt-3">
                    @php
                        $contact = \App\Models\Contact::latest()->first();
                        if ($contact) {
                            $phone = $contact->phone;
                            // Jika nomor diawali "0", ganti dengan "+62"
                            if (substr($phone, 0, 1) === '0') {
                                $phone = '+62' . substr($phone, 1);
                            }
                        }
                    @endphp
                    @if ($contact)
                        <address>
                            <p class="mb-1"><strong>Address: <br></strong> {{ $contact->address }}</p>
                            <p class="mb-1"><strong>Phone 1: <br></strong> {{ $contact->phone1 }} ({{ $contact->phone1_name }})</p>
                            @if($contact->phone2)
                                <p class="mb-1"><strong>Phone 2: <br></strong> {{ $contact->phone2 }} ({{ $contact->phone2_name }})</p>
                            @endif
                            <p class="mb-1"><strong>Email:  <br></strong> {{ $contact->email }}</p>
                        </address>
                    @else
                        <p class="text-muted">No contact information available.</p>
                    @endif
                </div>
                <div class="social-links d-flex mt-4">
                    @php
                    $activeYear = \App\Models\LandingSetting::where('is_active', true)->value('year');
                    $instagram = \App\Models\Instagram::where('year', $activeYear)->first();
                @endphp
                
                @if ($instagram)
                    <a href="{{ $instagram->link }}" class="me-2" target="_blank"><i class="bi bi-instagram"></i></a>
                @else
                    <a href="" class="me-2"><i class="bi bi-instagram"></i></a>
                @endif
                
                </div>
            </div>

            <!-- Footer Links: Committee -->
            <div class="col-lg-2 col-md-3 footer-links">
                <h4>Committee</h4>
                <ul>
                    <li><a href="{{ route('committee.steering') }}">Steering Committee</a></li>
                    <li><a href="{{ route('committee.reviewer') }}">Reviewer Committee</a></li>
                    <li><a href="{{ route('committee.organizing') }}">Organizing Committee</a></li>
                </ul>
            </div>

            <!-- Footer Links: Support -->
            <div class="col-lg-2 col-md-3 footer-links">
                <h4>Support</h4>
                <ul>
                    <li><a href="{{ route('submission.abstract') }}">Abstract Guideline</a></li>
                    <li><a href="{{ route('submission.fullpaper') }}">Fullpaper Guideline</a></li>
                    <li><a href="{{ route('submission.presentation') }}">Presentation Guideline</a></li>
                    <li><a href="{{ route('conference.program') }}">Conference</a></li>
                    <li><a href="{{ route('faq') }}">FAQ</a></li>
                </ul>
            </div>

            <!-- Footer Newsletter -->
            <div class="col-lg-4 col-md-12 footer-newsletter">
                <h4>Our Newsletter</h4>
                <p>Subscribe to our newsletter and receive the latest news about our products and services!</p>
                <form action="{{ route('landing.newsletters.store') }}" method="POST" class="php-email-form">
                    @csrf
                    <div class="newsletter-form d-flex">
                        <input type="email" name="email" class="text-white outline-none me-2" placeholder="Your Email" required />
                        <input type="submit" value="Subscribe" class="btn btn-primary" />
                    </div>
                    @if(session('success'))
                        <div class="sent-message">{{ session('success') }}</div>
                    @endif
                    @if ($errors->has('email'))
                        <div class="error-message">{{ $errors->first('email') }}</div>
                    @endif
                </form>
                
            </div>
        </div>
    </div>

    <div class="container copyright text-center mt-4">
        <p>Copyright &copy; {{ date('Y') }} <strong>ICASVE</strong> &mdash; Faculty of Vocational Studies, Universitas Brawijaya</p>
    </div>
</footer>
