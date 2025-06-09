import { Upload, LineChart, Globe } from "lucide-react";

const features = [
  {
    name: "Simple Upload",
    description:
      "Upload your CSV files containing NIR spectral data and let our system handle the analysis. No specialized knowledge required.",
    icon: Upload,
  },
  {
    name: "Advanced Analysis",
    description:
      "Our advanced algorithms process your data using sophisticated models to predict soil carbon levels with high accuracy.",
    icon: LineChart,
  },
  {
    name: "Cloud-Based Platform",
    description:
      "Access your data and results from anywhere. Our Azure-backed platform ensures your information is secure and always available.",
    icon: Globe,
  },
];

export default function FeaturesSection() {
  return (
    <section id="about" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-base font-semibold leading-7 text-green-600">
            Simple. Fast. Accurate.
          </h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
            Making soil carbon analysis accessible
          </p>
          <p className="mt-6 text-lg/8 text-gray-600">
            CarbonSense transforms how we measure soil carbon in coastal
            wetlands using Near-Infrared (NIR) spectroscopy, making the process
            faster, more affordable, and accessible to everyone.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="text-base/7 font-semibold text-gray-900">
                  <div className="mb-6 flex size-10 items-center justify-center rounded-lg bg-green-600">
                    <feature.icon
                      aria-hidden="true"
                      className="size-6 text-white"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base/7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
