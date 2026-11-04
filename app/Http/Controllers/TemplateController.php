<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class TemplateController extends Controller
{
    public function index()
    {
        return Inertia::render('Template/Index');
    }

    public function frontOffice()
    {
        return Inertia::render('Template/FrontOffice');
    }

    public function business()
    {
        return Inertia::render('Template/Business');
    }

    public function jadwalSaya()
    {
        return Inertia::render('Template/schedule/JadwalSaya');
    }
    public function jadwalKlinik()
    {
        return Inertia::render('Template/schedule/JadwalKlinik');
    }
    public function jadwalStaff()
    {
        return Inertia::render('Template/schedule/JadwalStaff');
    }
    public function pasien()
    {
        return Inertia::render('Template/patient/Pasien');
    }
    public function pasienRegister()
    {
        return Inertia::render('Template/patient/PasienRegister');
    }
    public function transaksi()
    {
        return Inertia::render('Template/penjualan/Transaksi');
    }
    public function treatment()
    {
        return Inertia::render('Template/treatment/Treatment');
    }
    public function produk()
    {
        return Inertia::render('Template/produk/Produk');
    }
    public function kategoriProduk()
    {
        return Inertia::render('Template/produk/KategoriProduk');
    }
    public function ruangPenyimpanan()
    {
        return Inertia::render('Template/inventory/RuangPenyimpanan');
    }
    public function penerimaan()
    {
        return Inertia::render('Template/inventory/Penerimaan');
    }
    public function setting()
    {
        return Inertia::render('Template/setting/Setting');
    }
    public function daftarStaff()
    {
        return Inertia::render('Template/setting/DaftarStaff');
    }
    public function tambahStaff()
    {
        return Inertia::render('Template/setting/TambahStaff');
    }
    public function cabang()
    {
        return Inertia::render('Template/setting/Cabang');
    }
    public function complianceDocument()
    {
        return Inertia::render('Template/setting/ComplianceDocument');
    }
    public function lihatDokumen($id)
    {
        return Inertia::render('Template/setting/LihatDokumen', ['docId' => $id]);
    }
    public function userRole()
    {
        return Inertia::render('Template/setting/UserRole');
    }
    public function supplierList()
    {
        return Inertia::render('Template/setting/SupplierList');
    }
    public function paymentMethod()
    {
        return Inertia::render('Template/setting/PaymentMethod');
    }
    public function docs()
    {
        return Inertia::render('Template/Docs');
    }
}
