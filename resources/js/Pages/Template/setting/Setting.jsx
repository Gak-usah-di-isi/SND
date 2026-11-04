import { useState, useRef } from 'react';
import { Plus, Save } from 'lucide-react';
import PageLayout from '../../../Components/ui/shared/PageLayout';

const DAYS = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'];

const FEATURES = [
  'Appointment Booking','CRM Admin','Rekam Medis Elektronik (EMR)','Stok Medis Basic',
  'Pasien mobile app','Resep Elektronik','Reporting / Dashboards','Multi-cabang',
  'WhatsApp call assistance','Stok Medis Advanced','Marketing lead-generation',
  'e-Signatures / month','Staff Users','Batas rekam medis pasien','Biaya setup (1x bayar)','Harga bulanan',
];
const PLANS = [
  { name:'Starter', highlight:true,  values:['✓','✓','✓','✓','✓','Tambahan','Tambahan','Tambahan','Tambahan','Tambahan','Tambahan','100','Up to 5','1.000','Rp. 1jt','Rp.3.5jt'] },
  { name:'Growth',  highlight:false, values:['✓','✓','✓','✓','✓','✓','✓','✓','Tambahan','-','Tambahan','250','Up to 5','2.000','Rp. 2jt','Rp. 8.4jt'] },
  { name:'Pro',     highlight:false, values:['✓','✓','✓','✓','✓','✓','✓','✓','✓','✓','Tambahan','500','Up to 10','5.000','Rp. 3jt','Rp. 12jt'] },
  { name:'Custom',  highlight:false, values:['✓','✓','✓','✓','✓','✓','✓','✓','✓','✓','Custom','Unlimited','Unlimited','Custom','Custom','Custom'] },
];

function InputField({ label, id, placeholder, type = 'text' }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
      <input id={id} type={type} placeholder={placeholder}
        className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all bg-white" />
    </div>
  );
}

function PhotoUploader({ label }) {
  const [preview, setPreview] = useState(null);
  const ref = useRef();
  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <div
        onClick={() => ref.current?.click()}
        className="w-48 h-48 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors hover:border-blue-400 hover:bg-blue-50"
      >
        {preview
          ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
          : <>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                <Plus size={24} className="text-blue-400" />
              </div>
              <p className="text-xs text-gray-400 text-center px-4">Format JPG atau PNG, maks 2MB</p>
            </>
        }
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      </div>
    </div>
  );
}

function PersonalTab() {
  const [passcode, setPasscode] = useState(['','','','']);
  const refs = useRef([]);
  const handlePasscode = (i, val) => {
    if (val && !/^\d$/.test(val)) return;
    const next = [...passcode]; next[i] = val; setPasscode(next);
    if (val && i < 3) refs.current[i+1]?.focus();
  };
  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !passcode[i] && i > 0) refs.current[i-1]?.focus();
  };
  return (
    <div className="bg-white p-6" style={{ borderRadius: '12px', boxShadow: '0px 2px 4px -1px rgba(175,182,201,0.2)' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputField label="Nama"  id="p-name"  placeholder="Masukkan nama" />
        <InputField label="No Hp" id="p-phone" placeholder="Masukkan nomor hp" />
        <InputField label="Email" id="p-email" placeholder="Masukkan email" type="email" />
        <InputField label="Alamat" id="p-addr" placeholder="Masukkan alamat" />
      </div>
      <div className="mt-5">
        <p className="text-sm font-medium text-gray-700 mb-2">Passcode</p>
        <div className="flex items-center gap-3 flex-wrap">
          {passcode.map((d, i) => (
            <input key={i} ref={el => refs.current[i] = el} value={d}
              onChange={e => handlePasscode(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              maxLength={1} inputMode="numeric"
              className="w-12 h-12 border border-gray-200 rounded-md text-center text-lg font-semibold text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 bg-white" />
          ))}
          <button className="px-3 py-2 text-sm font-medium rounded-md" style={{ backgroundColor: 'rgba(1,82,234,0.1)', color: '#0152EA', borderRadius: '9px' }}>Hapus Passcode</button>
          <button className="px-3 py-2 text-sm font-medium text-white rounded-md" style={{ backgroundColor: '#0152EA', borderRadius: '9px' }}>Simpan Passcode</button>
        </div>
      </div>
      <div className="mt-5">
        <PhotoUploader label="Ganti Foto" />
      </div>
      <div className="flex justify-end mt-6">
        <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-md" style={{ backgroundColor: '#0152EA', borderRadius: '9px' }}>
          <Save size={16} /> Simpan
        </button>
      </div>
    </div>
  );
}

function ClinicTab() {
  return (
    <div className="bg-white p-6" style={{ borderRadius: '12px', boxShadow: '0px 2px 4px -1px rgba(175,182,201,0.2)' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputField label="Nama Klinik"   id="c-name"  placeholder="Masukkan nama klinik" />
        <InputField label="No Telephone"  id="c-phone" placeholder="Masukkan nomor telephone" />
        <InputField label="Email"         id="c-email" placeholder="Masukkan email" type="email" />
        <InputField label="Alamat"        id="c-addr"  placeholder="Masukkan alamat" />
      </div>
      <div className="mt-5">
        <PhotoUploader label="Tambah Logo" />
      </div>
      <div className="flex justify-end mt-6">
        <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-md" style={{ backgroundColor: '#0152EA', borderRadius: '9px' }}>
          <Save size={16} /> Simpan
        </button>
      </div>
    </div>
  );
}

function WorkHourTab() {
  const [days, setDays] = useState(DAYS.map((d, i) => ({ day: d, active: i < 5, open: '08:00', close: '17:00' })));
  const toggle = (i) => setDays(prev => prev.map((d, idx) => idx === i ? { ...d, active: !d.active } : d));
  const update = (i, key, val) => setDays(prev => prev.map((d, idx) => idx === i ? { ...d, [key]: val } : d));
  return (
    <div className="bg-white p-6" style={{ borderRadius: '12px', boxShadow: '0px 2px 4px -1px rgba(175,182,201,0.2)' }}>
      <p className="font-semibold text-gray-800 mb-4">Jam Kerja Klinik</p>
      <div className="space-y-3">
        {days.map((d, i) => (
          <div key={d.day} className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer w-28">
              <div onClick={() => toggle(i)} className="w-10 h-5 rounded-full transition-colors flex items-center px-0.5 cursor-pointer" style={{ backgroundColor: d.active ? '#0152EA' : '#E5E7EB' }}>
                <div className="w-4 h-4 bg-white rounded-full transition-transform shadow-sm" style={{ transform: d.active ? 'translateX(20px)' : 'translateX(0)' }} />
              </div>
              <span className="text-sm font-medium text-gray-700">{d.day}</span>
            </label>
            {d.active ? (
              <div className="flex items-center gap-2">
                <input type="time" value={d.open}  onChange={e => update(i, 'open',  e.target.value)} className="border border-gray-200 rounded-md px-3 py-1.5 text-sm outline-none focus:border-blue-400" />
                <span className="text-gray-400 text-sm">—</span>
                <input type="time" value={d.close} onChange={e => update(i, 'close', e.target.value)} className="border border-gray-200 rounded-md px-3 py-1.5 text-sm outline-none focus:border-blue-400" />
              </div>
            ) : (
              <span className="text-sm text-gray-400">Libur</span>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-6">
        <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-md" style={{ backgroundColor: '#0152EA', borderRadius: '9px' }}>
          <Save size={16} /> Simpan
        </button>
      </div>
    </div>
  );
}

function SubscriptionTab() {
  return (
    <div className="bg-white p-6 overflow-x-auto" style={{ borderRadius: '12px', boxShadow: '0px 2px 4px -1px rgba(175,182,201,0.2)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `minmax(200px,260px) repeat(4,minmax(180px,1fr))`, gap: 12, minWidth: 900 }}>
        <div className="py-2">
          <p className="font-bold text-gray-700 mb-6 text-right">FITUR</p>
          {FEATURES.map(f => (
            <p key={f} className="text-sm text-gray-500 py-3 border-b border-gray-50 text-right">{f}</p>
          ))}
        </div>
        {PLANS.map(plan => (
          <div key={plan.name} className="rounded-2xl overflow-hidden"
            style={plan.highlight ? { backgroundImage: 'linear-gradient(to top right,#104675,#79C7EE)' } : { backgroundColor: '#fff', border: '1px solid #f3f4f6' }}>
            <div className="relative p-5 pt-10 flex items-center justify-center">
              {plan.highlight && (
                <div className="absolute right-[-40px] top-[18px] text-xs font-bold text-white bg-green-500 px-10 py-1" style={{ transform: 'rotate(45deg)', width: 160, textAlign: 'center' }}>
                  Recommended
                </div>
              )}
              <p className="font-bold text-lg" style={{ color: plan.highlight ? '#fff' : '#2A3547' }}>{plan.name}</p>
            </div>
            {plan.values.map((v, i) => (
              <div key={i} className="py-3 text-center border-b text-sm" style={{ borderColor: plan.highlight ? 'rgba(255,255,255,0.08)' : '#f3f4f6', color: plan.highlight ? '#fff' : '#64748B', backgroundColor: plan.highlight && i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'transparent' }}>
                {v}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const TABS = ['Personal Information', 'Klinik Information', 'Jam Kerja', 'Subscription'];

export default function SettingPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <PageLayout currentPath="/template/pengaturan">
      <h1 className="font-bold text-gray-800 mb-6" style={{ fontSize: 22 }}>Setting</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {TABS.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)}
            className="px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px"
            style={{ borderColor: activeTab === i ? '#0152EA' : 'transparent', color: activeTab === i ? '#0152EA' : '#64748B' }}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && <PersonalTab />}
      {activeTab === 1 && <ClinicTab />}
      {activeTab === 2 && <WorkHourTab />}
      {activeTab === 3 && <SubscriptionTab />}
    </PageLayout>
  );
}
