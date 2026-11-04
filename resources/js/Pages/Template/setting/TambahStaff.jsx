import { useState } from 'react';
import { router } from '@inertiajs/react';
import PageLayout from '../../../Components/ui/shared/PageLayout';
import BackButton from '../../../Components/ui/BackButton';
import { Card } from '../../../Components/ui/card';
import { FloatInput } from '../../../Components/ui/FloatInput';
import { FloatSelect } from '../../../Components/ui/FloatSelect';
import FormActions from '../../../Components/ui/FormActions';
import PhotoUpload from '../../../Components/ui/PhotoUpload';

const GENDER_OPTIONS = [
  { value: 'male', label: 'Laki-laki' },
  { value: 'female', label: 'Perempuan' },
];

const EDUCATION_OPTIONS = [
  { value: 'SMA/SMK', label: 'SMA/SMK' },
  { value: 'D3', label: 'D3' },
  { value: 'S1', label: 'S1' },
  { value: 'S2', label: 'S2' },
];

const RELIGION_OPTIONS = [
  { value: 'Islam', label: 'Islam' },
  { value: 'Kristen', label: 'Kristen' },
  { value: 'Katolik', label: 'Katolik' },
  { value: 'Hindu', label: 'Hindu' },
  { value: 'Buddha', label: 'Buddha' },
  { value: 'Konghucu', label: 'Konghucu' },
];

const MARITAL_OPTIONS = [
  { value: 'Menikah', label: 'Menikah' },
  { value: 'Belum Menikah', label: 'Belum Menikah' },
];

const ROLE_OPTIONS = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'front_office', label: 'Front Office' },
  { value: 'dokter', label: 'Dokter' },
  { value: 'kasir', label: 'Kasir' },
];

const SECTION_TITLE = { fontSize: 16, fontWeight: 600, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' };
const GRID_2 = { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 };

export default function TambahStaffPage() {
  const [form, setForm] = useState({
    first_name: '', last_name: '', national_id_number: '', gender: '',
    birth_place: '', birth_date: '', last_education: '', religion: '',
    marital_status: '', role_id: '', province: '', city: '', sub_district: '',
    rt_rw: '', address: '', phone_number: '', email: '', photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));
  const setInput = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const errs = {};
    const required = [
      'first_name', 'last_name', 'national_id_number', 'gender',
      'birth_place', 'birth_date', 'last_education', 'religion',
      'marital_status', 'role_id', 'phone_number', 'email', 'address',
    ];
    required.forEach(k => { if (!form[k]) errs[k] = 'Wajib diisi'; });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Format email tidak valid';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(f => ({ ...f, photo: file }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!validate()) return;
    router.visit('/template/pengaturan/staff');
  };

  const handleBack = () => router.visit('/template/pengaturan/staff');

  return (
    <PageLayout currentPath="/template/pengaturan/staff">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <BackButton onClick={handleBack} />
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', margin: 0 }}>
          Tambah Staff
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Data Diri */}
        <Card>
          <p style={SECTION_TITLE}>Data Diri</p>
          <div style={GRID_2}>
            <FloatInput
              id="first_name"
              label="Nama Depan"
              placeholder="Masukkan nama depan"
              value={form.first_name}
              onChange={setInput('first_name')}
              error={!!errors.first_name}
              helperText={errors.first_name}
            />
            <FloatInput
              id="last_name"
              label="Nama Belakang"
              placeholder="Masukkan nama belakang"
              value={form.last_name}
              onChange={setInput('last_name')}
              error={!!errors.last_name}
              helperText={errors.last_name}
            />
            <FloatInput
              id="national_id_number"
              label="NIK"
              placeholder="Masukkan NIK"
              value={form.national_id_number}
              onChange={setInput('national_id_number')}
              error={!!errors.national_id_number}
              helperText={errors.national_id_number}
            />
            <FloatSelect
              id="gender"
              label="Jenis Kelamin"
              options={GENDER_OPTIONS}
              value={form.gender}
              onChange={set('gender')}
              error={!!errors.gender}
              helperText={errors.gender}
            />
            <FloatInput
              id="birth_place"
              label="Tempat Lahir"
              placeholder="Masukkan tempat lahir"
              value={form.birth_place}
              onChange={setInput('birth_place')}
              error={!!errors.birth_place}
              helperText={errors.birth_place}
            />
            <FloatInput
              id="birth_date"
              label="Tanggal Lahir"
              placeholder="DD/MM/YYYY"
              value={form.birth_date}
              onFocus={(e) => { if (!form.birth_date) setForm(f => ({ ...f, birth_date: '' })); }}
              onChange={(e) => {
                let raw = e.target.value.replace(/\D/g, '');
                if (raw.length > 8) raw = raw.slice(0, 8);
                let masked = '';
                if (raw.length <= 2) masked = raw;
                else if (raw.length <= 4) masked = raw.slice(0,2) + '/' + raw.slice(2);
                else masked = raw.slice(0,2) + '/' + raw.slice(2,4) + '/' + raw.slice(4);
                setForm(f => ({ ...f, birth_date: masked }));
              }}
              error={!!errors.birth_date}
              helperText={errors.birth_date}
            />
            <FloatSelect
              id="last_education"
              label="Pendidikan Terakhir"
              options={EDUCATION_OPTIONS}
              value={form.last_education}
              onChange={set('last_education')}
              error={!!errors.last_education}
              helperText={errors.last_education}
            />
            <FloatSelect
              id="religion"
              label="Agama"
              options={RELIGION_OPTIONS}
              value={form.religion}
              onChange={set('religion')}
              error={!!errors.religion}
              helperText={errors.religion}
            />
            <FloatSelect
              id="marital_status"
              label="Status"
              options={MARITAL_OPTIONS}
              value={form.marital_status}
              onChange={set('marital_status')}
              error={!!errors.marital_status}
              helperText={errors.marital_status}
            />
            <FloatSelect
              id="role_id"
              label="Jabatan"
              options={ROLE_OPTIONS}
              value={form.role_id}
              onChange={set('role_id')}
              error={!!errors.role_id}
              helperText={errors.role_id}
            />
            <div></div>
            <div style={{ gridColumn: 'span 2' }}>
              <PhotoUpload
                label="Foto Karyawan"
                previewUrl={photoPreview}
                onChange={handlePhotoChange}
                inputId="staff-photo-upload"
              />
            </div>
          </div>
        </Card>

        {/* Alamat */}
        <Card>
          <p style={SECTION_TITLE}>Alamat</p>
          <div style={GRID_2}>
            <FloatInput
              id="province"
              label="Provinsi"
              placeholder="Masukkan provinsi"
              value={form.province}
              onChange={setInput('province')}
            />
            <FloatInput
              id="city"
              label="Kabupaten/Kota"
              placeholder="Masukkan kabupaten/kota"
              value={form.city}
              onChange={setInput('city')}
            />
            <FloatInput
              id="sub_district"
              label="Kecamatan"
              placeholder="Masukkan kecamatan"
              value={form.sub_district}
              onChange={setInput('sub_district')}
            />
            <FloatInput
              id="rt_rw"
              label="RT/RW"
              placeholder="Masukkan RT/RW"
              value={form.rt_rw}
              onChange={setInput('rt_rw')}
            />
          </div>
          <div style={{ marginTop: 20 }}>
            <FloatInput
              id="address"
              label="Alamat"
              placeholder="Masukkan alamat rumah anda"
              value={form.address}
              onChange={setInput('address')}
              multiline
              rows={3}
              error={!!errors.address}
              helperText={errors.address}
            />
          </div>
        </Card>

        {/* Kontak */}
        <Card>
          <p style={SECTION_TITLE}>Kontak</p>
          <div style={GRID_2}>
            <FloatInput
              id="phone_number"
              label="No. Telepon/Handphone"
              placeholder="Masukkan no handphone"
              value={form.phone_number}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                setForm(f => ({ ...f, phone_number: val }));
              }}
              error={!!errors.phone_number}
              helperText={errors.phone_number}
            />
            <FloatInput
              id="email"
              label="Email"
              placeholder="Masukkan email"
              type="email"
              value={form.email}
              onChange={setInput('email')}
              error={!!errors.email}
              helperText={errors.email}
            />
          </div>
        </Card>

        <FormActions
          id="tambah-staff-form"
          onCancel={handleBack}
          onSubmit={handleSubmit}
          cancelText="Batalkan"
          submitText="Simpan"
        />
      </div>
    </PageLayout>
  );
}
