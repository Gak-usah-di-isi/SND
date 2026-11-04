@extends('layouts.error')

<body>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="error-template" style="padding: 40px 15px; text-align: center;">
                    <h1 class="error-code" style="font-size: 120px; font-weight: bold; color: #dc3545;">404</h1>
                    <h2>Oops! Halaman Tidak Ditemukan</h2>
                    <div class="error-details" style="margin-top: 20px; margin-bottom: 20px;">
                        Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
                    </div>
                    <div class="error-actions" style="margin-top: 15px; margin-bottom: 15px;">
                        <button onclick="window.history.back()" class="btn btn-secondary btn-md">
                            <i class="fas fa-arrow-left"></i> Kembali
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
