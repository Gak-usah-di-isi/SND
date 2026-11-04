# Nex Healthcare — Template UI Documentation

Dokumentasi komponen UI untuk project **Nex Healthcare** (Laravel 11 + Inertia + React JSX).

> **Font:** Manrope — selalu gunakan `fontFamily: 'Manrope, sans-serif'` di inline style.  
> **Primary color:** `#0152EA`  
> **Text dark:** `#1F2A3D`  
> **Border:** `#e0e6eb`  
> **Background:** `#F4F7FB`

---

## Daftar Komponen

| Komponen | File | Keterangan |
|---|---|---|
| [DataTable](#1-datatable) | `Components/ui/DataTable.jsx` | Tabel reusable dengan header + empty state |
| [TablePagination](#2-tablepagination) | `Components/ui/TablePagination.jsx` | Pagination custom dengan rows-per-page dropdown |
| [FilterPopover](#3-filterpopover) | `Components/ui/FilterPopover.jsx` | Tombol Filter dengan popover panel |
| [FloatInput](#4-floatinput) | `Components/ui/FloatInput.jsx` | Text input dengan floating label |
| [FloatSelect](#5-floatselect) | `Components/ui/FloatSelect.jsx` | Dropdown select dengan floating label + search |
| [PageLayout](#6-pagelayout) | `Components/shared/PageLayout.jsx` | Layout wrapper (sidebar + topbar) |

---

## 1. DataTable

**File:** `resources/js/Components/ui/DataTable.jsx`

Komponen tabel yang sudah include border card, header abu-abu, dan empty state.

### Props

| Prop | Type | Default | Keterangan |
|---|---|---|---|
| `columns` | `Array<{key, label, align?}>` | `[]` | Definisi kolom header |
| `children` | `ReactNode` (rows `<tr>`) | — | Baris-baris tabel |
| `empty` | `ReactNode` | Default empty SVG | Tampilan saat tidak ada data |
| `colSpan` | `number` | `columns.length` | colSpan untuk empty state row |
| `footer` | `ReactNode` | — | Slot di bawah tabel, biasanya `<TablePagination>` |

### Penggunaan

```jsx
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';

const COL_CELL = 'px-6 py-4 text-sm text-gray-700';

<DataTable
  columns={[
    { key: 'nama',  label: 'Nama'   },
    { key: 'email', label: 'Email'  },
    { key: 'aksi',  label: '', align: 'right' },
  ]}
  empty={
    <div className="flex flex-col items-center gap-2">
      <p className="font-medium text-gray-500">Tidak ada data</p>
    </div>
  }
  footer={
    <TablePagination
      page={page}
      rowsPerPage={rowsPerPage}
      total={filtered.length}
      onPageChange={setPage}
      onRowsPerPageChange={n => { setRowsPerPage(n); setPage(0); }}
    />
  }
>
  {paged.map(item => (
    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
      <td className={COL_CELL}>{item.nama}</td>
      <td className={COL_CELL}>{item.email}</td>
      <td className="px-6 py-4">
        {/* action buttons di sini */}
      </td>
    </tr>
  ))}
</DataTable>
```

### Action Buttons (pola standar)

Edit button → **biru**, Trash button → **merah**. Gunakan `onMouseEnter`/`onMouseLeave` untuk hover effect:

```jsx
{/* Edit */}
<button
  className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
  style={{ color: '#0152EA' }}
  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(1,82,234,0.08)'}
  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
  title="Edit"
>
  <IconEdit />
</button>

{/* Hapus */}
<button
  className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
  style={{ color: '#EF4444' }}
  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'}
  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
  title="Hapus"
>
  <IconTrash />
</button>
```

### Icon Edit & Trash (SVG standar)

```jsx
function IconEdit({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1" />
      <path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3l8.385-8.415z" />
    </svg>
  );
}

function IconTrash({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
    </svg>
  );
}
```

### Expandable Rows (accordion)

Gunakan array pattern untuk render expand row di bawah main row:

```jsx
{paged.map(r => {
  const isOpen = !!expanded[r.id];
  return [
    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
      <td className="pl-4 py-4 w-10">
        <button onClick={() => setExpanded(prev => ({ ...prev, [r.id]: !prev[r.id] }))}>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </td>
      <td className={COL_CELL}>{r.nama}</td>
    </tr>,
    isOpen && (
      <tr key={`${r.id}-expand`}>
        <td colSpan={2} style={{ background: '#F8FAFC', padding: '20px 24px' }}>
          {/* konten expand */}
        </td>
      </tr>
    ),
  ];
})}
```

---

## 2. TablePagination

**File:** `resources/js/Components/ui/TablePagination.jsx`

Pagination dengan teks "Menampilkan X - Y dari Z entri", dropdown rows per page, dan tombol prev/next.

### Props

| Prop | Type | Default | Keterangan |
|---|---|---|---|
| `page` | `number` | — | Index halaman saat ini (0-based) |
| `rowsPerPage` | `number` | — | Jumlah baris per halaman |
| `total` | `number` | — | Total data keseluruhan |
| `onPageChange` | `(page: number) => void` | — | Callback ganti halaman |
| `onRowsPerPageChange` | `(n: number) => void` | — | Callback ganti rows per page |
| `rowsPerPageOptions` | `number[]` | `[5,10,25,50]` | Pilihan jumlah baris |

### Penggunaan

```jsx
import { TablePagination } from '../../../Components/ui/TablePagination';

const [page, setPage]               = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(10);

// Selalu dipakai sebagai prop `footer` di DataTable:
<DataTable
  columns={...}
  footer={
    <TablePagination
      page={page}
      rowsPerPage={rowsPerPage}
      total={data.length}
      onPageChange={setPage}
      onRowsPerPageChange={n => { setRowsPerPage(n); setPage(0); }}
      rowsPerPageOptions={[5, 10, 25, 50]}
    />
  }
>
  ...
</DataTable>

// Slice data untuk paging:
const paged = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
```

---

## 3. FilterPopover

**File:** `resources/js/Components/ui/FilterPopover.jsx`

Tombol "Filter" yang membuka panel popover berisi select filters + range slider "Total Spent".

### Props

| Prop | Type | Default | Keterangan |
|---|---|---|---|
| `filters` | `Array<{id, label, options[]}>` | `[]` | Definisi filter select |
| `values` | `{ [id]: value }` | `{}` | Nilai filter saat ini |
| `onChange` | `(id, value) => void` | — | Callback perubahan nilai filter |
| `onApply` | `() => void` | — | Callback tombol Terapkan |
| `onClear` | `() => void` | — | Callback tombol Clear all |
| `maxSpent` | `number` | `1000000` | Nilai maksimum range slider Total Spent |

### Penggunaan

```jsx
import { FilterPopover } from '../../../Components/ui/FilterPopover';

const FILTER_DEFS = [
  {
    id: 'status',
    label: 'Status',
    options: [
      { value: 'all',    label: 'Semua'    },
      { value: 'aktif',  label: 'Aktif'   },
      { value: 'nonaktif', label: 'Nonaktif' },
    ],
  },
  {
    id: 'tier',
    label: 'Membership',
    options: [
      { value: 'all',    label: 'Semua Tier' },
      { value: 'Gold',   label: 'Gold'       },
      { value: 'Silver', label: 'Silver'     },
    ],
  },
];

const [filterVals, setFilterVals]   = useState({ status: 'all', tier: 'all' });
const [appliedVals, setAppliedVals] = useState({ status: 'all', tier: 'all' });

<FilterPopover
  filters={FILTER_DEFS}
  values={filterVals}
  onChange={(id, val) => setFilterVals(prev => ({ ...prev, [id]: val }))}
  onApply={() => { setAppliedVals({ ...filterVals }); setPage(0); }}
  onClear={() => {
    const def = { status: 'all', tier: 'all' };
    setFilterVals(def);
    setAppliedVals(def);
    setPage(0);
  }}
/>

// Filter data dengan appliedVals:
const filtered = data.filter(item => {
  const matchStatus = appliedVals.status === 'all' || item.status === appliedVals.status;
  const matchTier   = appliedVals.tier === 'all'   || item.tier === appliedVals.tier;
  return matchStatus && matchTier;
});
```

### Tanpa range slider (kosongkan filters)

```jsx
// Filter button saja, tanpa dropdown filter:
<FilterPopover
  filters={[]}
  values={{}}
  onChange={() => {}}
  onApply={() => setPage(0)}
  onClear={() => setPage(0)}
/>
```

---

## 4. FloatInput

**File:** `resources/js/Components/ui/FloatInput.jsx`

Text input dengan floating label Material-UI style. Notched border, focus biru.

### Props

| Prop | Type | Default | Keterangan |
|---|---|---|---|
| `label` | `string` | — | Floating label text |
| `id` | `string` | — | HTML id untuk input |
| `value` | `string` | `''` | Nilai input (controlled) |
| `onChange` | `(e) => void` | — | Handler perubahan |
| `placeholder` | `string` | `''` | Placeholder (muncul saat focused) |
| `type` | `string` | `'text'` | HTML input type |
| `disabled` | `boolean` | `false` | Nonaktifkan input |
| `multiline` | `boolean` | `false` | Gunakan `<textarea>` |
| `rows` | `number` | `4` | Jumlah baris (jika multiline) |
| `error` | `boolean` | `false` | Tampilkan state error (border merah) |
| `helperText` | `string` | — | Teks helper di bawah input |

### Penggunaan

```jsx
import { FloatInput } from '../../../Components/ui/FloatInput';

const [nama, setNama] = useState('');

{/* Input biasa */}
<FloatInput
  id="nama"
  label="Nama"
  value={nama}
  onChange={e => setNama(e.target.value)}
  placeholder="Masukkan nama lengkap"
/>

{/* Input email */}
<FloatInput
  id="email"
  label="Email"
  type="email"
  value={email}
  onChange={e => setEmail(e.target.value)}
/>

{/* Textarea */}
<FloatInput
  id="catatan"
  label="Catatan"
  multiline
  rows={4}
  value={catatan}
  onChange={e => setCatatan(e.target.value)}
/>

{/* Dengan error */}
<FloatInput
  id="phone"
  label="No. HP"
  value={phone}
  onChange={e => setPhone(e.target.value)}
  error={!isValidPhone}
  helperText={!isValidPhone ? 'Nomor tidak valid' : ''}
/>

{/* Disabled */}
<FloatInput
  id="kode"
  label="Kode"
  value="AUTO-001"
  disabled
/>
```

---

## 5. FloatSelect

**File:** `resources/js/Components/ui/FloatSelect.jsx`

Dropdown select dengan floating label, built-in search, dan clear button. Dropdown rendered via `createPortal` (tidak ter-clip oleh overflow).

### Props

| Prop | Type | Default | Keterangan |
|---|---|---|---|
| `label` | `string` | — | Floating label text |
| `id` | `string` | — | HTML id |
| `options` | `Array<{value, label}>` | `[]` | Daftar pilihan |
| `value` | `string` | `''` | Nilai terpilih (value dari option) |
| `onChange` | `(value) => void` | — | Callback saat pilihan berubah |
| `placeholder` | `string` | `''` | Placeholder saat search |
| `disabled` | `boolean` | `false` | Nonaktifkan select |
| `error` | `boolean` | `false` | Tampilkan state error |
| `helperText` | `string` | — | Teks helper di bawah |

### Penggunaan

```jsx
import { FloatSelect } from '../../../Components/ui/FloatSelect';

const [status, setStatus] = useState('');

<FloatSelect
  id="status"
  label="Status"
  value={status}
  options={[
    { value: '',          label: 'Semua'   },
    { value: 'aktif',     label: 'Aktif'   },
    { value: 'nonaktif',  label: 'Nonaktif' },
  ]}
  onChange={val => setStatus(val)}
/>

{/* Di dalam form grid */}
<div className="grid grid-cols-2 gap-4">
  <FloatSelect
    id="jabatan"
    label="Jabatan"
    value={jabatan}
    options={jabatanOptions}
    onChange={setJabatan}
  />
  <FloatInput
    id="nama"
    label="Nama"
    value={nama}
    onChange={e => setNama(e.target.value)}
  />
</div>
```

---

## 6. PageLayout

**File:** `resources/js/Components/shared/PageLayout.jsx`

Wrapper halaman yang menyertakan sidebar dan topbar. Semua halaman template wajib dibungkus komponen ini.

### Props

| Prop | Type | Keterangan |
|---|---|---|
| `currentPath` | `string` | Path URL halaman saat ini (untuk highlight sidebar) |
| `children` | `ReactNode` | Konten halaman |

### Penggunaan

```jsx
import PageLayout from '../../../Components/shared/PageLayout';

export default function HalamanSaya() {
  return (
    <PageLayout currentPath="/template/path-halaman-ini">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' }}>
        Judul Halaman
      </h1>

      {/* konten di sini */}
    </PageLayout>
  );
}
```

---

## Pola Halaman (Page Pattern)

Setiap halaman tabel mengikuti pola yang konsisten:

```jsx
import { useState } from 'react';
import { Search } from 'lucide-react';
import PageLayout from '../../../Components/shared/PageLayout';
import { FilterPopover } from '../../../Components/ui/FilterPopover';
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';

export default function ContohPage() {
  const [search, setSearch]           = useState('');
  const [filterVals, setFilterVals]   = useState({ status: 'all' });
  const [appliedVals, setAppliedVals] = useState({ status: 'all' });
  const [page, setPage]               = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filtered = DATA.filter(item => {
    const matchSearch = item.nama.toLowerCase().includes(search.toLowerCase());
    const matchStatus = appliedVals.status === 'all' || item.status === appliedVals.status;
    return matchSearch && matchStatus;
  });

  const paged = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const COL_CELL = 'px-6 py-4 text-sm text-gray-700';

  return (
    <PageLayout currentPath="/template/contoh">
      {/* 1. Judul */}
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' }}>
        Nama Halaman
      </h1>

      {/* 2. Action bar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        {/* Kiri: Filter */}
        <FilterPopover
          filters={FILTER_DEFS}
          values={filterVals}
          onChange={(id, val) => setFilterVals(prev => ({ ...prev, [id]: val }))}
          onApply={() => { setAppliedVals({ ...filterVals }); setPage(0); }}
          onClear={() => { setFilterVals({ status: 'all' }); setAppliedVals({ status: 'all' }); setPage(0); }}
        />

        {/* Kanan: Tombol aksi + Search */}
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>
            + Tambah Data
          </button>

          <div className="flex items-center gap-2 border border-gray-200 bg-white px-3 py-2" style={{ borderRadius: 8 }}>
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
              placeholder="Cari..."
              className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              style={{ width: 150 }}
            />
          </div>
        </div>
      </div>

      {/* 3. Tabel */}
      <DataTable
        columns={[
          { key: 'col1', label: 'Kolom 1' },
          { key: 'col2', label: 'Kolom 2' },
          { key: 'aksi', label: '', align: 'right' },
        ]}
        footer={
          <TablePagination
            page={page}
            rowsPerPage={rowsPerPage}
            total={filtered.length}
            onPageChange={setPage}
            onRowsPerPageChange={n => { setRowsPerPage(n); setPage(0); }}
          />
        }
      >
        {paged.map(item => (
          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
            <td className={COL_CELL}>{item.col1}</td>
            <td className={COL_CELL}>{item.col2}</td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-1">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
                  style={{ color: '#0152EA' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(1,82,234,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  title="Edit">
                  <IconEdit />
                </button>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
                  style={{ color: '#EF4444' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  title="Hapus">
                  <IconTrash />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
    </PageLayout>
  );
}
```

---

## Status Badge (pola standar)

```jsx
{/* Aktif / Nonaktif */}
<span className="inline-block px-3 py-1 text-xs font-medium rounded-full"
  style={{
    backgroundColor: isActive ? 'rgba(19,222,185,0.1)' : 'rgba(239,68,68,0.1)',
    color: isActive ? '#10B981' : '#EF4444',
  }}>
  {isActive ? 'Aktif' : 'Nonaktif'}
</span>

{/* Selesai / Draft */}
const STATUS_STYLE = {
  completed: { label: 'Selesai', bg: 'rgba(19,222,185,0.1)',  color: '#10B981' },
  draft:     { label: 'Draft',   bg: 'rgba(255,174,31,0.12)', color: '#F59E0B' },
};

<span className="inline-block px-3 py-1 text-xs font-medium rounded-full"
  style={{ backgroundColor: STATUS_STYLE[item.status].bg, color: STATUS_STYLE[item.status].color }}>
  {STATUS_STYLE[item.status].label}
</span>
```

---

## Avatar Inisial

```jsx
{/* Avatar inisial dari nama */}
function initials(obj) {
  return `${obj.first_name[0]}${obj.last_name[0]}`.toUpperCase();
}

<div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
  style={{ backgroundColor: '#0152EA' }}>
  {initials(item)}
</div>
```

---

## Tombol Standar

```jsx
{/* Primary (solid) */}
<button
  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white"
  style={{ backgroundColor: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>
  + Tambah Data
</button>

{/* Outlined (border biru) */}
<button
  className="px-4 py-2 text-sm font-medium"
  style={{ border: '1px solid #0152EA', color: '#0152EA', borderRadius: 8, background: '#fff', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>
  Atur Kategori
</button>

{/* Neutral (Export File style) */}
<button
  className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
  style={{ borderRadius: 8, fontFamily: 'Manrope, sans-serif' }}>
  Export File
</button>
```

---

## Search Input

```jsx
import { Search } from 'lucide-react';

<div className="flex items-center gap-2 border border-gray-200 bg-white px-3 py-2" style={{ borderRadius: 8 }}>
  <Search size={15} className="text-gray-400 flex-shrink-0" />
  <input
    value={search}
    onChange={e => { setSearch(e.target.value); setPage(0); }}
    placeholder="Cari..."
    className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
    style={{ width: 150 }}
  />
</div>
```

---

## Warna Sistem

| Token | Hex | Penggunaan |
|---|---|---|
| Primary | `#0152EA` | Button, link, focus, badge aktif |
| Primary hover bg | `rgba(1,82,234,0.08)` | Hover icon edit |
| Text dark | `#1F2A3D` | Judul halaman |
| Text body | `#2A3547` | Text utama |
| Text secondary | `#5A6A85` | Subtext |
| Text muted | `#98A4AE` | Placeholder, label |
| Border | `#e0e6eb` | Border card, input, pagination |
| Background | `#F4F7FB` | Background halaman |
| Success | `#10B981` | Badge aktif / selesai |
| Warning | `#F59E0B` | Badge draft |
| Error | `#EF4444` | Badge nonaktif, trash button |

---

## Menambahkan Halaman Baru

1. Buat file di `resources/js/Pages/Template/{modul}/NamaHalaman.jsx`
2. Tambahkan route di `routes/web.php`:
   ```php
   Route::get('/template/modul/nama', [TemplateController::class, 'namaHalaman'])->name('template.namaHalaman');
   ```
3. Tambahkan method di `app/Http/Controllers/TemplateController.php`:
   ```php
   public function namaHalaman() { return Inertia::render('Template/modul/NamaHalaman'); }
   ```
4. Update URL di `resources/js/Pages/layout/SidebarItems.js` jika halaman ada di sidebar
5. `currentPath` di `PageLayout` harus sama persis dengan URL route-nya
