export interface MarketStatistic {
  id: string;
  label: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease" | "neutral";
  description: string;
  source: string;
  sourceUrl: string;
  lastUpdated: string;
}

export interface MarketInsight {
  id: string;
  title: string;
  description: string;
  impact: "positive" | "negative" | "neutral";
  category: "pricing" | "inventory" | "demand" | "market-conditions";
}

/**
 * Current Cape Coral Real Estate Market Statistics
 * Data sources: Florida Realtors, Federal Reserve Economic Data, Local MLS
 * Last updated: January 2025
 */
export const marketStatistics: MarketStatistic[] = [
  {
    id: "median-price",
    label: "Median Home Price",
    value: "$365,000",
    change: "↓ 11.2%",
    changeType: "decrease",
    description: "Cape Coral median home price, 12.5% below state average",
    source: "Florida Custom Homes Market Report",
    sourceUrl:
      "https://www.floridacustomhomes.com/blog/cape-coral-florida-now-considered-buyers-market-february-2025/",
    lastUpdated: "January 2025",
  },
  {
    id: "days-on-market",
    label: "Average Days on Market",
    value: "59 days",
    change: "Faster than state (73 days)",
    changeType: "increase",
    description: "Homes selling faster than Florida average",
    source: "Florida Realtors Association",
    sourceUrl:
      "https://www.floridarealtors.org/newsroom/florida-realtorsr-2025-real-estate-trends-whats-ahead-flas-housing",
    lastUpdated: "January 2025",
  },
  {
    id: "inventory-levels",
    label: "Active Listings",
    value: "3,773",
    change: "↑ 25.3%",
    changeType: "increase",
    description: "More options available for buyers",
    source: "Cape Coral MLS Data",
    sourceUrl:
      "https://www.capecoralrealestatenow.com/Cape-Coral-Homes-for-Sale/home-values/",
    lastUpdated: "January 2025",
  },
  {
    id: "months-supply",
    label: "Months of Supply",
    value: "12.3 months",
    change: "↑ 24.2%",
    changeType: "increase",
    description: "Strong buyer's market conditions",
    source: "Market Analysis Report",
    sourceUrl:
      "https://www.floridacustomhomes.com/blog/cape-coral-florida-now-considered-buyers-market-february-2025/",
    lastUpdated: "January 2025",
  },
  {
    id: "mortgage-rates",
    label: "Average Mortgage Rate",
    value: "6.85%",
    change: "Stable from previous month",
    changeType: "neutral",
    description: "Competitive financing options available",
    source: "Freddie Mac Primary Mortgage Market Survey",
    sourceUrl:
      "https://freddiemac.gcs-web.com/news-releases/news-release-details/mortgage-rates-move-down",
    lastUpdated: "June 2025",
  },
  {
    id: "monthly-payment",
    label: "Typical Monthly Payment",
    value: "$2,731",
    change: "↓ $39",
    changeType: "decrease",
    description: "Lower than previous year",
    source: "Mortgage Calculator Analysis",
    sourceUrl:
      "https://www.calculator.net/mortgage-amortization-calculator.html",
    lastUpdated: "January 2025",
  },
];

/**
 * Key Market Insights and Trends for Cape Coral
 * Expert analysis of current market conditions
 */
export const marketInsights: MarketInsight[] = [
  {
    id: "buyers-market",
    title: "Strong Buyer's Market Conditions",
    description:
      "With 12.3 months of supply and increased inventory, buyers have more negotiating power and time to make decisions without pressure.",
    impact: "positive",
    category: "market-conditions",
  },
  {
    id: "affordability-opportunity",
    title: "Affordability Opportunity",
    description:
      "Cape Coral homes are 12.5% below the Florida state average, making it an attractive option for first-time buyers and relocators.",
    impact: "positive",
    category: "pricing",
  },
  {
    id: "faster-sales",
    title: "Quick Sales Despite Market Shift",
    description:
      "Homes still selling 14 days faster than the state average, indicating strong underlying demand for Cape Coral properties.",
    impact: "positive",
    category: "demand",
  },
  {
    id: "inventory-growth",
    title: "Increased Housing Options",
    description:
      "25% increase in available homes gives buyers more choices across different price ranges and property types.",
    impact: "positive",
    category: "inventory",
  },
];

/**
 * Buyer Demographics and Market Trends
 * Based on current market research and national trends
 */
export const marketTrends = {
  buyerDemographics: {
    boomers: { percentage: 42, trend: "increasing" },
    millennials: { percentage: 29, trend: "stable" },
    genX: { percentage: 24, trend: "decreasing" },
    other: { percentage: 5, trend: "stable" },
  },
  priceComparison: {
    capeCoralMedian: 365000,
    floridaStateMedian: 410600,
    fortMyersMedian: 378500,
    savingsVsState: 45600,
  },
  marketConditions: {
    marketType: "buyer's market",
    inventoryTrend: "increasing",
    priceTrend: "decreasing",
    demandLevel: "moderate",
  },
} as const;

/**
 * Neighborhood Spotlight Data
 * Featured areas with current market activity
 */
export const neighborhoodSpotlights = [
  {
    name: "Southwest Cape Coral",
    medianPrice: "$385,000",
    priceChange: "-8.5%",
    inventory: "High",
    highlights: ["Family-friendly", "New construction", "Schools nearby"],
  },
  {
    name: "Northwest Cape Coral",
    medianPrice: "$425,000",
    priceChange: "-12.1%",
    inventory: "Moderate",
    highlights: ["Luxury waterfront", "Golf courses", "Boating access"],
  },
  {
    name: "Southeast Cape Coral",
    medianPrice: "$340,000",
    priceChange: "-9.8%",
    inventory: "High",
    highlights: ["Waterfront lots", "Investment potential", "Growing area"],
  },
] as const;
