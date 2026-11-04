<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terminal Log Viewer — laravel.log</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            background-color: #0d1117;
            color: #c9d1d9;
            font-family: 'JetBrains Mono', Consolas, Monaco, 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.5;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        /* Top Navigation / Terminal Header */
        header {
            background: #161b22;
            border-bottom: 1px solid #30363d;
            padding: 10px 18px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .header-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .window-dots {
            display: flex;
            gap: 6px;
        }
        .dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            display: inline-block;
        }
        .dot-red { background: #ff5f56; }
        .dot-yellow { background: #ffbd2e; }
        .dot-green { background: #27c93f; }
        .title {
            color: #58a6ff;
            font-weight: 600;
            font-size: 14px;
        }
        .file-meta {
            color: #8b949e;
            font-size: 12px;
            margin-left: 10px;
        }
        .header-right {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .search-form {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        input[type="text"], select {
            background: #0d1117;
            border: 1px solid #30363d;
            color: #c9d1d9;
            padding: 5px 10px;
            border-radius: 6px;
            font-family: inherit;
            font-size: 12px;
            outline: none;
        }
        input[type="text"]:focus, select:focus {
            border-color: #58a6ff;
        }
        .btn {
            background: #21262d;
            border: 1px solid #30363d;
            color: #c9d1d9;
            padding: 5px 12px;
            border-radius: 6px;
            font-family: inherit;
            font-size: 12px;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            transition: all 0.2s;
        }
        .btn:hover {
            background: #30363d;
            color: #f0f6fc;
        }
        .btn-danger {
            background: rgba(248, 81, 73, 0.15);
            border-color: rgba(248, 81, 73, 0.4);
            color: #ff7b72;
        }
        .btn-danger:hover {
            background: #da3633;
            color: #ffffff;
        }
        .btn-primary {
            background: #238636;
            border-color: #2ea043;
            color: #ffffff;
        }
        .btn-primary:hover {
            background: #2ea043;
        }

        /* Terminal Body */
        main {
            flex: 1;
            padding: 16px 20px;
            overflow-x: auto;
        }
        .alert-msg {
            background: rgba(35, 134, 54, 0.2);
            border: 1px solid #2ea043;
            color: #3fb950;
            padding: 8px 14px;
            border-radius: 6px;
            margin-bottom: 12px;
        }
        pre.log-container {
            font-family: inherit;
            white-space: pre-wrap;
            word-break: break-all;
        }
        .log-line {
            padding: 2px 0;
            border-left: 2px solid transparent;
            padding-left: 6px;
        }
        .log-line:hover {
            background: rgba(110, 118, 129, 0.1);
        }
        .line-error {
            color: #ff7b72;
            background: rgba(248, 81, 73, 0.08);
            border-left-color: #f85149;
            font-weight: 500;
        }
        .line-warning {
            color: #e3b341;
            background: rgba(210, 153, 34, 0.08);
            border-left-color: #d29922;
        }
        .line-info {
            color: #79c0ff;
        }
        .line-stack {
            color: #8b949e;
            padding-left: 20px;
            font-size: 12px;
        }
        .empty-state {
            color: #8b949e;
            text-align: center;
            margin-top: 50px;
            font-size: 14px;
        }
        /* Sticky floating bottom toolbar */
        .floating-action {
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            gap: 8px;
            background: rgba(22, 27, 34, 0.9);
            padding: 6px 10px;
            border: 1px solid #30363d;
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.5);
            backdrop-filter: blur(8px);
        }
    </style>
</head>
<body>
    <header>
        <div class="header-left">
            <div class="window-dots">
                <span class="dot dot-red"></span>
                <span class="dot dot-yellow"></span>
                <span class="dot dot-green"></span>
            </div>
            <span class="title">admin@icasve:~/storage/logs/laravel.log$</span>
            <span class="file-meta">[{{ $fileSize }} | Modified: {{ $lastModified ?? '-' }}]</span>
        </div>

        <div class="header-right">
            <form action="{{ route('admin.logs') }}" method="GET" class="search-form">
                <input type="text" name="q" placeholder="Cari (misal: Mail, SMTP)..." value="{{ $filter }}">
                <select name="lines" onchange="this.form.submit()">
                    <option value="100" {{ $lines == 100 ? 'selected' : '' }}>100 baris</option>
                    <option value="300" {{ $lines == 300 ? 'selected' : '' }}>300 baris</option>
                    <option value="500" {{ $lines == 500 ? 'selected' : '' }}>500 baris</option>
                    <option value="1000" {{ $lines == 1000 ? 'selected' : '' }}>1000 baris</option>
                    <option value="5000" {{ $lines == 5000 ? 'selected' : '' }}>5000 baris</option>
                </select>
                <button type="submit" class="btn btn-primary">Filter</button>
                @if($filter)
                    <a href="{{ route('admin.logs') }}" class="btn">Reset</a>
                @endif
            </form>

            <form action="{{ route('admin.logs.clear') }}" method="POST" onsubmit="return confirm('Apakah Anda yakin ingin mengosongkan laravel.log?')">
                @csrf
                <button type="submit" class="btn btn-danger">Hapus Log</button>
            </form>
        </div>
    </header>

    <main>
        @if(session('success'))
            <div class="alert-msg">{{ session('success') }}</div>
        @endif

        @if(empty($logs))
            <div class="empty-state">
                <p>~ File log kosong atau belum ada log yang tercatat ~</p>
            </div>
        @else
            <pre class="log-container">@foreach($logs as $line)@php
                $trimmed = trim($line);
                $isError = preg_match('/\.ERROR:|\.CRITICAL:|\.ALERT:|\.EMERGENCY:/i', $line);
                $isWarning = preg_match('/\.WARNING:/i', $line);
                $isInfo = preg_match('/\.INFO:|\.DEBUG:/i', $line);
                $isStack = str_starts_with($trimmed, '#') || str_starts_with($trimmed, '[stacktrace]');
                $class = '';
                if ($isError) $class = 'line-error';
                elseif ($isWarning) $class = 'line-warning';
                elseif ($isInfo) $class = 'line-info';
                elseif ($isStack) $class = 'line-stack';
            @endphp<div class="log-line {{ $class }}">{{ $line }}</div>@endforeach</pre>
        @endif
    </main>

    <div class="floating-action">
        <button type="button" class="btn" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">⬆ Ke Atas</button>
        <button type="button" class="btn" onclick="window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})">⬇ Paling Bawah</button>
        <button type="button" class="btn" onclick="window.location.reload()">🔄 Refresh</button>
    </div>

    <script>
        // Auto-scroll ke paling bawah saat pertama load (seperti tail -f)
        window.addEventListener('DOMContentLoaded', () => {
            window.scrollTo(0, document.body.scrollHeight);
        });
    </script>
</body>
</html>
