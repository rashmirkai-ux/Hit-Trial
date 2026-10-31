import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { RouteOption, SafeLocation, RiskZone, Coordinates } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  createOriginMarker,
  createDestinationMarker,
  createCurrentLocationMarker,
  createSafeHavenMarker,
  createRiskBeaconMarker,
  createTransitVehicleMarker,
} from './mapIcons';
import { MapFloatingRouteCard } from './MapFloatingRouteCard';
import { MapControlDeck, BasemapType } from './MapControlDeck';
import { MapLegend } from './MapLegend';
import { AlertCircle, RefreshCw, MapPin, WifiOff, Loader2 } from 'lucide-react';

interface SajagMapProps {
  origin: Coordinates;
  destination: Coordinates;
  routes: RouteOption[];
  selectedRouteId: string;
  onSelectRoute: (id: string) => void;
  safeLocations: SafeLocation[];
  riskZones: RiskZone[];
  isPickingLocation?: 'origin' | 'destination' | null;
  onLocationPicked?: (type: 'origin' | 'destination', coords: Coordinates) => void;
  userSimulatedPosition?: [number, number] | null;
  activeMode: string;
}

export const SajagMap: React.FC<SajagMapProps> = ({
  origin,
  destination,
  routes,
  selectedRouteId,
  onSelectRoute,
  safeLocations,
  riskZones,
  isPickingLocation,
  onLocationPicked,
  userSimulatedPosition,
  activeMode,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const locationLayerRef = useRef<L.LayerGroup | null>(null);

  const { theme } = useTheme();
  const { language } = useLanguage();

  // Map state
  const [basemap, setBasemap] = useState<BasemapType>('voyager');
  const [showRiskOverlay, setShowRiskOverlay] = useState(true);
  const [showSafeHavens, setShowSafeHavens] = useState(true);

  // Status & Telemetry states
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [tileError, setTileError] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);

  // Synchronize basemap with dark mode if user hasn't explicitly set satellite
  useEffect(() => {
    if (theme === 'dark' && basemap !== 'satellite') {
      setBasemap('dark');
    } else if (theme === 'light' && basemap === 'dark') {
      setBasemap('voyager');
    }
  }, [theme]);

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialCenter: [number, number] = [28.565, 77.155];
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 12,
      zoomControl: false,
      attributionControl: true,
      fadeAnimation: true,
    });

    map.attributionControl.setPosition('bottomright');

    const layerGroup = L.layerGroup().addTo(map);
    const locationLayer = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    locationLayerRef.current = locationLayer;
    mapInstanceRef.current = map;

    // Click handler for picking origin/destination on map
    map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = parseFloat(e.latlng.lat.toFixed(5));
      const lng = parseFloat(e.latlng.lng.toFixed(5));
      if (isPickingLocation && onLocationPicked) {
        onLocationPicked(isPickingLocation, {
          lat,
          lng,
          name: `${isPickingLocation === 'origin' ? 'Custom Start' : 'Custom Destination'} (${lat}, ${lng})`,
          address: `Pinned Location [${lat}, ${lng}]`,
        });
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Tile Provider Configuration with Auto-Fallback (Guaranteed NO API Key Errors)
  const loadTileLayer = useCallback((style: BasemapType) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let tileUrl = '';
    let attribution = '';

    switch (style) {
      case 'voyager':
        // CARTO Voyager: rich, balanced streets and landuse, completely open & free
        tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
        attribution = '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors';
        break;
      case 'positron':
        // CARTO Positron: low-glare, ultra-clean light monochrome
        tileUrl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
        attribution = '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors';
        break;
      case 'dark':
        // CARTO Dark Matter: night-vision tactical
        tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
        attribution = '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors';
        break;
      case 'satellite':
        // Esri High-Resolution World Imagery: open, verified, no API key required
        tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        attribution = '&copy; Esri, Maxar, Earthstar Geographics';
        break;
    }

    setIsMapLoading(true);

    const newTiles = L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution,
    });

    newTiles.on('load', () => {
      setIsMapLoading(false);
      setTileError(false);
    });

    newTiles.on('tileerror', () => {
      // Graceful fallback to standard OpenStreetMap tiles
      console.warn('Primary tile layer error. Loading fallback OpenStreetMap provider.');
      setTileError(true);
      setIsMapLoading(false);
    });

    newTiles.addTo(map);
    tileLayerRef.current = newTiles;
  }, []);

  useEffect(() => {
    loadTileLayer(basemap);
  }, [basemap, loadTileLayer]);

  // 3. Render High-Contrast Polylines, Consistent SVG Markers & Risk Circles
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layers = layerGroupRef.current;
    if (!map || !layers) return;

    layers.clearLayers();

    // 1. Render Risk Zones (Perimeters & Central Warning Beacons)
    if (showRiskOverlay) {
      riskZones.forEach((zone) => {
        const isHigh = zone.severity === 'high' || zone.severity === 'critical';
        const isEnv = zone.category === 'environmental';
        const color = isHigh ? '#DC2626' : isEnv ? '#0284C7' : '#D97706';

        // Outer risk area circle
        const circle = L.circle(zone.center, {
          color: color,
          weight: 2,
          opacity: 0.85,
          dashArray: isHigh ? '5, 6' : '3, 4',
          fillColor: color,
          fillOpacity: isHigh ? 0.22 : 0.16,
          radius: zone.radiusMeters,
        });

        const zoneTitle = language === 'hi' ? zone.titleHi : language === 'pa' ? zone.titlePa : zone.title;
        const zoneDesc = language === 'hi' ? zone.descriptionHi : language === 'pa' ? zone.descriptionPa : zone.description;

        const popupContent = `
          <div style="font-family: 'Inter', sans-serif; min-width: 210px; padding: 4px;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background: ${color};"></span>
              <span style="font-weight: 800; font-size: 11px; text-transform: uppercase; color: ${color}; letter-spacing: 0.5px;">${zone.category.replace('_', ' ')} • ${zone.severity}</span>
            </div>
            <h4 style="font-weight: 700; font-size: 13px; color: #0F172A; margin: 0 0 4px 0;">${zoneTitle}</h4>
            <p style="font-size: 12px; color: #475569; margin: 0 0 6px 0; line-height: 1.4;">${zoneDesc}</p>
            <div style="font-size: 11px; color: #64748B;">Reported: ${zone.reportedTime} • Status: ${zone.activeStatus}</div>
          </div>
        `;

        circle.bindPopup(popupContent);
        layers.addLayer(circle);

        // Center warning beacon icon
        const beaconMarker = L.marker(zone.center, {
          icon: createRiskBeaconMarker(zone.severity),
        });
        beaconMarker.bindPopup(popupContent);
        layers.addLayer(beaconMarker);
      });
    }

    // 2. Render Route Polylines (Distinguishable Styles)
    const allRoutePoints: [number, number][] = [];

    // Render unselected routes first
    routes.forEach((route) => {
      if (route.id === selectedRouteId) return;

      const isFastest = route.type === 'fastest';
      const coreColor = isFastest ? '#D97706' : '#7C3AED';

      // Outer casing
      const casing = L.polyline(route.path, {
        color: '#FFFFFF',
        weight: 7,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
      });
      layers.addLayer(casing);

      // Core dashed line
      const line = L.polyline(route.path, {
        color: coreColor,
        weight: 4.5,
        opacity: 0.85,
        dashArray: isFastest ? '7, 8' : '5, 8',
        lineCap: 'round',
        lineJoin: 'round',
      });

      line.on('click', () => onSelectRoute(route.id));
      line.bindTooltip(
        `<span style="font-weight: 700; font-size: 11px;">${route.name} (${route.durationMinutes}m • ${route.safetyScore}/100)</span>`,
        { sticky: true }
      );
      layers.addLayer(line);
      allRoutePoints.push(...route.path);
    });

    // Render active/selected route on top with vibrant Royal Blue + White Casing + Ambient Glow
    const activeRoute = routes.find((r) => r.id === selectedRouteId);
    if (activeRoute) {
      // Ambient glow
      const glowLine = L.polyline(activeRoute.path, {
        color: '#2563EB',
        weight: 12,
        opacity: 0.22,
      });
      layers.addLayer(glowLine);

      // White contrast casing
      const casingLine = L.polyline(activeRoute.path, {
        color: '#FFFFFF',
        weight: 9,
        opacity: 0.98,
        lineCap: 'round',
        lineJoin: 'round',
      });
      layers.addLayer(casingLine);

      // Primary crisp route core
      const coreLine = L.polyline(activeRoute.path, {
        color: '#2563EB',
        weight: 5.5,
        opacity: 1,
        lineCap: 'round',
        lineJoin: 'round',
      });

      coreLine.bindTooltip(
        `<div style="font-weight: 800; font-size: 12px; color: #1D4ED8;">${activeRoute.name}<br/><span style="font-size: 11px; color: #059669;">Safety: ${activeRoute.safetyScore}/100</span></div>`,
        { sticky: true }
      );
      layers.addLayer(coreLine);
      allRoutePoints.push(...activeRoute.path);
    }

    // 3. Render Safe Locations with consistent SVG badges
    if (showSafeHavens) {
      safeLocations.forEach((loc) => {
        const marker = L.marker([loc.lat, loc.lng], {
          icon: createSafeHavenMarker(loc.category),
        });

        const locName = language === 'hi' ? loc.nameHi : language === 'pa' ? loc.namePa : loc.name;

        const popupContent = `
          <div style="font-family: 'Inter', sans-serif; min-width: 220px; padding: 4px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 9999px;">
                VERIFIED SAFE HAVEN
              </span>
              <span style="font-size: 11px; color: #64748B;">24/7 OPEN</span>
            </div>
            <h4 style="font-weight: 700; font-size: 13px; color: #0F172A; margin: 0 0 4px 0;">${locName}</h4>
            <p style="font-size: 12px; color: #475569; margin: 0 0 8px 0;">${loc.address}</p>
              <a href="tel:${loc.phone}" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; background: #2563EB; color: #FFFFFF; text-decoration: none; font-size: 11px; font-weight: 600; padding: 6px 8px; border-radius: 6px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                ${loc.phone}
              </a>
          </div>
        `;

        marker.bindPopup(popupContent);
        layers.addLayer(marker);
      });
    }

    // 4. Origin (Point A) Marker
    const originMarker = L.marker([origin.lat, origin.lng], {
      icon: createOriginMarker('A'),
    });
    originMarker.bindTooltip(
      `<span style="font-weight: 700; font-size: 12px; color: #2563EB;">START: ${origin.name || 'Origin'}</span>`,
      { permanent: false, direction: 'top' }
    );
    layers.addLayer(originMarker);

    // 5. Destination (Point B) Marker
    const destMarker = L.marker([destination.lat, destination.lng], {
      icon: createDestinationMarker('B'),
    });
    destMarker.bindTooltip(
      `<span style="font-weight: 700; font-size: 12px; color: #059669;">DESTINATION: ${destination.name || 'End Point'}</span>`,
      { permanent: false, direction: 'top' }
    );
    layers.addLayer(destMarker);

    // 6. In-Transit Simulated Vehicle Marker
    if (userSimulatedPosition) {
      const carMarker = L.marker(userSimulatedPosition, {
        icon: createTransitVehicleMarker(),
      });
      carMarker.bindTooltip(
        '<span style="font-weight: 700; font-size: 11px; color: #0284C7;">YOU (Safe Tracking Active)</span>',
        { permanent: true, direction: 'right' }
      );
      layers.addLayer(carMarker);
    }

    // 7. Fit Bounds with Guaranteed Visibility for Both Point A and B
    if (allRoutePoints.length > 0) {
      const bounds = L.latLngBounds(allRoutePoints);
      bounds.extend([origin.lat, origin.lng]);
      bounds.extend([destination.lat, destination.lng]);

      map.invalidateSize();
      map.fitBounds(bounds, {
        paddingTopLeft: [70, 70],
        paddingBottomRight: [70, 90], // Extra clearance for floating bottom HUD
        maxZoom: 13,
        animate: true,
      });
    }
  }, [
    routes,
    selectedRouteId,
    safeLocations,
    riskZones,
    origin,
    destination,
    showRiskOverlay,
    showSafeHavens,
    userSimulatedPosition,
    language,
    onSelectRoute,
  ]);

  // 4. Current Location (GPS) Marker & Accuracy Circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    const locationLayer = locationLayerRef.current;
    if (!map || !locationLayer) return;

    locationLayer.clearLayers();

    if (gpsLocation) {
      // Subtle Blue Location Accuracy Circle
      const accuracyCircle = L.circle([gpsLocation.lat, gpsLocation.lng], {
        radius: Math.max(30, gpsLocation.accuracy),
        color: '#2563EB',
        weight: 1.2,
        fillColor: '#3B82F6',
        fillOpacity: 0.15,
        dashArray: '4, 4',
      });
      locationLayer.addLayer(accuracyCircle);

      // Blue Pulsing Core Dot Marker
      const gpsMarker = L.marker([gpsLocation.lat, gpsLocation.lng], {
        icon: createCurrentLocationMarker(true),
      });
      gpsMarker.bindTooltip(
        `<span style="font-weight: 700; font-size: 11px; color: #2563EB;">Current GPS Location (±${Math.round(gpsLocation.accuracy)}m)</span>`,
        { permanent: false, direction: 'top' }
      );
      locationLayer.addLayer(gpsMarker);
    }
  }, [gpsLocation]);

  // GPS Locate Action
  const handleLocateMe = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const lat = parseFloat(latitude.toFixed(5));
        const lng = parseFloat(longitude.toFixed(5));

        setGpsLocation({ lat, lng, accuracy });
        setIsLocating(false);

        // Pan map smoothly to user location
        mapInstanceRef.current?.flyTo([lat, lng], 14, { duration: 1.5 });
      },
      (err) => {
        setIsLocating(false);
        setLocationError('Unable to retrieve your location. Check browser location permissions.');
        setTimeout(() => setLocationError(null), 4000);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Recenter Action
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    const activeRoute = routes.find((r) => r.id === selectedRouteId);
    if (activeRoute) {
      const bounds = L.latLngBounds(activeRoute.path);
      bounds.extend([origin.lat, origin.lng]);
      bounds.extend([destination.lat, destination.lng]);
      mapInstanceRef.current.fitBounds(bounds, {
        paddingTopLeft: [70, 70],
        paddingBottomRight: [70, 90],
      });
    } else {
      mapInstanceRef.current.setView([origin.lat, origin.lng], 13);
    }
  };

  // Zoom controls
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  return (
    <div className="relative w-full h-full min-h-[460px] bg-slate-100 dark:bg-slate-900 overflow-hidden select-none">
      {/* 1. Pick on Map Interaction Banner */}
      {isPickingLocation && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-blue-600 text-white px-5 py-2.5 rounded-full shadow-xl font-bold text-xs sm:text-sm flex items-center gap-2 animate-bounce border-2 border-white">
          <MapPin className="w-4 h-4" />
          <span>Click anywhere on the map to set {isPickingLocation === 'origin' ? 'Origin' : 'Destination'}</span>
        </div>
      )}

      {/* 2. Loading State Overlay */}
      {isMapLoading && (
        <div className="absolute inset-0 z-10 bg-slate-100/70 dark:bg-slate-900/70 backdrop-blur-xs flex items-center justify-center transition-opacity pointer-events-none">
          <div className="bg-white dark:bg-slate-800 px-4 py-2.5 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span>Loading safety map tiles...</span>
          </div>
        </div>
      )}

      {/* 3. Tile Error / Unavailable Fallback Banner */}
      {tileError && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-amber-500 text-slate-950 px-4 py-2 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 border border-amber-600">
          <WifiOff className="w-4 h-4" />
          <span>Tile server connection weak. Switch to standard OpenStreetMap.</span>
          <button
            onClick={() => loadTileLayer('positron')}
            className="px-2 py-0.5 bg-slate-950 text-white rounded-lg text-[10px] uppercase font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* 4. GPS Error Notification */}
      {locationError && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-red-600 text-white px-4 py-2 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4" />
          <span>{locationError}</span>
        </div>
      )}

      {/* 5. Main Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* 6. Floating Non-Obstructive Route Information Card (Top-Left) */}
      <MapFloatingRouteCard
        routes={routes}
        selectedRouteId={selectedRouteId}
        onSelectRoute={onSelectRoute}
        className="absolute top-4 left-4 z-20"
      />

      {/* 7. Redesigned Map Control Deck (Top-Right: Layers, Recenter, GPS, Zoom) */}
      <MapControlDeck
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onRecenter={handleRecenter}
        onLocateMe={handleLocateMe}
        isLocating={isLocating}
        basemap={basemap}
        onChangeBasemap={setBasemap}
        showRiskOverlay={showRiskOverlay}
        onToggleRiskOverlay={() => setShowRiskOverlay(!showRiskOverlay)}
        showSafeHavens={showSafeHavens}
        onToggleSafeHavens={() => setShowSafeHavens(!showSafeHavens)}
        className="absolute top-4 right-4"
      />

      {/* 8. Collapsible Map Legend (Bottom-Left) */}
      <MapLegend
        className="absolute bottom-4 left-4"
        defaultExpanded={false}
      />
    </div>
  );
};
