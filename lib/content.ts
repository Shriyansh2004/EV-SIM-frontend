import rawContent from "@/content/site-content.json";
import {
  ASSET_BASE_URL,
  GITHUB_BACKEND_URL,
  GITHUB_FRONTEND_LABEL,
  GITHUB_FRONTEND_URL,
  REFERENCE_LINKS,
} from "@/lib/env";
import type { EvPreset } from "@/types";

export type SiteContent = typeof rawContent;

export const content = rawContent as SiteContent;

/** Resolves a path or full URL to a final asset URL (supports S3 / CDN). */
export function resolveAssetUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const jsonBase = content.assets.baseUrl?.replace(/\/$/, "");
  const base = ASSET_BASE_URL || jsonBase;

  if (!base) {
    return path;
  }

  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getImageUrl(key: keyof SiteContent["assets"]["images"]): string {
  return resolveAssetUrl(content.assets.images[key].url);
}

export function getImageAlt(key: keyof SiteContent["assets"]["images"]): string {
  const image = content.assets.images[key];
  return "alt" in image && image.alt ? image.alt : content.site.name;
}

export function getModelUrl(key: keyof SiteContent["assets"]["models"]): string {
  return resolveAssetUrl(content.assets.models[key].url);
}

export function isRemoteAsset(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

/** Interpolate {{dot.path}} placeholders using site content values. */
export function interpolate(template: string, extra: Record<string, string | number> = {}): string {
  const vars: Record<string, string | number> = {
    year: new Date().getFullYear(),
    "site.name": content.site.name,
    "site.license": content.site.license,
    "site.tagline": content.site.tagline,
    "external.github.frontend": GITHUB_FRONTEND_URL,
    "external.github.backend": GITHUB_BACKEND_URL,
    ...extra,
  };

  return template.replace(/\{\{([^}]+)\}\}/g, (_, key: string) => {
    const trimmed = key.trim();
    return String(vars[trimmed] ?? "");
  });
}

export function resolveLinkHref(href: string): string {
  return interpolate(href);
}

export const EV_PRESETS = content.evPresets as EvPreset[];

export { GITHUB_FRONTEND_URL, GITHUB_BACKEND_URL, GITHUB_FRONTEND_LABEL, REFERENCE_LINKS };
