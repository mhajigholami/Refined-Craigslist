import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MiniMapProps {
  locationName: string;
  latitude?: number;
  longitude?: number;
}

export const MiniMap: React.FC<MiniMapProps> = ({ 
  latitude = 37.7749, 
  longitude = -122.4194 
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [latitude, longitude],
        zoom: 13,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        attributionControl: false
      });

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: ''
      }).addTo(map);

      // Area circle
      L.circle([latitude, longitude], {
        color: '#7e22ce',
        fillColor: '#a855f7',
        fillOpacity: 0.18,
        radius: 900
      }).addTo(map);

      // Center Pin
      const icon = L.divIcon({
        className: 'custom-pin',
        html: `<div class="w-4 h-4 bg-purple-700 rounded-full border-2 border-white shadow-xl animate-pulse"></div>`,
        iconSize: [16, 16]
      });

      L.marker([latitude, longitude], { icon }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude]);

  return <div ref={mapContainerRef} className="w-full h-full bg-gray-100 dark:bg-gray-800" />;
};
