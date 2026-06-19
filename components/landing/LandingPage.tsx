import { LandingNavbar } from "./LandingNavbar";
import { HeroSection } from "./HeroSection";
import { LandingFooter } from "./LandingFooter";

export function LandingPage() {
  return (
    <div className="landing-page min-h-screen">
      <LandingNavbar />
      <main>
        <HeroSection />
      </main>
      <LandingFooter />
    </div>
  );
}
