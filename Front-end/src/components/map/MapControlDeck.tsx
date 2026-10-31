import React, { useState } from 'react';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Target,
  LocateFixed,
  ShieldCheck,
  AlertTriangle,
  Moon,
  Sun,
  Satellite,
  Compass,
  Check,
  Map as MapIcon,
} from 'lucide-react';

export type BasemapType = 'voyager' | 'positron' | 'dark' | 'satellite';

interface MapControlDeckProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRecenter: () => void;
  onLocateMe: () => void;
  isLocating: boolean;
  basemap: BasemapType;
  onChangeBasemap: (type: BasemapType) => void;
  showRiskOverlay: boolean;
  onToggleRiskOverlay: () => void;
  showSafeHavens: boolean;
  onToggleSafeHavens: () => void;
  className?: string;
}

export const MapControlDeck: React.FC<MapControlDeckProps> = ({
  onZoomIn,
  onZoomOut,
  onRecenter,
  onLocateMe,
  isLocating,
  basemap,
  onChangeBasemap,
  showRiskOverlay,
  onToggleRiskOverlay,
  showSafeHavens,
  onToggleSafeHavens,
  className = '',
}) => {
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  return (
    <div className={`flex flex-col items-end gap-2.5 z-20 select-none ${className}`}>
      {/* 1. Layers & Overlay Settings Button */}
      <div className="relative">
        <button
          onClick={() => setShowLayerMenu(!showLayerMenu)}
          className={`h-10 px-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border shadow-md flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
            showLayerMenu
              ? 'border-blue-600 text-blue-600 ring-2 ring-blue-600/10'
              : 'border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
          title="Map Layers & Basemap Styles"
          aria-expanded={showLayerMenu}
          aria-label="Map Layers & Basemap Styles"
        >
          <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="hidden sm:inline">Layers</span>
        </button>

        {/* Dropdown Menu */}
        {showLayerMenu && (
          <div className="absolute right-0 top-12 w-64 p-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3 animate-in fade-in zoom-in-95">
            {/* Basemap Styles */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block px-1">
                Basemap Appearance
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {/* Voyager Standard */}
                <button
                  onClick={() => onChangeBasemap('voyager')}
                  className={`p-2 rounded-xl text-left border flex items-center justify-between cursor-pointer transition-colors ${
                    basemap === 'voyager'
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <MapIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>Voyager</span>
                  </div>
                  {basemap === 'voyager' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>

                {/* Positron Clean Light */}
                <button
                  onClick={() => onChangeBasemap('positron')}
                  className={`p-2 rounded-xl text-left border flex items-center justify-between cursor-pointer transition-colors ${
                    basemap === 'positron'
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Positron</span>
                  </div>
                  {basemap === 'positron' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>

                {/* Dark Matter Night */}
                <button
                  onClick={() => onChangeBasemap('dark')}
                  className={`p-2 rounded-xl text-left border flex items-center justify-between cursor-pointer transition-colors ${
                    basemap === 'dark'
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Dark</span>
                  </div>
                  {basemap === 'dark' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>

                {/* Satellite Imagery */}
                <button
                  onClick={() => onChangeBasemap('satellite')}
                  className={`p-2 rounded-xl text-left border flex items-center justify-between cursor-pointer transition-colors ${
                    basemap === 'satellite'
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Satellite className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Aerial</span>
                  </div>
                  {basemap === 'satellite' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              </div>
            </div>

            {/* Overlays Switch Toggles */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block px-1">
                Safety Overlays
              </span>

              {/* Safe Havens Toggle */}
              <button
                type="button"
                onClick={onToggleSafeHavens}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold cursor-pointer"
              >
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Safe Havens</span>
                </div>
                <div
                  className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center px-0.5 ${
                    showSafeHavens ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white shadow-xs transition-transform ${
                      showSafeHavens ? 'translate-x-3.5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </button>

              {/* Risk Zones Toggle */}
              <button
                type="button"
                onClick={onToggleRiskOverlay}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold cursor-pointer"
              >
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Hazards & Risks</span>
                </div>
                <div
                  className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center px-0.5 ${
                    showRiskOverlay ? 'bg-amber-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white shadow-xs transition-transform ${
                      showRiskOverlay ? 'translate-x-3.5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Utility Group: Recenter & GPS Locate Me */}
      <div className="flex flex-col bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-md p-1 gap-1">
        {/* Recenter & Fit Route */}
        <button
          onClick={onRecenter}
          className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          title="Fit entire route trajectory"
          aria-label="Fit entire route"
        >
          <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </button>

        {/* Locate Me (GPS) */}
        <button
          onClick={onLocateMe}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
            isLocating
              ? 'bg-blue-600 text-white animate-pulse'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
          }`}
          title="Locate my position via GPS"
          aria-label="Locate my position via GPS"
        >
          <LocateFixed className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Zoom Controls Pill (+ / -) */}
      <div className="flex flex-col bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-md p-1">
        <button
          onClick={onZoomIn}
          className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-black text-lg flex items-center justify-center transition-colors cursor-pointer"
          title="Zoom in"
          aria-label="Zoom in"
        >
          +
        </button>
        <div className="h-[1px] bg-slate-200/80 dark:bg-slate-800 mx-1.5" />
        <button
          onClick={onZoomOut}
          className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-black text-lg flex items-center justify-center transition-colors cursor-pointer"
          title="Zoom out"
          aria-label="Zoom out"
        >
          −
        </button>
      </div>
    </div>
  );
};
