<!DOCTYPE html>
<html>

<head>
    <title>Payment Verification Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.8;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
        }

        .email-container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            padding: 30px;
            border: 1px solid #ddd;
        }

        .email-header {
            text-align: center;
            padding-bottom: 15px;
            border-bottom: 3px solid #007bff;
        }

        .email-header h1 {
            font-size: 24px;
            margin: 0;
            color: #007bff;
        }

        .email-body {
            padding: 20px 10px;
        }

        .email-body p {
            margin-bottom: 15px;
        }

        .highlight {
            background-color: #eaf4ff;
            padding: 15px;
            border-radius: 8px;
            font-size: 15px;
            text-align: center;
            font-weight: bold;
        }

        .email-footer {
            margin-top: 25px;
            padding-top: 15px;
            border-top: 2px solid #007bff;
            text-align: center;
            font-size: 13px;
            color: #666;
        }

        a {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
        }

        a:hover {
            text-decoration: underline;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Payment Verification Confirmation</h1>
        </div>
        <div class="email-body">
            <p>Dear {{ $user->name }},</p>
            <p>Thank you for making the payment for our conference. We are pleased to inform you that your payment has
                been successfully <strong style="text-transform: uppercase;">verified</strong>.
            </p>

            <p><strong>Amount Paid:</strong> {{ $filePayment->currency }}
                {{ number_format($filePayment->amount, 0, ',', '.') }}</p>
            <p><strong>Payment Status:</strong> {{ ucfirst($filePayment->status) }}</p>


            <p class="highlight">
                After your payment is successfully verified, you can access the full event schedule.<br>
                Please visit the link below to view the program details:<br>
                <a href="{{ route('conference.program') }}">View Conference Program</a>
            </p>

            <p>We appreciate your participation and look forward to your valuable contributions.</p>
        </div>
        <div class="email-footer">
            <p>Best regards,<br>Conference Committee<br><strong>{{ $conference->conference_title }}</strong></p>
        </div>
    </div>
</body>

</html>
