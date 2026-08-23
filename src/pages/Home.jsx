import AboutSection from "../components/AboutSection";
import ApproachSection from "../components/ApproachSection";
import ClosingCTA from "../components/ClosingCTA";
import Footer from "../components/Footer";
import Hero from "../components/HeroSection";
import ProjectsSection from "../components/ProjectsSection";
import QuickFactsSection from "../components/QuickFactsSection";
import ServicesSection from "../components/ServicesSection";
import SkillsSection from "../components/SkillsSection";

function Home() {
  return (
    <main id="main-content">
      <Hero />
      <QuickFactsSection />
      <AboutSection />
      <ServicesSection />
      <SkillsSection />
      <ProjectsSection />
      <ApproachSection />
      <ClosingCTA />
      <Footer />
    </main>
  );
}

export default Home;
