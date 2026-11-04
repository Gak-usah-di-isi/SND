<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Abstract Detail</title>
    <style>
        #abstract_title {
            text-align: center;
            font-size: 16pt;
            font-weight: bold;
        }

        #abstract_author,
        #abstract_affiliation {
            text-align: center;
            font-size: 12pt;
        }

        #abstract_body {
            text-align: justify;
            font-size: 10pt;
        }

        #abstract_email {
            text-align: center;
            font-family: "Times", serif;
            font-size: 10pt;
        }

        #abstract_abstract {
            font-weight: bold;
            font-family: "Times", serif;
            font-size: 12pt;
            text-align: center;
        }

        hr {
            border-top: 1px solid #ccc;
        }

        #abstract_symposium {
            font-size: 10pt;
            font-family: "Times", serif;
            font-style: italic;
        }
    </style>
</head>

<body>
    <h4 id="abstract_title">{{ $abstract->title }}</h4>
    <p id="abstract_author">{!! $formattedAuthors !!}</p>
    <p id="abstract_affiliation">{!! $formattedAffiliations !!}</p>
    <p id="abstract_email"><strong>Corresponding Email:</strong> {{ $abstract->corresponding_email }}</p>
    <p id="abstract_abstract"><strong>Abstract</strong></p>
    <div id="abstract_body">
        {!! nl2br(e($abstract->abstract)) !!}
    </div>
    <hr>
    <p id="abstract_symposium"><strong>Symposium:</strong> {{ $abstract->symposium->name }}</p>
</body>

</html>
