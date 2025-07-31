"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Home, Users, DollarSign } from "lucide-react";

interface SearchFormData {
  location: string;
  priceRange: string;
  propertyType: string;
  bedrooms: string;
  quickFilters: string[];
}

const priceRanges = [
  { value: "all", label: "Any Price" },
  { value: "0-300000", label: "$0 - $300k" },
  { value: "300000-500000", label: "$300k - $500k" },
  { value: "500000-750000", label: "$500k - $750k" },
  { value: "750000-1000000", label: "$750k - $1M" },
  { value: "1000000+", label: "$1M+" },
];

const propertyTypes = [
  { value: "all", label: "All Properties" },
  { value: "single-family", label: "Single Family" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "vacant-land", label: "Vacant Land" },
];

const bedroomOptions = [
  { value: "any", label: "Any Bedrooms" },
  { value: "1+", label: "1+" },
  { value: "2+", label: "2+" },
  { value: "3+", label: "3+" },
  { value: "4+", label: "4+" },
  { value: "5+", label: "5+" },
];

const quickFilters = [
  { id: "waterfront", label: "Waterfront" },
  { id: "new-construction", label: "New Construction" },
  { id: "golf-course", label: "Golf Course" },
  { id: "55-community", label: "55+ Community" },
];

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 25,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 25,
    },
  },
};

export function PropertySearchBar() {
  const [searchData, setSearchData] = useState<SearchFormData>({
    location: "",
    priceRange: "all",
    propertyType: "all",
    bedrooms: "any",
    quickFilters: [],
  });

  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const handleQuickFilterToggle = (filterId: string) => {
    setSearchData((prev) => ({
      ...prev,
      quickFilters: prev.quickFilters.includes(filterId)
        ? prev.quickFilters.filter((id) => id !== filterId)
        : [...prev.quickFilters, filterId],
    }));
  };

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log("Search data:", searchData);
    // This will redirect to search results page
  };

  return (
    <motion.div
      className="relative mt-12 mx-auto max-w-7xl px-4"
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-neutral-border/20 p-8 md:p-10 lg:p-12"
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Main Search Form */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8"
          variants={fieldVariants}
        >
          {/* Location Field */}
          <motion.div className="space-y-3" variants={fieldVariants}>
            <Label
              htmlFor="location"
              className="flex items-center gap-3 text-base md:text-lg font-semibold text-neutral-text"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <MapPin className="h-5 w-5 text-primary-blue" />
              </motion.div>
              Location
            </Label>
            <motion.div
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Input
                id="location"
                type="text"
                placeholder="Cape Coral neighborhoods..."
                value={searchData.location}
                onChange={(e) =>
                  setSearchData((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                className="h-12 text-base border-neutral-border focus:border-primary-blue focus:ring-primary-blue/20 rounded-xl transition-all duration-300"
              />
            </motion.div>
          </motion.div>

          {/* Price Range */}
          <motion.div className="space-y-3" variants={fieldVariants}>
            <Label className="flex items-center gap-3 text-base md:text-lg font-semibold text-neutral-text">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <DollarSign className="h-5 w-5 text-primary-blue" />
              </motion.div>
              Price Range
            </Label>
            <Select
              value={searchData.priceRange}
              onValueChange={(value) =>
                setSearchData((prev) => ({ ...prev, priceRange: value }))
              }
            >
              <SelectTrigger className="h-12 text-base border-neutral-border focus:border-primary-blue focus:ring-primary-blue/20 rounded-xl transition-all duration-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((range) => (
                  <SelectItem
                    key={range.value}
                    value={range.value}
                    className="text-base"
                  >
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Property Type */}
          <motion.div className="space-y-3" variants={fieldVariants}>
            <Label className="flex items-center gap-3 text-base md:text-lg font-semibold text-neutral-text">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Home className="h-5 w-5 text-primary-blue" />
              </motion.div>
              Property Type
            </Label>
            <Select
              value={searchData.propertyType}
              onValueChange={(value) =>
                setSearchData((prev) => ({ ...prev, propertyType: value }))
              }
            >
              <SelectTrigger className="h-12 text-base border-neutral-border focus:border-primary-blue focus:ring-primary-blue/20 rounded-xl transition-all duration-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem
                    key={type.value}
                    value={type.value}
                    className="text-base"
                  >
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Bedrooms */}
          <motion.div className="space-y-3" variants={fieldVariants}>
            <Label className="flex items-center gap-3 text-base md:text-lg font-semibold text-neutral-text">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Users className="h-5 w-5 text-primary-blue" />
              </motion.div>
              Bedrooms
            </Label>
            <Select
              value={searchData.bedrooms}
              onValueChange={(value) =>
                setSearchData((prev) => ({ ...prev, bedrooms: value }))
              }
            >
              <SelectTrigger className="h-12 text-base border-neutral-border focus:border-primary-blue focus:ring-primary-blue/20 rounded-xl transition-all duration-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {bedroomOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-base"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        </motion.div>

        {/* Quick Filters */}
        <motion.div className="mb-8" variants={fieldVariants}>
          <Label className="block text-base md:text-lg font-semibold text-neutral-text mb-4">
            Popular Searches
          </Label>
          <div className="flex flex-wrap gap-3">
            {quickFilters.map((filter, index) => (
              <motion.button
                key={filter.id}
                onClick={() => handleQuickFilterToggle(filter.id)}
                className={`px-5 py-3 rounded-xl border text-base font-medium transition-all duration-300 ${
                  searchData.quickFilters.includes(filter.id)
                    ? "bg-primary-blue text-white border-primary-blue shadow-lg"
                    : "bg-white text-neutral-text border-neutral-border hover:bg-secondary-light hover:border-primary-blue hover:shadow-md"
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  delay: 0.4 + index * 0.1,
                }}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Search Button */}
        <motion.div
          className="flex justify-center"
          variants={fieldVariants}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Button
              onClick={handleSearch}
              variant="brand-primary"
              size="touch-lg"
              className="w-full md:w-auto px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Search className="h-6 w-6 mr-3" />
              Search Properties
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
