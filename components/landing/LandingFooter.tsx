import Link from "next/link";
import { SiteImage } from "@/components/ui/SiteImage";
import { content, interpolate, resolveLinkHref } from "@/lib/content";

export function LandingFooter() {
  const { site } = content;
  const { footer } = content.landing;
  const { footer: footerNav } = content.navigation;

  return (
    <footer className="bg-lp-dark border-t border-white/10">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <SiteImage
                asset="logo"
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
              />
              <span className="font-lp-display font-semibold text-white text-sm">{site.name}</span>
            </Link>
            <p className="mt-3 text-sm text-lp-grey-300 leading-relaxed max-w-xs">
              {footer.blurb}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-lp-mono uppercase tracking-wider text-lp-grey-300 mb-4">
              {footerNav.productHeading}
            </h3>
            <ul className="space-y-2.5">
              {footerNav.product.map((link) => (
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
              {footerNav.resourcesHeading}
            </h3>
            <ul className="space-y-2.5">
              {footerNav.resources.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={resolveLinkHref(link.href)}
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
                  {footerNav.referenceHeading}
                </p>
                <ul className="space-y-2.5">
                  {content.external.references.map((link) => (
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
              {footerNav.connectHeading}
            </h3>
            <ul className="space-y-2.5">
              {footerNav.connect.map((link) => (
                <li key={link.href}>
                  <a
                    href={resolveLinkHref(link.href)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-lp-grey-300/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-lp-mono text-lp-grey-300/60">
            {interpolate(footer.copyright)}
          </p>
          <p className="text-xs font-lp-mono text-lp-grey-300/60">{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
