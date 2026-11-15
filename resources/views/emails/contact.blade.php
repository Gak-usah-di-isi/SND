<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $subject }}</title>
</head>
<body>
    <h1>Pesan dari formulir kontak</h1>
    <p><strong>Nama:</strong> {{ $name }}</p>
    <p><strong>Email:</strong> {{ $email }}</p>
    <p><strong>Perihal:</strong> {{ $subject }}</p>
    <h2>Pesan</h2>
    <div style="white-space: pre-wrap">{{ $body }}</div>
</body>
</html>
