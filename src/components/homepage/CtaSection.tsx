import Link from "next/link";

export default function CtaSection() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="relative isolate overflow-hidden bg-green-950 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
          <h2 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
            Ready to analyze your soil data?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg/8 text-pretty text-white/70">
            Upload your CSV files and get accurate soil carbon predictions using
            our advanced NIR spectral analysis.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/analysis"
              className="rounded-full bg-white px-6 py-3 text-base font-semibold text-green-900 shadow-sm hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Analyze Data
            </Link>
          </div>
          <svg
            viewBox="0 0 1024 1024"
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -z-10 size-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
          >
            <circle
              r={512}
              cx={512}
              cy={512}
              fill="url(#green-gradient)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient id="green-gradient">
                <stop stopColor="#34d399" />
                <stop offset={1} stopColor="#059669" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
