import React, { useState } from 'react';
import { RouteOption } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  ShieldCheck,
  Zap,
  Scale,
  Clock,
  Compass,
  ChevronDown,
  ChevronUp,
  Navigation,
  Sparkles,
} from 'lucide-react';

interface MapFloatingRouteCardProps {
  routes: RouteOption[];
  selectedRouteId: string;
  onSelectRoute: (id: string) => void;
  className?: string;
}

export const MapFloatingRouteCard: React.FC<MapFloatingRouteCardProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute,
  className = '',
}) => {
  const { t, language } = useLanguage();
  const [isMinimized, setIsMinimized] = useState(false);

  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  const getRouteIcon = (type: RouteOption['type']) => {
    switch (type) {
      case 'safest':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />;
      case 'fastest':
        return <Zap className="w-3.5 h-3.5 text-amber-500" />;
      case 'balanced':
        return <Scale className="w-3.5 h-3.5 text-blue-600" />;
    }
  };

  const getRouteBadgeColor = (type: RouteOption['type']) => {
    switch (type) {
      case 'safest':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'fastest':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'balanced':
        return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    }
  };

  const nextStep = activeRoute?.steps?.[0];

  return (
    <div
      className={`bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xl transition-all duration-300 text-slate-800 dark:text-slate-100 ${
        isMinimized ? 'w-auto' : 'w-80 sm:w-84 max-w-[calc(100vw-3rem)]'
      } ${className}`}
      aria-label="Active Route Navigation Status"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between p-3 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
            <Navigation className="w-4 h-4 fill-current text-blue-600" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                ACTIVE CORRIDOR
              </span>
            </div>
            <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
              {activeRoute?.name || 'Selected Route'}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Quick Metrics when minimized */}
          {isMinimized && (
            <div className="flex items-center gap-2 px-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="text-blue-600 font-extrabold">{activeRoute.durationMinutes}m</span>
              <span className="text-emerald-600 font-extrabold">🛡️{activeRoute.safetyScore}</span>
            </div>
          )}

          {/* Minimize / Expand Toggle */}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            title={isMinimized ? 'Expand Route Details' : 'Minimize to Card Pill'}
            aria-label={isMinimized ? 'Expand Route Details' : 'Minimize Route Details'}
          >
            {isMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Content Body */}
      {!isMinimized && (
        <div className="px-3 pb-3 space-y-2.5 pt-0 border-t border-slate-100 dark:border-slate-800/80">
          {/* Metrics Row: ETA, Distance, Safety Score */}
          <div className="grid grid-cols-3 gap-1.5 pt-2 text-center">
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2 border border-slate-100 dark:border-slate-700/50">
              <span className="text-[10px] text-slate-400 block font-medium">Duration</span>
              <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                {activeRoute.durationMinutes} min
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2 border border-slate-100 dark:border-slate-700/50">
              <span className="text-[10px] text-slate-400 block font-medium">Distance</span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                {activeRoute.distanceKm} km
              </span>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-xl p-2 border border-emerald-200/80 dark:border-emerald-800/50">
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block font-medium">Safety Score</span>
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-300">
                {activeRoute.safetyScore}/100
              </span>
            </div>
          </div>

          {/* Next Turn Maneuver Preview */}
          {nextStep && (
            <div className="bg-slate-50/80 dark:bg-slate-800/40 rounded-xl p-2.5 border border-slate-200/70 dark:border-slate-700/50 flex items-start gap-2 text-xs">
              <Compass className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] leading-tight">
                  {nextStep.instruction}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{nextStep.distance} • {nextStep.duration}</p>
              </div>
            </div>
          )}

          {/* Quick Route Switcher Pills */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-0.5">
              Compare Alternatives
            </span>
            <div className="grid grid-cols-3 gap-1">
              {routes.map((r) => {
                const isSelected = r.id === selectedRouteId;
                return (
                  <button
                    key={r.id}
                    onClick={() => onSelectRoute(r.id)}
                    className={`px-2 py-1.5 rounded-xl text-[10px] font-bold border transition-all flex flex-col items-center justify-center cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                    }`}
                  >
                    <span className="capitalize truncate">{r.type}</span>
                    <span className={isSelected ? 'text-white' : 'text-slate-400'}>
                      {r.durationMinutes}m • {r.safetyScore}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
