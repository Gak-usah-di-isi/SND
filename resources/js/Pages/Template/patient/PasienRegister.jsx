import { useEffect, useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import PageLayout from "../../../Components/ui/shared/PageLayout.jsx";
import { Card } from '../../../Components/ui/card';
import { FloatInput } from '../../../Components/ui/FloatInput';
import { FloatSelect } from '../../../Components/ui/FloatSelect';
import PhotoUpload from '../../../Components/ui/PhotoUpload';
import BackButton from '../../../Components/ui/BackButton';
import FormActions from '../../../Components/ui/FormActions';

const EDUCATION_OPTIONS = [
  { value: 'sd', label: 'SD' },
  { value: 'smp', label: 'SMP' },
  { value: 'sma', label: 'SMA/SMK' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'sarjana', label: 'Sarjana' },
  { value: 'pascasarjana', label: 'Pascasarjana' },
];

const GENDER_OPTIONS = [
  { value: 'male', label: 'Laki-laki' },
  { value: 'female', label: 'Perempuan' },
];

const PROFESSION_OPTIONS = [
  { value: 'karyawan', label: 'Karyawan' },
  { value: 'wiraswasta', label: 'Wiraswasta' },
  { value: 'pelajar', label: 'Pelajar/Mahasiswa' },
  { value: 'ibu_rumah_tangga', label: 'Ibu Rumah Tangga' },
  { value: 'lainnya', label: 'Lainnya' },
];

const MARITAL_OPTIONS = [
  { value: 'single', label: 'Belum Menikah' },
  { value: 'married', label: 'Menikah' },
  { value: 'divorced', label: 'Cerai' },
];

const RELIGION_OPTIONS = [
  { value: 'islam', label: 'Islam' },
  { value: 'kristen', label: 'Kristen' },
  { value: 'katolik', label: 'Katolik' },
  { value: 'hindu', label: 'Hindu' },
  { value: 'budha', label: 'Buddha' },
  { value: 'konghucu', label: 'Konghucu' },
  { value: 'lainnya', label: 'Lainnya' },
];

const PROVINCE_OPTIONS = [
  { value: 'jakarta', label: 'DKI Jakarta' },
  { value: 'jabar', label: 'Jawa Barat' },
  { value: 'jateng', label: 'Jawa Tengah' },
  { value: 'jatim', label: 'Jawa Timur' },
  { value: 'bali', label: 'Bali' },
];

const CITY_OPTIONS = [
  { value: 'jakarta_selatan', label: 'Jakarta Selatan' },
  { value: 'bandung', label: 'Bandung' },
  { value: 'semarang', label: 'Semarang' },
  { value: 'surabaya', label: 'Surabaya' },
  { value: 'denpasar', label: 'Denpasar' },
];

const DISTRICT_OPTIONS = [
  { value: 'kebayoran', label: 'Kebayoran Baru' },
  { value: 'coblong', label: 'Coblong' },
  { value: 'tembalang', label: 'Tembalang' },
  { value: 'gubeng', label: 'Gubeng' },
  { value: 'denpasar_barat', label: 'Denpasar Barat' },
];

const INITIAL_FORM = {
  first_name: '',
  last_name: '',
  birth_place: '',
  date_of_birth: '',
  nik: '',
  education: '',
  gender: '',
  profession: '',
  marital_status: '',
  religion: '',
  province: '',
  city: '',
  district: '',
  rt_rw: '',
  address: '',
  phone: '',
  email: '',
  weight: '',
  height: '',
  blood_type: '',
  skin_history: '',
  medical_beauty_history: '',
  lifestyle: '',
  vitals: '',
};

function DateField({ id, label, value, onChange }) {
  const [inputType, setInputType] = useState(value ? 'date' : 'text');

  useEffect(() => {
    if (value) setInputType('date');
  }, [value]);

  return (
    <FloatInput
      id={id}
      label={label}
      type={inputType}
      value={value}
      onChange={onChange}
      onFocus={() => setInputType('date')}
      onBlur={() => { if (!value) setInputType('text'); }}
    />
  );
}

export default function PasienRegisterPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [photoFile, setPhotoFile] = useState(null);

  const previewUrl = useMemo(() => {
    if (!photoFile) return '';
    return URL.createObjectURL(photoFile);
  }, [photoFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <PageLayout currentPath="/template/pasien">
      <div className="flex items-center gap-3 mb-5">
        <BackButton onClick={() => router.get('/template/pasien')} />
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif' }}>
          Registrasi Pasien
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Info Pasien</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FloatInput
              id="patient-first-name"
              label="Nama Depan *"
              placeholder="Masukkan nama depan"
              value={form.first_name}
              onChange={(e) => setField('first_name', e.target.value)}
            />
            <FloatInput
              id="patient-last-name"
              label="Nama Belakang *"
              placeholder="Masukkan nama belakang"
              value={form.last_name}
              onChange={(e) => setField('last_name', e.target.value)}
            />
            <FloatInput
              id="patient-birth-place"
              label="Tempat Lahir *"
              placeholder="Masukkan tempat lahir"
              value={form.birth_place}
              onChange={(e) => setField('birth_place', e.target.value)}
            />
            <DateField
              id="patient-date-of-birth"
              label="Tanggal Lahir *"
              value={form.date_of_birth}
              onChange={(e) => setField('date_of_birth', e.target.value)}
            />
            <FloatInput
              id="patient-nik"
              label="NIK *"
              placeholder="Masukkan NIK"
              value={form.nik}
              onChange={(e) => setField('nik', e.target.value)}
              inputMode="numeric"
            />
            <FloatSelect
              id="patient-education"
              label="Pendidikan Terakhir *"
              options={EDUCATION_OPTIONS}
              value={form.education}
              onChange={(value) => setField('education', value)}
            />
            <FloatSelect
              id="patient-gender"
              label="Jenis Kelamin *"
              options={GENDER_OPTIONS}
              value={form.gender}
              onChange={(value) => setField('gender', value)}
            />
            <FloatSelect
              id="patient-profession"
              label="Profesi *"
              options={PROFESSION_OPTIONS}
              value={form.profession}
              onChange={(value) => setField('profession', value)}
            />
            <FloatSelect
              id="patient-marital"
              label="Status *"
              options={MARITAL_OPTIONS}
              value={form.marital_status}
              onChange={(value) => setField('marital_status', value)}
            />
            <FloatSelect
              id="patient-religion"
              label="Agama *"
              options={RELIGION_OPTIONS}
              value={form.religion}
              onChange={(value) => setField('religion', value)}
            />
          </div>

          <div className="mt-6">
            <PhotoUpload
              label="Foto Customer *"
              previewUrl={previewUrl}
              onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
              inputId="patient-photo"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Alamat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FloatSelect
              id="patient-province"
              label="Provinsi *"
              options={PROVINCE_OPTIONS}
              value={form.province}
              onChange={(value) => setField('province', value)}
            />
            <FloatSelect
              id="patient-city"
              label="Kabupaten/Kota *"
              options={CITY_OPTIONS}
              value={form.city}
              onChange={(value) => setField('city', value)}
            />
            <FloatSelect
              id="patient-district"
              label="Kecamatan *"
              options={DISTRICT_OPTIONS}
              value={form.district}
              onChange={(value) => setField('district', value)}
            />
            <FloatInput
              id="patient-rt-rw"
              label="RT/RW *"
              placeholder="Masukkan RT/RW"
              value={form.rt_rw}
              onChange={(e) => setField('rt_rw', e.target.value)}
            />
          </div>

          <div className="mt-4">
            <FloatInput
              id="patient-address"
              label="Alamat *"
              placeholder="Masukkan alamat rumah anda"
              value={form.address}
              onChange={(e) => setField('address', e.target.value)}
              multiline
              rows={3}
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Kontak</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FloatInput
              id="patient-phone"
              label="No. Telepon *"
              placeholder="Masukkan no handphone"
              value={form.phone}
              onChange={(e) => setField('phone', e.target.value)}
              inputMode="numeric"
            />
            <FloatInput
              id="patient-email"
              label="Email *"
              placeholder="Masukkan email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Medical Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FloatInput
              id="patient-weight"
              label="Berat Badan"
              placeholder="Masukkan berat badan"
              value={form.weight}
              onChange={(e) => setField('weight', e.target.value)}
              inputMode="numeric"
            />
            <FloatInput
              id="patient-height"
              label="Tinggi Badan"
              placeholder="Masukkan tinggi badan"
              value={form.height}
              onChange={(e) => setField('height', e.target.value)}
              inputMode="numeric"
            />
            <FloatInput
              id="patient-blood"
              label="Golongan Darah"
              placeholder="Masukkan golongan darah"
              value={form.blood_type}
              onChange={(e) => setField('blood_type', e.target.value)}
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Riwayat Kesehatan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FloatInput
              id="patient-skin-history"
              label="Riwayat Kesehatan Kulit"
              value={form.skin_history}
              onChange={(e) => setField('skin_history', e.target.value)}
              multiline
              rows={4}
              placeholder="Share your thoughts"
            />
            <FloatInput
              id="patient-medical-beauty"
              label="Riwayat Medis terkait Kecantikan"
              value={form.medical_beauty_history}
              onChange={(e) => setField('medical_beauty_history', e.target.value)}
              multiline
              rows={4}
              placeholder="Share your thoughts"
            />
            <FloatInput
              id="patient-lifestyle"
              label="Gaya Hidup yang Mempengaruhi Kulit"
              value={form.lifestyle}
              onChange={(e) => setField('lifestyle', e.target.value)}
              multiline
              rows={4}
              placeholder="Share your thoughts"
            />
            <FloatInput
              id="patient-vitals"
              label="Tanda Vital & Pemeriksaan Fisik Singkat"
              value={form.vitals}
              onChange={(e) => setField('vitals', e.target.value)}
              multiline
              rows={4}
              placeholder="Share your thoughts"
            />
          </div>
        </Card>

        <FormActions
          id="employee-form-actions"
          onCancel={() => router.get('/template/pasien')}
          onSubmit={handleSubmit}
          cancelText="Batalkan"
          submitText="Simpan"
        />
      </form>
    </PageLayout>
  );
}
