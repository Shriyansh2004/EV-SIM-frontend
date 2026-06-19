import Link from "next/link";
import Image from "next/image";

export function LandingNavbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-lp-surface/95 backdrop-blur-sm border-b border-lp-grey-300">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 h-16 flex items-center">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/logo.png"
            alt="EV-SIM"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
            priority
          />
          <span className="font-lp-display font-semibold text-lp-grey-900 text-[15px] tracking-tight hidden sm:block">
            EV-SIM
          </span>
        </Link>
      </div>
    </header>
  );
}
