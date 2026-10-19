import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Compass } from 'lucide-react';

interface LocationPickerMapProps {
  initialLat?: number;
  initialLng?: number;
  onLocationChange: (lat: number, lng: number, placeLabel?: string) => void;
}

const CITY_PRESETS = [
  { name: 'SF Mission', lat: 37.7599, lng: -122.4148 },
  { name: 'SF Downtown', lat: 37.7879, lng: -122.4075 },
  { name: 'Berkeley', lat: 37.8715, lng: -122.2730 },
  { name: 'Oakland', lat: 37.8044, lng: -122.2712 },
  { name: 'San Jose', lat: 37.3382, lng: -121.8863 },
  { name: 'Palo Alto', lat: 37.4419, lng: -122.1430 }
];

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  initialLat = 37.7749,
  initialLng = -122.4194,
  onLocationChange
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);

  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng
  });
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 13,
        zoomControl: true,
        attributionControl: false
      });

      // Esri World Street Map (fast CDN, zero watermark, no API key needed)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: ''
      }).addTo(map);

      // Area highlight circle
      const circle = L.circle([initialLat, initialLng], {
        color: '#7e22ce',
        fillColor: '#a855f7',
        fillOpacity: 0.15,
        radius: 400
      }).addTo(map);
      circleRef.current = circle;

      // Custom draggable pin
      const icon = L.divIcon({
        className: 'custom-interactive-pin',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: grab;">
            <div style="background-color: #7e22ce; color: #ffffff; padding: 4px 8px; border-radius: 9999px; font-weight: 800; font-size: 10px; box-shadow: 0 4px 12px rgba(126,34,206,0.35); border: 2px solid #ffffff; white-space: nowrap; display: flex; align-items: center; gap: 4px;">
              <span>📍 Drag Me</span>
            </div>
            <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 7px solid #7e22ce;"></div>
            <div style="width: 10px; height: 4px; background: rgba(0,0,0,0.25); border-radius: 50%; margin-top: 1px;"></div>
          </div>
        `,
        iconSize: [80, 42],
        iconAnchor: [40, 38]
      });

      const marker = L.marker([initialLat, initialLng], {
        draggable: true,
        icon
      }).addTo(map);

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        updatePosition(pos.lat, pos.lng);
      });

      map.on('click', (e: L.LeafletMouseEvent) => {
        marker.setLatLng(e.latlng);
        updatePosition(e.latlng.lat, e.latlng.lng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
        circleRef.current = null;
      }
    };
  }, []);

  const updatePosition = (lat: number, lng: number, placeLabel?: string) => {
    const roundedLat = parseFloat(lat.toFixed(5));
    const roundedLng = parseFloat(lng.toFixed(5));
    setCurrentCoords({ lat: roundedLat, lng: roundedLng });

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    }
    if (circleRef.current) {
      circleRef.current.setLatLng([lat, lng]);
    }

    onLocationChange(roundedLat, roundedLng, placeLabel);
  };

  const handleSelectPreset = (preset: { name: string; lat: number; lng: number }) => {
    updatePosition(preset.lat, preset.lng, preset.name);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([preset.lat, preset.lng], 14, { duration: 0.8 });
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        updatePosition(lat, lng, 'My Current Location');
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([lat, lng], 14, { duration: 0.8 });
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation failed:', err.message);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-gray-700 dark:text-gray-300">
          <MapPin className="w-3.5 h-3.5 text-purple-600" />
          <span>Interactive Pin Placement</span>
          <span className="text-[10px] text-gray-400 font-normal">
            (Tap map or drag pin to position)
          </span>
        </div>
        
        <button
          type="button"
          onClick={handleLocateMe}
          disabled={isLocating}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-[11px] font-bold hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors cursor-pointer"
        >
          <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Locating...' : 'Use My GPS'}</span>
        </button>
      </div>

      {/* Map Canvas */}
      <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner bg-gray-100 dark:bg-gray-800">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Live Coordinate Badge Overlay */}
        <div className="absolute bottom-3 left-3 z-[400] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md flex items-center gap-2 text-[11px] font-mono font-medium text-gray-700 dark:text-gray-300">
          <Compass className="w-3.5 h-3.5 text-purple-600" />
          <span>Lat: {currentCoords.lat}</span>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <span>Lng: {currentCoords.lng}</span>
        </div>
      </div>

      {/* Quick City Area Presets */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">
          Quick Areas:
        </span>
        {CITY_PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => handleSelectPreset(preset)}
            className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all shrink-0 cursor-pointer"
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  );
};
