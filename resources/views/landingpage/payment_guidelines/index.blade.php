@extends('layouts.landing')

@section('title', 'Payment Guidelines')

@section('content')
<div class="container">
    <h1 class="text-center my-4">Payment Guidelines</h1>

    <div class="accordion" id="guidelineAccordion">
        @foreach($guidelines as $guideline)
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading{{ $guideline->id }}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse{{ $guideline->id }}" aria-expanded="false" aria-controls="collapse{{ $guideline->id }}">
                        {{ $guideline->bank_name }} - {{ $guideline->year }}
                    </button>
                </h2>
                <div id="collapse{{ $guideline->id }}" class="accordion-collapse collapse" aria-labelledby="heading{{ $guideline->id }}" data-bs-parent="#guidelineAccordion">
                    {{-- white-space: pre-line supaya jeda baris (\n) dari database
                         tetap tampil rapi, bukan menyatu dalam satu baris. --}}
                    <div class="accordion-body" style="white-space: pre-line">
                        {!! $guideline->guideline !!}
                    </div>
                </div>
            </div>
        @endforeach
    </div>
</div>
@endsection
