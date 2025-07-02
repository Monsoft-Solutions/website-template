import {
  pgTable,
  uuid,
  varchar,
  integer,
  foreignKey,
} from "drizzle-orm/pg-core";
import { servicePricingTiers } from "./service-pricing-tier.table";

/**
 * Service pricing tier features table
 * Stores individual features for each pricing tier
 */
export const servicePricingFeatures = pgTable(
  "service_pricing_features",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pricingTierId: uuid("pricing_tier_id").notNull(),
    feature: varchar("feature", { length: 255 }).notNull(),
    order: integer("order").notNull(),
  },
  (table) => ({
    pricingTierFk: foreignKey({
      columns: [table.pricingTierId],
      foreignColumns: [servicePricingTiers.id],
      name: "service_pricing_features_pricing_tier_id_fk",
    }),
  })
);
