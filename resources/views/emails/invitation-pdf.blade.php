<!DOCTYPE html>
<html>

<head>
    <title>ICASVE 2025 Invitation Letter</title>
    <style>
        body {
            font-family: Times New Roman, Times, serif;
            font-size: 12pt;
            margin: 40px 60px;
        }

        .header-table {
            width: 100%;
            margin-bottom: 10px;
        }

        .subject {
            margin-bottom: 1px;
        }

        .highlight {
            font-weight: bold;
        }

        .content {
            text-align: justify;
        }

        .details-table {
            margin-top: 1px;
            margin-bottom: 1px;
        }

        .signature-block {
            width: 100%;
            margin-top: 40px;
        }

        .signature-cell {
            width: 60%;
        }

        .logo-cell {
            width: 40%;
            text-align: left;
            vertical-align: top;
            padding-left: 40px;
        }

        .logo-img {
            width: 200px;
            margin-bottom: 10px;
            display: block;
        }

        .signature-img {
            width: 200px;
            margin-bottom: 0;
            display: block;
        }

        .chairperson {
            margin-top: 0;
            font-weight: bold;
        }

        .details-table td {
            word-break: break-all;
        }

        .rundown-section {
            page-break-before: always;
            margin-top: 40px;
        }
    </style>
</head>

<body>
    <header>
        @if ($letterHeader)
            <img src="{{ $letterHeader }}" alt="Letterhead" style="width: 800px; max-width: 100%; margin-bottom: 24px;">
        @endif
    </header>
    <table class="header-table">
        <tr>
            <td>Date</td>
            <td>:</td>
            <td>{{ now()->format('d F Y') }}</td>
        </tr>
        <tr>
            <td valign="top">Subject</td>
            <td valign="top">:</td>
            <td>
                Acceptance of Abstract and Invitation as an Academic Session Speaker at The 4th International Conference
                On Applied Science For Vocational Education (ICAVSE 2025)
            </td>
        </tr>
    </table>

    <div class="subject">
        <span class="highlight">{{ $user->name }}</span><br>
        <span class="highlight">{{ $user->institution }}</span>
    </div>

    @php
        $isIndoPresenter = in_array('indonesia-presenter', $roleNames);
        $isForeignPresenter = in_array('foreign-presenter', $roleNames);
        $isIndoParticipant = in_array('indonesia-participants', $roleNames);
        $isForeignParticipant = in_array('foreign-participants', $roleNames);
    @endphp

    <div class="content">
        @if ($isIndoPresenter || $isForeignPresenter)
            <p>
                Greetings from Faculty of Vocational Studies-Universitas Brawijaya.<br>
                It is our delight to inform you that your abstract titled <span
                    class="highlight">‘{{ $abstract->title }}’</span> has been accepted for presentation at the
                International Conference on Applied Science for Vocational Education (ICASVE) 2025. You are thus invited
                to present your work as an Academic Session Speaker of ICASVE 2025.
            </p>
        @elseif($isIndoParticipant || $isForeignParticipant)
            <p>
                Greetings from Faculty of Vocational Studies-Universitas Brawijaya.<br>
                Congratulations! You are invited as an Academic Session Speaker at the International Conference on
                Applied Science for Vocational Education (ICASVE) 2025.
            </p>
        @endif
        <p>
            With the theme "Entrepreneurship, Creativity, and AI-driven Innovation in the Digital Era," ICASVE 2025
            explores innovative strategies that bridge the gap between technology and human interaction, creating
            opportunities that not only advance industries but also enrich the lives of communities worldwide. Through
            AI and creativity, ICASVE 2025 is dedicated to advancing entrepreneurship for a more sustainable and
            equitable future. It also aims to foster collaboration among academia, industry professionals, and
            policymakers to integrate AI technologies seamlessly into the evolving world of business, hospitality, IT,
            and design, empowering individuals and organizations to thrive in the digital era. ICASVE 2025 details are
            as follows:
        </p>
        <table class="details-table">
            <tr>
                <td style="width: 80px;">Date</td>
                <td style="width: 10px;">:</td>
                <td>August 1<sup>st</sup> – 2<sup>rd</sup> 2025</td>
            </tr>
            <tr>
                <td>Venue</td>
                <td>:</td>
                <td>Widyaloka Building – Universitas Brawijaya</td>
            </tr>
            <tr>
                <td>Livestream/Zoom</td>
                <td>:</td>
                <td>
                    <a href="{{ $zoomLink['url'] }}"
                        style="word-break: break-all; color: #007bff; text-decoration: underline;">
                        Zoom Link
                    </a>
                </td>
            </tr>
        </table>
        <p>
            Your presentation schedule will be informed at a later date. Please be reminded that your registration is
            only complete when the conference registration fee is paid and the payment slip is received by the
            Secretariat via email at icasve@ub.ac.id. For more information about ICASVE, you can visit our website
            icasve.ub.ac.id.
        </p>
        <p>
            Thank you and we look forward to seeing you in Malang, East Java, Indonesia.
        </p>
        <div style="width:100%; margin-top:10px; page-break-before: always; page-break-inside: avoid;">
            <div style="text-align:right;">
                <p style="margin-bottom: 30px;">
                    Thank you and we look forward to seeing you in Malang, East Java, Indonesia.
                </p>
                @if ($signaturePath)
                    <img src="{{ $signaturePath }}" alt="Signature" style="width:200px;">
                @endif
                <p style="margin:0;"><strong>{{ $conference->conference_chairperson }}</strong></p>
                <p style="margin:0;">Conference Chairperson</p>
            </div>
        </div>
    </div>


    <div class="rundown-section">
        <header>
            @if ($letterHeader)
                <img src="{{ $letterHeader }}" alt="Letterhead" style="width: 800px; max-width: 100%; margin-bottom: 24px;">
            @endif
        </header>
        <h3 style="text-align:center; margin-bottom: 0;">
            Rundown The 4<sup>th</sup> ICASVE 2025<br>
            <span style="font-size: 13px; font-style: italic;">
                (International Conference on Applied Science for Vocational Education)<br>
                Faculty of Vocational Studies, Universitas Brawijaya<br>
                August 1<sup>st</sup>, 2025
            </span>
        </h3>
        <table style="width:100%; border-collapse:collapse; margin-top:20px; font-size:11pt;">
            <tr style="background:#e6f0fa; font-weight:bold;">
                <td style="border:1px solid #333; padding:4px;">Time***</td>
                <td style="border:1px solid #333; padding:4px;">Program</td>
                <td style="border:1px solid #333; padding:4px;">PIC</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:4px;">06.30 - 07.30</td>
                <td style="border:1px solid #333; padding:4px;">Preparation</td>
                <td style="border:1px solid #333; padding:4px;">Committee</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:4px;">07.30 - 08.00</td>
                <td style="border:1px solid #333; padding:4px;">Registration</td>
                <td style="border:1px solid #333; padding:4px;">Committee</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:4px;">08.00 - 08.05</td>
                <td style="border:1px solid #333; padding:4px;">Opening by MC</td>
                <td style="border:1px solid #333; padding:4px;">Dr. Dini Kurnia Irmawati, M.Pd</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:4px;">08.05 - 08.10</td>
                <td style="border:1px solid #333; padding:4px;">Traditional Dance</td>
                <td style="border:1px solid #333; padding:4px;">MC</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:4px;">08.10 - 08.15</td>
                <td style="border:1px solid #333; padding:4px;">Lagu Indonesia Raya</td>
                <td style="border:1px solid #333; padding:4px;">MC</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:4px;">08.15 - 08.20</td>
                <td style="border:1px solid #333; padding:4px;">Doa</td>
                <td style="border:1px solid #333; padding:4px;">Dr. Sugeng</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:4px;">08.20 - 08.25</td>
                <td style="border:1px solid #333; padding:4px;">Welcoming Speech from Chairman of ICASVE 2025</td>
                <td style="border:1px solid #333; padding:4px;">Sovia Rosalin, SAP, MAB</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:4px;">08.25 - 08.30</td>
                <td style="border:1px solid #333; padding:4px;">Welcoming Speech from Dean of Faculty of Vocational
                    Studies Universitas Brawijaya</td>
                <td style="border:1px solid #333; padding:4px;">Mukhammad Kholid Mawardi, S.Sos., M.A.B., Ph.D.</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:4px;">08.30 - 08.35</td>
                <td style="border:1px solid #333; padding:4px;">Welcoming Speech from Rector of Universitas Brawijaya
                </td>
                <td style="border:1px solid #333; padding:4px;">Prof. Widodo, S.Si., M.Si., Ph.D.Med.Sc</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:4px;">08.35 - 08.45</td>
                <td style="border:1px solid #333; padding:4px;">Opening Session & Photo Session</td>
                <td style="border:1px solid #333; padding:4px;">Dr. Dini Kurnia Irmawati, M.Pd</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:4px;">08.45 – 09.00</td>
                <td style="border:1px solid #333; padding:4px;">Coffee Break</td>
                <td style="border:1px solid #333; padding:4px;">Committee</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:4px;">09.00 – 09.30</td>
                <td style="border:1px solid #333; padding:4px;">Invited Speaker 1:<br>
                    Prof. Dr.-Ing. Hendro Wicaksono, M.Sc. Constructor University, Jerman<br>
                </td>
                <td style="border:1px solid #333; padding:4px;">Moderator: Rachmad Andri Atmoko, S.ST, M.T, MCF</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:4px;">09.30 - 09.40</td>
                <td style="border:1px solid #333; padding:4px;">Question and Answer</td>
                <td style="border:1px solid #333; padding:4px;">Moderator: Rachmad Andri Atmoko, S.ST, M.T, MCF</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:4px;">09.40 – 10.10</td>
                <td style="border:1px solid #333; padding:4px;">Invited Speaker 2:<br>
                    TAN Kim Lim, PhD, MBA, James Cook University<br>
                </td>
                <td style="border:1px solid #333; padding:4px;">Moderator: Dr. Karisma Sri Rahayu, S.S.T., MAB.</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:4px;">10.10 – 10.20</td>
                <td style="border:1px solid #333; padding:4px;">Question and Answer</td>
                <td style="border:1px solid #333; padding:4px;">Moderator: Dr. Karisma Sri Rahayu, S.S.T., MAB.</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:4px;">10.20- 11.00</td>
                <td style="border:1px solid #333; padding:4px;">Invited Speaker 3:<br>
                    Li-Hsin Chen, Ph.D., Taiwan<br>
                </td>
                <td style="border:1px solid #333; padding:4px;">Moderator: Andira Dwi Wiranugraha,SM.,MBA</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:4px;">11.00 - 11.15</td>
                <td style="border:1px solid #333; padding:4px;">Question and Answer</td>
                <td style="border:1px solid #333; padding:4px;">Moderator: Andira Dwi Wiranugraha,SM.,MBA</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:4px;">11.15 - 13.00</td>
                <td style="border:1px solid #333; padding:4px;">Lunch and praying</td>
                <td style="border:1px solid #333; padding:4px;">Committee</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:4px;">13.00- 13.30</td>
                <td style="border:1px solid #333; padding:4px;">Keynote Speaker :<br>
                    Dr. Beny Bandanadjaja, ST., MT<br>
                    Direktur Pembelajaran dan Kemahasiswaan Kemdiktisaintek<br>
                </td>
                <td style="border:1px solid #333; padding:4px;">Moderator: Dr. A. Faidlal Rahman, M.Sc.</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:4px;">13.30 - 13.45</td>
                <td style="border:1px solid #333; padding:4px;">Question and Answer</td>
                <td style="border:1px solid #333; padding:4px;">Moderator: Dr. A. Faidlal Rahman, M.Sc.</td>
            </tr>
            <tr style="background:#e6f0fa; font-weight:bold;">
                <td colspan="3" style="border:1px solid #333; padding:4px; text-align:center;">Parallel Session</td>
            </tr>
            <tr style="background:#f2f2f2;">
                <td style="border:1px solid #333; padding:4px;">Room 1<br>14.00 - 16.30</td>
                <td style="border:1px solid #333; padding:4px;">Parallel Presentation (Onsite)<br>
                </td>
                <td style="border:1px solid #333; padding:4px;">Moderator: Eka Ratri Noor W, S.Si, M.Si, M.Sc, MCF</td>
            </tr>
            <tr style="background:#f2f2f2;">
                <td style="border:1px solid #333; padding:4px;">Room 2<br>14.00 - 16.30</td>
                <td style="border:1px solid #333; padding:4px;">Parallel Presentation (Onsite)<br>
                </td>
                <td style="border:1px solid #333; padding:4px;">Moderator: Fitriana Dhanias, S.E.,MSA.,Ak.,CFP</td>
            </tr>
            <tr style="background:#f2f2f2;">
                <td style="border:1px solid #333; padding:4px;">Room 3<br>14.00 - 16.30</td>
                <td style="border:1px solid #333; padding:4px;">Parallel Presentation (Onsite)<br>
                </td>
                <td style="border:1px solid #333; padding:4px;">Moderator: Erlangga Setyawan, SP., MM., CODP</td>
            </tr>
            <tr style="background:#f2f2f2;">
                <td style="border:1px solid #333; padding:4px;">Room 4<br>14.00 - 16.30</td>
                <td style="border:1px solid #333; padding:4px;">Parallel Presentation (Onsite)<br>
                </td>
                <td style="border:1px solid #333; padding:4px;">Moderator: Dimas Fakhruddin, S.ST., M.Ds.</td>
            </tr>
            <tr style="background:#f2f2f2;">
                <td style="border:1px solid #333; padding:4px;">Room 5<br>14.00 - 16.30</td>
                <td style="border:1px solid #333; padding:4px;">Parallel Presentation (Online)<br>
                </td>
                <td style="border:1px solid #333; padding:4px;">Moderator: Hapsari Dian Sylvatri, S.S.,M.I.Kom</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:4px;">16.30-16.45</td>
                <td style="border:1px solid #333; padding:4px;">Awarding of Best Presenter</td>
                <td style="border:1px solid #333; padding:4px;">MC</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:4px;">16.45-17.00</td>
                <td style="border:1px solid #333; padding:4px;">Closing by MC</td>
                <td style="border:1px solid #333; padding:4px;">MC</td>
            </tr>
            <tr>

                <td colspan="3" style="border:1px solid #333; padding:4px; font-size:10px;">
                    *** Refer to Indonesian Western Time (WIB)
                </td>

            </tr>
        </table>
    </div>

</body>

</html>
