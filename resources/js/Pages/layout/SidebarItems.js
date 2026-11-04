let _id = 0;
const uniqueId = () => String(++_id);

const SidebarContent = [
  {
    id: 1,
    name: 'DASHBOARD',
    items: [
      {
        heading: 'DASHBOARD',
        children: [
          { name: 'Doctor',         icon: 'solar:stethoscope-outline',              id: uniqueId(), url: '/template' },
          { name: 'Front Office',   icon: 'solar:buildings-outline',                id: uniqueId(), url: '/template/front-office' },
          { name: 'Performa Bisnis',icon: 'solar:chart-square-outline',             id: uniqueId(), url: '/template/business' },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Jadwal',
    items: [
      {
        heading: 'JADWAL',
        children: [
          { name: 'Jadwal Saya',    icon: 'solar:calendar-outline',                 id: uniqueId(), url: '/template/jadwal/saya' },
          { name: 'Jadwal Klinik',  icon: 'solar:user-outline',                     id: uniqueId(), url: '/template/jadwal/klinik' },
          { name: 'Jadwal Staff',   icon: 'solar:users-group-two-rounded-outline',  id: uniqueId(), url: '/template/jadwal/staff' },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'PASIEN',
    items: [
      {
        heading: 'PASIEN',
        children: [
          { name: 'Data Pasien & Riwayat', icon: 'solar:users-group-two-rounded-outline', id: uniqueId(), url: '/template/pasien' },
        ],
      },
    ],
  },
  {
    id: 4,
    name: 'PENJUALAN',
    items: [
      {
        heading: 'PENJUALAN',
        children: [
          { name: 'Daftar Transaksi', icon: 'solar:money-bag-outline', id: uniqueId(), url: '/template/penjualan/transaksi' },
          { name: 'Pembayaran',       icon: 'solar:wallet-outline',    id: uniqueId(), url: '/template/penjualan/transaksi' },
        ],
      },
    ],
  },
  {
    id: 5,
    name: 'TREATMENT',
    items: [
      {
        heading: 'TREATMENT',
        children: [
          { name: 'Daftar Treatment', icon: 'solar:key-outline',  id: uniqueId(), url: '/template/treatment/daftar' },
          { name: 'Paket Treatment',  icon: 'solar:box-outline',  id: uniqueId(), url: '/template/treatment/daftar' },
          { name: 'Promo & Voucher',  icon: 'solar:gift-outline', id: uniqueId(), url: '/template/treatment/daftar' },
        ],
      },
    ],
  },
  {
    id: 6,
    name: 'PRODUK',
    items: [
      {
        heading: 'PRODUK',
        children: [
          { name: 'Daftar Produk',    icon: 'solar:bag-outline',    id: uniqueId(), url: '/template/produk/daftar' },
          { name: 'Penjualan Produk', icon: 'solar:dollar-outline', id: uniqueId(), url: '/template/produk/daftar' },
        ],
      },
    ],
  },
  {
    id: 7,
    name: 'INVENTORY',
    items: [
      {
        heading: 'INVENTORY',
        children: [
          { name: 'Ruang Penyimpanan',     icon: 'solar:home-2-outline',   id: uniqueId(), url: '/template/inventory/ruang' },
          { name: 'Penerimaan Item',        icon: 'solar:box-outline',      id: uniqueId(), url: '/template/inventory/penerimaan' },
          { name: 'Pengeluaran Item',       icon: 'solar:box-outline',      id: uniqueId(), url: '/template/inventory/penerimaan' },
          { name: 'Penyesuaian Item',       icon: 'solar:box-outline',      id: uniqueId(), url: '/template/inventory/penerimaan' },
          { name: 'Kirim dan Terima Item',  icon: 'solar:box-outline',      id: uniqueId(), url: '/template/inventory/penerimaan' },
          { name: 'Stock Minimum',          icon: 'solar:danger-outline',   id: uniqueId(), url: '/template/inventory/penerimaan' },
        ],
      },
    ],
  },
  {
    id: 10,
    name: 'PENGATURAN',
    items: [
      {
        heading: 'PENGATURAN',
        children: [
          { name: 'Daftar Staff',            icon: 'solar:users-group-two-rounded-outline', id: uniqueId(), url: '/template/pengaturan/staff'      },
          { name: 'Cabang',                  icon: 'solar:map-outline',                    id: uniqueId(), url: '/template/pengaturan/cabang'     },
          { name: 'Compliance & Document',   icon: 'solar:file-text-outline',              id: uniqueId(), url: '/template/pengaturan/compliance'  },
          { name: 'User Role & Keamanan',    icon: 'solar:shield-outline',                 id: uniqueId(), url: '/template/pengaturan/role'        },
          { name: 'Audit Trail',             icon: 'solar:eye-outline',                    id: uniqueId(), url: '/template/pengaturan'             },
          { name: 'Membership',              icon: 'solar:user-outline',                   id: uniqueId(), url: '/template/pengaturan'             },
          { name: 'Supplier List',           icon: 'solar:box-outline',                    id: uniqueId(), url: '/template/pengaturan/supplier'    },
          { name: 'Payment Method',          icon: 'solar:wallet-outline',                 id: uniqueId(), url: '/template/pengaturan/payment'     },
        ],
      },
    ],
  },
];

export default SidebarContent;
