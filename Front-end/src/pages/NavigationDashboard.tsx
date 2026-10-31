import React, { useState } from 'react';
import { NavigationMode, Coordinates, RouteOption, SafeLocation, RiskZone } from '../types';
import { PRESET_LOCATIONS, MOCK_ROUTES, MOCK_SAFE_LOCATIONS, MOCK_RISK_ZONES } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';
import { MainLayout } from '../components/layout/MainLayout';
import { Header } from '../components/layout/Header';
import { SajagMap } from '../components/map/SajagMap';
import { SmartNavigationMode } from '../components/modes/SmartNavigationMode';
import { SafeJourneyMode } from '../components/modes/SafeJourneyMode';
import { RiskAwarenessMode } from '../components/modes/RiskAwarenessMode';
import { LiveMonitoringMode } from '../components/modes/LiveMonitoringMode';
import { EmergencyMode } from '../components/modes/EmergencyMode';
import { FloatingActionHud } from '../components/layout/FloatingActionHud';
import { ProfileModal } from '../components/modals/ProfileModal';
import { Toast } from '../components/common/Toast';

export const NavigationDashboard: React.FC = () => {
  const { t } = useLanguage();

  // Navigation & Location State
  const [activeMode, setActiveMode] = useState<NavigationMode>('smart-navigation');
  const [origin, setOrigin] = useState<Coordinates>(PRESET_LOCATIONS[0]); // Connaught Place
  const [destination, setDestination] = useState<Coordinates>(PRESET_LOCATIONS[1]); // Cyber Hub
  const [routes, setRoutes] = useState<RouteOption[]>(MOCK_ROUTES);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-safest');
  const [safeLocations, setSafeLocations] = useState<SafeLocation[]>(MOCK_SAFE_LOCATIONS);
  const [riskZones, setRiskZones] = useState<RiskZone[]>(MOCK_RISK_ZONES);

  // Map Interactive Picking & Live Simulation State
  const [isPickingLocation, setIsPickingLocation] = useState<'origin' | 'destination' | null>(null);
  const [userSimulatedPosition, setUserSimulatedPosition] = useState<[number, number] | null>(null);

  // Modals & Feedback Notifications
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  const handleLocationPicked = (type: 'origin' | 'destination', coords: Coordinates) => {
    if (type === 'origin') {
      setOrigin(coords);
    } else {
      setDestination(coords);
    }
    setIsPickingLocation(null);
    showToast(`Pinned ${type === 'origin' ? 'Start' : 'Destination'} on map`);
  };

  const handleStartSafeJourney = () => {
    setActiveMode('safe-journey');
    setUserSimulatedPosition(activeRoute.path[0]);
    showToast('Safe tracking initialized along verified corridor');
  };

  const handleEndJourney = () => {
    setUserSimulatedPosition(null);
    setActiveMode('smart-navigation');
    showToast('Journey successfully completed');
  };

  const handleQuickReroute = () => {
    const currentIndex = routes.findIndex((r) => r.id === selectedRouteId);
    const nextRoute = routes[(currentIndex + 1) % routes.length];
    setSelectedRouteId(nextRoute.id);
    showToast(`Rerouted to: ${nextRoute.name}`);
  };

  const handlePingSafeHaven = () => {
    showToast('Checked-in at nearest verified police assistance post.');
  };

  const handleRerouteToSafeHaven = (haven: SafeLocation) => {
    setDestination({
      lat: haven.lat,
      lng: haven.lng,
      name: haven.name,
      address: haven.address,
    });
    setActiveMode('smart-navigation');
    showToast(`Emergency escape path calculated to: ${haven.name}`);
  };

  const handleAddRiskZone = (newZone: RiskZone) => {
    setRiskZones((prev) => [newZone, ...prev]);
    showToast('Hazard reported to community map.');
  };

  const handleFocusRiskZone = (zone: RiskZone) => {
    showToast(`Inspecting hazard: ${zone.title}`);
  };

  return (
    <MainLayout
      header={
        <Header
          activeMode={activeMode}
          onSelectMode={(mode) => {
            setActiveMode(mode);
            if (mode !== 'safe-journey') {
              setUserSimulatedPosition(null);
            }
          }}
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />
      }
      sidebarTitle={t.modes[activeMode]}
      sidebarSubtitle={t.modeSubtitles[activeMode]}
      sidebarContent={
        <>
          {activeMode === 'smart-navigation' && (
            <SmartNavigationMode
              origin={origin}
              setOrigin={setOrigin}
              destination={destination}
              setDestination={setDestination}
              routes={routes}
              selectedRouteId={selectedRouteId}
              onSelectRoute={setSelectedRouteId}
              onStartJourney={handleStartSafeJourney}
              onPickOnMap={(target) => setIsPickingLocation(target)}
            />
          )}

          {activeMode === 'safe-journey' && (
            <SafeJourneyMode
              route={activeRoute}
              safeLocations={safeLocations}
              onSimulatePositionChange={setUserSimulatedPosition}
              onEndJourney={handleEndJourney}
            />
          )}

          {activeMode === 'risk-awareness' && (
            <RiskAwarenessMode
              riskZones={riskZones}
              onAddRiskZone={handleAddRiskZone}
              onFocusRiskZone={handleFocusRiskZone}
            />
          )}

          {activeMode === 'live-monitoring' && <LiveMonitoringMode />}

          {activeMode === 'emergency' && (
            <EmergencyMode
              safeLocations={safeLocations}
              onRerouteToNearestSafeHaven={handleRerouteToSafeHaven}
            />
          )}
        </>
      }
      mapContent={
        <SajagMap
          origin={origin}
          destination={destination}
          routes={routes}
          selectedRouteId={selectedRouteId}
          onSelectRoute={setSelectedRouteId}
          safeLocations={safeLocations}
          riskZones={riskZones}
          isPickingLocation={isPickingLocation}
          onLocationPicked={handleLocationPicked}
          userSimulatedPosition={userSimulatedPosition}
          activeMode={activeMode}
        />
      }
      hudContent={
        activeMode !== 'emergency' && (
          <FloatingActionHud
            activeRoute={activeRoute}
            onQuickReroute={handleQuickReroute}
            onPingSafeHaven={handlePingSafeHaven}
            onOpenEmergency={() => setActiveMode('emergency')}
          />
        )
      }
      toastContent={
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      }
      modalContent={
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      }
    />
  );
};
