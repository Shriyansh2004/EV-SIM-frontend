import Image, { type ImageProps } from "next/image";
import { getImageAlt, getImageUrl, isRemoteAsset } from "@/lib/content";

type SiteImageKey = "logo" | "favicon";

type SiteImageProps = Omit<ImageProps, "src" | "alt"> & {
  asset: SiteImageKey;
  alt?: string;
};

export function SiteImage({ asset, alt, ...props }: SiteImageProps) {
  const src = getImageUrl(asset);
  const resolvedAlt = alt ?? getImageAlt(asset);

  return (
    <Image
      src={src}
      alt={resolvedAlt}
      unoptimized={isRemoteAsset(src)}
      {...props}
    />
  );
}
