"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  HelpCircle,
  Search,
  ChevronRight,
  Star,
  Clock,
  DollarSign,
  Code,
  Palette,
  Rocket,
  Shield,
  MessageSquare,
  Lightbulb,
} from "lucide-react";

// FAQ categories with icons and colors
const faqCategories = [
  {
    id: "all",
    name: "All Questions",
    icon: Star,
    color: "text-primary",
    count: 0,
  },
  {
    id: "services",
    name: "Services",
    icon: Rocket,
    color: "text-blue-500",
    count: 0,
  },
  {
    id: "pricing",
    name: "Pricing",
    icon: DollarSign,
    color: "text-green-500",
    count: 0,
  },
  {
    id: "process",
    name: "Process",
    icon: Clock,
    color: "text-orange-500",
    count: 0,
  },
  {
    id: "technical",
    name: "Technical",
    icon: Code,
    color: "text-purple-500",
    count: 0,
  },
  {
    id: "design",
    name: "Design",
    icon: Palette,
    color: "text-pink-500",
    count: 0,
  },
  {
    id: "support",
    name: "Support",
    icon: Shield,
    color: "text-cyan-500",
    count: 0,
  },
];

// FAQ data with categories and popularity
const faqData = [
  {
    id: 1,
    question: "What services do you offer?",
    answer:
      "We provide comprehensive software development services including web development, mobile app development, UI/UX design, and digital consulting. Our team specializes in modern technologies like React, Next.js, Node.js, and cloud platforms.",
    category: "services",
    popularity: 5,
    tags: ["web development", "mobile apps", "design", "consulting"],
    lastUpdated: "2024-01-15",
  },
  {
    id: 2,
    question: "How long does a typical project take?",
    answer:
      "Project timelines vary based on scope and complexity. Simple websites typically take 2-4 weeks, while complex applications can take 3-6 months or more. We provide detailed timeline estimates during our initial consultation.",
    category: "process",
    popularity: 4,
    tags: ["timeline", "project duration", "planning"],
    lastUpdated: "2024-01-20",
  },
  {
    id: 3,
    question: "What are your pricing models?",
    answer:
      "We offer flexible pricing models including fixed-price projects, hourly rates, and retainer agreements. Pricing depends on project complexity, timeline, and specific requirements. Contact us for a detailed quote.",
    category: "pricing",
    popularity: 5,
    tags: ["cost", "budget", "payment"],
    lastUpdated: "2024-01-18",
  },
  {
    id: 4,
    question: "Do you work with startups?",
    answer:
      "Absolutely! We love working with startups and have special packages designed for early-stage companies. We understand the unique challenges startups face and offer flexible payment terms and MVP development approaches.",
    category: "services",
    popularity: 4,
    tags: ["startups", "MVP", "early-stage"],
    lastUpdated: "2024-01-22",
  },
  {
    id: 5,
    question: "What technologies do you use?",
    answer:
      "We work with modern technologies including React, Next.js, Node.js, TypeScript, Python, and various cloud platforms like AWS and Vercel. We choose the best technology stack based on your project requirements.",
    category: "technical",
    popularity: 4,
    tags: ["technology stack", "React", "Node.js", "cloud"],
    lastUpdated: "2024-01-25",
  },
  {
    id: 6,
    question: "Do you provide ongoing support?",
    answer:
      "Yes, we offer comprehensive maintenance and support packages to ensure your application stays updated, secure, and performing optimally. This includes bug fixes, security updates, and feature enhancements.",
    category: "support",
    popularity: 4,
    tags: ["maintenance", "support", "updates"],
    lastUpdated: "2024-01-19",
  },
  {
    id: 7,
    question: "Can you help with existing projects?",
    answer:
      "Definitely! We can help improve, maintain, or add features to existing applications. We&apos;re experienced in working with legacy codebases and can seamlessly integrate with your current development workflow.",
    category: "services",
    popularity: 3,
    tags: ["legacy code", "existing projects", "maintenance"],
    lastUpdated: "2024-01-21",
  },
  {
    id: 8,
    question: "What is your development process?",
    answer:
      "We follow an agile development process with regular client communication, iterative development, and continuous feedback. Our process includes discovery, planning, design, development, testing, and deployment phases.",
    category: "process",
    popularity: 3,
    tags: ["agile", "methodology", "workflow"],
    lastUpdated: "2024-01-23",
  },
  {
    id: 9,
    question: "Do you offer UI/UX design services?",
    answer:
      "Yes, we have a dedicated design team that specializes in user experience and interface design. We create intuitive, beautiful designs that enhance user engagement and achieve your business goals.",
    category: "design",
    popularity: 4,
    tags: ["UI design", "UX design", "user interface"],
    lastUpdated: "2024-01-24",
  },
  {
    id: 10,
    question: "How do you ensure code quality?",
    answer:
      "We maintain high code quality through code reviews, automated testing, continuous integration, and adherence to best practices. We use tools like ESLint, TypeScript, and comprehensive testing frameworks.",
    category: "technical",
    popularity: 3,
    tags: ["code quality", "testing", "best practices"],
    lastUpdated: "2024-01-26",
  },
  {
    id: 11,
    question: "What payment methods do you accept?",
    answer:
      "We accept various payment methods including bank transfers, credit cards, and digital payment platforms. We typically work with milestone-based payments for larger projects.",
    category: "pricing",
    popularity: 2,
    tags: ["payment methods", "billing", "invoicing"],
    lastUpdated: "2024-01-17",
  },
  {
    id: 12,
    question: "Do you sign NDAs?",
    answer:
      "Yes, we&apos;re happy to sign non-disclosure agreements to protect your intellectual property and sensitive business information. We understand the importance of confidentiality in business relationships.",
    category: "process",
    popularity: 2,
    tags: ["NDA", "confidentiality", "legal"],
    lastUpdated: "2024-01-16",
  },
];

export function EnhancedFaqSection() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Calculate category counts
  const categoriesWithCounts = useMemo(() => {
    return faqCategories.map((category) => ({
      ...category,
      count:
        category.id === "all"
          ? faqData.length
          : faqData.filter((faq) => faq.category === category.id).length,
    }));
  }, []);

  // Filter FAQs based on category and search
  const filteredFaqs = useMemo(() => {
    let filtered = faqData;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((faq) => faq.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query) ||
          faq.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Sort by popularity (highest first)
    return filtered.sort((a, b) => b.popularity - a.popularity);
  }, [selectedCategory, searchQuery]);

  const toggleFaq = (faqId: number) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-muted/5 via-background to-accent/5">
      <div className="container">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">
              <HelpCircle className="w-3 h-3 mr-1" />
              Get Instant Answers
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Find quick answers to common questions about our services,
              process, and pricing. Can&apos;t find what you&apos;re looking
              for? Feel free to reach out directly.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search questions, topics, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg rounded-2xl border-2 focus:border-primary transition-colors"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setSearchQuery("")}
                >
                  Clear
                </Button>
              )}
            </div>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex flex-wrap justify-center gap-3">
              {categoriesWithCounts.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;

                return (
                  <Button
                    key={category.id}
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className="rounded-full flex items-center gap-2"
                  >
                    <Icon
                      className={`w-4 h-4 ${isSelected ? "" : category.color}`}
                    />
                    {category.name}
                    <Badge
                      variant={isSelected ? "secondary" : "outline"}
                      className="ml-1 text-xs"
                    >
                      {category.count}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </motion.div>

          {/* Search Results Info */}
          {(searchQuery || selectedCategory !== "all") && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8 text-center"
            >
              <p className="text-muted-foreground">
                {filteredFaqs.length === 0 ? (
                  <>
                    No questions found for &quot;{searchQuery}&quot;
                    {selectedCategory !== "all" &&
                      ` in ${
                        categoriesWithCounts.find(
                          (c) => c.id === selectedCategory
                        )?.name
                      }`}
                  </>
                ) : (
                  <>
                    Found {filteredFaqs.length} question
                    {filteredFaqs.length !== 1 ? "s" : ""}
                    {searchQuery && ` for "${searchQuery}"`}
                    {selectedCategory !== "all" &&
                      ` in ${
                        categoriesWithCounts.find(
                          (c) => c.id === selectedCategory
                        )?.name
                      }`}
                  </>
                )}
              </p>
            </motion.div>
          )}

          {/* FAQ List */}
          <div className="space-y-4">
            <AnimatePresence>
              {filteredFaqs.map((faq, index) => {
                const isExpanded = expandedFaq === faq.id;
                const category = categoriesWithCounts.find(
                  (c) => c.id === faq.category
                );
                const CategoryIcon = category?.icon || HelpCircle;

                return (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    layout
                  >
                    <Card
                      className={`glass-card cursor-pointer transition-all duration-300 ${
                        isExpanded
                          ? "ring-2 ring-primary shadow-lg"
                          : "hover:shadow-md"
                      }`}
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CategoryIcon
                                className={`w-4 h-4 ${
                                  category?.color || "text-muted-foreground"
                                }`}
                              />
                              <Badge variant="outline" className="text-xs">
                                {category?.name}
                              </Badge>
                              {faq.popularity >= 4 && (
                                <Badge variant="secondary" className="text-xs">
                                  <Star className="w-3 h-3 mr-1" />
                                  Popular
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-lg leading-relaxed text-left">
                              {faq.question}
                            </CardTitle>
                          </div>
                          <motion.div
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex-shrink-0"
                          >
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          </motion.div>
                        </div>
                      </CardHeader>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <CardContent className="pt-0">
                              <div className="border-t pt-4 space-y-4">
                                <p className="text-muted-foreground leading-relaxed">
                                  {faq.answer}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                  {faq.tags.map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="secondary"
                                      className="text-xs cursor-pointer hover:bg-primary/10"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSearchQuery(tag);
                                      }}
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>

                                {/* Last Updated */}
                                <div className="text-xs text-muted-foreground flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Last updated:{" "}
                                  {new Date(
                                    faq.lastUpdated
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* No Results State */}
          {filteredFaqs.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Card className="glass-card max-w-md mx-auto">
                <CardContent className="p-8">
                  <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No questions found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    We couldn&apos;t find any questions matching your search.
                    Try adjusting your search terms or browse all categories.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                    <Button>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Ask a Question
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 text-center"
          >
            <Card className="glass-card max-w-2xl mx-auto">
              <CardContent className="p-8">
                <Lightbulb className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Still have questions?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Can&apos;t find the answer you&apos;re looking for? Our team
                  is here to help. Get personalized answers to your specific
                  questions.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                  <Button variant="outline">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Request Feature
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
