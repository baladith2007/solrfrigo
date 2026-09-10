import React from 'react';

interface HeaderProps {
  onOpenArchitecture: () => void;
  onBackToLanding: () => void;
  lastSyncedSeconds: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenArchitecture, onBackToLanding, lastSyncedSeconds }) => {
  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-surface/85 backdrop-blur-xl border-b border-surface-container-high/60 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 px-3 max-w-md mx-auto flex items-center justify-between">
        {/* Back to landing + Logo & Identity */}
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToLanding}
            className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
            title="Return to Product Landing Page"
            aria-label="Back to Product Landing Page"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>

          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-fixed shadow-sm">
            <span className="material-symbols-outlined text-[20px]">solar_power</span>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[16px] font-bold tracking-tight text-on-surface">SolFrigo</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-fixed-dim opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1 py-0.2 rounded bg-primary-fixed text-on-primary-fixed">
                IoT
              </span>
            </div>
            <div className="flex items-center gap-1 text-on-surface-variant">
              <span className="material-symbols-outlined text-[12px] text-primary">location_on</span>
              <span className="text-[10px] font-medium truncate">Unit NER-04 • Kohima</span>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          {/* Architecture Blueprint Trigger */}
          <button
            onClick={onOpenArchitecture}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-medium text-[11px] border border-outline-variant/40 transition-colors active:scale-95"
            title="View System Hardware Architecture Flow"
            aria-label="View Hardware Architecture Flow"
          >
            <span className="material-symbols-outlined text-[16px]">schema</span>
            <span className="hidden xs:inline">Blueprint</span>
          </button>

          {/* Wi-Fi / LoRa Status Badge */}
          <div
            className="flex items-center justify-center w-7 h-7 rounded-full bg-surface-container-low text-primary"
            title={`IoT Link Active • Synchronized ${lastSyncedSeconds}s ago`}
          >
            <span className="material-symbols-outlined text-[16px]">wifi</span>
          </div>
        </div>
      </div>
    </header>
  );
};
