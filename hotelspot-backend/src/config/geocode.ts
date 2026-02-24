export async function geocodeAddress(
  address: string,
  city: string,
  country: string,
): Promise<{ lat: number; lng: number } | null> {
  const query = encodeURIComponent(`${address}, ${city}, ${country}`);
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
    {
      headers: {
        "User-Agent": "HotelSpot/1.0", // Nominatim requires this
      },
    },
  );

  const data = await res.json();
  if (!data || data.length === 0) return null;

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
}
