import SoilCarbonSection from "@/components/homepage/SoilCarbonSection";
import FeaturesSection from "@/components/homepage/FeaturesSection";
import CtaSection from "@/components/homepage/CtaSection";
import HeroSection from "@/components/homepage/HeroSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <FeaturesSection />
      <SoilCarbonSection />
      <CtaSection />
    </main>
  );
}
