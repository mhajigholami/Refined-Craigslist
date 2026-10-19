import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GLOBAL_SITES } from '../constants/globalData';

interface HeroMapProps {
  onRegionSelect?: (slug: string) => void;
}

export const HeroMap: React.FC<HeroMapProps> = ({ onRegionSelect }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const isSmallScreen = window.innerWidth < 768;

    const map = L.map(mapContainerRef.current, {
      center: [25, 0],
      zoom: isSmallScreen ? 1.4 : 2.2,
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: true,
      attributionControl: false,
      minZoom: 1.2,
      worldCopyJump: true
    });

    mapInstanceRef.current = map;

    // Clean Tile Layer (Zero watermarks, no API key needed, high-speed CDN)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      noWrap: false,
      attribution: ''
    }).addTo(map);

    // Custom Icon for Continents / Regions
    const createCustomIcon = (label: string) => {
      return L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div class="relative group cursor-pointer select-none">
            <div class="w-5 h-5 bg-purple-700 rounded-full border-2 border-white shadow-xl animate-pulse transition-all duration-300 group-hover:scale-150 group-hover:bg-purple-600"></div>
            <div class="hidden sm:block absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-3 py-1 rounded-xl shadow-xl text-xs font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[1000] border border-gray-200 dark:border-gray-700">
              ${label}
              <div class="absolute bottom-[-5px] left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-white dark:bg-gray-900 rotate-45 border-r border-b border-gray-200 dark:border-gray-700"></div>
            </div>
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });
    };

    // Add Markers
    GLOBAL_SITES.forEach(region => {
      const marker = L.marker(region.coordinates, {
        icon: createCustomIcon(region.name)
      }).addTo(map);

      marker.on('click', () => {
        map.flyTo(region.coordinates, isSmallScreen ? 3.5 : 4.5, {
          duration: 1.5,
          easeLinearity: 0.25
        });

        setTimeout(() => {
          if (onRegionSelect) {
            onRegionSelect(region.slug);
          } else {
            const el = document.getElementById(region.slug);
            if (el) {
              const offset = 120; 
              const elementPosition = el.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - offset;
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
            }
          }
        }, 800);
      });
    });

    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onRegionSelect]);

  return (
    <div className="relative w-full h-[320px] sm:h-[400px] z-0 transition-all duration-300">
      <div ref={mapContainerRef} className="w-full h-full bg-slate-100 dark:bg-slate-900" />
      
      {/* Overlay Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-gray-950 to-transparent pointer-events-none z-[400]" />
      
      {/* Overlay Title */}
      <div className="absolute top-6 sm:top-10 left-1/2 transform -translate-x-1/2 text-center pointer-events-none z-[400] w-full px-4">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-slate-800 dark:text-slate-100 drop-shadow-md mb-2 bg-white/40 dark:bg-black/40 backdrop-blur-md inline-block px-4 py-2 sm:px-6 rounded-2xl border border-white/30 dark:border-gray-700 transition-all">
          craigslist <span className="text-purple-700 dark:text-purple-400">worldwide</span>
        </h1>
        <div className="flex justify-center mt-2">
          <p className="text-xs sm:text-base md:text-lg text-slate-700 dark:text-slate-200 font-bold bg-white/60 dark:bg-gray-900/60 backdrop-blur-md px-3.5 py-1 rounded-full inline-block border border-white/40 dark:border-gray-700">
            Select a continent or region to browse local classifieds
          </p>
        </div>
      </div>
    </div>
  );
};
