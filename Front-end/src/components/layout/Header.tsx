import React, { useState } from 'react';
import { NavigationMode, Language } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Shield,
  Navigation,
  Compass,
  AlertTriangle,
  Activity,
  AlertOctagon,
  Sun,
  Moon,
  Globe,
  User,
  Check,
} from 'lucide-react';

interface HeaderProps {
  activeMode: NavigationMode;
  onSelectMode: (mode: NavigationMode) => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeMode,
  onSelectMode,
  onOpenProfile,
}) => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [showLangMenu, setShowLangMenu] = useState(false);

  // 4 Primary navigation modes
  const primaryNavModes: { id: NavigationMode; label: string; icon: any }[] = [
    { id: 'smart-navigation', label: t.modes['smart-navigation'], icon: Navigation },
    { id: 'safe-journey', label: t.modes['safe-journey'], icon: Compass },
    { id: 'risk-awareness', label: t.modes['risk-awareness'], icon: AlertTriangle },
    { id: 'live-monitoring', label: t.modes['live-monitoring'], icon: Activity },
  ];

  const languages: { code: Language; label: string; nativeName: string }[] = [
    { code: 'en', label: 'English', nativeName: 'EN' },
    { code: 'hi', label: 'हिन्दी', nativeName: 'हिन्दी' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ', nativeName: 'ਪੰਜਾਬੀ' },
  ];

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* 1. Brand Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white shadow-sm shadow-blue-600/30">
              <Shield className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-slate-100">
                  {t.brandName}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60 hidden sm:inline-block">
                  SAFETY PLATFORM
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block leading-none mt-0.5">
                AI-Assisted Smart Navigation
              </p>
            </div>
          </div>

          {/* 2. Desktop Segmented Navigation Tabs (4 Core Modes) */}
          <nav
            aria-label="Operating Modes"
            className="hidden lg:flex items-center bg-slate-100/90 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700/60"
          >
            {primaryNavModes.map((item) => {
              const Icon = item.icon;
              const isActive = activeMode === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectMode(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200/60 dark:border-slate-800'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-750'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* 3. Controls & Visually Distinct Emergency Action */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Visually Distinct Emergency Action Button */}
            <button
              onClick={() => onSelectMode('emergency')}
              className={`h-9 px-3 sm:px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer select-none ${
                activeMode === 'emergency'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-2 ring-red-600/20'
                  : 'bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/60'
              }`}
              title="Emergency Mode & SOS Assistance"
              aria-label="Open Emergency Mode"
            >
              <AlertOctagon className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              <span className="font-heading uppercase tracking-wider text-[11px]">
                {activeMode === 'emergency' ? 'SOS Active' : 'Emergency'}
              </span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="h-9 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer"
                title="Change Interface Language"
                aria-expanded={showLangMenu}
                aria-label="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="uppercase">{currentLang.nativeName}</span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 top-11 w-36 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl p-1 z-50 animate-in fade-in zoom-in-95">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                        language === l.code
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{l.label}</span>
                      {language === l.code && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              title={theme === 'dark' ? t.themeLight : t.themeDark}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* User Profile Trigger */}
            <button
              onClick={onOpenProfile}
              className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200/80 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-colors cursor-pointer relative"
              title={t.profile}
              aria-label="User Profile"
            >
              <User className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Horizontal Mode Ribbon */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1.5 scrollbar-none border-t border-slate-100 dark:border-slate-800/80">
          {primaryNavModes.map((item) => {
            const Icon = item.icon;
            const isActive = activeMode === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectMode(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
