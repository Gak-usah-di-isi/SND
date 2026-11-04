@extends('layouts.app')

@section('title', 'Upload Files')

@section('content')
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Upload Files</h4>

                @if (session('success'))
                    <div class="alert alert-success">{{ session('success') }}</div>
                @endif

                @if (session('error'))
                    <div class="alert alert-danger">{{ session('error') }}</div>
                @endif

                @foreach ([
            'logo' => [
                'label' => 'LOGO',
                'description' => "This file will be used in: letter of acceptance, payment receipt <br>
                                                                                  The image size should be 300 × 300 pixels <br>
                                                                                  File must be in PNG format having extension .png",
            ],
            'letter_header' => [
                'label' => 'LETTER HEADER',
                'description' => "This file will be used in: letter of acceptance, payment receipt <br>
                                                                                  The image size should be 2390 × 470 pixels <br>
                                                                                  File must be in PNG format having extension .png",
            ],
            'signature' => [
                'label' => 'SIGNATURE',
                'description' => "This file will be used in: letter of acceptance, payment receipt <br>
                                                                                  The image size should be 900 × 320 pixels <br>
                                                                                  File must be in JPG format having extension .jpg",
            ],
            'certificate_presenter' => [
                'label' => 'CERTIFICATE BACKGROUND (PRESENTER)',
                'description' => "This file will be used in: PRESENTER certificate <br>
                                                                                  The image size should be 1754 × 1240 pixels (equal to A4 in 150 dpi) <br>
                                                                                  File must be in PDF format having extension .pdf",
            ],
            'certificate_participant' => [
                'label' => 'CERTIFICATE BACKGROUND (PARTICIPANT)',
                'description' => "This file will be used in: PARTICIPANT certificate <br>
                                                                                  The image size should be 1754 × 1240 pixels (equal to A4 in 150 dpi) <br>
                                                                                  File must be in PDF format having extension .pdf",
            ],
            'commitment_letter' => [
                'label' => 'COMMITMENT LETTER TEMPLATE',
                'description' => "This file will be used for: commitment letter template <br>
                                The file must be in PDF format having extension .docx",
            ],
        ] as $key => $data)
                    <div class="card my-3">
                        <div class="card-header bg-success text-white">
                            <strong>{{ $data['label'] }}</strong>
                        </div>
                        <div class="card-body">
                            <p>{!! $data['description'] !!}</p>

                            <form action="{{ route('admin.upload.store') }}" method="POST" enctype="multipart/form-data">
                                @csrf
                                <input type="hidden" name="type" value="{{ $key }}">

                                <div class="mb-3">
                                    <input type="file" name="file" class="form-control" accept=".png,.jpg,.pdf"
                                        required>
                                </div>

                                <button type="submit" class="btn btn-success">Upload</button>

                                @php
                                    $upload = \App\Models\Upload::currentForType($key);
                                @endphp

                                @if ($upload)
                                    <a href="{{ route('admin.upload.show', $key) }}" class="btn btn-primary"
                                        target="_blank">View File</a>
                                @endif
                            </form>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </div>
@endsection
