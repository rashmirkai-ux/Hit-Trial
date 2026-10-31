import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Layers,
  ChevronUp,
  ChevronDown,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Info,
  MapPin,
  Flame,
  CloudRain,
  Cross,
  Hospital,
  Fuel,
  HeartHandshake,
} from 'lucide-react';

interface MapLegendProps {
  className?: string;
  defaultExpanded?: boolean;
}

export const MapLegend: React.FC<MapLegendProps> = ({
  className = '',
  defaultExpanded = true,
}) => {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Localization labels
  const labels = {
    en: {
      legendTitle: 'Map Legend',
      routesTitle: 'Routes & Waypoints',
      safeHavensTitle: 'Safe Havens (24/7 Assistance)',
      riskZonesTitle: 'Risk & Hazard Zones',
      safestRoute: 'Safest Corridor (AI Recommended)',
      safestRouteSub: '100% LED lighting, active PCR patrols',
      alternateRoute: 'Alternative Route',
      alternateRouteSub: 'Standard urban street with variable lighting',
      startPoint: 'Origin (Start)',
      destPoint: 'Destination (End)',
      policePost: 'Police Post & Pink Booth',
      policePostSub: '24/7 armed presence & female officer desk',
      hospital: 'Emergency Trauma Hospital',
      hospitalSub: '24/7 emergency medical triage',
      fuelSafeHaven: '24/7 Swagat Fuel Station',
      fuelSafeHavenSub: 'Well-lit rest area, EV charging & CCTV',
      womenDesk: 'Women Safety Assistance Desk',
      womenDeskSub: 'Helpline rapid assistance point',
      highRisk: 'High-Risk Incident Blackspot',
      highRiskSub: 'Unlit stretch / past night incidents',
      moderateRisk: 'Caution / Construction Zone',
      moderateRiskSub: 'Lane convergence / roadwork detour',
      environmentalRisk: 'Environmental Hazard',
      environmentalRiskSub: 'Waterlogging or dense fog vulnerability',
      clickToExpand: 'Click to expand legend',
      clickToCollapse: 'Click to collapse legend',
    },
    hi: {
      legendTitle: 'मानचित्र संकेतिका (Legend)',
      routesTitle: 'मार्ग एवं स्थान',
      safeHavensTitle: 'सुरक्षित आश्रय (24/7 सहायता)',
      riskZonesTitle: 'जोखिम एवं खतरा क्षेत्र',
      safestRoute: 'सबसे सुरक्षित गलियारा (एआई अनुशंसित)',
      safestRouteSub: '100% एलईडी रोशनी, सक्रिय पीसीआर गश्त',
      alternateRoute: 'वैकल्पिक मार्ग',
      alternateRouteSub: 'सामान्य शहरी सड़क, मध्यम रोशनी',
      startPoint: 'आरंभिक बिंदु (Point A)',
      destPoint: 'गंतव्य बिंदु (Point B)',
      policePost: 'पुलिस सहायता केंद्र व पिंक बूथ',
      policePostSub: '24/7 पुलिस उपस्थिति एवं महिला सुरक्षा डेस्क',
      hospital: 'आपातकालीन ट्रॉमा अस्पताल',
      hospitalSub: '24/7 आपातकालीन चिकित्सा सुविधा',
      fuelSafeHaven: '24/7 स्वागत फ्यूल स्टेशन व आश्रय',
      fuelSafeHavenSub: 'रोशन विश्राम क्षेत्र, सीसीटीवी निगरानी',
      womenDesk: 'महिला सुरक्षा सहायता डेस्क',
      womenDeskSub: 'त्वरित महिला सहायता केंद्र',
      highRisk: 'उच्च जोखिम ब्लैकस्पॉट',
      highRiskSub: 'कम रोशनी वाला क्षेत्र / पूर्व घटनाएं',
      moderateRisk: 'सावधानी / निर्माण क्षेत्र',
      moderateRiskSub: 'सड़क कार्य / लेन परिवर्तन',
      environmentalRisk: 'पर्यावरणीय खतरा',
      environmentalRiskSub: 'जलभराव या भारी कोहरे का क्षेत्र',
      clickToExpand: 'संकेतिका खोलने के लिए क्लिक करें',
      clickToCollapse: 'संकेतिका बंद करने के लिए क्लिक करें',
    },
    pa: {
      legendTitle: 'ਨਕਸ਼ਾ ਸੰਕੇਤ (Legend)',
      routesTitle: 'ਰਸਤੇ ਅਤੇ ਸਥਾਨ',
      safeHavensTitle: 'ਸੁਰੱਖਿਅਤ ਆਸਰੇ (24/7 ਸਹਾਇਤਾ)',
      riskZonesTitle: 'ਖ਼ਤਰਾ ਅਤੇ ਜੋਖਮ ਖੇਤਰ',
      safestRoute: 'ਸਭ ਤੋਂ ਸੁਰੱਖਿਅਤ ਰਸਤਾ (ਏਆਈ ਸਿਫਾਰਸ਼ੀ)',
      safestRouteSub: '100% ਰੌਸ਼ਨੀ, ਸਰਗਰਮ ਪੁਲਿਸ ਗਸ਼ਤ',
      alternateRoute: 'ਬਦਲਵਾਂ ਰਸਤਾ',
      alternateRouteSub: 'ਆਮ ਸੜਕ, ਬਦਲਵੀਂ ਰੌਸ਼ਨੀ',
      startPoint: 'ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ (Point A)',
      destPoint: 'ਮੰਜ਼ਿਲ ਬਿੰਦੂ (Point B)',
      policePost: 'ਪੁਲਿਸ ਚੌਕੀ ਅਤੇ ਪਿੰਕ ਬੂਥ',
      policePostSub: '24/7 ਪੁਲਿਸ ਮੌਜੂਦਗੀ ਅਤੇ ਮਹਿਲਾ ਡੈਸਕ',
      hospital: 'ਐਮਰਜੈਂਸੀ ਟਰਾਮਾ ਹਸਪਤਾਲ',
      hospitalSub: '24/7 ਡਾਕਟਰੀ ਸਹਾਇਤਾ',
      fuelSafeHaven: '24/7 ਸਵਾਗਤ ਫਿਊਲ ਸਟੇਸ਼ਨ',
      fuelSafeHavenSub: 'ਰੌਸ਼ਨ ਵਿਸ਼ਰਾਮ ਖੇਤਰ ਅਤੇ ਸੀਸੀਟੀਵੀ',
      womenDesk: 'ਮਹਿਲਾ ਸੁਰੱਖਿਆ ਸਹਾਇਤਾ ਡੈਸਕ',
      womenDeskSub: 'ਤੁਰੰਤ ਮਹਿਲਾ ਸਹਾਇਤਾ ਕੇਂਦਰ',
      highRisk: 'ਉੱਚ ਖ਼ਤਰਾ ਬਲੈਕਸਪੌਟ',
      highRiskSub: 'ਘੱਟ ਰੌਸ਼ਨੀ / ਪਿਛਲੀਆਂ ਘਟਨਾਵਾਂ',
      moderateRisk: 'ਸਾਵਧਾਨੀ / ਨਿਰਮਾਣ ਖੇਤਰ',
      moderateRiskSub: 'ਸੜਕ ਮੁਰੰਮਤ / ਲੇਨ ਬਦਲਾਅ',
      environmentalRisk: 'ਵਾਤਾਵਰਣਕ ਖ਼ਤਰਾ',
      environmentalRiskSub: 'ਪਾਣੀ ਭਰਨ ਜਾਂ ਸੰਘਣੀ ਧੁੰਦ ਦਾ ਖ਼ਤਰਾ',
      clickToExpand: 'ਸੰਕੇਤ ਦੇਖਣ ਲਈ ਕਲਿੱਕ ਕਰੋ',
      clickToCollapse: 'ਸੰਕੇਤ ਬੰਦ ਕਰਨ ਲਈ ਕਲਿੱਕ ਕਰੋ',
    },
  }[language] || {
    legendTitle: 'Map Legend',
    routesTitle: 'Routes & Waypoints',
    safeHavensTitle: 'Safe Havens (24/7 Assistance)',
    riskZonesTitle: 'Risk & Hazard Zones',
    safestRoute: 'Safest Corridor (AI Recommended)',
    safestRouteSub: '100% LED lighting, active PCR patrols',
    alternateRoute: 'Alternative Route',
    alternateRouteSub: 'Standard urban street with variable lighting',
    startPoint: 'Origin (Start)',
    destPoint: 'Destination (End)',
    policePost: 'Police Post & Pink Booth',
    policePostSub: '24/7 armed presence & female officer desk',
    hospital: 'Emergency Trauma Hospital',
    hospitalSub: '24/7 emergency medical triage',
    fuelSafeHaven: '24/7 Swagat Fuel Station',
    fuelSafeHavenSub: 'Well-lit rest area, EV charging & CCTV',
    womenDesk: 'Women Safety Assistance Desk',
    womenDeskSub: 'Helpline rapid assistance point',
    highRisk: 'High-Risk Incident Blackspot',
    highRiskSub: 'Unlit stretch / past night incidents',
    moderateRisk: 'Caution / Construction Zone',
    moderateRiskSub: 'Lane convergence / roadwork detour',
    environmentalRisk: 'Environmental Hazard',
    environmentalRiskSub: 'Waterlogging or dense fog vulnerability',
    clickToExpand: 'Click to expand legend',
    clickToCollapse: 'Click to collapse legend',
  };

  return (
    <div
      className={`bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl transition-all duration-300 z-20 text-slate-800 dark:text-slate-200 pointer-events-auto ${className} ${
        isExpanded ? 'w-80 max-w-[calc(100vw-2.5rem)]' : 'w-auto'
      }`}
      aria-label="Map Visual Legend"
      role="region"
    >
      {/* Header Bar with Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1"
        aria-expanded={isExpanded}
        aria-label={isExpanded ? labels.clickToCollapse : labels.clickToExpand}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <span className="font-heading font-bold text-xs tracking-tight text-slate-900 dark:text-slate-100">
            {labels.legendTitle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!isExpanded && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pr-1">
              {/* Mini visual summary chips */}
              <span className="inline-block w-3.5 h-1 bg-blue-600 rounded-full" />
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
            </div>
          )}
          <span className="w-5 h-5 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </span>
        </div>
      </button>

      {/* Expanded Details Body */}
      {isExpanded && (
        <div className="px-3.5 pb-3.5 pt-1 space-y-3.5 text-xs border-t border-slate-100 dark:border-slate-800/80 max-h-[340px] overflow-y-auto overscroll-contain">
          {/* Section 1: Route Status Colors */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {labels.routesTitle}
            </h4>
            <div className="space-y-1.5 pl-0.5">
              {/* Safest Route */}
              <div className="flex items-start gap-2.5">
                <div className="mt-1.5 flex items-center shrink-0">
                  <div className="w-5 h-2 bg-blue-600 rounded-full border border-white shadow-sm" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100 text-[11px] leading-tight">
                    {labels.safestRoute}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                    {labels.safestRouteSub}
                  </p>
                </div>
              </div>

              {/* Alternative Route */}
              <div className="flex items-start gap-2.5">
                <div className="mt-1.5 flex items-center shrink-0">
                  <div className="w-5 h-1.5 bg-slate-400 dark:bg-slate-600 rounded-full border-t border-dashed border-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300 text-[11px] leading-tight">
                    {labels.alternateRoute}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                    {labels.alternateRouteSub}
                  </p>
                </div>
              </div>

              {/* Origin & Destination Markers */}
              <div className="flex items-center gap-4 pt-1 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-extrabold text-[9px] flex items-center justify-center border border-white shadow-xs">
                    A
                  </span>
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{labels.startPoint}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-extrabold text-[9px] flex items-center justify-center border border-white shadow-xs">
                    B
                  </span>
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{labels.destPoint}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Safe Havens & 24/7 Assistance Points */}
          <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {labels.safeHavensTitle}
            </h4>
            <div className="space-y-2 pl-0.5">
              {/* Police Post */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-white dark:bg-slate-800 border-2 border-[#004AC6] flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldAlert className="w-3 h-3 text-[#004AC6]" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100 text-[11px] leading-tight">
                    {labels.policePost}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                    {labels.policePostSub}
                  </p>
                </div>
              </div>

              {/* Emergency Hospital */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-white dark:bg-slate-800 border-2 border-red-600 flex items-center justify-center shrink-0 shadow-xs">
                  <Hospital className="w-3 h-3 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100 text-[11px] leading-tight">
                    {labels.hospital}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                    {labels.hospitalSub}
                  </p>
                </div>
              </div>

              {/* Fuel Station Safe Haven */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-white dark:bg-slate-800 border-2 border-amber-600 flex items-center justify-center shrink-0 shadow-xs">
                  <Fuel className="w-3 h-3 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100 text-[11px] leading-tight">
                    {labels.fuelSafeHaven}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                    {labels.fuelSafeHavenSub}
                  </p>
                </div>
              </div>

              {/* Women Safety Desk */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-white dark:bg-slate-800 border-2 border-purple-600 flex items-center justify-center shrink-0 shadow-xs">
                  <HeartHandshake className="w-3 h-3 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100 text-[11px] leading-tight">
                    {labels.womenDesk}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                    {labels.womenDeskSub}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Risk & Hazard Zones */}
          <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {labels.riskZonesTitle}
            </h4>
            <div className="space-y-2 pl-0.5">
              {/* High-Risk Blackspot */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full border-2 border-dashed border-red-600 bg-red-500/20 flex items-center justify-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                </div>
                <div>
                  <p className="font-semibold text-red-700 dark:text-red-400 text-[11px] leading-tight">
                    {labels.highRisk}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                    {labels.highRiskSub}
                  </p>
                </div>
              </div>

              {/* Moderate Caution Zone */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full border-2 border-amber-500 bg-amber-500/20 flex items-center justify-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                </div>
                <div>
                  <p className="font-semibold text-amber-700 dark:text-amber-400 text-[11px] leading-tight">
                    {labels.moderateRisk}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                    {labels.moderateRiskSub}
                  </p>
                </div>
              </div>

              {/* Environmental Hazard */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full border-2 border-sky-500 bg-sky-500/20 flex items-center justify-center shrink-0">
                  <CloudRain className="w-2.5 h-2.5 text-sky-600" />
                </div>
                <div>
                  <p className="font-semibold text-sky-700 dark:text-sky-400 text-[11px] leading-tight">
                    {labels.environmentalRisk}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                    {labels.environmentalRiskSub}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
