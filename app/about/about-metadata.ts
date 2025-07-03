import { generateSeoMetadata } from "@/lib/config/seo";
import { Metadata } from "next";

export const metadata: Metadata = generateSeoMetadata({
  title: "About Us - Our Story, Mission & Team",
  description:
    "Discover our journey from startup to industry leader. Meet our passionate team, explore our mission to transform digital experiences, and learn about the values that drive everything we do.",
  keywords: [
    "about us",
    "company story",
    "team",
    "mission",
    "values",
    "culture",
    "leadership",
    "innovation",
    "digital transformation",
  ],
});
