import { Database, LineChart, Upload, Leaf } from "lucide-react";

export default function SoilCarbonSection() {
  return (
    <section className="relative isolate overflow-hidden bg-white py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="absolute hidden lg:block top-40 left-[max(6rem,33%)] -z-10 transform-gpu blur-3xl sm:left-1/2 lg:ml-20 xl:top-52 xl:ml-56"
      >
        <div
          style={{
            clipPath:
              "polygon(63.1% 29.6%, 100% 17.2%, 76.7% 3.1%, 48.4% 0.1%, 44.6% 4.8%, 54.5% 25.4%, 59.8% 49.1%, 55.3% 57.9%, 44.5% 57.3%, 27.8% 48%, 35.1% 81.6%, 0% 97.8%, 39.3% 100%, 35.3% 81.5%, 97.2% 52.8%, 63.1% 29.6%)",
          }}
          className="aspect-801/1036 w-[50.0625rem] bg-linear-to-tr from-[#34d399] to-[#059669] opacity-30"
        />
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <p className="text-base/7 font-semibold text-green-600">
            Understanding Our Technology
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
            The Science Behind Soil Carbon Analysis
          </h1>
          <p className="mt-6 text-xl/8 text-gray-700">
            Soil carbon plays a vital role in maintaining healthy ecosystems and
            effective agricultural practices. Our platform uses Near-Infrared
            (NIR) spectroscopy to provide fast, affordable soil carbon analysis
            for coastal wetlands.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:mt-10 lg:max-w-none lg:grid-cols-12">
          <div className="relative lg:order-last lg:col-span-5">
            <figure className="border-l border-green-600 pl-8">
              <blockquote className="text-xl/8 font-semibold tracking-tight text-gray-900">
                <p>
                  "Soil carbon is a key asset for food production and economic
                  stability. In Australia, particularly in Queensland, higher
                  levels of soil organic carbon contribute to increased soil
                  fertility and help safeguard against crop yield losses during
                  droughts."
                </p>
              </blockquote>
              <figcaption className="mt-8 flex gap-x-4">
                <div className="mt-1 size-10 flex-none rounded-full bg-green-100 flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-sm/6">
                  <div className="font-semibold text-gray-900">
                    Environment and Liveability Strategy
                  </div>
                  <div className="text-gray-600">
                    Sunshine Coast Council, 2024
                  </div>
                </div>
              </figcaption>
            </figure>
          </div>
          <div className="max-w-xl text-base/7 text-gray-700 lg:col-span-7">
            <p>
              Soil carbon enhances soil quality by improving structure, boosting
              water retention, and increasing the availability of essential
              nutrients. It supports rich microbial communities and serves as a
              natural carbon sink, helping to mitigate climate change by
              capturing atmospheric carbon dioxide.
            </p>
            <ul className="mt-8 max-w-xl space-y-8 text-gray-600">
              <li className="flex gap-x-3">
                <Database
                  aria-hidden="true"
                  className="mt-1 size-5 flex-none text-green-600"
                />
                <span>
                  <strong className="font-semibold text-gray-900">
                    NIR Spectrometry.
                  </strong>{" "}
                  Our platform analyzes Near Infrared (NIR) spectral data
                  (900-1700 nm range) from soil samples. We do not sell or
                  provide NIR spectrometers - you'll need your own device that
                  can export data in CSV format.
                </span>
              </li>
              <li className="flex gap-x-3">
                <Upload
                  aria-hidden="true"
                  className="mt-1 size-5 flex-none text-green-600"
                />
                <span>
                  <strong className="font-semibold text-gray-900">
                    Simple Process.
                  </strong>{" "}
                  After taking soil readings with your NIR device, export the
                  data as a CSV file, then upload it to our platform. Our
                  cloud-based system handles all the complex analysis and
                  delivers accurate carbon percentage results.
                </span>
              </li>
              <li className="flex gap-x-3">
                <LineChart
                  aria-hidden="true"
                  className="mt-1 size-5 flex-none text-green-600"
                />
                <span>
                  <strong className="font-semibold text-gray-900">
                    Advanced Analysis.
                  </strong>{" "}
                  Our advanced algorithms apply sophisticated smoothing
                  techniques and predictive models to your spectral data,
                  producing accurate soil carbon measurements without expensive
                  lab testing.
                </span>
              </li>
            </ul>
            <p className="mt-8">
              By making soil carbon analysis accessible, we support regenerative
              agriculture, wetland restoration projects, and help landowners
              identify new potential uses for agricultural lands. This
              accessibility is crucial as climate change and sea level rise
              continue to impact coastal wetlands.
            </p>
            <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
              Supporting Climate Resilience
            </h2>
            <p className="mt-6">
              Understanding soil organic carbon behavior is essential for
              climate adaptation, land use planning, and disaster mitigation.
              Our platform aligns with initiatives like the Sunshine Coast
              Council's Environment and Liveability Strategy, which aims to
              ensure a healthy, resilient region by making advanced soil carbon
              measurement technology accessible to everyone.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
