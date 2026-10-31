import L from 'leaflet';
import { SafeLocation, RiskZone } from '../../types';

/**
 * Creates high-fidelity, consistent SVG-based markers for SAJAG Navigation
 * No low-res emojis or inconsistent platform icons.
 */

// 1. Origin (Point A) Marker
export const createOriginMarker = (label = 'A'): L.DivIcon => {
  const html = `
    <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
      <!-- Outer Beacon Pulse -->
      <div style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background: rgba(37, 99, 235, 0.25); animation: pulse 2s infinite ease-in-out;"></div>
      <!-- Pin Body -->
      <div style="position: relative; width: 34px; height: 34px; background: #2563EB; border: 3px solid #FFFFFF; border-radius: 9999px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.45); display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-weight: 800; font-size: 13px; font-family: 'Plus Jakarta Sans', sans-serif;">
        ${label}
      </div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'sajag-origin-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

// 2. Destination (Point B) Marker
export const createDestinationMarker = (label = 'B'): L.DivIcon => {
  const html = `
    <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background: rgba(5, 150, 105, 0.25); animation: pulse 2s infinite ease-in-out;"></div>
      <div style="position: relative; width: 34px; height: 34px; background: #059669; border: 3px solid #FFFFFF; border-radius: 9999px; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.45); display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-weight: 800; font-size: 13px; font-family: 'Plus Jakarta Sans', sans-serif;">
        ${label}
      </div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'sajag-dest-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

// 3. Current Live GPS Location Indicator (Blue Dot + Accuracy Ring)
export const createCurrentLocationMarker = (isTracking = false): L.DivIcon => {
  const html = `
    <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
      <!-- Pulsing Radar Wave -->
      <div style="position: absolute; inset: -4px; border-radius: 9999px; background: rgba(37, 99, 235, 0.3); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <!-- Core Indicator -->
      <div style="width: 20px; height: 20px; border-radius: 9999px; background: #2563EB; border: 3px solid #FFFFFF; box-shadow: 0 0 10px rgba(37, 99, 235, 0.7); display: flex; align-items: center; justify-content: center;">
        <div style="width: 6px; height: 6px; border-radius: 9999px; background: #FFFFFF;"></div>
      </div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'sajag-gps-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// 4. Safe Haven Consistent SVG Marker (Police, Hospital, Fuel, Women Desk)
export const createSafeHavenMarker = (category: SafeLocation['category']): L.DivIcon => {
  let borderColor = '#059669'; // default safe emerald
  let svgPath = '';

  if (category === 'police') {
    borderColor = '#004AC6';
    // Shield with star
    svgPath = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${borderColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M12 8v4"/>
        <path d="M12 16h.01"/>
      </svg>
    `;
  } else if (category === 'hospital') {
    borderColor = '#DC2626';
    // Medical cross
    svgPath = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="${borderColor}">
        <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z"/>
      </svg>
    `;
  } else if (category === 'fuel_station') {
    borderColor = '#D97706';
    // Fuel pump
    svgPath = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${borderColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 22h12"/>
        <path d="M4 9h10"/>
        <path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/>
        <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/>
      </svg>
    `;
  } else if (category === 'women_desk') {
    borderColor = '#7C3AED';
    // Heart shield / safe shelter
    svgPath = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${borderColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      </svg>
    `;
  } else {
    // General Safe Haven
    svgPath = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${borderColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    `;
  }

  const html = `
    <div style="width: 32px; height: 32px; background: #FFFFFF; border: 2.5px solid ${borderColor}; border-radius: 9999px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.16); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.15s ease;">
      ${svgPath}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'sajag-haven-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// 5. Risk Zone Center Warning Beacon (Hazard SVG)
export const createRiskBeaconMarker = (severity: RiskZone['severity']): L.DivIcon => {
  const isHigh = severity === 'high' || severity === 'critical';
  const color = isHigh ? '#DC2626' : '#D97706';

  const html = `
    <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; inset: 0; border-radius: 9999px; background: ${isHigh ? 'rgba(220, 38, 38, 0.3)' : 'rgba(217, 119, 6, 0.3)'}; ${isHigh ? 'animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;' : ''}"></div>
      <div style="width: 22px; height: 22px; background: ${color}; border: 2px solid #FFFFFF; border-radius: 9999px; box-shadow: 0 2px 6px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; color: #FFFFFF;">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'sajag-risk-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

// 6. Simulated In-Transit Vehicle Marker
export const createTransitVehicleMarker = (): L.DivIcon => {
  const html = `
    <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; inset: -4px; border-radius: 9999px; border: 1.5px dashed #38BDF8; animation: spin 8s linear infinite;"></div>
      <div style="width: 28px; height: 28px; background: #0F172A; border: 2px solid #38BDF8; border-radius: 9999px; box-shadow: 0 0 12px rgba(56, 189, 248, 0.6); display: flex; align-items: center; justify-content: center; color: #38BDF8;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.9 2 11.2 2 11.5V16c0 .6.4 1 1 1h2"/>
          <circle cx="7" cy="17" r="2"/>
          <path d="M9 17h6"/>
          <circle cx="17" cy="17" r="2"/>
        </svg>
      </div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'sajag-transit-car',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
};
