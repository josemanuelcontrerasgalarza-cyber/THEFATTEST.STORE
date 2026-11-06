type LoaderArgs = { src: string; width: number; quality?: number };

/**
 * Next/Image loader.
 * - Unsplash: the CDN resizes + converts format on the fly.
 * - /products/*: pre-resized copies live in /products/sm (640px) for small slots.
 */
export default function imageLoader({ src, width, quality }: LoaderArgs): string {
  if (src.startsWith("https://images.unsplash.com/")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 75));
    url.searchParams.set("auto", "format");
    if (!url.searchParams.has("fit")) url.searchParams.set("fit", "crop");
    return url.toString();
  }
  if (src.startsWith("/products/") && !src.startsWith("/products/sm/")) {
    return width <= 640 ? src.replace("/products/", "/products/sm/") : `${src}?w=${width}`;
  }
  return src;
}
