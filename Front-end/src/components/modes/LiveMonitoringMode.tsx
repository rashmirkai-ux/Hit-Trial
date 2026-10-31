import React, { useState, useEffect } from 'react';
import { TelemetryData } from '../../types';
import { INITIAL_TELEMETRY } from '../../data/mockData';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Activity,
  RefreshCw,
  Wifi,
  WifiOff,
  Sun,
  CloudRain,
  Shield,
  Eye,
  CheckCircle,
  AlertTriangle,
  Info,
  Radio,
} from 'lucide-react';

export const LiveMonitoringMode: React.FC = () => {
  const { t } = useLanguage();
  const [telemetry, setTelemetry] = useState<TelemetryData>(INITIAL_TELEMETRY);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());

  // Auto-refresh timer (every 15s)
  useEffect(() => {
    let interval: any = null;
    if (autoRefreshEnabled) {
      interval = setInterval(() => {
        handleManualRefresh();
      }, 15000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefreshEnabled]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate realistic road sensor jitter
      setTelemetry((prev) => ({
        ...prev,
        trafficCongestionIndex: Math.floor(25 + Math.random() * 20),
        weatherVisibilityKm: parseFloat((8.5 + Math.random() * 2.0).toFixed(1)),
        lastUpdated: new Date().toLocaleTimeString(),
        dataSource: 'simulated', // Explicitly simulated as instructed!
      }));
      setLastRefreshedAt(new Date());
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Telemetry Control & Data Source Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600" />
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              {t.liveTelemetry}
            </h3>
          </div>

          {/* Strict Data Transparency Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Info className="w-3 h-3" />
            <span>{t.statusSimulated}</span>
          </div>
        </div>

        {/* Data Freshness Controls */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-slate-400">
            Updated: {lastRefreshedAt.toLocaleTimeString()}
          </span>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefreshEnabled}
                onChange={(e) => setAutoRefreshEnabled(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-[11px] font-medium">{t.autoRefresh}</span>
            </label>

            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition-colors"
              title={t.manualRefresh}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Sensor Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* 1. Traffic Congestion */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t.trafficIndex}</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-slate-900 dark:text-slate-100">
              {telemetry.trafficCongestionIndex}%
            </span>
            <span className="text-[11px] font-bold text-emerald-600">Moderate Flow</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full"
              style={{ width: `${telemetry.trafficCongestionIndex}%` }}
            />
          </div>
        </div>

        {/* 2. Street Lighting Grid */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t.lightingIndex}</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-slate-900 dark:text-slate-100">
              98.4%
            </span>
            <span className="text-[11px] font-bold text-emerald-600">{t.operational}</span>
          </div>
          <p className="text-[10px] text-slate-400">Smart Grid Automated Diagnostic</p>
        </div>

        {/* 3. Atmospheric Visibility */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t.visibilityIndex}</span>
            <Eye className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-slate-900 dark:text-slate-100">
              {telemetry.weatherVisibilityKm} km
            </span>
            <span className="text-[11px] font-bold text-emerald-600">Optimal Range</span>
          </div>
          <p className="text-[10px] text-slate-400">Clear road ahead, zero fog alerts</p>
        </div>

        {/* 4. Road Surface Condition */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t.roadSurface}</span>
            <CloudRain className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-slate-900 dark:text-slate-100">
              {t.dry}
            </span>
            <span className="text-[11px] font-bold text-emerald-600">High Traction</span>
          </div>
          <p className="text-[10px] text-slate-400">Zero surface water pooling reported</p>
        </div>
      </div>

      {/* Sensor Status Legend */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Sensor Infrastructure Status
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Highway Smart CCTV Nodes (NH-48)
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              42/42 Active
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Police Patrol Radio Telemetry
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              High Density
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Ridge Sector Ambient Acoustic Sensors
              </span>
            </div>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
              {t.statusUnavailable}
            </span>
          </div>
        </div>
      </div>

      {/* Active Traffic & Safety Advisories */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          {t.activeAdvisories}
        </h4>
        <div className="space-y-2 text-xs">
          <div className="p-2.5 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-xl text-amber-900 dark:text-amber-200">
            <p className="font-bold">Dhaula Kuan Junction Peak Flow</p>
            <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
              Service lanes undergoing routine surface inspection. Expect 3-minute transit delay.
            </p>
          </div>
          <div className="p-2.5 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 rounded-xl text-blue-900 dark:text-blue-200">
            <p className="font-bold">Pink Police Booth Patrol Active</p>
            <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-0.5">
              Dedicated women commuter support vehicles patrolling South Ext to Cyber Hub stretch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
