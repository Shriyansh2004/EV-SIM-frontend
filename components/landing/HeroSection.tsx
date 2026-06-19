import Link from "next/link";
import { HeroBlockDiagram } from "./HeroBlockDiagram";
import { GITHUB_FRONTEND_URL } from "@/lib/github";

export function HeroSection() {
  return (
    <section className="pt-28 pb-16 md:pt-32 md:pb-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="font-lp-mono text-[13px] text-lp-grey-600 mb-4 tracking-wide">
              OCPP 2.0.1 · WebSocket
            </p>
            <h1 className="font-lp-display font-bold text-lp-grey-900 text-[2.5rem] sm:text-5xl lg:text-[3.5rem] leading-[1.08] tracking-[-0.03em]">
              Simulate EV Charging Infrastructure,{" "}
              <span className="text-lp-orange">End to End</span>
            </h1>
            <p className="mt-6 text-lg text-lp-grey-600 leading-relaxed max-w-lg">
              Spin up virtual EVs and charge points, plug in and run real OCPP 2.0.1 sessions over
              WebSocket to a live CSMS handler — and watch every protocol message as it happens.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/dashboard" className="landing-btn-primary">
                Launch Simulator
              </Link>
              <a
                href={GITHUB_FRONTEND_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="landing-btn-secondary"
              >
                View on GitHub
              </a>
            </div>
          </div>

          <HeroBlockDiagram />
        </div>
      </div>
    </section>
  );
}
