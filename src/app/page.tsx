import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import FeatureCards from "@/components/feature-cards";
import ImpactMetrics from "@/components/impact-metrics";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <FeatureCards />
      <ImpactMetrics />
      <Footer />
    </main>
  );
}
