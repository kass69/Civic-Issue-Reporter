import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapComponentProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}

const MapComponent = ({ onLocationSelect }: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);

  const mapboxToken = import.meta.env.VITE_MAPBOXGL_ACCESS_TOKEN; // ✅ Store token in .env

  // Initialize Map
  useEffect(() => {
    const initializeMap = async () => {
      if (!mapContainer.current || !mapboxToken) return;

      try {
        const mapboxgl = await import("mapbox-gl");
        mapboxgl.default.accessToken = mapboxToken;

        const map = new mapboxgl.default.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [77.5946, 12.9716], // Default: Bangalore
          zoom: 10,
        });

        map.addControl(new mapboxgl.default.NavigationControl(), "top-right");

        // On map click - add marker and fetch address
        map.on("click", (e) => {
          const { lng, lat } = e.lngLat;

          // Remove old marker
          if (markerRef.current) markerRef.current.remove();

          // Add new draggable marker
          markerRef.current = new mapboxgl.default.Marker({ color: "#ef4444", draggable: true })
            .setLngLat([lng, lat])
            .addTo(map);

          setSelectedCoords({ lat, lng });
          fetchAddress(lng, lat);

          // Handle drag end to update location
          markerRef.current.on("dragend", () => {
            const pos = markerRef.current.getLngLat();
            setSelectedCoords({ lat: pos.lat, lng: pos.lng });
            fetchAddress(pos.lng, pos.lat);
          });
        });

        mapRef.current = map;
      } catch (error) {
        console.error("Error loading Mapbox:", error);
      }
    };

    initializeMap();
  }, [mapboxToken]);

  // Fetch Address from Mapbox Geocoding API
  const fetchAddress = async (lng: number, lat: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}`
      );
      const data = await response.json();
      const address = data.features[0]?.place_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

      // Pass data to parent
      onLocationSelect(lat, lng, address);
    } catch (err) {
      console.error("Error fetching address:", err);
      onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    }
  };

  return (
    <div className="relative h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />

      {selectedCoords && (
        <div className="absolute top-4 left-4 bg-white shadow-md rounded-lg px-4 py-2 text-sm">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-red-500" />
            <span>
              {selectedCoords.lat.toFixed(4)}, {selectedCoords.lng.toFixed(4)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
