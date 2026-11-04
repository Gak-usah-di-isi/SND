<!DOCTYPE html>
<html>

<head>
    <title>Payment Reminder</title>
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
            font-size: 22px;
            margin: 0;
            color: #007bff;
        }

        .email-body {
            padding: 20px 0;
            color: #333;
        }

        .email-body p {
            margin: 10px 0;
        }

        .deadline-box {
            background-color: #FEF9E7;
            border: 1px solid #F5D77E;
            border-radius: 8px;
            padding: 16px;
            margin: 20px 0;
            text-align: center;
            font-weight: bold;
            color: #8a6d1f;
        }

        .payment-box {
            background-color: #EAF4FF;
            border-radius: 8px;
            padding: 16px;
            margin: 20px 0;
            text-align: center;
        }

        .payment-box a {
            display: inline-block;
            margin-top: 8px;
            color: #007bff;
            font-weight: bold;
            text-decoration: none;
        }

        .payment-box a:hover {
            text-decoration: underline;
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
            <h1>Payment Reminder</h1>
        </div>
        <div class="email-body">
            <p>Dear Presenter and Participant,</p>
            <p>We hope this message finds you well. This is a friendly reminder regarding your conference registration payment.</p>

            <div class="deadline-box">
                ⚠️ Payment Deadline: {{ $deadlineLabel }} ⚠️<br>
                Please complete your payment before this date to secure your participation.
            </div>

            <div class="payment-box">
                Please complete your payment to secure your participation in the conference.<br>
                You can make your payment by visiting the link below:<br>
                <a href="{{ $paymentUrl }}">Complete Payment</a>
            </div>

            <p>If you have already made the payment, please ignore this reminder. Your payment may still be under review.</p>
            <p>We appreciate your interest and look forward to your participation.</p>
        </div>
        <div class="email-footer">
            <p>Best regards,<br>Conference Committee<br><strong>{{ $conference->conference_title ?? '' }}</strong></p>
        </div>
    </div>
</body>

</html>
