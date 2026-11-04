@extends('layouts.landing')
@section('title', 'Home')
@php
    $contact = \App\Models\Contact::latest()->first();
    $emailTo = $contact ? $contact->email : 'contact@example.com';
    $whatsappNumber = null;

    if ($contact) {
        $whatsappNumber = $contact->phone;
        if (substr($whatsappNumber, 0, 1) === '0') {
            $whatsappNumber = '+62' . substr($whatsappNumber, 1);
        }
    }

    $heroSplitLines = function ($text, array $counts) {
        $words = explode(' ', $text);
        $lines = [];
        $offset = 0;
        foreach ($counts as $count) {
            $lines[] = implode(' ', array_slice($words, $offset, $count));
            $offset += $count;
        }
        $lines[] = implode(' ', array_slice($words, $offset));
        return $lines;
    };
@endphp
@section('content')
    <section id="hero" class="hero section dark-background">
        {{-- <img src="{{ asset('/images/hero-bg-new.png') }}" alt="" class="hero-bg" style="opacity: 0.75;" /> --}}

        <img src="{{ asset('images/hero-section.png') }}" alt="" class="hero-pattern hero-pattern-left" />
        <img src="{{ asset('images/hero-section.png') }}" alt="" class="hero-pattern hero-pattern-right" />

        @if ($conference_title)
            <div class="container d-flex align-items-center justify-content-center" style="min-height: 60vh;">
                <div class="row gy-4 justify-content-center">
                    <div class="hero-content d-flex flex-column align-items-center text-center" data-aos="fade-in">
                        <div class="hero-logos d-flex align-items-center justify-content-center flex-wrap gap-2">
                            <img src="{{ asset('images/logoub.png') }}" alt="Universitas Brawijaya" class="hero-logo" />
                            <img src="{{ asset('images/kemdikbud.png') }}" alt="Kemendikbud" class="hero-logo" />
                            <img src="{{ asset('images/dikti.png') }}" alt="Diktisaintek Berdampak" class="hero-logo" />
                            <img src="{{ asset('images/vokasi_ub.png') }}" alt="Vokasi UB" class="hero-logo" />
                        </div>
                        @php
                            $titleLines = $heroSplitLines($conference_title->title, [2, 4]);
                            $descLines = $heroSplitLines($conference_title->description, [2, 3]);
                        @endphp
                        <h1>{{ $titleLines[0] }}<br>{{ $titleLines[1] }}<br>{{ $titleLines[2] }}</h1>
                        <div class="hero-tag-row d-flex align-items-center flex-wrap justify-content-center gap-3">
                            <span class="hero-tag">ICASVE {{ $conference_title->year }}</span>
                            <span class="hero-tag-desc">{{ $descLines[0] }}<br>{{ $descLines[1] }}<br>{{ $descLines[2] }}</span>
                        </div>
                        <div class="d-flex justify-content-center gap-3">
                            @if ((int) $activeYear->year === 2026)
                                <a href="{{ route('login') }}" class="btn-cta-single">
                                    <span>Join the Conference Now</span>
                                    <span class="btn-cta-icon"><i class="bi bi-arrow-right"></i></span>
                                </a>
                            @else
                                <a href="{{ route('login') }}" class="btn-get-started">Login</a>
                                <a href="{{ route('register') }}" class="btn-get-started">Register</a>
                            @endif
                        </div>
                    </div>
                </div>
            </div>
        @else
            <div class="container d-flex align-items-center justify-content-center" style="min-height: 60vh;">
                <div class="row gy-4 justify-content-center">
                    <div class="hero-content d-flex flex-column align-items-center text-center" data-aos="fade-in">
                        <div class="hero-logos d-flex align-items-center justify-content-center flex-wrap gap-2">
                            <img src="{{ asset('images/logoub.png') }}" alt="Universitas Brawijaya" class="hero-logo" />
                            <img src="{{ asset('images/kemdikbud.png') }}" alt="Kemendikbud" class="hero-logo" />
                            <img src="{{ asset('images/dikti.png') }}" alt="Diktisaintek Berdampak" class="hero-logo" />
                            <img src="{{ asset('images/vokasi_ub.png') }}" alt="Vokasi UB" class="hero-logo" />
                        </div>
                        <h1>ICASVE {{ date('Y') }}</h1>
                        @php $descLines = $heroSplitLines('International Conference on Applied Science and Engineering', [2, 3]); @endphp
                        <div class="hero-tag-row d-flex align-items-center flex-wrap justify-content-center gap-3">
                            <span class="hero-tag">ICASVE {{ $activeYear->year }}</span>
                            <span class="hero-tag-desc">{{ $descLines[0] }}<br>{{ $descLines[1] }}<br>{{ $descLines[2] }}</span>
                        </div>
                        <div class="d-flex justify-content-center gap-3">
                            @if ((int) $activeYear->year === 2026)
                                <a href="{{ route('login') }}" class="btn-cta-single">
                                    <span>Join the Conference Now</span>
                                    <span class="btn-cta-icon"><i class="bi bi-arrow-right"></i></span>
                                </a>
                            @else
                                <a href="{{ route('login') }}" class="btn-get-started">Login</a>
                                <a href="{{ route('register') }}" class="btn-get-started">Register</a>
                            @endif
                        </div>
                    </div>
                </div>
            </div>
        @endif

        <svg class="hero-waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 24 150 28 " preserveAspectRatio="none">
            <defs>
                <path id="wave-path" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"></path>
            </defs>
            <g class="wave1">
                <use xlink:href="#wave-path" x="50" y="3"></use>
            </g>
            <g class="wave2">
                <use xlink:href="#wave-path" x="50" y="0"></use>
            </g>

        </svg>
    </section>
    <!-- /Hero Section -->

    <style>
        .hero {
            padding: 90px 0 90px 0;
        }

        .hero .hero-pattern {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 130px;
            max-width: 10%;
            height: 100%;
            object-fit: cover;
            z-index: 2;
            pointer-events: none;
        }

        .hero .hero-pattern-left {
            left: 0;
        }

        .hero .hero-pattern-right {
            right: 0;
            transform: scaleX(-1);
        }

        @media (max-width: 992px) {
            .hero .hero-pattern {
                width: 80px;
            }
        }

        @media (max-width: 640px) {
            .hero .hero-pattern {
                display: none;
            }
        }

        .hero .hero-content {
            width: 100%;
        }

        .hero .hero-logos {
            margin-bottom: 16px;
        }

        .hero .hero-logo {
            height: 56px;
            width: auto;
            object-fit: contain;
        }

        .hero h1 {
            color: var(--heading-color);
        }

        .hero .hero-tag-row {
            margin-bottom: 30px;
        }

        .hero .hero-tag {
            display: inline-flex;
            align-items: center;
            background: var(--accent-color);
            color: #ffffff;
            font-family: var(--heading-font);
            font-weight: 700;
            font-size: 20px;
            padding: 14px 28px;
            clip-path: polygon(18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%, 0 18px);
            white-space: nowrap;
        }

        .hero .hero-tag-desc {
            color: color-mix(in srgb, var(--default-color), transparent 10%);
            font-size: 16px;
            line-height: 1.4;
            text-align: left;
            max-width: 320px;
        }

        @media (max-width: 640px) {
            .hero .hero-logo {
                height: 44px;
            }

            .hero .hero-tag-row {
                flex-direction: column;
                align-items: center !important;
            }

            .hero .hero-tag-desc {
                text-align: center;
                max-width: 100%;
            }
        }
    </style>

    <!-- About Section -->
    <!-- About Section -->
    @if ($about)
        <section id="about" class="about section">
            <div class="container">
                <div class="row align-items-center justify-content-between gy-5">
                    <div class="teks-about col-12 col-xl-5 content" data-aos="fade-up">
                        <h3>About</h3>
                        <h2>{{ $about->title }}</h2>
                        <div class="text-justify" style="text-align: justify">
                            {!! $about->content !!}
                        </div>
                    </div>

                    <div class="d-none d-xl-block col-xl-2"></div>

                    <div class="image-about col-12 col-xl-5 d-flex justify-content-end" data-aos="fade-up"
                        data-aos-delay="100">
                        <img src="{{ asset('storage/' . $about->image) }}" class="w-100 w-md-75 animated rounded-3"
                            alt="gedung-vokasi" />
                    </div>
                </div>
            </div>
        </section>
    @endif
    <!-- /About Section -->

    <!-- Conference Objectives Section -->
    @if ($conference_objectives->isNotEmpty())
    <section id="conference-objectives" class="conference-objectives section light-background">
        <div class="container">
            <div class="section-title title-accent" data-aos="fade-up">
                <h2>Objectives</h2>
                <div><span>Conference</span> <span class="description-title"> Objectives</span></div>
            </div>
            <div class="row g-4 justify-content-center">
                @foreach ($conference_objectives as $obj)
                <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="{{ $loop->index * 80 }}">
                    <div class="h-100" style="background: #ffffff; border-radius: 16px; padding: 32px 24px; display: flex; flex-direction: column; align-items: flex-start; gap: 16px; box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06); border: 1px solid rgba(0, 0, 0, 0.05); transition: transform 0.25s ease, box-shadow 0.25s ease;">
                        <div style="width: 52px; height: 52px; border-radius: 14px; background: #141a63; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <i class="{{ $obj->icon }}" style="font-size: 24px; color: #ffffff;"></i>
                        </div>
                        <p style="font-size: 15px; line-height: 1.65; color: var(--default-color); text-align: left; margin: 0;">{{ $obj->content }}</p>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
    </section>
    @endif
    <!-- /Conference Objectives Section -->

    <!-- Team Section -->
    @if ($keynoteSpeakers->isNotEmpty())
        <section id="team" class="team section">
            <!-- Section Title -->
            <div class="container section-title title-accent" data-aos="fade-up">
                <h2>Keynote Speakers</h2>
                <div><span>Check Our</span> <span class="description-title">Keynote Speakers</span></div>
            </div>
            <!-- End Section Title -->

            <div class="container">
                <div class="row gy-5">
                    @if ($keynoteSpeakers->isEmpty())
                        <p>No keynote speakers found.</p>
                    @endif
                    @foreach ($keynoteSpeakers as $speaker)
                        <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                            <div class="member">
                                <div class="pic" style="width: 100%; aspect-ratio: 3 / 4; overflow: hidden; margin-bottom: 50px;">
                                    <img src="{{ asset('storage/' . $speaker->image) }}"
                                        class="img-fluid"
                                        alt="{{ $speaker->name }}"
                                        style="width: 100%; height: 100%; object-fit: cover; object-position: top center;" />
                                </div>
                                <div class="member-info">
                                    <h4>
                                        {{ $speaker->name }}
                                        @if($speaker->await_confirmation)
                                            <span style="color: #ff5722; font-size: 0.9em; font-weight: bold; margin-left: 5px;">( Await Confirmation )</span>
                                        @endif
                                    </h4>
                                    <span>{{ $speaker->institution }}</span>
                                    @if($speaker->session_topic)
                                        <div style="color: #ff5722; font-weight: bold; font-size: 0.95em; margin-top: 8px;">{{ $speaker->session_topic }}</div>
                                    @endif
                                    <div class="social">
                                        <span>{{ $speaker->country }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    @endforeach
                    <!-- End Team Member -->
                </div>
            </div>
        </section>
    @endif
    @if ($invitedSpeakers->isNotEmpty())
        <section id="team-invited" class="team section">
            <!-- Section Title -->
            <div class="container section-title" data-aos="fade-up">
                <h2>Invited Speakers</h2>
                <div><span>Check Our</span> <span class="description-title">Invited Speakers</span></div>
            </div>
            <!-- End Section Title -->

            <div class="container">
                <div class="row gy-5">
                    @if ($invitedSpeakers->isEmpty())
                        <p>No invited speakers found.</p>
                    @endif
                    @foreach ($invitedSpeakers as $speaker)
                        <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                            <div class="member">
                                <div class="pic" style="width: 100%; aspect-ratio: 3 / 4; overflow: hidden; margin-bottom: 50px;">
                                    <img src="{{ asset('storage/' . $speaker->image) }}"
                                        class="img-fluid"
                                        alt="{{ $speaker->name }}"
                                        style="width: 100%; height: 100%; object-fit: cover; object-position: top center;" />
                                </div>
                                <div class="member-info">
                                    <h4>
                                        {{ $speaker->name }}
                                        @if($speaker->await_confirmation)
                                            <span style="color: #ff5722; font-size: 0.9em; font-weight: bold; margin-left: 5px;">( Await Confirmation )</span>
                                        @endif
                                    </h4>
                                    <span>{{ $speaker->institution }}</span>
                                    @if($speaker->session_topic)
                                        <div style="color: #ff5722; font-weight: bold; font-size: 0.95em; margin-top: 8px;">{{ $speaker->session_topic }}</div>
                                    @endif
                                    <div class="social">
                                        <span>{{ $speaker->country }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    @endforeach
                    <!-- End Team Member -->
                </div>
            </div>
        </section>
    @endif
    <!-- /Team Section -->

    @if ($themes->isNotEmpty())
        <div id="hero-topics" class="py-5 content-topics">
            <div class="container">
                <div class="contents-topics text-white text-left text-md-start">
                    <h2 class="fw-bold text-white mb-3" data-aos="fade-up">CALL FOR PAPER</h2>
                    <p data-aos="fade-up">The topics include, but are not limited to:</p>
                    <ul class="list-topics" data-aos="fade-up" data-aos-delay="200">
                        @if ($themes->isEmpty())
                            <p>No topics found.</p>
                        @endif
                        @foreach ($themes as $theme)
                            <li>
                                <a href="{{ route('themes.show', $theme->id) }}"
                                    class="text-white text-decoration-underline">
                                    {{ $theme->title }} ({{ $theme->year }})
                                </a>
                            </li>
                        @endforeach
                    </ul>
                </div>
            </div>
        </div>
    @endif


    <!-- Details Section -->
    <section id="details" class="details section">
        @if ($posters->count() > 0)
            <div class="container">
                @foreach ($posters as $poster)
                    <div class="row gy-4 align-items-center features-item">
                        <div class=" col-md-5 order-1 order-md-2 d-flex align-items-center" data-aos="zoom-out"
                            data-aos-delay="200">
                            <img src="{{ asset('storage/' . $poster->image) }}" class="poster-md img-fluid rounded-2"
                                alt="" />
                        </div>
                        <div class="col-md-7 order-2 order-md-1">
                            <div class="container section-title title-accent" data-aos="fade-up">
                                <h2>ICASVE Conference Timeline</h2>
                                <div><span>Deadline</span> <span class="description-title"> Dates</span></div>
                            </div>
                            <div class="mb-4" data-aos="fade-up" data-aos-delay="100">
                                <img src="{{ asset('storage/' . $poster->image) }}" class="poster-sm img-fluid rounded-2"
                                    alt="" />
                            </div>
                            <table class="custom-table" data-aos="fade-up" data-aos-delay="200">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @php
                                        $groupedDeadlines = $deadline_date
                                            ->groupBy(function ($item) {
                                                return trim(strtolower($item->name));
                                            })
                                            ->sortBy(function ($group) {
                                                return $group->min('date');
                                            });
                                    @endphp
                                    @foreach ($groupedDeadlines as $group)
                                        @php
                                            $displayName = $group->first()->name;
                                            $sortedDates = $group->sortBy('date')->values();
                                            $latestIndex = $sortedDates->count() - 1;
                                        @endphp
                                        <tr>
                                            <td>{{ $displayName }}</td>
                                            <td>
                                                @foreach ($sortedDates as $index => $item)
                                                    @if ($index < $latestIndex)
                                                        <s class="text-muted" style="color: #9CA3AF; margin-right: 8px;">
                                                            {{ \Carbon\Carbon::parse($item->date)->format('F j, Y') }}
                                                        </s>
                                                    @else
                                                        <span style="font-weight: 600; color: #1F2A3D;">
                                                            {{ \Carbon\Carbon::parse($item->date)->format('F j, Y') }}
                                                        </span>
                                                    @endif
                                                @endforeach
                                            </td>
                                        </tr>
                                    @endforeach
                                    @if ($deadline_date->isEmpty())
                                        <tr>
                                            <td colspan="2">No deadline date found.</td>
                                        </tr>
                                    @endif
                                </tbody>
                            </table>
                            <a href="{{ asset('storage/' . $poster->image) }}" class="leaflet-button"
                                data-aos="fade-up">Get Our Leaflet</a>
                        </div>
                    </div>
                @endforeach
        @endif
        <!-- Features Item -->
        <div class="row gy-4 align-items-center features-item">
            @if ($presenter->isNotEmpty())
                <div class="container">
                    <div class="container section-title title-accent" data-aos="fade-up">
                        <h2>Registration</h2>
                        <div><span>Registration</span> <span class="description-title"> Fee</span></div>
                    </div>
                    <div class="table-responsive" data-aos="fade-up" data-aos-delay="100">
                        <table class="table table-bordered">
                            <thead class="thead-light">
                                <tr>
                                    <th>Presenter</th>
                                    <th>Domestic Participants</th>
                                    <th>International Participants</th>
                                    <th>Period of Payment</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($presenter as $fee)
                                    @php
                                        $payment_date =
                                            $fee->period_of_payment !== 'TBA'
                                                ? \Carbon\Carbon::parse($fee->period_of_payment)
                                                : null;
                                    @endphp
                                    <tr>
                                        <td>
                                            @if ($payment_date && $payment_date->isPast())
                                                <s>{{ $fee->category_name }}</s>
                                            @else
                                                {{ $fee->category_name }}
                                            @endif
                                        </td>
                                        <td>
                                            @if ($payment_date && $payment_date->isPast())
                                                <s>
                                            @endif
                                            @if ($fee->domestic_participants === 'TBA')
                                                TBA
                                            @elseif(is_numeric($fee->domestic_participants))
                                                IDR {{ number_format($fee->domestic_participants, 0, ',', '.') }}
                                            @endif
                                            @if ($payment_date && $payment_date->isPast())
                                                </s>
                                            @endif
                                        </td>
                                        <td>
                                            @if ($payment_date && $payment_date->isPast())
                                                <s>
                                            @endif
                                            @if ($fee->international_participants === 'TBA')
                                                TBA
                                            @elseif(is_numeric($fee->international_participants))
                                                US$ {{ number_format($fee->international_participants, 2, '.', ',') }}
                                            @endif
                                            @if ($payment_date && $payment_date->isPast())
                                                </s>
                                            @endif
                                        </td>
                                        <td>
                                            @if ($fee->period_of_payment === 'TBA')
                                                TBA
                                            @else
                                                {!! $payment_date && $payment_date->isPast()
                                                    ? '<s>Until ' . $payment_date->format('F jS, Y') . '</s>'
                                                    : 'Until ' . $payment_date->format('F jS, Y') !!}
                                            @endif
                                        </td>
                                    </tr>
                                @endforeach
                                @if ($presenter->isEmpty())
                                    <tr>
                                        <td colspan="4">No presenter found.</td>
                                    </tr>
                                @endif
                        </table>
                        <table class="table table-bordered">
                            <thead class="thead-light">
                                <tr>
                                    <th>Non-presenter</th>
                                    <th>Domestic Participants</th>
                                    <th>International Participants</th>
                                    <th>Period of Payment</th>
                                </tr>
                            </thead>
                            @foreach ($non_presenter as $fee)
                                @php
                                    $payment_date =
                                        $fee->period_of_payment !== 'TBA'
                                            ? \Carbon\Carbon::parse($fee->period_of_payment)
                                            : null;
                                @endphp
                                <tr>
                                    <td>
                                        @if ($payment_date && $payment_date->isPast())
                                            <s>{{ $fee->category_name }}</s>
                                        @else
                                            {{ $fee->category_name }}
                                        @endif
                                    </td>
                                    <td>
                                        @if ($payment_date && $payment_date->isPast())
                                            <s>
                                        @endif
                                        @if ($fee->domestic_participants === 'TBA')
                                            TBA
                                        @elseif(is_numeric($fee->domestic_participants))
                                            IDR {{ number_format($fee->domestic_participants, 0, ',', '.') }}
                                        @endif
                                        @if ($payment_date && $payment_date->isPast())
                                            </s>
                                        @endif
                                    </td>
                                    <td>
                                        @if ($payment_date && $payment_date->isPast())
                                            <s>
                                        @endif
                                        @if ($fee->international_participants === 'TBA')
                                            TBA
                                        @elseif(is_numeric($fee->international_participants))
                                            US$ {{ number_format($fee->international_participants, 2, '.', ',') }}
                                        @endif
                                        @if ($payment_date && $payment_date->isPast())
                                            </s>
                                        @endif
                                    </td>
                                    <td>
                                        @if ($fee->period_of_payment === 'TBA')
                                            TBA
                                        @else
                                            {!! $payment_date && $payment_date->isPast()
                                                ? '<s>Until ' . $payment_date->format('F jS, Y') . '</s>'
                                                : 'Until ' . $payment_date->format('F jS, Y') !!}
                                        @endif
                                    </td>
                                </tr>
                            @endforeach
                            @if ($non_presenter->isEmpty())
                                <tr>
                                    <td colspan="4">No Non-presenter found.</td>
                                </tr>
                            @endif
                            </tbody>
                        </table>
                        <table class="table table-bordered">
                            <thead class="thead-light">
                                <tr>
                                    <th>Additional Fee</th>
                                    <th>Domestic Participants</th>
                                    <th>International Participants</th>
                                    <th>Period of Payment</th>
                                </tr>
                            </thead>
                            @foreach ($additional_fee as $fee)
                                @php
                                    $payment_date =
                                        $fee->period_of_payment !== 'TBA'
                                            ? \Carbon\Carbon::parse($fee->period_of_payment)
                                            : null;
                                @endphp
                                <tr>
                                    <td>
                                        @if ($payment_date && $payment_date->isPast())
                                            <s>{{ $fee->category_name }}</s>
                                        @else
                                            {{ $fee->category_name }}
                                        @endif
                                    </td>
                                    <td>
                                        @if ($payment_date && $payment_date->isPast())
                                            <s>
                                        @endif
                                        @if ($fee->domestic_participants === 'TBA')
                                            TBA
                                        @elseif(is_numeric($fee->domestic_participants))
                                            IDR {{ number_format($fee->domestic_participants, 0, ',', '.') }}
                                        @endif
                                        @if ($payment_date && $payment_date->isPast())
                                            </s>
                                        @endif
                                    </td>
                                    <td>
                                        @if ($payment_date && $payment_date->isPast())
                                            <s>
                                        @endif
                                        @if ($fee->international_participants === 'TBA')
                                            TBA
                                        @elseif(is_numeric($fee->international_participants))
                                            US$ {{ number_format($fee->international_participants, 2, '.', ',') }}
                                        @endif
                                        @if ($payment_date && $payment_date->isPast())
                                            </s>
                                        @endif
                                    </td>
                                    <td>
                                        @if ($fee->period_of_payment === 'TBA')
                                            TBA
                                        @else
                                            {!! $payment_date && $payment_date->isPast()
                                                ? '<s>Until ' . $payment_date->format('F jS, Y') . '</s>'
                                                : 'Until ' . $payment_date->format('F jS, Y') !!}
                                        @endif
                                    </td>
                                </tr>
                            @endforeach
                            @if ($additional_fee->isEmpty())
                                <tr>
                                    <td colspan="4">No Additional Fee found.</td>
                                </tr>
                            @endif
                        </table>
                    </div>
                    <p class="text-muted mt-3" data-aos="fade-up">
                        <small>
                            <b>Please note:</b><br />
                            1. The registration fee serves only for conference fee, and it cannot be waived for
                            authors.<br />
                            2. Authors need to pay for publishing if accepted.<br />
                            3. Certificate fee: Participants can attend the event without certificate.
                        </small>
                    </p>
                    <div class="mt-4">
                        <a href="{{ route('payment_guidelines.landing') }}" class="btn btn-primary btn-sm py-2 px-4">
                            See payment procedures
                        </a>
                    </div>
                </div>
            @endif

            @if ($venues->isNotEmpty())
        </div>
        <div class="row gy-4 align-items-center features-item">
            <div class="container section-title title-accent" data-aos="fade-up">
                <h2>Venue</h2>
                <div><span>Our</span> <span class="description-title"> Venue</span></div>
            </div>
            @foreach ($venues as $venue)
                <div class="row align-items-start">
                    <div class="col-md-6 mb-2 mb-md-0" data-aos="fade-up">
                        <img src="{{ asset('storage/' . $venue->image_path) }}" alt="Venue Building"
                            class="img-fluid rounded shadow" style="width: 100%; max-width: 500px; max-height: 375px;" />
                    </div>
                    <div class="location col-md-6 mt-2 mt-md-0" data-aos="fade-up">
                        <h3 class="title-location">{{ $venue->venue_name }}</h3>
                        <p class="text-muted">{{ $venue->address }}</p>
                        <p class="font-weight-bold">Date: {{ $venue->date }}</p>
                        
                        @if($venue->conference_mode || $venue->onsite_programme || $venue->online_programme)
                        <div class="table-responsive mt-3 mb-3">
                            <table class="table table-bordered table-sm" style="font-size: 0.9em;">
                                @if($venue->conference_mode)
                                <tr>
                                    <th style="width: 35%; color: #ff5722;">Conference mode</th>
                                    <td style="color: #ff5722;">{{ $venue->conference_mode }}</td>
                                </tr>
                                @endif
                                @if($venue->onsite_programme)
                                <tr>
                                    <th style="color: #ff5722;">Onsite programme</th>
                                    <td style="color: #ff5722;">{{ $venue->onsite_programme }}</td>
                                </tr>
                                @endif
                                @if($venue->online_programme)
                                <tr>
                                    <th style="color: #ff5722;">Online programme</th>
                                    <td style="color: #ff5722;">{{ $venue->online_programme }}</td>
                                </tr>
                                @endif
                            </table>
                        </div>
                        @endif

                        <a href="{{ $venue->link_map }}" target="_blank" class="btn btn-primary btn-map">See on Map</a>
                    </div>
                </div>

                <!-- Map Section -->
                <div class="mt-4 full-screen-map" data-aos="fade-up">
                    <div class="mt-4 full-screen-map" data-aos="fade-up">
                        {!! $venue->map !!}
                    </div>
                </div>
            @endforeach
            @if ($venues->isEmpty())
                <p class="text-muted mt-3" data-aos="fade-up">No venue found.</p>
            @endif
        </div>
        @endif
        </div>
    </section>
    <!-- /Details Section -->

    {{-- Section Baru: Publication Information (Publication Pathway Roadmap) --}}
    @if (!empty($publication_setting?->proceedings_text) || !empty($publication_setting?->journal_text))
        <style>
            .publication-pathway-section {
                position: relative;
            }
            .pathway-card {
                background: #ffffff;
                border-radius: 20px;
                padding: 30px 28px;
                box-shadow: 0 8px 24px rgba(20, 26, 99, 0.04);
                border: 1px solid rgba(20, 26, 99, 0.08);
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                position: relative;
                overflow: hidden;
            }
            .pathway-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 16px 36px rgba(20, 26, 99, 0.09);
                border-color: rgba(20, 26, 99, 0.16);
            }
            .pathway-icon-box {
                width: 46px;
                height: 46px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                font-size: 20px;
            }
            .pathway-flow {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 14px;
                padding: 14px 16px;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
                flex-wrap: wrap;
            }
            .pathway-flow-step {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 12.5px;
                font-weight: 600;
                color: #334155;
            }
            .pathway-flow-num {
                width: 22px;
                height: 22px;
                border-radius: 50%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                font-weight: 700;
                color: #ffffff;
                flex-shrink: 0;
            }
            .pathway-flow-arrow {
                color: #94a3b8;
                font-size: 13px;
                flex-shrink: 0;
            }
            @media (max-width: 576px) {
                .pathway-flow {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 10px;
                }
                .pathway-flow-arrow {
                    transform: rotate(90deg);
                    align-self: center;
                    margin: -4px 0;
                }
            }
        </style>

        <section id="publication-info-section" class="publications-section section light-background pb-3">
            <div class="container">
                {{-- Judul dibuat rata kiri konsisten dengan section lain --}}
                <div class="container section-title title-accent" data-aos="fade-up">
                    <h2>Publications</h2>
                    <div><span>Conference</span> <span class="description-title"> Publications</span></div>
                </div>

                @php
                    $hasProceedings = !empty($publication_setting?->proceedings_text);
                    $hasJournal = !empty($publication_setting?->journal_text);
                    $colClass = ($hasProceedings && $hasJournal) ? 'col-lg-6' : 'col-lg-10 mx-auto';
                @endphp

                <div class="row g-4 align-items-stretch">
                    {{-- JALUR 1: Conference Proceedings Pathway --}}
                    @if ($hasProceedings)
                        <div class="{{ $colClass }}" data-aos="fade-up" data-aos-delay="50">
                            <div class="pathway-card h-100 d-flex flex-column">
                                {{-- Header Track --}}
                                <div class="d-flex align-items-center gap-3 mb-3">
                                    <div class="pathway-icon-box" style="background: rgba(20, 26, 99, 0.08); color: #141a63;">
                                        <i class="bi bi-book-half"></i>
                                    </div>
                                    <h4 class="mb-0 fw-bold" style="color: #141a63; font-size: 19px;">
                                        Conference Proceedings
                                    </h4>
                                </div>

                                {{-- Visual Roadmap / Pathway Flow --}}
                                <div class="pathway-flow">
                                    <div class="pathway-flow-step">
                                        <span class="pathway-flow-num" style="background: #141a63;">1</span>
                                        <span>Submit Paper</span>
                                    </div>
                                    <i class="bi bi-arrow-right pathway-flow-arrow"></i>
                                    <div class="pathway-flow-step">
                                        <span class="pathway-flow-num" style="background: #141a63;">2</span>
                                        <span>Present at ICASVE</span>
                                    </div>
                                    <i class="bi bi-arrow-right pathway-flow-arrow"></i>
                                    <div class="pathway-flow-step">
                                        <span class="pathway-flow-num" style="background: #141a63;">3</span>
                                        <span class="fw-bold" style="color: #141a63;">Proceedings (ISSN)</span>
                                    </div>
                                </div>

                                {{-- Deskripsi Naskah --}}
                                <p style="font-size: 14.5px; line-height: 1.8; color: #475569; margin-bottom: 0; white-space: pre-line; text-align: justify;">
                                    {{ $publication_setting->proceedings_text }}
                                </p>
                            </div>
                        </div>
                    @endif

                    {{-- JALUR 2: Journal Publication Opportunity Pathway --}}
                    @if ($hasJournal)
                        <div class="{{ $colClass }}" data-aos="fade-up" data-aos-delay="100">
                            <div class="pathway-card h-100 d-flex flex-column">
                                {{-- Header Track --}}
                                <div class="d-flex align-items-center gap-3 mb-3">
                                    <div class="pathway-icon-box" style="background: rgba(20, 26, 99, 0.08); color: #141a63;">
                                        <i class="bi bi-book-half"></i>
                                    </div>
                                    <h4 class="mb-0 fw-bold" style="color: #141a63; font-size: 19px;">
                                        {{ $publication_setting->journal_title ?? 'Journal Publication Opportunity' }}
                                    </h4>
                                </div>

                                {{-- Visual Roadmap / Pathway Flow --}}
                                <div class="pathway-flow">
                                    <div class="pathway-flow-step">
                                        <span class="pathway-flow-num" style="background: #141a63;">1</span>
                                        <span>Selected Papers</span>
                                    </div>
                                    <i class="bi bi-arrow-right pathway-flow-arrow"></i>
                                    <div class="pathway-flow-step">
                                        <span class="pathway-flow-num" style="background: #141a63;">2</span>
                                        <span>Extended Manuscript</span>
                                    </div>
                                    <i class="bi bi-arrow-right pathway-flow-arrow"></i>
                                    <div class="pathway-flow-step">
                                        <span class="pathway-flow-num" style="background: #141a63;">3</span>
                                        <span class="fw-bold" style="color: #141a63;">AJAR (Emerald)</span>
                                    </div>
                                </div>

                                {{-- Deskripsi Naskah --}}
                                <p style="font-size: 14.5px; line-height: 1.8; color: #475569; margin-bottom: 0; white-space: pre-line; text-align: justify;">
                                    {{ $publication_setting->journal_text }}
                                </p>
                            </div>
                        </div>
                    @endif
                </div>
            </div>
        </section>
    @endif

    {{-- Section Lama: Publications Journal (Logo / Gambar Coming Soon) --}}
    {{-- Tetap utuh seperti di prod & bisa dinonaktifkan dari admin lewat tombol toggle is_journal_active --}}
    @if (($publication_setting?->is_journal_active ?? true) && $publications_journal->isNotEmpty())
        <section id="publications-section" class="publications-section section light-background">
            <div class="container d-flex flex-column justify-content-center">
                <div class="publications-journal container section-title title-accent" data-aos="fade-up">
                    <h2>Publications</h2>
                    <div><span>Publications</span> <span class="description-title"> Journal</span></div>
                </div>
                <div class="row d-flex flex-wrap justify-content-center align-items-stretch text-center">
                    @foreach ($publications_journal as $item)
                        <div class="col-md-2 col-6 mb-3 d-flex align-items-center justify-content-center">
                            <img src="{{ asset('storage/' . $item->image_path) }}" alt="Publication Logo"
                                class="img-fluid publication-img" />
                        </div>
                    @endforeach
                </div>
                @if ($publications_journal->isEmpty())
                    <p class="text-center">No publications journal found.</p>
                @endif
            </div>
        </section>
    @endif


    <!-- Hosted and Supported Section -->
    <section id="hosted-supported-section" class="section">
        <div class="container">
            <div class="row {{ $supported_by->isEmpty() ? 'justify-content-center' : '' }}">
                <!-- Left Section (30%) -->
                @if ($hosted_by->isNotEmpty() || $co_hosted_by->isNotEmpty())
                    <div class="{{ $supported_by->isNotEmpty() ? 'col-md-4' : 'col-md-6 col-lg-4' }} hosted-box p-4">
                        <div class="mb-4 text-center">
                            <h4 class="mb-4" data-aos="fade-up">Hosted By</h4>
                            @foreach ($hosted_by as $item)
                                <img src="{{ asset('storage/' . $item->image_path) }}" alt="Hosted Logo"
                                    class="img-fluid mb-3 w-50 mx-auto" data-aos="fade-up">
                            @endforeach
                            @if ($hosted_by->isEmpty())
                                <p class="text-center text-muted">No hosted by found.</p>
                            @endif
                        </div>
                        <div class="text-center">
                            <h4 class="mb-4" data-aos="fade-up">Co-Hosted By</h4>
                            @foreach ($co_hosted_by as $item)
                                <img src="{{ asset('storage/' . $item->image_path) }}" class="w-50 mx-auto mb-3"
                                    alt="Co-Hosted Logo 1" class="img-fluid mb-2" data-aos="fade-up">
                            @endforeach
                            @if ($co_hosted_by->isEmpty())
                                <p class="text-center text-muted">No co-hosted by found.</p>
                            @endif
                        </div>
                    </div>
                @endif
                <!-- Right Section (70%) -->
                @if ($supported_by->isNotEmpty())
                    <div class="col-md-8 p-4">
                        <h4 class="text-center mb-4" data-aos="fade-up">Supported By</h4>
                        <div class="row text-center">
                            @foreach ($supported_by as $item)
                                <div class="col-md-3 col-6 mb-3">
                                    <img src="{{ asset('storage/' . $item->image_path) }}"
                                        class="logo-support img-fluid max-w-lg" alt="Sponsor Logo 1" data-aos="fade-up">
                                </div>
                            @endforeach
                            @if ($supported_by->isEmpty())
                                <p>No supported by found.</p>
                            @endif
                        </div>
                    </div>
                @endif
            </div>
        </div>
    </section>

    <!-- Faq Section -->
    @if ($faqs->isNotEmpty())
        <section id="faq" class="faq section light-background">
            <div class="container-fluid">
                <div class="row gy-4">
                    <div class="col-lg-7 d-flex flex-column justify-content-center order-2 order-lg-1">
                        <div class="content px-xl-5" data-aos="fade-up" data-aos-delay="100">
                            <h3><span>Frequently Asked </span><strong>Questions</strong></h3>
                            <p>
                                Here are some of the most commonly asked questions:
                            </p>
                        </div>

                        <div class="faq-container px-xl-5" data-aos="fade-up" data-aos-delay="200">
                            @foreach ($faqs as $index => $faq)
                                <div class="faq-item {{ $index === 0 ? 'faq-active' : '' }}">
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
                </div>
            </div>
        </section>
    @endif
    <!-- /Faq Section -->

    <!-- Contact Section -->
    @if ($contacts->isNotEmpty())
        <section id="contact" class="contact section">
            <!-- Section Title -->
            <div class="container section-title title-accent" data-aos="fade-up">
                <h2>Contact</h2>
                <div><span>Check Our</span> <span class="description-title">Contact</span></div>
            </div>
            <!-- End Section Title -->

            <div class="container" data-aos="fade" data-aos-delay="100">
                <div class="row gy-4">
                    <div class="col-lg-4">
                        @foreach ($contacts as $contact)
                            <div class="info-item d-flex" data-aos="fade-up" data-aos-delay="200">
                                <i class="bi bi-geo-alt flex-shrink-0"></i>
                                <div>
                                    <h3>Address</h3>
                                    <p>{{ $contact->address }}</p>
                                </div>
                            </div>

                            <div class="info-item d-flex" data-aos="fade-up" data-aos-delay="300">
                                <i class="bi bi-telephone flex-shrink-0"></i>
                                <div>
                                    <h3>Call Us</h3>
                                    <p>{{ $contact->phone1 }} ({{ $contact->phone1_name }})</p>
                                    @if ($contact->phone2)
                                        <p>{{ $contact->phone2 }} ({{ $contact->phone2_name }})</p>
                                    @endif
                                </div>
                            </div>

                            <div class="info-item d-flex" data-aos="fade-up" data-aos-delay="400">
                                <i class="bi bi-envelope flex-shrink-0"></i>
                                <div>
                                    <h3>Email Us</h3>
                                    <p>{{ $contact->email }}</p>
                                </div>
                            </div>
                        @endforeach
                    </div>

                    <div class="col-lg-8">
                        <form id="whatsappForm" class="php-email-form" data-aos="fade-up" data-aos-delay="200"
                            data-email="{{ $emailTo }}">
                            <div class="row gy-4">
                                <div class="col-md-6">
                                    <input type="text" name="name" class="form-control" placeholder="Your Name"
                                        required />
                                </div>

                                <div class="col-md-6">
                                    <input type="email" name="email" class="form-control" placeholder="Your Email"
                                        required />
                                </div>

                                <div class="col-md-12">
                                    <input type="text" name="subject" class="form-control" placeholder="Subject"
                                        required />
                                </div>

                                <div class="col-md-12">
                                    <textarea name="message" class="form-control" rows="6" placeholder="Message" required></textarea>
                                </div>

                                <div class="col-md-12 text-center">
                                    <div class="loading">Loading</div>
                                    <div class="error-message"></div>
                                    <div class="sent-message">Your message has been sent. Thank you!</div>

                                    <button type="submit">Send Message</button>
                                </div>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    @endif


    <script>
        document.getElementById('whatsappForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const emailTo = this.getAttribute("data-email");

            const name = document.querySelector("input[name='name']").value.trim();
            const email = document.querySelector("input[name='email']").value.trim();
            const subject = document.querySelector("input[name='subject']").value.trim();
            const message = document.querySelector("textarea[name='message']").value.trim();

            if (!name || !email || !subject || !message) {
                alert("Please fill out all fields before sending.");
                return;
            }

            const mailtoSubject = `Contact Us - ${name}`;
            const mailtoBody =
                `Dear Support Team,\n\nMy Name: ${name}\nMy Email: ${email}\n\nMessage:\n${message}\n\nBest regards,\n${name}`;

            // Kirim ke email menggunakan `mailto:`
            const mailtoLink =
                `mailto:${emailTo}?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(mailtoBody)}`;
            window.location.href = mailtoLink;
        });
    </script>



    <style>
        .full-screen-map iframe {
            width: 100% !important;
            height: 300px !important;
            border: none;
        }
    </style>
@endsection
