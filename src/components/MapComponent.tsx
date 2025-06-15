import { useRef, useState } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { MapPin, AlertCircle } from "lucide-react";

interface MapComponentProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}

const MapComponent = ({ onLocationSelect }: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [selectedCoords, setSelectedCoords] = useState<{lat: number, lng: number} | null>(null);
  const mapRef = useRef<unknown>(null);

  const initializeMap = async (token: string) => {
    if (!mapContainer.current) return;

    try {
      // Dynamically import mapbox-gl
      const mapboxgl = await import('mapbox-gl');
      
      mapboxgl.default.accessToken = token;
      
      const map = new mapboxgl.default.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-74.006, 40.7128], // NYC coordinates as default
        zoom: 12
      });

      // Add navigation controls
      map.addControl(new mapboxgl.default.NavigationControl(), 'top-right');

      // Add click handler for location selection
      map.on('click', async (e) => {
        const { lng, lat } = e.lngLat;
        
        // Remove existing marker
        const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
        existingMarkers.forEach(marker => marker.remove());
        
        // Add new marker
        new mapboxgl.default.Marker({ color: '#ef4444' })
          .setLngLat([lng, lat])
          .addTo(map);
        
        setSelectedCoords({ lat, lng });
        
        // Reverse geocoding to get address
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${token}`
          );
          const data = await response.json();
          const address = data.features[0]?.place_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          
          onLocationSelect(lat, lng, address);
        } catch (error) {
          console.error('Geocoding error:', error);
          onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }
      });

      mapRef.current = map;
      setShowTokenInput(false);
    } catch (error) {
      console.error('Error initializing map:', error);
      alert('Error loading map. Please check your Mapbox token.');
    }
  };

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      initializeMap(mapboxToken);
    }
  };

  if (showTokenInput) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-muted/20">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="h-12 w-12 mx-auto text-yellow-500" />
          <h3 className="text-lg font-semibold">Mapbox Token Required</h3>
          <p className="text-sm text-muted-foreground">
            To use the map functionality, please enter your Mapbox public token. 
            You can get one from <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
          </p>
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Enter your Mapbox public token"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <Button onClick={handleTokenSubmit} className="w-full">
              Initialize Map
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      {selectedCoords && (
        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur p-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-red-500" />
            <span>Location Selected</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;