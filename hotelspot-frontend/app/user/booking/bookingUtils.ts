export const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-800 text-green-100";
    case "upcoming":
      return "bg-blue-800 text-blue-100";
    case "cancelled":
      return "bg-red-800 text-red-100";
    default:
      return "bg-gray-700 text-gray-100";
  }
};

export const getStatusText = (status: string) => {
  if (!status) return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const getImageUrl = (
  imageUrl?: string,
  fallback = "/api/placeholder/300/200",
) => {
  if (!imageUrl) return fallback;
  if (imageUrl.startsWith("http")) return imageUrl;
  return (process.env.NEXT_PUBLIC_API_BASE_URL || "") + imageUrl;
};

export const parseDate = (dateInput: any) => {
  if (!dateInput) return null;
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return null;
    return date;
  } catch {
    return null;
  }
};

export const formatDate = (dateInput: any) => {
  const date = parseDate(dateInput);
  if (!date) return "Invalid Date";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const getLocationString = (hotelData: any) => {
  const address = hotelData?.address || "";
  const city = hotelData?.city || "";
  const country = hotelData?.country || "";
  const parts = [address, city, country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Location";
};
