<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Official Receipt</title>
    <style>
        @page {
            size: A4;
            margin: 20mm 20mm 18mm 20mm;
        }

        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.55;
            color: #000000;
            margin: 0;
            padding: 0;
        }

        /* Letterhead — no wrapper, no extra padding above the document */
        header {
            margin: 0 0 22px;
            padding: 0;
            text-align: center;
        }

        header img {
            display: block;
            width: auto;
            max-width: 100%;
            max-height: 70mm;
            margin: 0 auto;
        }

        header p {
            margin: 0;
        }

        /* Document title */
        .receipt-title {
            margin: 0;
            padding: 0;
            text-align: center;
            font-size: 18pt;
            font-weight: bold;
            letter-spacing: 2px;
        }

        .title-rule {
            height: 0;
            margin: 8px 0 24px;
            border: 0;
            border-top: 1px solid #000000;
        }

        /* Payment details — borderless table with aligned colons */
        .receipt-details {
            width: 100%;
            margin: 0;
            border-collapse: collapse;
        }

        .receipt-details td {
            padding: 5px 0;
            vertical-align: top;
            font-size: 12pt;
            line-height: 1.5;
        }

        .receipt-details .label {
            width: 145px;
            white-space: nowrap;
        }

        .receipt-details .colon {
            width: 14px;
            text-align: center;
        }

        .receipt-details .value {
            font-weight: bold;
            word-wrap: break-word;
        }

        /* Signature — right aligned, kept together on one page */
        .signature {
            margin: 40px 0 0;
            text-align: right;
            page-break-inside: avoid;
        }

        .signature p {
            margin: 2px 0;
            line-height: 1.4;
        }

        .signature .sincerely {
            margin-bottom: 6px;
        }

        .signature img {
            height: 80px;
            max-width: 220px;
            margin: 0 0 4px;
        }

        .signature .name {
            font-weight: bold;
        }

        .signature .role {
            margin-bottom: 0;
        }
    </style>
</head>

<body>
    <header>
        @if ($letterHeader)
            {{-- Pre-resized base64 data URI — no Imagick/file:// OOM risk --}}
            <img src="{{ $letterHeader }}" alt="Letterhead">
        @else
            <p>No Letterhead Uploaded</p>
        @endif
    </header>

    <div class="receipt-title">OFFICIAL RECEIPT</div>
    <div class="title-rule"></div>

    <table class="receipt-details">
        <tr>
            <td class="label">Registration No.</td>
            <td class="colon">:</td>
            <td class="value">REG/{{ $filePayment->user->id }}</td>
        </tr>
        <tr>
            <td class="label">Date</td>
            <td class="colon">:</td>
            <td class="value">{{ $filePayment->created_at->format('d F Y') }}</td>
        </tr>
        <tr>
            <td class="label">Received from</td>
            <td class="colon">:</td>
            <td class="value">{{ $filePayment->user->name }}</td>
        </tr>
        <tr>
            <td class="label">Amount</td>
            <td class="colon">:</td>
            <td class="value">{{ $filePayment->currency }} {{ number_format($filePayment->amount, 2) }}</td>
        </tr>
        <tr>
            <td class="label">Payment for</td>
            <td class="colon">:</td>
            <td class="value">
                @if ($filePayment->user->abstracts->isNotEmpty())
                    {{ $filePayment->user->abstracts->pluck('title')->implode(', ') }}
                @else
                    No abstract submitted
                @endif
            </td>
        </tr>
    </table>

    <div class="signature">
        <p class="sincerely">Sincerely,</p>
        @if ($signature)
            <img src="{{ $signature }}" alt="Signature">
        @else
            <p>No Signature Uploaded</p>
        @endif
        <p class="name">{{ $conferenceChairPerson }}</p>
        <p class="role">Conference Chairperson</p>
    </div>
</body>

</html>
