import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { Property } from "@/lib/types/property.type";
import { cn } from "@/lib/utils/cn";

interface PropertyCardProps {
  property: Property;
  className?: string;
}

const PropertyCard = ({ property, className }: PropertyCardProps) => {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "New":
        return "bg-emerald-500 text-white hover:bg-emerald-600 font-medium px-3 py-1";
      case "Active":
        return "bg-blue-500 text-white hover:bg-blue-600 font-medium px-3 py-1";
      case "Price Reduced":
        return "bg-red-500 text-white hover:bg-red-600 font-medium px-3 py-1";
      case "Pending":
        return "bg-orange-500 text-white hover:bg-orange-600 font-medium px-3 py-1";
      default:
        return "bg-gray-500 text-white hover:bg-gray-600 font-medium px-3 py-1";
    }
  };

  return (
    <Card
      className={cn(
        "group overflow-hidden bg-white shadow-lg hover:shadow-xl border border-gray-100 rounded-xl",
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link href={`/properties/${property.slug}`}>
          <PlaceholderImage
            src={property.images[0]}
            alt={`${property.address} - ${property.propertyType}`}
            width={400}
            height={300}
            fill
            className="object-cover"
          />
        </Link>

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <Badge
            variant="secondary"
            className={getStatusBadgeVariant(property.status)}
          >
            {property.status}
          </Badge>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-white px-4 py-2 rounded-lg shadow-md">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(property.price)}
            </span>
          </div>
        </div>
      </div>

      <CardHeader className="pb-4 pt-6">
        <div className="space-y-3">
          <Link href={`/properties/${property.slug}`} className="block">
            <h3 className="font-semibold text-xl text-gray-900 leading-tight line-clamp-2 hover:text-blue-600">
              {property.address}
            </h3>
          </Link>
          <p className="text-base text-gray-600 font-medium">
            {property.neighborhood}
          </p>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-6">
        {/* Property Details */}
        <div className="flex items-center justify-between text-gray-700">
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-lg">{property.bedrooms}</span>
            <span className="text-base">
              bed{property.bedrooms !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-lg">{property.bathrooms}</span>
            <span className="text-base">
              bath{property.bathrooms !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-lg">
              {property.squareFeet.toLocaleString()}
            </span>
            <span className="text-base">sqft</span>
          </div>
        </div>

        {/* Property Type */}
        <div className="text-center">
          <span className="text-base text-gray-600 font-medium">
            {property.propertyType}
          </span>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2">
          {property.features.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200"
            >
              {feature}
            </span>
          ))}
          {property.features.length > 3 && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-50 text-gray-600 border border-gray-200">
              +{property.features.length - 3} more
            </span>
          )}
        </div>

        {/* MLS Number */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-sm text-gray-500 font-medium">
            MLS# {property.mlsNumber}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export { PropertyCard };
