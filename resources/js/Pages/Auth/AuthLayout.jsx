import { usePage } from '@inertiajs/react';

const DEFAULT_ABBREVIATION = 'Seminar DAMPAK';
const DEFAULT_TITLE = 'Seminar Nasional Pengabdian kepada Masyarakat dan Inovasi Terapan Fakultas Vokasi Universitas Brawijaya';
// Kepanjangan DAMPAK adalah identitas nama seminar, bukan data tahunan.
const ACRONYM = 'Diseminasi Aksi Masyarakat, Pengabdian, Aplikasi, dan Karya';

function LeftSidebarPart({ abbreviation, title }) {
  return (
    <div className="flex xl:justify-start justify-center xl:ps-32 xl:pt-28 h-screen items-start z-10 relative">
      <div className="max-w-xl text-white">
        <p className="text-5xl font-extrabold tracking-tight">{abbreviation || DEFAULT_ABBREVIATION}</p>
        <p className="mt-5 text-2xl font-medium leading-snug opacity-95">{title || DEFAULT_TITLE}</p>
        <p className="mt-4 text-lg leading-snug opacity-85">{ACRONYM}</p>
      </div>
    </div>
  );
}

export default function AuthLayout({ abbreviation, title, bgImage, children }) {
  const { authBgPath } = usePage().props;
  const background = bgImage || authBgPath || '/images/voks.webp';

  return (
    <div className="relative overflow-hidden h-screen">
      <div
        className="grid grid-cols-12 gap-3 h-full"
        style={{
          backgroundImage: `url('${background}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="xl:col-span-8 lg:col-span-6 col-span-12 lg:block hidden relative overflow-hidden">
          {/* Gradasi navy agar teks putih tetap terbaca di atas foto yang langitnya terang. */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#15224a]/85 via-[#15224a]/55 to-transparent" aria-hidden="true" />
          <LeftSidebarPart abbreviation={abbreviation} title={title} />
        </div>
        <div className="xl:col-span-4 lg:col-span-6 col-span-12 sm:px-12 lg:px-6 xl:px-3 py-3">
          <div className="flex h-full w-full items-center px-3 lg:justify-start justify-center rounded-lg bg-white">
            <div className="max-w-md w-full mx-auto">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
