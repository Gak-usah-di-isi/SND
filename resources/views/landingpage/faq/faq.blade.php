@extends('layouts.landing')
@section('title', 'FAQ')
@section('content')
    <section id="faq" class="faq container section">
        <div class="container-fluid">
            <div class="row gy-4">
                <div class="col-lg-7 d-flex flex-column justify-content-center order-2 order-lg-1 w-100">
                    <div class="content px-xl-5" data-aos="fade-up" data-aos-delay="100">
                        <h3><span>Frequently Asked </span><strong>Questions</strong></h3>
                        <p>Here are some of the most commonly asked questions:</p>
                    </div>

                    <div class="faq-container px-xl-5" data-aos="fade-up" data-aos-delay="200">
                        @foreach ($faqs as $faq)
                            <div class="faq-item">
                                <i class="faq-icon bi bi-question-circle"></i>
                                <h3>{{ $faq->title }}</h3>
                                <div class="faq-content">
                                    {!! $faq->description !!}
                                </div>
                                <i class="faq-toggle bi bi-chevron-right"></i>
                            </div>
                        @endforeach
                        @if ($faqs->isEmpty())
                            <p class="text-muted mt-3" data-aos="fade-up">No faq found.</p>
                        @endif
                    </div>
                </div>

                <div class="col-lg-5 order-1 order-lg-2">
                    <img src="assets/images/faq.jpg" class="img-fluid" alt="" data-aos="zoom-in"
                        data-aos-delay="100" />
                </div>
            </div>
        </div>
    </section>
@endsection
