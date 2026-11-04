<!DOCTYPE html>
<html>

<head>
    <title>Acceptance Letter</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            margin: 50px;
        }

        header {
            text-align: center;
            margin-bottom: 30px;
        }

        .letter-content {
            margin-top: 20px;
        }

        .signature {
            margin-top: 50px;
            text-align: right;
        }

        .signature img {
            height: 100px;
        }

        .title h2 {
            font-size: 24px;
            text-align: center;
            font-weight: bold;
            margin-bottom: 20px;
        }

        .center-text {
            text-align: center;
        }

        .right-align {
            text-align: right;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <header>
        @if ($letterHeader)
            <img src="{{ $letterHeader }}" alt="Letterhead" style="width: 800px; max-width: 100%;">
        @else
            <p>No Letterhead Uploaded</p>
        @endif
    </header>

    <div class="letter-content">
        <div class="title">
            <h2>LETTER OF ACCEPTANCE</h2>
        </div>

        <p>Dear <strong>{{ $abstract->user->name }},</strong></p>
        <p>On behalf of the committee, we are pleased to confirm that your abstract,</p>

        <p class="center-text"><strong>{{ $abstract->title }}</strong></p>

        <p>has been accepted, with editorial decision:</p>

        <p class="center-text"><strong>Accepted for {{ $abstract->presentation_type }}</strong></p>

        @php
            $confTitle = $conferenceTitle ?? ($conferenceSetting->conference_title ?? 'International Conference on Applied Science for Vocational Education');
            $displayTitle = \Illuminate\Support\Str::startsWith(trim($confTitle), ['The ', 'the ']) ? $confTitle : 'The ' . $confTitle;
        @endphp
        <p>at <strong>{{ $displayTitle }}</strong>.</p>
        <p>Please note that, in order for the abstract to be included in the conference program, presenters are required
            to complete the registration process and payment.</p>
        <p>Your presentation is an important part of the conference, and we are looking forward to meet you at the
            conference.</p>

        <p class="right-align">Sincerely,</p>
    </div>

    <div class="signature">
        @if ($signature)
            <img src="{{ $signature }}" alt="Signature">
        @else
            <p>No Signature Uploaded</p>
        @endif
        <p><strong>{{ $conferenceChairPerson }}</strong></p>
        <p>Conference Chairperson</p>
    </div>
</body>

</html>
