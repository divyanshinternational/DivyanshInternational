"use client";

/**
 * Leaflet Map Component
 *
 * Renders an interactive map using React-Leaflet.
 * dynamically renders markers and radius circles based on props.
 * Note: Must be dynamically imported with ssr: false in parent components.
 */

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import { z } from "zod";
import "leaflet/dist/leaflet.css";

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

export const LocationSchema = z.object({
  name: z.string(),
  lat: z.number(),
  lng: z.number(),
  radius: z.number().default(50000),
});

export const LeafletMapPropsSchema = z.object({
  locations: z.array(LocationSchema).optional(),
  center: z.tuple([z.number(), z.number()]).optional(),
  zoom: z.number().optional(),
});

// =============================================================================
// TYPES
// =============================================================================

export type Location = z.infer<typeof LocationSchema>;
export type LeafletMapProps = z.infer<typeof LeafletMapPropsSchema>;

// =============================================================================
// ASSETS
// Standard Leaflet markers from CDN (reliable for this use case)
// =============================================================================

const ICON_CONFIG = {
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41] as [number, number],
  iconAnchor: [12, 41] as [number, number],
  popupAnchor: [1, -34] as [number, number],
  shadowSize: [41, 41] as [number, number],
};

// =============================================================================
// COMPONENT
// =============================================================================

export default function LeafletMap({
  locations = [],
  center = [30.0, 76.5],
  zoom = 6,
}: LeafletMapProps) {
  // Runtime validation in development
  if (process.env.NODE_ENV === "development") {
    const result = LeafletMapPropsSchema.safeParse({ locations, center, zoom });
    if (!result.success) {
      console.warn("[LeafletMap] Prop validation warning:", result.error.flatten());
    }
  }

  // Memoize icon to prevent recreation on re-renders
  const customIcon = useMemo(() => {
    return new L.Icon(ICON_CONFIG);
  }, []);

  // Fix for map tile rendering issues on load (Leaflet specific resize trigger)
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      className="w-full h-full z-0"
      style={{ background: "var(--color-input, #f3f4f6)" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {locations.map((loc) => (
        <div key={`${loc.name}-${loc.lat}-${loc.lng}`}>
          <Marker position={[loc.lat, loc.lng]} icon={customIcon}>
            <Popup>
              <div className="font-bold text-deep-brown text-sm">{loc.name}</div>
            </Popup>
          </Marker>
          <Circle
            center={[loc.lat, loc.lng]}
            pathOptions={{
              color: "#D4AF37", // Gold
              fillColor: "#D4AF37",
              fillOpacity: 0.2,
              weight: 1,
            }}
            radius={loc.radius}
          />
        </div>
      ))}
    </MapContainer>
  );
}
