"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  TrendingUp,
  TrendingDown,
  Home,
  Calendar,
  DollarSign,
  MapPin,
  Download,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  marketStatistics,
  marketInsights,
  marketTrends,
  neighborhoodSpotlights,
  type MarketStatistic,
} from "@/lib/data/market-insights";

/**
 * Cape Coral Market Insights Section Component
 *
 * A comprehensive market intelligence component that displays:
 * - Current market statistics with visual indicators
 * - Market trends and analysis insights
 * - Buyer demographics chart
 * - Neighborhood spotlights
 * - Call-to-action for market reports
 *
 * This component is designed to be reusable across the website and provides
 * valuable market data to potential buyers and sellers.
 *
 * Usage:
 * ```tsx
 * import { MarketInsightsSection } from "@/components/home";
 *
 * export default function HomePage() {
 *   return (
 *     <div>
 *       <MarketInsightsSection />
 *     </div>
 *   );
 * }
 * ```
 *
 * Features:
 * - Responsive design (mobile-first)
 * - Smooth animations with Framer Motion
 * - Interactive hover effects
 * - Color-coded change indicators
 * - Accessible design with proper semantics
 * - Brand-aligned styling using design system
 */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const StatCard = ({ stat }: { stat: MarketStatistic }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case "median-price":
        return DollarSign;
      case "days-on-market":
        return Calendar;
      case "inventory-levels":
        return Home;
      case "months-supply":
        return TrendingUp;
      case "mortgage-rates":
        return TrendingUp;
      case "monthly-payment":
        return DollarSign;
      default:
        return TrendingUp;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case "increase":
        return "text-primary-blue";
      case "decrease":
        return "text-accent-orange";
      default:
        return "text-neutral-text";
    }
  };

  const Icon = getIcon(stat.id);

  const handleCardClick = () => {
    if (stat.sourceUrl) {
      window.open(stat.sourceUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <Card
        className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] group"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick();
          }
        }}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-primary-blue/10 rounded-lg group-hover:bg-primary-blue/20 transition-colors">
              <Icon className="h-6 w-6 text-primary-blue" />
            </div>
            <Badge variant="secondary" className="text-xs">
              Updated {stat.lastUpdated}
            </Badge>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-neutral-text">
              {stat.value}
            </h3>
            <p className="text-sm font-medium text-neutral-light">
              {stat.label}
            </p>
            <p
              className={`text-sm font-semibold ${getChangeColor(stat.changeType)}`}
            >
              {stat.change}
            </p>
            <p className="text-xs text-neutral-light">{stat.description}</p>
            <div className="flex items-center gap-1 mt-3 pt-2 border-t border-neutral-border/50">
              <ArrowRight className="h-3 w-3 text-primary-blue opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-xs text-primary-blue font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                View Source: {stat.source}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const InsightCard = ({ insight }: { insight: (typeof marketInsights)[0] }) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "positive":
        return "text-green-600 bg-green-50";
      case "negative":
        return "text-red-600 bg-red-50";
      default:
        return "text-primary-blue bg-primary-blue/10";
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="h-full hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-full ${getImpactColor(insight.impact)}`}
            >
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-neutral-text mb-2">
                {insight.title}
              </h4>
              <p className="text-sm text-neutral-light">
                {insight.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const BuyerDemographicsChart = () => {
  const { buyerDemographics } = marketTrends;

  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral-text">
            Buyer Demographics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(buyerDemographics).map(([group, data]) => (
              <div key={group} className="flex items-center justify-between">
                <span className="text-sm capitalize text-neutral-text">
                  {group === "genX" ? "Gen X" : group}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-neutral-border rounded-full h-2">
                    <div
                      className="bg-primary-blue h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-neutral-text min-w-[40px]">
                    {data.percentage}%
                  </span>
                  {data.trend === "increasing" && (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  )}
                  {data.trend === "decreasing" && (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const NeighborhoodSpotlight = () => {
  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral-text flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary-blue" />
            Neighborhood Spotlight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {neighborhoodSpotlights.map((neighborhood, index) => (
              <div
                key={index}
                className="border-b border-neutral-border last:border-0 pb-4 last:pb-0"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-neutral-text">
                    {neighborhood.name}
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    {neighborhood.inventory} Inventory
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-lg font-bold text-primary-blue">
                    {neighborhood.medianPrice}
                  </span>
                  <span className="text-sm text-accent-orange font-medium">
                    {neighborhood.priceChange}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {neighborhood.highlights.map((highlight, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function MarketInsightsSection() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section
      className="py-20 bg-gradient-to-b from-white to-secondary-light/30"
      ref={ref}
    >
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-7xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-blue-dark mb-6">
              Cape Coral Market Intelligence
            </h2>
            <p className="text-xl text-neutral-light max-w-3xl mx-auto">
              Stay informed with real-time market data and expert analysis from
              your local Cape Coral real estate professionals
            </p>
          </motion.div>

          {/* Market Statistics Grid */}
          <motion.div variants={itemVariants} className="mb-16">
            <h3 className="text-2xl font-bold text-neutral-text mb-8 text-center">
              Current Market Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketStatistics.slice(0, 6).map((stat) => (
                <StatCard key={stat.id} stat={stat} />
              ))}
            </div>
          </motion.div>

          {/* Two-Column Layout: Insights & Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Market Insights */}
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-bold text-neutral-text mb-8">
                Market Analysis & Trends
              </h3>
              <div className="space-y-6">
                {marketInsights.map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </motion.div>

            {/* Charts & Data Visualization */}
            <div className="space-y-8">
              <BuyerDemographicsChart />
              <NeighborhoodSpotlight />
            </div>
          </div>

          {/* Market Summary & CTA - Redesigned */}
          <motion.div variants={itemVariants}>
            <div className="relative overflow-hidden">
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-primary-blue-dark via-primary-blue to-primary-blue-light">
                <CardContent className="relative p-12">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-orange rounded-full translate-y-24 -translate-x-24"></div>
                  </div>

                  <div className="relative z-10 text-center">
                    <div className="mb-8">
                      <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                        Get Your Complete Market Report
                      </h3>
                      <p className="text-lg md:text-xl mb-2 text-white/90 max-w-2xl mx-auto">
                        Access detailed neighborhood analysis, price
                        predictions, and investment opportunities in Cape Coral
                      </p>
                      <div className="flex items-center justify-center gap-2 text-white/75 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>Updated monthly</span>
                        <span>•</span>
                        <span>No obligation</span>
                        <span>•</span>
                        <span>Free consultation</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                      <Button
                        variant="brand-primary"
                        size="touch-lg"
                        className="w-full sm:w-auto shadow-2xl"
                      >
                        <Download className="mr-2 h-5 w-5" />
                        Download Full Report
                      </Button>
                      <Button
                        variant="brand-secondary"
                        size="touch-lg"
                        className="w-full sm:w-auto bg-white/10 border-white text-white hover:bg-white hover:text-primary-blue shadow-lg backdrop-blur-sm"
                      >
                        Schedule Consultation
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>

                    {/* Additional Trust Indicators */}
                    <div className="mt-8 pt-6 border-t border-white/20">
                      <div className="flex flex-wrap justify-center gap-6 text-white/80 text-sm">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-white/20 text-white border-0"
                          >
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Real-time Data
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-white/20 text-white border-0"
                          >
                            <Home className="h-3 w-3 mr-1" />
                            Local Expertise
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-white/20 text-white border-0"
                          >
                            <MapPin className="h-3 w-3 mr-1" />
                            Cape Coral Focus
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
