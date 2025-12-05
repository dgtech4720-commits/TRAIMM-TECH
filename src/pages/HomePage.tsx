
import { HeroSection } from "../components/sections/HeroSection";
import { ServicesSection } from "../components/sections/ServicesSection";
import { HowItWorksSection } from "../components/sections/HowItWorksSection";
import { FAQ } from "../components/sections/FAQ";
import { Contact } from "../components/sections/Contact";

const HomePage = () => {
  return (
      <main className="bg-gray-900 min-h-screen">
        <HeroSection />
        <ServicesSection />
        <HowItWorksSection />
        <FAQ />
        <Contact />
      </main>
  );
};

export default HomePage;