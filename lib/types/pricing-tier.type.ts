/**
 * Represents a pricing tier for a service offering
 */
export type PricingTier = {
  /** Name of the pricing tier */
  readonly name: string;
  /** Price range or fixed price for this tier */
  readonly price: string;
  /** Description of what this tier includes */
  readonly description: string;
  /** List of features included in this tier */
  readonly features: readonly string[];
  /** Whether this tier is marked as popular/recommended */
  readonly popular?: boolean;
};
