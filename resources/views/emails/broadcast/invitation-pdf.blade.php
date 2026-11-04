<!DOCTYPE html>
<html>

<head>
    <title>ICASVE {{ $activeYear }} Invitation Letter</title>
    <style>
        body {
            font-family: Times New Roman, Times, serif;
            font-size: 12pt;
            margin: 40px 60px;
        }

        .header-table {
            width: 100%;
            margin-bottom: 10px;
        }

        .subject {
            margin-bottom: 1px;
        }

        .highlight {
            font-weight: bold;
        }

        .content {
            text-align: justify;
        }

        .details-table {
            margin-top: 1px;
            margin-bottom: 1px;
        }

        .signature-block {
            width: 100%;
            margin-top: 40px;
        }

        .signature-cell {
            width: 60%;
        }

        .logo-cell {
            width: 40%;
            text-align: left;
            vertical-align: top;
            padding-left: 40px;
        }

        .logo-img {
            width: 200px;
            margin-bottom: 10px;
            display: block;
        }

        .signature-img {
            width: 200px;
            margin-bottom: 0;
            display: block;
        }

        .chairperson {
            margin-top: 0;
            font-weight: bold;
        }

        .details-table td {
            word-break: break-all;
        }

        .rundown-section {
            page-break-before: always;
            margin-top: 40px;
        }
    </style>
</head>

<body>
    <header>
        @if ($letterHeader)
            <img src="{{ $letterHeader }}" alt="Letterhead" style="width: 800px; max-width: 100%; margin-bottom: 24px;">
        @endif
    </header>
    <table class="header-table">
        <tr>
            <td>Date</td>
            <td>:</td>
            <td>{{ $letterDate }}</td>
        </tr>
        <tr>
            <td valign="top">Subject</td>
            <td valign="top">:</td>
            <td>
                {{ $subject }}
            </td>
        </tr>
    </table>

    <div class="subject">
        <span class="highlight">{{ $user->name }}</span><br>
        <span class="highlight">{{ $user->institution }}</span>
    </div>

    @php
        $isIndoPresenter = in_array('indonesia-presenter', $roleNames);
        $isForeignPresenter = in_array('foreign-presenter', $roleNames);
        $isIndoParticipant = in_array('indonesia-participants', $roleNames);
        $isForeignParticipant = in_array('foreign-participants', $roleNames);
    @endphp

    <div class="content">
        @if ($isIndoPresenter || $isForeignPresenter)
            <p>
                Greetings from Faculty of Vocational Studies-Universitas Brawijaya.<br>
                It is our delight to inform you that your abstract titled <span
                    class="highlight">'{{ $abstract->title }}'</span> has been accepted for presentation at the
                {{ $conferenceFullName }}. You are thus invited
                to present your work as an Academic Session Speaker of {{ $conference->conference_abbreviation }}
                {{ $activeYear }}.
            </p>
        @elseif($isIndoParticipant || $isForeignParticipant)
            <p>
                Greetings from Faculty of Vocational Studies-Universitas Brawijaya.<br>
                Congratulations! You are invited as an Academic Session Speaker at the
                {{ $conferenceFullName }}.
            </p>
        @endif
        <p>
            {!! nl2br(e($pdfThemeParagraph)) !!}
        </p>
        <table class="details-table">
            <tr>
                <td style="width: 80px;">Date</td>
                <td style="width: 10px;">:</td>
                <td>{{ $eventDateLabel }}</td>
            </tr>
            <tr>
                <td>Venue</td>
                <td>:</td>
                <td>Widyaloka Building – Universitas Brawijaya</td>
            </tr>
            <tr>
                <td>Livestream/Zoom</td>
                <td>:</td>
                <td>
                    <a href="{{ $zoomLink['url'] }}"
                        style="word-break: break-all; color: #007bff; text-decoration: underline;">
                        Zoom Link
                    </a>
                </td>
            </tr>
        </table>
        <p>
            Your presentation schedule will be informed at a later date. Please be reminded that your registration is
            only complete when the conference registration fee is paid and the payment slip is received by the
            Secretariat via email at icasve@ub.ac.id. For more information about ICASVE, you can visit our website
            icasve.ub.ac.id.
        </p>
        <div style="width:100%; margin-top:10px; page-break-inside: avoid;">
            <div style="text-align:right;">
                <p style="margin-bottom: 30px;">
                    Thank you and we look forward to seeing you in Malang, East Java, Indonesia.
                </p>
                @if ($signaturePath)
                    <img src="{{ $signaturePath }}" alt="Signature" style="width:100px;">
                @endif
                <p style="margin:0;"><strong>{{ $conference->conference_chairperson }}</strong></p>
                <p style="margin:0;">Conference Chairperson</p>
            </div>
        </div>
    </div>

    <div class="rundown-section">
        <header>
            @if ($letterHeader)
                <img src="{{ $letterHeader }}" alt="Letterhead" style="width: 800px; max-width: 100%; margin-bottom: 24px;">
            @endif
        </header>
        <h3 style="text-align:center; margin-bottom: 0;">
            Rundown The {{ $rundownEdition }} {{ $conference->conference_abbreviation }}<br>
            <span style="font-size: 13px; font-style: italic;">
                ({{ $conference->conference_title }})<br>
                {{ $organizer }}<br>
                {{ $eventDateLabel }}
            </span>
        </h3>
        @include('emails.broadcast.partials.rundown-table', ['items' => $rundownItems])
    </div>

</body>

</html>
