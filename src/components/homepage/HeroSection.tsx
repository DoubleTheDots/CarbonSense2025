import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-emerald-950 text-white rounded-[3rem] min-h-screen border-10 border-white flex items-center justify-center">
      <Image
        alt="Image of a coastal wetland"
        src="/coastal_wetland.jpg"
        fill
        className="absolute inset-0 -z-10 size-full object-cover opacity-20 rounded-3xl"
        priority
      />
      <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
        <div className="max-w-5xl">
          <div className="text-left">
            <h1 className="text-5xl font-semibold tracking-tight leading-tight text-balance text-white sm:text-7xl lg:text-8xl sm:leading-tight">
              Soil Carbon Analysis
              <br className="hidden lg:block" /> Made Simple
            </h1>
            <p className="mt-8 text-base font-medium text-pretty text-white/70 sm:text-lg/8 max-w-2xl">
              A cloud-based platform for processing and analyzing Near Infrared
              (NIR) spectral data to estimate soil carbon in coastal wetlands.
              Making carbon analysis simple, fast, and affordable.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href="/analysis"
                className="rounded-full bg-white px-6 py-3.5 text-base font-semibold text-emerald-800 shadow-sm hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Analyze Data
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
