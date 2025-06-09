import { Inter } from "next/font/google";
import { Footer } from "@/components/homepage/Footer";

const inter = Inter({ subsets: ["latin"] });

export default function UploadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex-grow bg-gray-50">{children}</div>
      <Footer />
    </>
  );
}
