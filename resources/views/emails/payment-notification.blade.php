<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Notification</title>
</head>

<body>
    <h2>New Payment Received</h2>
    <p>User <strong>{{ $filePayment->user->name }}</strong> has made a payment of <strong>Rp
            {{ number_format($filePayment->amount, 0, ',', '.') }}</strong>.</p>
    <p>Payment status: <strong>{{ ucfirst($filePayment->status) }}</strong></p>
    <p>Please check the system for further verification.</p>
    <p>Thank you.</p>
</body>

</html>
