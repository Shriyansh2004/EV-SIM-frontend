import Link from "next/link";
import { Hero3DVisual } from "./hero3d/Hero3DVisual";
import { content, resolveLinkHref } from "@/lib/content";

export function HeroSection() {
  const { hero } = content.landing;

  return (
    <section className="pt-28 pb-16 md:pt-32 md:pb-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="font-lp-mono text-[13px] text-lp-grey-600 mb-4 tracking-wide">
              {hero.eyebrow}
            </p>
            <h1 className="font-lp-display font-bold text-lp-grey-900 text-[2.5rem] sm:text-5xl lg:text-[3.5rem] leading-[1.08] tracking-[-0.03em]">
              {hero.headline}{" "}
              <span className="text-lp-orange">{hero.headlineAccent}</span>
            </h1>
            <p className="mt-6 text-lg text-lp-grey-600 leading-relaxed max-w-lg">
              {hero.body}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={hero.primaryCta.href} className="landing-btn-primary">
                {hero.primaryCta.label}
              </Link>
              <a
                href={resolveLinkHref(hero.secondaryCta.href)}
                target="_blank"
                rel="noopener noreferrer"
                className="landing-btn-secondary"
              >
                {hero.secondaryCta.label}
              </a>
            </div>
          </div>

          <Hero3DVisual />
        </div>
      </div>
    </section>
  );
}
