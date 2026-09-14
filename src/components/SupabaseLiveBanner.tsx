import React, { useState } from 'react';
import { SupabaseTelemetryState } from '../types';

interface SupabaseLiveBannerProps {
  telemetry: SupabaseTelemetryState;
  isLoading: boolean;
  onRefresh: () => void;
  onSendTestReading?: () => void;
  isSendingTest?: boolean;
}

export const SupabaseLiveBanner: React.FC<SupabaseLiveBannerProps> = ({
  telemetry,
  isLoading,
  onRefresh,
  onSendTestReading,
  isSendingTest
}) => {
  const [showRecentTable, setShowRecentTable] = useState(false);

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

  const reading = telemetry.latestReading;

  return (
    <div className="w-full rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden">
      {/* Header bar with connection status */}
      <div className="px-4 py-3 bg-gradient-to-r from-surface-container-low via-surface-container-lowest to-surface-container-low border-b border-outline-variant/20 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
            {telemetry.isConnected ? (
              <>
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
              </>
            ) : telemetry.isConfigured ? (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 animate-pulse"></span>
            ) : (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-on-surface tracking-tight truncate">
                Supabase <span className="font-mono text-primary font-semibold">sensor_readings</span>
              </span>
              {telemetry.isRealtimeActive && (
                <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  REALTIME
                </span>
              )}
            </div>
            <span className="text-[10px] text-on-surface-variant truncate">
              {telemetry.isConnected
                ? 'Connected to live database'
                : telemetry.isConfigured
                ? 'Connecting to Supabase instance...'
                : 'Local Telemetry Active (Configure .env for Cloud)'}
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
                {reading ? reading.temperature.toFixed(1) : '3.8'}
              </span>
              <span className="text-xs font-semibold text-on-surface-variant">°C</span>
            </div>
            <span className="text-[9px] text-emerald-700 font-medium mt-0.5">
              Fruit/Veg Chill Target
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
                {reading ? reading.humidity : '88'}
              </span>
              <span className="text-xs font-semibold text-on-surface-variant">% RH</span>
            </div>
            <span className="text-[9px] text-teal-700 font-medium mt-0.5">
              Anti-shrivel lock
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
                {reading ? reading.batteryLevel : '92'}
              </span>
              <span className="text-xs font-semibold text-on-surface-variant">% SoC</span>
            </div>
            <span className="text-[9px] text-emerald-700 font-medium mt-0.5">
              LiFePO4 Reserve
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
                {reading ? reading.solarPower : '840'}
              </span>
              <span className="text-xs font-semibold text-on-surface-variant">W</span>
            </div>
            <span className="text-[9px] text-amber-700 font-medium mt-0.5">
              Monocrystalline PV
            </span>
          </div>
        </div>

        {/* Bottom Row: 5. Cooling Status & 6. Latest Reading Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-outline-variant/15">
          {/* 5. Cooling Status */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/20">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-primary-fixed flex items-center justify-center text-on-primary-fixed shrink-0">
                <span className="material-symbols-outlined text-[16px]">mode_fan</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Cooling Status
                </span>
                <span className="text-xs font-bold text-on-surface truncate">
                  {reading ? reading.coolingStatus : 'Active Peltier Stage (Normal)'}
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-container text-on-primary-container shrink-0">
              TEC ON
            </span>
          </div>

          {/* 6. Latest Reading Time */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/20">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Latest Reading Time
                </span>
                <span className="text-xs font-semibold text-on-surface truncate font-mono">
                  {formatTime(reading?.readingTime ?? telemetry.lastReadingTime)}
                </span>
              </div>
            </div>
            <span className="text-[10px] text-on-surface-variant font-medium shrink-0">
              {telemetry.lastFetchedAt ? 'Synced' : 'Real-time'}
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
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface">
                Recent <code className="text-primary font-mono">sensor_readings</code> Rows
              </span>
              {onSendTestReading && (
                <button
                  onClick={onSendTestReading}
                  disabled={isSendingTest}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary text-on-primary hover:bg-primary/90 transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[12px]">send</span>
                  {isSendingTest ? 'Sending...' : 'Insert Test Reading'}
                </button>
              )}
            </div>

            {telemetry.recentReadings.length > 0 ? (
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
                    {telemetry.recentReadings.map((row, idx) => (
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
                {telemetry.errorMessage || 'No rows in `sensor_readings` table yet. Send an IoT packet or insert a test reading.'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
