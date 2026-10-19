import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Listing } from '../types';
import { useNavigate } from 'react-router-dom';
import { 
  RefreshCw, 
  Layers, 
  Navigation, 
  Maximize2, 
  Minimize2, 
  X, 
  MapPin, 
  Globe, 
  Compass,
  Check,
  ArrowRight,
  Eye
} from 'lucide-react';
import { GLOBAL_SITES } from '../constants/globalData';
import { useToast } from '../context/ToastContext';

interface ResultsMapProps {
  listings: Listing[];
  className?: string;
  citySlug?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  autoZoomIn?: boolean;
}

type MapMode = 'city' | 'continents';

// Deterministic Pseudo-Random Number Generator using simple hashing
const getPseudoRandom = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
};

const CITY_COORDS: Record<string, [number, number]> = {
  'sfbay': [37.7749, -122.4194],
  'newyork': [40.7128, -74.0060],
  'losangeles': [34.0522, -118.2437],
  'chicago': [41.8781, -87.6298],
  'seattle': [47.6062, -122.3321],
  'london': [51.5074, -0.1278],
  'paris': [48.8566, 2.3522],
  'berlin': [52.5200, 13.4050],
  'tokyo': [35.6762, 139.6503],
  'sydney': [-33.8688, 151.2093],
  'toronto': [43.6532, -79.3832],
  'mexicocity': [19.4326, -99.1332],
  'capetown': [-33.9249, 18.4241]
};

// Global Continents Definitions for Majestic Continental Overview & Zoom
const CONTINENT_HUBS = [
  {
    name: 'North America',
    regionSlug: 'US',
    coordinates: [39.5, -98.3] as [number, number],
    destinationCity: 'sfbay',
    adCount: '1,420+ Ads',
    color: 'from-purple-600 to-indigo-600'
  },
  {
    name: 'Europe',
    regionSlug: 'EU',
    coordinates: [50.0, 12.0] as [number, number],
    destinationCity: 'london',
    adCount: '890+ Ads',
    color: 'from-blue-600 to-cyan-600'
  },
  {
    name: 'Asia',
    regionSlug: 'ASIA',
    coordinates: [34.0, 102.0] as [number, number],
    destinationCity: 'tokyo',
    adCount: '650+ Ads',
    color: 'from-amber-600 to-orange-600'
  },
  {
    name: 'Oceania',
    regionSlug: 'OCEANIA',
    coordinates: [-25.0, 134.0] as [number, number],
    destinationCity: 'sydney',
    adCount: '340+ Ads',
    color: 'from-teal-600 to-emerald-600'
  },
  {
    name: 'Latin America',
    regionSlug: 'LATAM',
    coordinates: [-12.0, -58.0] as [number, number],
    destinationCity: 'mexicocity',
    adCount: '270+ Ads',
    color: 'from-rose-600 to-pink-600'
  },
  {
    name: 'Africa',
    regionSlug: 'AF',
    coordinates: [4.0, 22.0] as [number, number],
    destinationCity: 'capetown',
    adCount: '190+ Ads',
    color: 'from-emerald-600 to-teal-700'
  }
];

// 100% Free, Global, Unrestricted Tile Providers
// Esri World Street Map is the default: zero API keys, zero watermarks, hosted on global AWS CloudFront
const TILE_PRESETS = {
  esri: {
    id: 'esri',
    name: 'Esri Streets HD (No Key Required)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    subdomains: '',
    maxZoom: 19
  },
  satellite: {
    id: 'satellite',
    name: 'Satellite Aerial (Esri Imagery)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    subdomains: '',
    maxZoom: 19
  },
  topo: {
    id: 'topo',
    name: 'Topographic & Terrain',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    subdomains: '',
    maxZoom: 19
  },
  voyager: {
    id: 'voyager',
    name: 'CARTO Voyager (Clean Vector)',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    subdomains: 'abcd',
    maxZoom: 19
  },
  osm: {
    id: 'osm',
    name: 'OpenStreetMap Open CDN',
    url: 'https://tile.openstreetmap.de/{z}/{x}/{y}.png',
    subdomains: '',
    maxZoom: 19
  }
};

// Official Safe Exchange Zones (Police Stations, Monitored Municipal Meetup Spots)
const SAFE_EXCHANGE_ZONES = [
  {
    name: 'SFPD Central Police Station',
    address: '766 Vallejo St, San Francisco, CA',
    coords: [37.7997, -122.4093] as [number, number],
    type: '24/7 Monitored Police Lobby'
  },
  {
    name: 'SFPD Mission Police Station',
    address: '630 Valencia St, San Francisco, CA',
    coords: [37.7628, -122.4219] as [number, number],
    type: 'Safe Trade Meetup Zone'
  },
  {
    name: 'Berkeley Police HQ Lobby',
    address: '2100 Martin Luther King Jr Way, Berkeley',
    coords: [37.8702, -122.2742] as [number, number],
    type: 'Public Safety Building'
  },
  {
    name: 'Oakland Police HQ Safe Spot',
    address: '455 7th St, Oakland, CA',
    coords: [37.8005, -122.2749] as [number, number],
    type: '24/7 Video Surveillance Zone'
  }
];

export const ResultsMap: React.FC<ResultsMapProps> = ({ 
  listings, 
  className = "w-full h-full",
  citySlug = 'sfbay',
  initialCenter = [37.7749, -122.4194],
  initialZoom = 11.5,
  autoZoomIn = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const listingMarkersRef = useRef<L.Marker[]>([]);
  const safeZoneMarkersRef = useRef<L.Marker[]>([]);
  const continentMarkersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [mapMode, setMapMode] = useState<MapMode>(autoZoomIn ? 'continents' : 'city');
  const [activeTileType, setActiveTileType] = useState<keyof typeof TILE_PRESETS>('esri');
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSafeZones, setShowSafeZones] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedSafeZone, setSelectedSafeZone] = useState<typeof SAFE_EXCHANGE_ZONES[0] | null>(null);
  const [showSearchBtn, setShowSearchBtn] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isFlying, setIsFlying] = useState(autoZoomIn);

  const targetCityCenter: [number, number] = useMemo(() => {
    return CITY_COORDS[citySlug] || initialCenter;
  }, [citySlug, initialCenter]);

  // Apply clean tile layer with fallback protection
  const applyTileLayer = (presetKey: keyof typeof TILE_PRESETS) => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }

    const preset = TILE_PRESETS[presetKey] || TILE_PRESETS.esri;
    const options: L.TileLayerOptions = {
      maxZoom: preset.maxZoom,
      subdomains: preset.subdomains || 'abc',
      noWrap: false,
      attribution: ''
    };

    const newLayer = L.tileLayer(preset.url, options);

    // Fallback if tile fails to load
    newLayer.on('tileerror', (errorEvent: any) => {
      if (errorEvent && errorEvent.tile) {
        // Fallback transparent 1x1 png or fallback tile to prevent broken icon
        errorEvent.tile.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAA';
      }
    });

    newLayer.addTo(map);
    tileLayerRef.current = newLayer;
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const isMobile = window.innerWidth < 768;

      // Start at continental overview if autoZoomIn is enabled, else target city
      const startCenter: [number, number] = autoZoomIn ? [20, 0] : targetCityCenter;
      const startZoom = autoZoomIn ? (isMobile ? 1.4 : 2.2) : initialZoom;

      const map = L.map(mapContainerRef.current, {
        center: startCenter,
        zoom: startZoom,
        zoomControl: false,
        attributionControl: false, // Ensures zero "api key required" or attribution banner
        scrollWheelZoom: true,
        worldCopyJump: true,
        minZoom: 1.2
      });

      mapInstanceRef.current = map;

      // Zoom control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Apply initial clean Esri World Street Map tiles (0 key needed, 0 watermark)
      applyTileLayer(activeTileType);

      // Listen for manual zoom/pan: seamlessly switch between Continents and City Ads mode
      map.on('zoomend', () => {
        const currentZoom = map.getZoom();
        if (currentZoom < 5.5) {
          setMapMode('continents');
          setSelectedListing(null);
        } else {
          setMapMode('city');
        }
      });

      map.on('moveend', () => {
        if (map.getZoom() >= 9) {
          setShowSearchBtn(true);
        }
      });

      // Smooth cinematic zoom-in from continents to city (if autoZoomIn enabled)
      if (autoZoomIn) {
        setIsFlying(true);
        const timer = setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo(targetCityCenter, initialZoom, {
              duration: 2.2,
              easeLinearity: 0.25
            });

            setTimeout(() => {
              setMapMode('city');
              setIsFlying(false);
            }, 1900);
          }
        }, 1200);

        return () => clearTimeout(timer);
      }
    }

    return () => {
      // Map cleanup if needed
    };
  }, []);

  // Update tile layer when activeTileType changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      applyTileLayer(activeTileType);
    }
  }, [activeTileType]);

  // Render Continent & Region Markers (for Continent Mode)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear continent markers
    continentMarkersRef.current.forEach(m => m.remove());
    continentMarkersRef.current = [];

    if (mapMode === 'continents') {
      CONTINENT_HUBS.forEach((hub) => {
        const icon = L.divIcon({
          className: 'custom-continent-marker',
          html: `
            <div class="relative group cursor-pointer flex flex-col items-center select-none transform transition-transform duration-300 hover:scale-110">
              <div class="relative flex items-center justify-center">
                <span class="w-10 h-10 rounded-full bg-purple-500/25 animate-ping absolute"></span>
                <div class="w-8 h-8 bg-gradient-to-tr ${hub.color} border-2 border-white rounded-full shadow-2xl flex items-center justify-center text-white text-[12px] font-black">
                  <span class="w-2.5 h-2.5 bg-white rounded-full"></span>
                </div>
              </div>
              <div class="mt-1.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-2xl shadow-xl text-center whitespace-nowrap transition-all group-hover:border-purple-500">
                <div class="text-[12px] font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-1.5 justify-center">
                  <span>${hub.name}</span>
                </div>
                <div class="flex items-center justify-center gap-1 mt-0.5">
                  <span class="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/80 px-2 py-0.5 rounded-full">
                    ${hub.adCount}
                  </span>
                  <span class="text-[10px] text-gray-400 font-semibold group-hover:text-purple-600">Zoom →</span>
                </div>
              </div>
            </div>
          `,
          iconSize: [140, 60],
          iconAnchor: [70, 20]
        });

        const marker = L.marker(hub.coordinates, { icon }).addTo(map);

        // Click continent: smoothly fly in and zoom down to that region / city!
        marker.on('click', () => {
          showToast(`Zooming into ${hub.name}...`, 'info');
          const destination: [number, number] = CITY_COORDS[hub.destinationCity] || hub.coordinates;
          map.flyTo(destination, 11.5, {
            duration: 2.0,
            easeLinearity: 0.25
          });
          setTimeout(() => {
            setMapMode('city');
          }, 1800);
        });

        continentMarkersRef.current.push(marker);
      });
    }
  }, [mapMode]);

  // Render Submitted Ads & Listing Markers (for City Mode)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear existing listing markers
    listingMarkersRef.current.forEach(m => m.remove());
    listingMarkersRef.current = [];

    if (mapMode === 'city' && listings && listings.length > 0) {
      listings.forEach((listing) => {
        let lat: number, lng: number;

        if (listing.coordinates?.coordinates && listing.coordinates.coordinates.length === 2) {
          lng = listing.coordinates.coordinates[0];
          lat = listing.coordinates.coordinates[1];
        } else if (listing.latitude && listing.longitude) {
          lat = listing.latitude;
          lng = listing.longitude;
        } else {
          const base = CITY_COORDS[listing.citySlug || citySlug] || targetCityCenter;
          const latOffset = (getPseudoRandom(listing.id + "lat") - 0.5) * 0.12;
          const lngOffset = (getPseudoRandom(listing.id + "lng") - 0.5) * 0.14;
          lat = base[0] + latOffset;
          lng = base[1] + lngOffset;
        }

        const isSelected = selectedListing?.id === listing.id;

        const isHousing = listing.category?.includes('housing') || listing.category?.includes('apts') || listing.category?.includes('room');
        const isVehicle = listing.category?.includes('car') || listing.category?.includes('bike') || listing.category?.includes('auto');
        
        const badgeBg = isSelected 
          ? 'bg-purple-950 ring-4 ring-purple-300' 
          : isHousing 
          ? 'bg-emerald-600 hover:bg-emerald-700' 
          : isVehicle 
          ? 'bg-blue-600 hover:bg-blue-700' 
          : 'bg-purple-700 hover:bg-purple-800';

        const markerHtml = `
          <div class="group relative cursor-pointer transform transition-all duration-200 hover:scale-115 active:scale-95 ${isSelected ? 'scale-115 z-30' : ''}">
             <div class="${badgeBg} text-white font-bold text-[11px] px-2.5 py-1 rounded-xl shadow-md border border-white/90 whitespace-nowrap flex items-center gap-1 transition-colors">
               <span>${listing.price || '$?'}</span>
             </div>
             <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent ${isSelected ? 'border-t-purple-950' : isHousing ? 'border-t-emerald-600' : isVehicle ? 'border-t-blue-600' : 'border-t-purple-700'}"></div>
          </div>
        `;

        const icon = L.divIcon({
          className: 'custom-price-marker',
          html: markerHtml,
          iconSize: [60, 32],
          iconAnchor: [30, 32]
        });

        const marker = L.marker([lat, lng], { icon }).addTo(map);

        marker.on('click', () => {
          setSelectedListing(listing);
          map.panTo([lat, lng], { animate: true, duration: 0.4 });
        });

        listingMarkersRef.current.push(marker);
      });
    }
  }, [mapMode, listings, selectedListing, targetCityCenter, citySlug]);

  // Render Official Safe Exchange Zones (Police Stations, Monitored Municipal Meetup Spots)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    safeZoneMarkersRef.current.forEach(m => m.remove());
    safeZoneMarkersRef.current = [];

    if (showSafeZones && mapMode === 'city') {
      SAFE_EXCHANGE_ZONES.forEach((zone) => {
        const iconHtml = `
          <div class="cursor-pointer transform hover:scale-115 active:scale-95 transition-all">
            <div class="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-lg border-2 border-white flex items-center gap-1 whitespace-nowrap">
              <span>🛡️ Safe Zone</span>
            </div>
            <div class="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-emerald-600 mx-auto"></div>
          </div>
        `;

        const icon = L.divIcon({
          className: 'custom-safe-zone-marker',
          html: iconHtml,
          iconSize: [80, 28],
          iconAnchor: [40, 28]
        });

        const marker = L.marker(zone.coords, { icon }).addTo(map);
        marker.on('click', () => {
          setSelectedSafeZone(zone);
          setSelectedListing(null);
          map.panTo(zone.coords, { animate: true, duration: 0.4 });
        });

        safeZoneMarkersRef.current.push(marker);
      });
    }
  }, [showSafeZones, mapMode]);

  // Switch to Continents / World View
  const handleFlyToContinents = () => {
    if (!mapInstanceRef.current) return;
    setMapMode('continents');
    setSelectedListing(null);
    setShowSearchBtn(false);

    const isMobile = window.innerWidth < 768;
    mapInstanceRef.current.flyTo([20, 0], isMobile ? 1.4 : 2.2, {
      duration: 1.8,
      easeLinearity: 0.25
    });
    showToast('Switched to Continents overview', 'info');
  };

  // Zoom back into City & Submitted Ads
  const handleFlyToCity = () => {
    if (!mapInstanceRef.current) return;
    setMapMode('city');
    setShowSearchBtn(false);

    mapInstanceRef.current.flyTo(targetCityCenter, initialZoom, {
      duration: 1.8,
      easeLinearity: 0.25
    });
    showToast(`Zoomed into local classifieds & submitted ads (${listings.length})`, 'success');
  };

  // Locate Me Geolocation
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', 'error');
      return;
    }

    showToast('Locating your position...', 'info');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (!mapInstanceRef.current) return;

        const map = mapInstanceRef.current;
        setMapMode('city');
        map.flyTo([latitude, longitude], 13, { duration: 1.4 });

        if (userMarkerRef.current) {
          userMarkerRef.current.remove();
        }

        const userIcon = L.divIcon({
          className: 'user-location-marker',
          html: `
            <div class="relative flex items-center justify-center w-7 h-7">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <div class="relative w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg"></div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        userMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon })
          .addTo(map)
          .bindPopup('<b>You are here</b><br/>Viewing nearby classifieds')
          .openPopup();

        showToast('Located your position!', 'success');
      },
      () => {
        showToast('Unable to access location. Check browser permissions.', 'error');
      }
    );
  };

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-[1000] rounded-none' : className} group font-sans select-none overflow-hidden`}>
      
      {/* Map Canvas (Attribution is completely disabled, zero watermarks or API key text) */}
      <div ref={mapContainerRef} className="w-full h-full bg-slate-100 dark:bg-slate-900" />

      {/* Cinematic Fly-in indicator if auto-zooming */}
      {isFlying && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[450] bg-gray-900/90 text-white backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold border border-gray-700/80 pointer-events-none animate-pulse">
          <Globe className="w-3.5 h-3.5 text-purple-400 animate-spin" />
          <span>Cinematic View: Zooming to Local Classifieds...</span>
        </div>
      )}

      {/* TOP-LEFT: Cinematic Mode Switcher (Continents vs City Ads) */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-1 rounded-2xl border border-gray-200/90 dark:border-gray-700 shadow-md">
        <button
          type="button"
          onClick={handleFlyToContinents}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            mapMode === 'continents'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          title="Zoom out to Continents & Global Overview"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Continents View</span>
        </button>

        <button
          type="button"
          onClick={handleFlyToCity}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            mapMode === 'city'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          title="Zoom in to local city submitted ads"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Local Classifieds ({listings.length})</span>
        </button>

        {/* Safe Meetup Zones Toggle */}
        <button
          type="button"
          onClick={() => {
            setShowSafeZones(!showSafeZones);
            showToast(!showSafeZones ? 'Official Police Safe Zones shown on map' : 'Safe Meetup Zones hidden', 'info');
          }}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            showSafeZones
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          title="Toggle official police safe exchange meetup zones"
        >
          <span>🛡️ Safe Zones</span>
        </button>
      </div>

      {/* TOP-RIGHT: Tools (Layers, Locate, Fullscreen, Re-fit) */}
      <div className="absolute top-3 right-3 z-[400] flex flex-col gap-1.5">
        
        {/* Layer Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
            className="w-9 h-9 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center transition-all"
            title="Switch Map Tiles (Esri / Satellite / Topo / OSM)"
            aria-label="Select map style"
          >
            <Layers className="w-4 h-4" />
          </button>

          {isLayerMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-1.5 z-[500] animate-scale-up space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Map View Style
              </div>
              {Object.entries(TILE_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => { setActiveTileType(key as keyof typeof TILE_PRESETS); setIsLayerMenuOpen(false); }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between ${
                    activeTileType === key ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="truncate">{preset.name}</span>
                  {activeTileType === key && <Check className="w-3.5 h-3.5 text-purple-700 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Locate Me */}
        <button
          type="button"
          onClick={handleLocateMe}
          className="w-9 h-9 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center transition-all"
          title="Find my current location"
          aria-label="Locate me"
        >
          <Navigation className="w-4 h-4 text-blue-600" />
        </button>

        {/* Recenter to City */}
        <button
          type="button"
          onClick={handleFlyToCity}
          className="w-9 h-9 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center transition-all"
          title="Center on local listings"
          aria-label="Recenter"
        >
          <Compass className="w-4 h-4 text-purple-700" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="w-9 h-9 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center transition-all"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Map"}
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* FLOATING "SEARCH THIS AREA" BUTTON */}
      {showSearchBtn && mapMode === 'city' && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[400] animate-slide-down">
          <button 
            type="button"
            onClick={() => {
              setIsSearching(true);
              setTimeout(() => {
                setIsSearching(false);
                setShowSearchBtn(false);
                showToast(`Viewing ${listings.length} classifieds in this area`, 'success');
              }, 400);
            }}
            className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-2 rounded-full font-bold shadow-xl flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-105 transition-all text-xs border border-gray-200 dark:border-gray-700"
          >
            {isSearching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 text-purple-700" />}
            <span>Search this area</span>
          </button>
        </div>
      )}

      {/* BOTTOM-LEFT: SUBMITTED AD PREVIEW CARD */}
      {selectedListing && (
        <div className="absolute bottom-4 left-4 z-[400] max-w-xs sm:max-w-sm w-full animate-slide-up">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 shadow-2xl relative flex gap-3 items-center">
            <button
              type="button"
              onClick={() => setSelectedListing(null)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center shadow hover:bg-black"
              aria-label="Close preview"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0 border border-gray-100 dark:border-gray-800">
              <img 
                src={selectedListing.imageUrl} 
                alt={selectedListing.title} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover" 
              />
            </div>

            <div className="flex-1 min-w-0 py-0.5">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="text-sm font-extrabold text-purple-700 dark:text-purple-400 font-serif">
                  {selectedListing.price || '$0'}
                </span>
                <span className="text-[10px] text-gray-400 font-semibold truncate">
                  {selectedListing.location}
                </span>
              </div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 line-clamp-1 mb-2">
                {selectedListing.title}
              </h4>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => navigate(`/listing/${selectedListing.id}`)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                >
                  <Eye className="w-3 h-3" />
                  <span>View Posting</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Safe Exchange Zone Detail Card */}
      {selectedSafeZone && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-[450] bg-white dark:bg-gray-900 border-2 border-emerald-500 rounded-3xl p-4 shadow-2xl animate-slide-up space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-lg">
                🛡️
              </span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block">
                  Official Safe Trading Zone
                </span>
                <h4 className="font-serif font-black text-sm text-gray-900 dark:text-gray-100">
                  {selectedSafeZone.name}
                </h4>
              </div>
            </div>
            <button
              onClick={() => setSelectedSafeZone(null)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            {selectedSafeZone.address}
          </p>
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
            ✓ Recommended municipal meetup point with 24/7 video surveillance. Safe for cash payments and item inspection.
          </div>
        </div>
      )}

    </div>
  );
};
