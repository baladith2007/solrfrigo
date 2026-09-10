import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  alertCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab, alertCount }) => {
  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-surface/90 backdrop-blur-xl border-t border-surface-container-high/60 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
      <div className="max-w-md mx-auto h-16 px-2 grid grid-cols-4 items-center">
        {/* Chamber Tab */}
        <button
          onClick={() => onSelectTab('chamber')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] gap-0.5 transition-colors ${
            activeTab === 'chamber' ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
          }`}
          aria-label="Chamber Overview"
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: activeTab === 'chamber' ? "'FILL' 1" : "'FILL' 0" }}
          >
            thermostat
          </span>
          <span className="text-[11px] leading-none">Chamber</span>
        </button>

        {/* Solar Tab */}
        <button
          onClick={() => onSelectTab('solar')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] gap-0.5 transition-colors ${
            activeTab === 'solar' ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
          }`}
          aria-label="Solar and Power Management"
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: activeTab === 'solar' ? "'FILL' 1" : "'FILL' 0" }}
          >
            solar_power
          </span>
          <span className="text-[11px] leading-none">Solar & Power</span>
        </button>

        {/* Produce Tab */}
        <button
          onClick={() => onSelectTab('produce')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] gap-0.5 transition-colors ${
            activeTab === 'produce' ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
          }`}
          aria-label="Produce Inventory"
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: activeTab === 'produce' ? "'FILL' 1" : "'FILL' 0" }}
          >
            local_florist
          </span>
          <span className="text-[11px] leading-none">Produce</span>
        </button>

        {/* Alerts & Diagnostics Tab */}
        <button
          onClick={() => onSelectTab('alerts')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] gap-0.5 transition-colors relative ${
            activeTab === 'alerts' ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
          }`}
          aria-label="Alerts and Diagnostics"
        >
          <div className="relative flex items-center justify-center">
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: activeTab === 'alerts' ? "'FILL' 1" : "'FILL' 0" }}
            >
              notifications
            </span>
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] px-1 rounded-full bg-error text-on-error font-mono text-[9px] flex items-center justify-center font-bold">
                {alertCount}
              </span>
            )}
          </div>
          <span className="text-[11px] leading-none">Alerts</span>
        </button>
      </div>
    </nav>
  );
};
