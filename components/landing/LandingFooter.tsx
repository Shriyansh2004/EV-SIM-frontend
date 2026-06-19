import Link from "next/link";
import Image from "next/image";
import { GITHUB_BACKEND_URL, GITHUB_FRONTEND_URL } from "@/lib/github";

const PRODUCT_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/chargers", label: "Chargers" },
  { href: "/ocpp-explorer", label: "OCPP Explorer" },
  { href: "/sessions", label: "Sessions" },
];

const RESOURCE_LINKS = [
  { href: "/learn", label: "Documentation" },
  { href: `${GITHUB_BACKEND_URL}#readme`, label: "Setup Backend", external: true },
  { href: `${GITHUB_FRONTEND_URL}#readme`, label: "Setup Dashboard", external: true },
];

const REFERENCE_LINKS = [
  {
    href: "https://github.com/citrineos/citrineos-core",
    label: "citrineos-core",
  },
  {
    href: "https://github.com/solidstudiosh/ocpp-virtual-charge-point",
    label: "vcp of solidstudio",
  },
  {
    href: "https://github.com/EVerest/everest",
    label: "everestev",
  },
];

export function LandingFooter() {
  return (
    <footer className="bg-lp-dark border-t border-white/10">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="EV-SIM"
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
              />
              <span className="font-lp-display font-semibold text-white text-sm">EV-SIM</span>
            </Link>
            <p className="mt-3 text-sm text-lp-grey-300 leading-relaxed max-w-xs">
              Full-stack EV charging simulation for protocol engineers and CSMS developers.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-lp-mono uppercase tracking-wider text-lp-grey-300 mb-4">
              Product
            </h3>
            <ul className="space-y-2.5">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-lp-grey-300/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-lp-mono uppercase tracking-wider text-lp-grey-300 mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-lp-grey-300/80 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-lp-grey-300/80 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
              <li className="pt-2">
                <p className="text-xs font-lp-mono uppercase tracking-wider text-lp-grey-300 mb-2">
                  Reference:
                </p>
                <ul className="space-y-2.5">
                  {REFERENCE_LINKS.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-lp-grey-300/80 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-lp-mono uppercase tracking-wider text-lp-grey-300 mb-4">
              Connect
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={GITHUB_BACKEND_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-lp-grey-300/80 hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-lp-mono text-lp-grey-300/60">
            © {new Date().getFullYear()} EV-SIM. MIT License.
          </p>
          <p className="text-xs font-lp-mono text-lp-grey-300/60">OCPP 2.0.1 · WebSocket</p>
        </div>
      </div>
    </footer>
  );
}
