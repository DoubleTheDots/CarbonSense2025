import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="mt-8 md:mt-0 md:order-1">
          <p className="text-center text-xs leading-5 text-gray-500">
            &copy; {new Date().getFullYear()} UniSC CarbonSense. All rights
            reserved.
          </p>
        </div>
        <div className="flex justify-center space-x-6 md:order-2">
          <Link
            href="/"
            className="text-xs leading-5 text-gray-500 hover:text-gray-900"
          >
            Home
          </Link>
          <Link
            href="/analysis"
            className="text-xs leading-5 text-gray-500 hover:text-gray-900"
          >
            Analysis
          </Link>
          <span className="text-xs leading-5 text-gray-500">
            University of the Sunshine Coast
          </span>
        </div>
      </div>
    </footer>
  );
}
