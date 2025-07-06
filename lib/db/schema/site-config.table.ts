import {
  pgTable,
  uuid,
  varchar,
  text,
  jsonb,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

/**
 * Site configuration table for storing dynamic site settings
 * This replaces the hardcoded configuration from lib/config/site.ts
 */
export const siteConfigs = pgTable("site_configs", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Site basic information
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  ogImage: varchar("og_image", { length: 500 }).notNull(),

  // Social media links
  links: jsonb("links").notNull().$type<{
    twitter?: string;
    github?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  }>(),

  // Creator information
  creator: jsonb("creator").notNull().$type<{
    name: string;
    email: string;
    twitter?: string;
    url?: string;
  }>(),

  // SEO Keywords
  keywords: jsonb("keywords").notNull().$type<string[]>(),

  // Language and locale
  language: varchar("language", { length: 10 }).notNull(),
  locale: varchar("locale", { length: 20 }).notNull(),

  // Theme colors
  theme: jsonb("theme").notNull().$type<{
    primaryColor: string;
    secondaryColor: string;
  }>(),

  // Social media metadata
  socialMedia: jsonb("social_media").notNull().$type<{
    twitter: {
      card: string;
      site?: string;
      creator?: string;
    };
  }>(),

  // General metadata
  metadata: jsonb("metadata").notNull().$type<{
    generator: string;
    applicationName: string;
    referrer: string;
    authors: Array<{ name: string; url?: string }>;
    colorScheme: string;
    themeColor: Array<{ media: string; color: string }>;
    viewport: {
      width: string;
      initialScale: number;
      maximumScale: number;
      userScalable: boolean;
    };
    verification: {
      google?: string;
      yandex?: string;
      bing?: string;
    };
  }>(),

  // Control fields
  isActive: boolean("is_active").notNull().default(true),

  // Audit fields
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
