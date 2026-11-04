<!DOCTYPE html>
<html>

<head>
    <title>Conference Payment Invoice</title>
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

        .highlight {
            background-color: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
            font-size: 14px;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Payment Invoice</h1>
        </div>
        <div class="email-body">
            <p>Dear {{ $user->name }},</p>

            <p>Thank you for registering for the {{ $conference->conference_abbreviation }}! We are delighted to have
                you join us for this event.</p>

            <p>We are pleased to inform you that your abstract titled
                "<strong>{{ $abstract->title }}</strong>" has been accepted for presentation at
                <strong>{{ $conference->conference_title }}</strong>.
            </p>

            <p>Payment can be made via bank transfer to the following account for a total of
                <strong>{{ $amountType }}
                    {{ number_format($amount, strtoupper($amountType) === 'IDR' ? 0 : 2, ',', '.') }}</strong>@if (!empty($user->is_student))
                    <span style="font-size: 13px; color: #555;">(Student Rate)</span>
                @endif
            </p>


            <p>{!! nl2br(e($customMessage)) !!}</p>

            <p>Please make the payment as soon as possible to secure your participation.</p>

            <p>Thank you, and we look forward to seeing you at the conference.</p>
        </div>
        <div class="email-footer">
            <p>Best regards,<br>Conference Committee<br><strong>{{ $conference->conference_title }}</strong></p>
        </div>
    </div>
</body>

</html>
