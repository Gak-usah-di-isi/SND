import { usePage } from '@inertiajs/react';

function LeftSidebarPart({ tagline }) {
  return (
    <div className="flex xl:justify-start justify-center xl:ps-32 xl:pt-28 h-screen items-start z-10 relative">
      <div className="max-w-lg">
        <p className="opacity-90 text-white my-4 text-4xl font-medium tracking-wide">
          {tagline}
        </p>
      </div>
    </div>
  );
}

export default function AuthLayout({ tagline, bgImage, children }) {
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
          <LeftSidebarPart tagline={tagline} />
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
