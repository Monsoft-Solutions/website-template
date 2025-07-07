/**
 * Utility functions for blog components
 */

export const formatDate = (dateString: string | Date) => {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Development:
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    TypeScript:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    SEO: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Design: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    Performance:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  };
  return (
    colors[category] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  );
};
