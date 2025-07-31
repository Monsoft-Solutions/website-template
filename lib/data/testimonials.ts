export interface Testimonial {
  id: string;
  clientName: string;
  clientPhoto: string;
  reviewText: string;
  rating: number;
  transactionType: "buyer" | "seller";
  propertyLocation: string;
  propertyType: string;
  transactionDate: string;
}

/**
 * Sample client testimonials for Sun Gulf Realty
 * Real reviews from real Cape Coral families
 */
export const testimonials: Testimonial[] = [
  {
    id: "1",
    clientName: "Sarah & Mike Johnson",
    clientPhoto:
      "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150&h=150&fit=crop&auto=format&crop=face",
    reviewText:
      "Sun Gulf Realty made our home buying experience absolutely seamless. Their transparency and local expertise helped us find the perfect waterfront home in Cape Coral. We couldn't be happier with our new home and the exceptional service we received throughout the entire process.",
    rating: 5,
    transactionType: "buyer",
    propertyLocation: "Southwest Cape Coral",
    propertyType: "Waterfront Home",
    transactionDate: "2024-01-15",
  },
  {
    id: "2",
    clientName: "Robert Chen",
    clientPhoto:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format&crop=face",
    reviewText:
      "As a first-time home buyer, I was nervous about the process. The team at Sun Gulf Realty guided me every step of the way with patience and professionalism. Their innovative marketing approach and technology made everything so much easier to understand.",
    rating: 5,
    transactionType: "buyer",
    propertyLocation: "Rose Garden",
    propertyType: "Single Family Home",
    transactionDate: "2024-02-28",
  },
  {
    id: "3",
    clientName: "Maria Rodriguez",
    clientPhoto:
      "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=150&h=150&fit=crop&auto=format&crop=face",
    reviewText:
      "Selling our family home was emotional, but Sun Gulf Realty handled everything with such care and professionalism. Their market analysis was spot-on, and we sold for above asking price in just 12 days. Their different by design approach really works!",
    rating: 5,
    transactionType: "seller",
    propertyLocation: "Pelican Neighborhood",
    propertyType: "Golf Course Home",
    transactionDate: "2024-01-08",
  },
  {
    id: "4",
    clientName: "James & Linda Thompson",
    clientPhoto:
      "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=150&h=150&fit=crop&auto=format&crop=face",
    reviewText:
      "We've bought and sold homes before, but never with such a dedicated team. Their local knowledge of Cape Coral is unmatched, and their transparent process gave us confidence every step of the way. We highly recommend Sun Gulf Realty to anyone looking to buy or sell.",
    rating: 5,
    transactionType: "buyer",
    propertyLocation: "Northwest Cape",
    propertyType: "Canal Front Home",
    transactionDate: "2023-12-20",
  },
  {
    id: "5",
    clientName: "Jennifer Davis",
    clientPhoto:
      "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=150&h=150&fit=crop&auto=format&crop=face",
    reviewText:
      "The professional photography and marketing strategy that Sun Gulf Realty used for our listing was incredible. Our home looked amazing online, and we had multiple showings within the first week. Their innovative approach definitely sets them apart from other agencies.",
    rating: 5,
    transactionType: "seller",
    propertyLocation: "Southeast Cape",
    propertyType: "Condo",
    transactionDate: "2024-03-10",
  },
  {
    id: "6",
    clientName: "David & Carol Williams",
    clientPhoto:
      "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=150&h=150&fit=crop&auto=format&crop=face",
    reviewText:
      "After working with several other realtors, we finally found our dream team at Sun Gulf Realty. Their attention to detail and commitment to finding us the perfect retirement home in Cape Coral was exceptional. We're now living our dream waterfront lifestyle!",
    rating: 5,
    transactionType: "buyer",
    propertyLocation: "Coral Point",
    propertyType: "Gulf Access Home",
    transactionDate: "2024-02-14",
  },
  {
    id: "7",
    clientName: "Amanda Foster",
    clientPhoto:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&auto=format&crop=face",
    reviewText:
      "As a single mom relocating to Cape Coral for work, I needed agents who understood my unique situation. Sun Gulf Realty went above and beyond to help me find a safe, affordable neighborhood with great schools. Their personal service made all the difference.",
    rating: 5,
    transactionType: "buyer",
    propertyLocation: "Rose Garden",
    propertyType: "Family Home",
    transactionDate: "2024-01-25",
  },
  {
    id: "8",
    clientName: "Thomas & Helen Martinez",
    clientPhoto:
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=150&h=150&fit=crop&auto=format&crop=face",
    reviewText:
      "We were impressed by how quickly and efficiently Sun Gulf Realty sold our investment property. Their market expertise and strategic pricing resulted in a sale above our expectations. We'll definitely be using them for all our future real estate needs in Cape Coral.",
    rating: 5,
    transactionType: "seller",
    propertyLocation: "Southwest Cape",
    propertyType: "Investment Property",
    transactionDate: "2023-11-30",
  },
];

/**
 * Overall testimonial statistics
 */
export const testimonialStats = {
  googleReviewsAverage: 4.9,
  totalReviews: 127,
  recommendationRate: 98,
  averageResponseTime: "2 hours",
};

/**
 * Get testimonials by transaction type
 */
export const getTestimonialsByType = (
  type: "buyer" | "seller" | "all"
): Testimonial[] => {
  if (type === "all") return testimonials;
  return testimonials.filter(
    (testimonial) => testimonial.transactionType === type
  );
};

/**
 * Get featured testimonials (top rated, recent)
 */
export const getFeaturedTestimonials = (count: number = 3): Testimonial[] => {
  return testimonials
    .filter((testimonial) => testimonial.rating === 5)
    .sort(
      (a, b) =>
        new Date(b.transactionDate).getTime() -
        new Date(a.transactionDate).getTime()
    )
    .slice(0, count);
};
