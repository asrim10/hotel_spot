export const getImageUrl = (url?: string) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return (process.env.NEXT_PUBLIC_API_BASE_URL || "") + url;
};
