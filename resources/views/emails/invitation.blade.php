<!DOCTYPE html>
<html>

<head>
    <title>ICASVE 2025 Invitation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .email-container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            padding: 25px;
            border: 1px solid #ddd;
        }

        .email-header {
            text-align: center;
            padding-bottom: 15px;
            border-bottom: 2px solid #007bff;
        }

        .email-header h1 {
            font-size: 24px;
            margin: 0;
            color: #333;
        }

        .email-body {
            padding: 20px 10px;
            color: #555;
        }

        .email-body p {
            margin: 10px 0;
        }

        .email-body strong {
            color: #222;
        }

        .email-footer {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 2px solid #007bff;
            text-align: center;
            font-size: 13px;
            color: #666;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="email-header">
            <h1>ICASVE 2025 Invitation</h1>
        </div>
        @php
            $isIndoPresenter = in_array('indonesia-presenter', $roleNames);
            $isForeignPresenter = in_array('foreign-presenter', $roleNames);
            $isIndoParticipant = in_array('indonesia-participants', $roleNames);
            $isForeignParticipant = in_array('foreign-participants', $roleNames);
        @endphp
        <div class="email-body">
            <p>Dear {{ $user->name }},</p>
            @if ($isIndoPresenter || $isForeignPresenter)
                <p>
                    Congratulations! Your abstract title "<strong>{{ $abstract->title }}</strong>" has been accepted for
                    presentation at <strong>{{ $conference->conference_abbreviation }}</strong>.<br>
                    You are invited as an Academic Session Speaker.<br>
                    <br>
                    Please find the invitation letter attached.<br>
                    <br>
                    <strong>The conference will be held in a hybrid format:</strong><br>
                    Onsite at Widyaloka Hall, Universitas Brawijaya, Malang, East Java, Indonesia<br>
                    Online via Zoom<br>
                    <br>
                    <strong>Zoom Meeting Details:</strong><br>
                    Link: <a href="{{ $zoomLink['url'] }}">{{ $zoomLink['url'] }}</a><br>
                    Meeting ID: {{ $zoomLink['id'] }}<br>
                    Passcode: {{ $zoomLink['pass'] }}<br>
                    <br>
                    We look forward to seeing you in Malang, East Java, Indonesia.
                </p>
            @elseif($isIndoParticipant || $isForeignParticipant)
                <p>
                    Congratulations! You are invited as an Academic Session Speaker at
                    <strong>{{ $conference->conference_abbreviation }}</strong>.<br>
                    <br>
                    Please find the invitation letter attached.<br>
                    <br>
                    <strong>The conference will be held in a hybrid format:</strong><br>
                    Onsite at Widyaloka Hall, Universitas Brawijaya, Malang, East Java, Indonesia<br>
                    Online via Zoom<br>
                    <br>
                    <strong>Zoom Meeting Details:</strong><br>
                    Link: <a href="{{ $zoomLink['url'] }}">{{ $zoomLink['url'] }}</a><br>
                    Meeting ID: {{ $zoomLink['id'] }}<br>
                    Passcode: {{ $zoomLink['pass'] }}<br>
                    <br>
                    We look forward to seeing you in Malang, East Java, Indonesia.
                </p>
            @endif
        </div>
        <div class="email-footer">
            <p>Best regards,<br>Conference Committee<br><strong>{{ $conference->conference_title }}</strong></p>
        </div>
    </div>
</body>

</html>
