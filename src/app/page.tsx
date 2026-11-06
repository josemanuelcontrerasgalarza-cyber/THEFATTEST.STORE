import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { LatestDrop } from "@/components/home/LatestDrop";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { BrandStory } from "@/components/home/BrandStory";
import { SocialProof } from "@/components/home/SocialProof";
import { Services } from "@/components/home/Services";
import { siteConfig } from "@/lib/config";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: siteConfig.name,
    url: siteConfig.url,
    slogan: siteConfig.tagline,
    description: siteConfig.description,
    currenciesAccepted: "COP",
    areaServed: "CO",
    sameAs: [siteConfig.instagramUrl, siteConfig.tiktokUrl].filter(Boolean),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <Marquee listKey="marquee.a" />
      <LatestDrop />
      <Services />
      <CategoryGrid />
      <BrandStory />
      <Marquee inverted listKey="marquee.b" />
      <SocialProof />
    </>
  );
}
