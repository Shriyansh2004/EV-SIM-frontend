/** Reads frontend config from environment variables (see `.env.local`). */

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optional(name: string): string {
  return process.env[name]?.trim() ?? "";
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/$/, "");
}

export const API_BASE = required("NEXT_PUBLIC_API_URL");

export const WS_URL = required("NEXT_PUBLIC_WS_URL");

export const ASSET_BASE_URL = trimTrailingSlash(optional("NEXT_PUBLIC_ASSET_BASE_URL"));

export const GITHUB_FRONTEND_URL = required("NEXT_PUBLIC_GITHUB_FRONTEND_URL");

export const GITHUB_BACKEND_URL = required("NEXT_PUBLIC_GITHUB_BACKEND_URL");

export const GITHUB_FRONTEND_LABEL =
  optional("NEXT_PUBLIC_GITHUB_FRONTEND_LABEL") ||
  GITHUB_FRONTEND_URL.replace(/^https?:\/\//, "");

export const DEMO_ID_TOKEN = required("NEXT_PUBLIC_DEMO_ID_TOKEN");

export const REFERENCE_LINKS = [
  {
    label: "citrineos-core",
    href: required("NEXT_PUBLIC_REF_CITRINEOS_URL"),
  },
  {
    label: "vcp of solidstudio",
    href: required("NEXT_PUBLIC_REF_VCP_URL"),
  },
  {
    label: "everestev",
    href: required("NEXT_PUBLIC_REF_EVEREST_URL"),
  },
] as const;
