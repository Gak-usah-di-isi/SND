<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Abstracts</title>
    <style>
        body {
            font-family: "Times New Roman", Times, serif;
            font-size: 12pt;
            padding: 2cm;
        }

        h2 {
            text-align: center;
            font-size: 18pt;
            font-weight: bold;
            text-transform: uppercase;
        }

        .abstract {
            position: relative;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        #abstract_title {
            font-size: 16pt;
            font-weight: bold;
            text-align: center;
            margin-bottom: 0px;
        }

        #abstract_author,
        #abstract_affiliation {
            text-align: center;
            font-size: 12pt;
            font-style: italic;
        }

        #abstract_email {
            text-align: center;
            font-size: 11pt;
            font-weight: bold;
        }

        #abstract_body {
            text-align: justify;
            font-size: 11pt;
            line-height: 1.5;
        }

        .symposium-title {
            font-size: 16pt;
            font-weight: bold;
            text-transform: uppercase;
            margin-top: 20px;
            text-align: center;
        }

        .page-number {
            position: absolute;
            bottom: 0px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 11pt;
            text-align: center;
            padding-bottom: 10px;
            width: 100%;
        }
    </style>
</head>

<body>
    @foreach ($abstracts as $abstract)
        <div class="abstract">
            <h3 id="abstract_title">{{ $abstract->title }}</h3>
            <p class="text-uppercase font-weight-bold">
                {{ $abstract->symposium->abbreviation ?? 'N/A' }} /
                {{ str_pad($loop->iteration, 3, '0', STR_PAD_LEFT) }}
            </p>
            <p id="abstract_author">{!! $abstract->formattedAuthors !!}</p>
            <p id="abstract_affiliation">{!! $abstract->formattedAffiliations !!}</p>
            <p id="abstract_email"><strong>Corresponding Email:</strong> {{ $abstract->corresponding_email }}</p>
            <p id="abstract_abstract" style="font-size: 14pt; font-weight: bold; text-align: left;">Abstract:</p>
            <div id="abstract_body">
                {!! nl2br(e($abstract->abstract)) !!}
            </div>
            <div class="page-number">{{ $loop->iteration }}</div>
        </div>
    @endforeach
</body>

</html>
