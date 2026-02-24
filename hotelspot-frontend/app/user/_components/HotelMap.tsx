"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

interface HotelMapProps {
  lat: number;
  lng: number;
  hotelName: string;
  location: string;
}

export default function HotelMap({
  lat,
  lng,
  hotelName,
  location,
}: HotelMapProps) {
  useEffect(() => {
    // Fix icons inside useEffect so it only runs client-side
    const L = require("leaflet");
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      style={{ height: "208px", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]}>
        <Popup>
          <strong>{hotelName}</strong>
          <br />
          {location}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
