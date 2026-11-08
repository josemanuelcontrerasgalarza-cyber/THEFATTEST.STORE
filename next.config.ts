import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== "off" ? process.env.NEXT_PUBLIC_SUPABASE_URL : "https://dqzjwdcwblizhpaeertg.supabase.co";
const ga = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim());
const meta = Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim());

/**
 * Content-Security-Policy. Third-party origins are only allowed when the
 * matching tool is configured (and the tool itself still waits for consent).
 * 'unsafe-inline' for scripts is required by Next.js inline bootstrapping
 * without a nonce middleware; sources are still restricted to an allowlist.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://vercel.live${ga ? " https://www.googletagmanager.com" : ""}${meta ? " https://connect.facebook.net" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${ga ? " https://www.google-analytics.com https://www.googletagmanager.com" : ""}${meta ? " https://www.facebook.com" : ""}`,
  "font-src 'self' data:",
  `connect-src 'self' ${supabaseUrl} https://vercel.live${ga ? " https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com" : ""}${meta ? " https://www.facebook.com https://connect.facebook.net" : ""}${isDev ? " ws:" : ""}`,
  "frame-src https://vercel.live",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  images: {
    // Unsplash's CDN resizes/compresses on the fly, so we use a custom loader
    // instead of proxying every image through the Next.js server.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/info/privacidad", destination: "/politica-de-privacidad", permanent: true },
      { source: "/info/terminos", destination: "/terminos-y-condiciones", permanent: true },
      { source: "/info/cambios", destination: "/cambios-y-devoluciones", permanent: true },
      { source: "/info/cookies", destination: "/politica-de-cookies", permanent: true },
    ];
  },
};

export default nextConfig;
