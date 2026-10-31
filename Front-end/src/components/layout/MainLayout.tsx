import React from 'react';

export interface MainLayoutProps {
  header: React.ReactNode;
  sidebarTitle: string;
  sidebarSubtitle: string;
  sidebarContent: React.ReactNode;
  mapContent: React.ReactNode;
  hudContent?: React.ReactNode;
  toastContent?: React.ReactNode;
  modalContent?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  header,
  sidebarTitle,
  sidebarSubtitle,
  sidebarContent,
  mapContent,
  hudContent,
  toastContent,
  modalContent,
}) => {
  return (
    <div className="flex flex-col min-h-screen lg:h-screen w-screen overflow-x-hidden lg:overflow-hidden bg-[#FAF8FF] dark:bg-[#090D16] text-[#0F172A] dark:text-[#F8FAFC]">
      {/* 1. Header Slot */}
      <div className="shrink-0 z-40 border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
        {header}
      </div>

      {/* 2. Responsive 12-Column Split Workspace */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 min-h-0 relative">
        {/* Left Side Rail: Situational Awareness Feed & Active Mode Panel (4-5 Cols) */}
        <aside className="lg:col-span-5 xl:col-span-4 flex flex-col min-h-0 order-2 lg:order-1 overflow-hidden">
          {/* Mode Subtitle Description */}
          <div className="mb-2.5 px-1 shrink-0">
            <h2 className="text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-slate-100 tracking-tight">
              {sidebarTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {sidebarSubtitle}
            </p>
          </div>

          {/* Scrollable Container with Smooth Scrollbar */}
          <div className="flex-1 overflow-y-auto overscroll-contain pr-1 space-y-3 focus:outline-none">
            {sidebarContent}
          </div>
        </aside>

        {/* Right Side: Map Canvas (7-8 Cols) */}
        <section
          className="lg:col-span-7 xl:col-span-8 order-1 lg:order-2 h-[380px] sm:h-[480px] lg:h-full min-h-[360px] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-sm relative"
          aria-label="Interactive Navigation and Safety Map"
        >
          {mapContent}
        </section>
      </main>

      {/* 3. Floating Action HUD */}
      {hudContent}

      {/* 4. Global Toast Feedback Slot */}
      {toastContent}

      {/* 5. Modal Dialogs Slot */}
      {modalContent}
    </div>
  );
};
