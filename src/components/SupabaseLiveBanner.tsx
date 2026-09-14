import React, { useState } from 'react';
import { SupabaseTelemetryState } from '../types';

interface SupabaseLiveBannerProps {
  telemetry: SupabaseTelemetryState;
  isLoading: boolean;
  onRefresh: () => void;
  onSendTestReading?: () => void;
  isSendingTest?: boolean;
  onOpenRlsModal?: () => void;
}

const defaultTelemetry: SupabaseTelemetryState = {
  isConfigured: false,
  isConnected: false,
  lastReadingTime: null,
  lastFetchedAt: null,
  errorMessage: null,
  isRealtimeActive: false,
  isRlsBlocked: false,
  isLocalPreview: false,
  latestReading: null,
  recentReadings: []
};

export const SupabaseLiveBanner: React.FC<SupabaseLiveBannerProps> = ({
  telemetry,
  isLoading,
  onRefresh,
  onSendTestReading,
  isSendingTest,
  onOpenRlsModal
}) => {
  const [showRecentTable, setShowRecentTable] = useState(false);
  const safeTelemetry = telemetry || defaultTelemetry;

  // Format reading time nicely
  const formatTime = (timeStr?: string | null) => {
    if (!timeStr) return 'Awaiting telemetry...';
    try {
      const date = new Date(timeStr);
      if (isNaN(date.getTime())) return timeStr;
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
        ' (' + date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ')';
    } catch {
      return timeStr;
    }
  };

  const reading = safeTelemetry.latestReading;

  return (
    <div className="w-full rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden">
      {/* Header bar with connection status */}
      <div className="px-4 py-3 bg-gradient-to-r from-surface-container-low via-surface-container-lowest to-surface-container-low border-b border-outline-variant/20 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
            {safeTelemetry.isConnected ? (
              <>
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
              </>
            ) : safeTelemetry.isConfigured ? (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 animate-pulse"></span>
            ) : (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600 animate-pulse"></span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-on-surface tracking-tight truncate">
                Supabase <span className="font-mono text-primary font-semibold">sensor_readings</span>
              </span>
              {safeTelemetry.isConnected && safeTelemetry.isRealtimeActive && (
                <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  REALTIME
                </span>
              )}
              {safeTelemetry.isLocalPreview && (
                <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-sky-100 text-sky-800 border border-sky-300">
                  PREVIEW
                </span>
              )}
              {safeTelemetry.isRlsBlocked && (
                <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  RLS RESTRICTED
                </span>
              )}
              {!safeTelemetry.isConnected && (
                <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                  DISCONNECTED
                </span>
              )}
            </div>
            <span className={`text-[10px] truncate ${!safeTelemetry.isConnected ? 'text-rose-600 font-semibold' : 'text-on-surface-variant'}`}>
              {safeTelemetry.isConnected
                ? 'Connected to live database'
                : safeTelemetry.isConfigured
                ? (safeTelemetry.errorMessage || 'Connection Failed: Unable to reach database')
                : 'Connection Error: VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY missing'}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="px-2 py-1 rounded-lg text-[11px] font-medium text-primary hover:bg-primary-fixed/30 bg-surface-container flex items-center gap-1 border border-outline-variant/30 active:scale-95 transition-all disabled:opacity-50"
            title="Fetch latest reading from sensor_readings table"
          >
            <span className={`material-symbols-outlined text-[14px] ${isLoading ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span className="hidden sm:inline">Sync</span>
          </button>

          <button
            onClick={() => setShowRecentTable(!showRecentTable)}
            className={`px-2 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 border transition-all active:scale-95 ${
              showRecentTable
                ? 'bg-primary text-on-primary border-transparent'
                : 'bg-surface-container text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-high'
            }`}
            title="Toggle recent rows from sensor_readings"
          >
            <span className="material-symbols-outlined text-[14px]">table_rows</span>
            <span className="hidden sm:inline">Rows</span>
          </button>
        </div>
      </div>

      {/* Explicit Connection Error Banner */}
      {!safeTelemetry.isConnected && (
        <div className="mx-3.5 mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 shadow-sm">
          <div className="flex items-start gap-2.5">
            <span className="material-symbols-outlined text-rose-600 text-[20px] shrink-0 mt-0.5">
              cloud_off
            </span>
            <div className="space-y-1.5 text-xs flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-rose-800 text-xs">
                  {!safeTelemetry.isConfigured ? 'Supabase Configuration Error' : 'Database Connection Failed'}
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-rose-200 text-rose-800 uppercase tracking-wider">
                  No Connection
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-rose-700">
                {!safeTelemetry.isConfigured ? (
                  <>
                    The dashboard requires client environment variables{' '}
                    <code className="px-1 py-0.5 rounded bg-rose-100 font-mono font-bold text-rose-900">import.meta.env.VITE_SUPABASE_URL</code>{' '}
                    and{' '}
                    <code className="px-1 py-0.5 rounded bg-rose-100 font-mono font-bold text-rose-900">import.meta.env.VITE_SUPABASE_ANON_KEY</code>.
                    These variables were not detected at runtime. Please configure them in your environment settings (Vercel, Cloud Run, or .env) and redeploy.
                  </>
                ) : (
                  safeTelemetry.errorMessage || 'Could not establish connection to the sensor_readings table. Check network connectivity or table access policies.'
                )}
              </p>
              <div className="pt-1 flex items-center justify-between gap-2 flex-wrap">
                <button
                  onClick={onRefresh}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-600 text-white hover:bg-rose-700 active:scale-95 transition-all flex items-center gap-1 shadow-sm"
                >
                  <span className={`material-symbols-outlined text-[13px] ${isLoading ? 'animate-spin' : ''}`}>
                    refresh
                  </span>
                  {isLoading ? 'Attempting Reconnect...' : 'Retry Connection'}
                </button>
                <span className="text-[10px] text-rose-600 font-medium italic">
                  Simulation fallback disabled — awaiting live database telemetry.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main 6 Metric Grid Required by user:
          1. Temperature
          2. Humidity
          3. Battery Level
          4. Solar Power
          5. Cooling Status
          6. Latest Reading Time
      */}
      <div className="p-3.5 space-y-3">
        {/* Top 4 Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* 1. Temperature */}
          <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-[10px] uppercase font-bold tracking-wider">Temperature</span>
              <span className="material-symbols-outlined text-[16px] text-blue-600">device_thermostat</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-on-surface font-sans">
                {safeTelemetry.isConnected && reading ? reading.temperature.toFixed(1) : '--'}
              </span>
              <span className="text-xs font-semibold text-on-surface-variant">°C</span>
            </div>
            <span className={`text-[9px] font-medium mt-0.5 ${safeTelemetry.isConnected && reading ? 'text-emerald-700' : 'text-rose-600 font-semibold'}`}>
              {safeTelemetry.isConnected ? (reading ? 'Live from sensor_readings' : 'Awaiting 1st row') : 'No Supabase link'}
            </span>
          </div>

          {/* 2. Humidity */}
          <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-[10px] uppercase font-bold tracking-wider">Humidity</span>
              <span className="material-symbols-outlined text-[16px] text-teal-600">water_drop</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-on-surface font-sans">
                {safeTelemetry.isConnected && reading ? reading.humidity : '--'}
              </span>
              <span className="text-xs font-semibold text-on-surface-variant">% RH</span>
            </div>
            <span className={`text-[9px] font-medium mt-0.5 ${safeTelemetry.isConnected && reading ? 'text-teal-700' : 'text-rose-600 font-semibold'}`}>
              {safeTelemetry.isConnected ? (reading ? 'Anti-shrivel target' : 'Awaiting 1st row') : 'No Supabase link'}
            </span>
          </div>

          {/* 3. Battery Level */}
          <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-[10px] uppercase font-bold tracking-wider">Battery Level</span>
              <span className="material-symbols-outlined text-[16px] text-emerald-600">battery_charging_full</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-on-surface font-sans">
                {safeTelemetry.isConnected && reading ? reading.batteryLevel : '--'}
              </span>
              <span className="text-xs font-semibold text-on-surface-variant">% SoC</span>
            </div>
            <span className={`text-[9px] font-medium mt-0.5 ${safeTelemetry.isConnected && reading ? 'text-emerald-700' : 'text-rose-600 font-semibold'}`}>
              {safeTelemetry.isConnected ? (reading ? 'LiFePO4 Storage' : 'Awaiting 1st row') : 'No Supabase link'}
            </span>
          </div>

          {/* 4. Solar Power */}
          <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-[10px] uppercase font-bold tracking-wider">Solar Power</span>
              <span className="material-symbols-outlined text-[16px] text-amber-500">solar_power</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-on-surface font-sans">
                {safeTelemetry.isConnected && reading ? reading.solarPower : '--'}
              </span>
              <span className="text-xs font-semibold text-on-surface-variant">W</span>
            </div>
            <span className={`text-[9px] font-medium mt-0.5 ${safeTelemetry.isConnected && reading ? 'text-amber-700' : 'text-rose-600 font-semibold'}`}>
              {safeTelemetry.isConnected ? (reading ? 'PV Generation' : 'Awaiting 1st row') : 'No Supabase link'}
            </span>
          </div>
        </div>

        {/* Bottom Row: 5. Cooling Status & 6. Latest Reading Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-outline-variant/15">
          {/* 5. Cooling Status */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/20">
            <div className="flex items-center gap-2 min-w-0">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${safeTelemetry.isConnected ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-rose-100 text-rose-700'}`}>
                <span className="material-symbols-outlined text-[16px]">mode_fan</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Cooling Status
                </span>
                <span className={`text-xs font-bold truncate ${safeTelemetry.isConnected ? 'text-on-surface' : 'text-rose-700'}`}>
                  {safeTelemetry.isConnected
                    ? (reading ? reading.coolingStatus : 'Standby (Awaiting data)')
                    : 'Disconnected (No database link)'}
                </span>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
              safeTelemetry.isConnected
                ? 'bg-primary-container text-on-primary-container'
                : 'bg-rose-100 text-rose-800'
            }`}>
              {safeTelemetry.isConnected ? (reading ? 'ACTIVE' : 'READY') : 'OFFLINE'}
            </span>
          </div>

          {/* 6. Latest Reading Time */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/20">
            <div className="flex items-center gap-2 min-w-0">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${safeTelemetry.isConnected ? 'bg-surface-container-highest text-primary' : 'bg-rose-100 text-rose-700'}`}>
                <span className="material-symbols-outlined text-[16px]">schedule</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Latest Reading Time
                </span>
                <span className="text-xs font-semibold text-on-surface truncate font-mono">
                  {safeTelemetry.isConnected && (reading?.readingTime ?? safeTelemetry.lastReadingTime)
                    ? formatTime(reading?.readingTime ?? safeTelemetry.lastReadingTime)
                    : (safeTelemetry.isConnected ? 'No readings yet' : 'Unavailable (Offline)')}
                </span>
              </div>
            </div>
            <span className={`text-[10px] font-medium shrink-0 ${safeTelemetry.isConnected ? 'text-emerald-700' : 'text-rose-600'}`}>
              {safeTelemetry.isConnected ? (safeTelemetry.lastFetchedAt ? 'Synced' : 'Real-time') : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Fruit & Vegetable Storage Optimization Banner */}
        <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/15 flex items-center gap-2 text-xs text-on-surface">
          <span className="material-symbols-outlined text-primary text-[18px] shrink-0">
            nutrition
          </span>
          <p className="text-[11px] leading-snug">
            <span className="font-semibold text-primary">Fresh Fruit & Veg Preservation:</span> Chamber configured for hill horticulture (Khasi Mandarin, Queen Pineapple, Naga Chillies & Bhaise Ginger). Maintaining high humidity prevents wilting while continuous chill extends shelf-life from 3 to 28 days.
          </p>
        </div>

        {/* Expandable Recent Sensor Readings Table */}
        {showRecentTable && (
          <div className="mt-2 pt-2 border-t border-outline-variant/25 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-bold text-on-surface">
                Recent <code className="text-primary font-mono">sensor_readings</code> Rows
              </span>
              <div className="flex items-center gap-1.5">
                {onOpenRlsModal && (
                  <button
                    onClick={onOpenRlsModal}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition-colors flex items-center gap-1 shadow-2xs"
                    title="View SQL command to fix Supabase Row-Level Security policy"
                  >
                    <span className="material-symbols-outlined text-[12px] text-amber-700">shield</span>
                    RLS SQL Fix
                  </button>
                )}
                {onSendTestReading && (
                  <button
                    onClick={onSendTestReading}
                    disabled={isSendingTest}
                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary text-on-primary hover:bg-primary/90 transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-[12px]">send</span>
                    {isSendingTest ? 'Sending...' : 'Insert Test Reading'}
                  </button>
                )}
              </div>
            </div>

            {/* RLS Policy Notice Banner if write was blocked */}
            {safeTelemetry.isRlsBlocked && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-amber-600 text-[18px] shrink-0">
                    lock_open
                  </span>
                  <div className="truncate">
                    <span className="font-bold text-amber-900">Supabase RLS Policy:</span>{' '}
                    <span className="text-amber-800 text-[11px]">Allow anonymous inserts to save directly to cloud.</span>
                  </div>
                </div>
                {onOpenRlsModal && (
                  <button
                    onClick={onOpenRlsModal}
                    className="px-2 py-1 rounded bg-amber-700 text-white font-bold text-[10px] hover:bg-amber-800 transition-colors shrink-0 shadow-2xs"
                  >
                    View SQL Fix
                  </button>
                )}
              </div>
            )}

            {safeTelemetry.recentReadings.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-outline-variant/20 max-h-48 overflow-y-auto text-[11px]">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container font-semibold text-on-surface-variant sticky top-0">
                    <tr>
                      <th className="p-1.5 border-b border-outline-variant/20 font-mono">Time</th>
                      <th className="p-1.5 border-b border-outline-variant/20 text-right">Temp</th>
                      <th className="p-1.5 border-b border-outline-variant/20 text-right">RH</th>
                      <th className="p-1.5 border-b border-outline-variant/20 text-right">Batt</th>
                      <th className="p-1.5 border-b border-outline-variant/20 text-right">Solar</th>
                      <th className="p-1.5 border-b border-outline-variant/20">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/15 text-on-surface">
                    {safeTelemetry.recentReadings.map((row, idx) => (
                      <tr key={row.id || idx} className="hover:bg-surface-container-low transition-colors">
                        <td className="p-1.5 font-mono text-[10px] text-on-surface-variant truncate max-w-[90px]">
                          {formatTime(row.readingTime)}
                        </td>
                        <td className="p-1.5 text-right font-mono font-bold text-primary">
                          {row.temperature.toFixed(1)}°C
                        </td>
                        <td className="p-1.5 text-right font-mono">{row.humidity}%</td>
                        <td className="p-1.5 text-right font-mono">{row.batteryLevel}%</td>
                        <td className="p-1.5 text-right font-mono">{row.solarPower}W</td>
                        <td className="p-1.5 truncate max-w-[120px] text-[10px]">
                          {row.coolingStatus}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-3 text-center rounded-lg bg-surface-container-low text-xs text-on-surface-variant">
                {safeTelemetry.errorMessage || 'No rows in `sensor_readings` table yet. Send an IoT packet or insert a test reading.'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
