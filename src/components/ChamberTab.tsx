import React, { useState } from 'react';
import { ActuatorState, ChamberTelemetry, SupabaseTelemetryState } from '../types';
import { HOURLY_TEMPERATURE_DATA } from '../data/initialData';
import { SupabaseLiveBanner } from './SupabaseLiveBanner';

interface ChamberTabProps {
  chamber: ChamberTelemetry;
  actuators: ActuatorState;
  lastSyncedSeconds: number;
  supabaseTelemetry?: SupabaseTelemetryState;
  isRefreshingSupabase?: boolean;
  onRefreshSupabase?: () => void;
  onSendTestReading?: () => void;
  isSendingTest?: boolean;
  onOpenRlsModal?: () => void;
  onUpdateSetpoint: (delta: number) => void;
  onToggleTurbo: (active: boolean) => void;
  onToggleDoor: () => void;
  onTriggerFlush: () => void;
  isFlushing: boolean;
}

export const ChamberTab: React.FC<ChamberTabProps> = ({
  chamber,
  actuators,
  lastSyncedSeconds,
  supabaseTelemetry,
  isRefreshingSupabase = false,
  onRefreshSupabase = () => {},
  onSendTestReading,
  isSendingTest,
  onOpenRlsModal,
  onUpdateSetpoint,
  onToggleTurbo,
  onToggleDoor,
  onTriggerFlush,
  isFlushing
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ time: string; chamber: number; ambient: number } | null>(null);

  // Determine thermal status
  const tempDiff = chamber.currentTemp - chamber.targetSetpoint;
  const isOptimal = Math.abs(tempDiff) <= 0.6;
  const isCoolingFast = chamber.turboBoostActive;

  return (
    <div className="flex flex-col w-full px-4 py-2 space-y-4 max-w-md mx-auto">
      {/* Supabase Live Telemetry Feed (6 Core Required Metrics) */}
      <SupabaseLiveBanner
        telemetry={supabaseTelemetry}
        isLoading={isRefreshingSupabase}
        onRefresh={onRefreshSupabase}
        onSendTestReading={onSendTestReading}
        isSendingTest={isSendingTest}
        onOpenRlsModal={onOpenRlsModal}
      />

      {/* Alert/Status Ambient Pill */}
      <div className={`flex items-center justify-between px-4 py-1.5 rounded-full shadow-sm border transition-colors ${
        supabaseTelemetry?.isConnected
          ? 'bg-surface-container-low border-outline-variant/30'
          : 'bg-rose-50 border-rose-200'
      }`}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2 w-2">
            {supabaseTelemetry?.isConnected ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
            )}
          </span>
          <span className={`text-xs font-medium truncate ${
            supabaseTelemetry?.isConnected ? 'text-on-surface' : 'text-rose-800 font-semibold'
          }`}>
            {supabaseTelemetry?.isConnected
              ? 'Supabase Telemetry Synced'
              : 'Supabase Connection Error (Live telemetry offline)'}
          </span>
        </div>
        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
          supabaseTelemetry?.isConnected
            ? 'text-primary bg-primary-fixed'
            : 'text-rose-700 bg-rose-100'
        }`}>
          {supabaseTelemetry?.isConnected ? `Synced (${lastSyncedSeconds}s ago)` : 'Offline'}
        </span>
      </div>

      {/* Primary Thermal Core Hero Card */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-4 shadow-sm border border-outline-variant/25">
        {/* Ambient teal glow */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-primary-fixed/20 blur-2xl pointer-events-none"></div>

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              ac_unit
            </span>
            <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
              Fruit & Veg Chamber Climate
            </span>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
              isOptimal
                ? 'bg-surface-container-high text-secondary'
                : tempDiff > 0
                ? 'bg-error-container text-error'
                : 'bg-primary-fixed text-on-primary-fixed'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {isOptimal ? 'check_circle' : tempDiff > 0 ? 'warning' : 'severe_cold'}
            </span>
            {isOptimal ? 'Optimal Chill' : tempDiff > 0 ? 'Cooling Required' : 'Sub-Cooled'}
          </span>
        </div>

        {/* Temperature Display & Stepper */}
        <div className="mt-3 flex items-baseline justify-between relative z-10">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold tracking-tight text-on-surface font-sans">
              {chamber.currentTemp.toFixed(1)}
            </span>
            <span className="text-xl text-on-surface-variant font-medium">°C</span>
          </div>

          {/* Stepper Quick Control */}
          <div className="flex items-center bg-surface-container rounded-lg p-0.5 shadow-inner border border-outline-variant/40">
            <button
              onClick={() => onUpdateSetpoint(-0.5)}
              aria-label="Decrease target temperature setpoint"
              className="w-10 h-10 flex items-center justify-center text-on-surface rounded-md bg-surface-container-lowest shadow-sm active:scale-95 transition-transform hover:bg-surface-bright"
            >
              <span className="material-symbols-outlined text-[18px]">remove</span>
            </button>
            <div className="px-2.5 flex flex-col items-center min-w-[62px]">
              <span className="text-[10px] uppercase font-semibold text-on-surface-variant leading-none">Target</span>
              <span className="text-xs font-bold text-on-surface mt-0.5">{chamber.targetSetpoint.toFixed(1)}°C</span>
            </div>
            <button
              onClick={() => onUpdateSetpoint(0.5)}
              aria-label="Increase target temperature setpoint"
              className="w-10 h-10 flex items-center justify-center text-on-surface rounded-md bg-surface-container-lowest shadow-sm active:scale-95 transition-transform hover:bg-surface-bright"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>
        </div>

        {/* Micro Metadata Chips */}
        <div className="mt-3 pt-3 flex items-center justify-between bg-surface-container-low rounded-lg px-3 py-2.5 relative z-10 border border-outline-variant/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[18px]">water_drop</span>
            </div>
            <div>
              <div className="text-[10px] text-on-surface-variant leading-tight">Chamber Humidity</div>
              <div className="text-sm font-semibold text-on-surface">
                {chamber.humidity}% <span className="text-xs font-normal text-on-surface-variant">RH</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-primary-fixed text-on-primary-fixed font-semibold inline-block">
              Fruits & Veggies OK
            </span>
            <div className="text-[10px] text-on-surface-variant mt-0.5">
              VPD: {chamber.vpd} kPa (Optimal)
            </div>
          </div>
        </div>
      </div>

      {/* Thermal Energy Buffer (PCM Latent Heat Storage) */}
      <div className="rounded-xl bg-surface-container-lowest p-4 shadow-sm space-y-3 border border-outline-variant/25">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              layers
            </span>
            <div>
              <h3 className="text-sm font-semibold text-on-surface leading-tight">PCM Latent Battery</h3>
              <p className="text-xs text-on-surface-variant">Inorganic Hydrated Salt Matrix</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-on-primary">
            {chamber.pcmSolidPercentage}% Solid
          </span>
        </div>

        {/* Level Bar Visualizer */}
        <div className="space-y-1">
          <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-primary-fixed-dim via-primary to-primary-container rounded-full transition-all duration-700"
              style={{ width: `${chamber.pcmSolidPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-xs text-on-surface-variant">
            <span>Phase: {chamber.pcmState}</span>
            <span className="font-semibold text-primary">Charging via Solar surplus</span>
          </div>
        </div>

        {/* Autonomy Metric Highlight */}
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-container-high border border-outline-variant/20">
          <span className="material-symbols-outlined text-primary text-[24px]">timelapse</span>
          <div className="min-w-0">
            <div className="text-sm font-bold text-on-surface">{chamber.pcmHoursBuffer} Hours Thermal Buffer</div>
            <div className="text-xs text-on-surface-variant truncate">
              Retention reserve without direct solar or grid feed
            </div>
          </div>
        </div>
      </div>

      {/* Actuator Subsystem Real-Time Grid */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Actuator Telemetry
          </span>
          <span className="text-xs text-on-surface-variant font-mono">Bus: {actuators.tecVoltage}V DC</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {/* TEC Peltier Module */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/25">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
                <span className="material-symbols-outlined text-[20px]">electric_bolt</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-on-surface">Thermoelectric (TEC)</span>
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                </div>
                <div className="text-xs text-on-surface-variant font-mono">
                  PWM {actuators.tecPwmDuty}% Duty • {actuators.tecVoltage}V • {actuators.tecCurrent}A
                </div>
              </div>
            </div>
            <span className="px-2 py-1 rounded text-xs font-bold bg-surface-container text-on-surface font-mono">
              {actuators.tecPeltierWatts}W
            </span>
          </div>

          {/* Cooling Fan */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/25">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[20px]">toys</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-on-surface">Heat Sink Fan Array</span>
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                </div>
                <div className="text-xs text-on-surface-variant">{actuators.fanStatus}</div>
              </div>
            </div>
            <span className="px-2 py-1 rounded text-xs font-bold bg-surface-container text-on-surface font-mono">
              {actuators.fanRpm.toLocaleString()} RPM
            </span>
          </div>

          {/* Hydronic Pump */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/25">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[20px]">swap_calls</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-on-surface">Hydronic PCM Loop</span>
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                </div>
                <div className="text-xs text-on-surface-variant">Propylene glycol thermal loop</div>
              </div>
            </div>
            <span className="px-2 py-1 rounded text-xs font-bold bg-surface-container text-on-surface font-mono">
              {actuators.pumpFlowLpm.toFixed(1)} L/min
            </span>
          </div>
        </div>
      </div>

      {/* 24-Hour Chamber Stability Sparkline Card */}
      <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm space-y-3 border border-outline-variant/25">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-on-surface">24h Temperature Stability</h4>
            <p className="text-xs text-on-surface-variant">Peak Ambient Glare: 28.0°C at 13:00</p>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-surface-container-high text-on-surface-variant font-medium">
            ±0.4°C Delta
          </span>
        </div>

        {/* SVG Area Line Chart */}
        <div className="w-full h-28 relative">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 80">
            <defs>
              <linearGradient id="coolGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#0e4d34" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0e4d34" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Ambient Outside Temp Curve (Muted Amber background line) */}
            <path
              d="M 0,65 Q 80,60 160,20 T 320,55"
              fill="none"
              stroke="#ffb77d"
              strokeDasharray="3,3"
              strokeWidth="2"
            />

            {/* Target Setpoint Baseline (4.0°C) */}
            <line stroke="#c0c9c1" strokeDasharray="3,3" strokeWidth="1" x1="0" x2="320" y1="42" y2="42" />

            {/* Chamber Temp Fill */}
            <path
              d="M 0,44 Q 40,43 80,45 T 160,40 T 240,43 T 320,41 L 320,80 L 0,80 Z"
              fill="url(#coolGradient)"
            />

            {/* Chamber Temp Solid Curve */}
            <path
              d="M 0,44 Q 40,43 80,45 T 160,40 T 240,43 T 320,41"
              fill="none"
              stroke="#0e4d34"
              strokeLinecap="round"
              strokeWidth="2.5"
            />

            {/* Current Node point */}
            <circle cx="320" cy="41" fill="#003521" r="4.5" stroke="#ffffff" strokeWidth="2" />
          </svg>
        </div>

        <div className="flex items-center justify-between text-[10px] text-on-surface-variant pt-1 border-t border-surface-container">
          <span>00:00 (3.9°C)</span>
          <span className="text-tertiary-container font-semibold">13:00 Peak Sun (4.1°C)</span>
          <span className="font-semibold text-primary">Now ({chamber.currentTemp.toFixed(1)}°C)</span>
        </div>
      </div>

      {/* Diagnostic & Quick Action Controls */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Door Sensor Card */}
        <div
          onClick={onToggleDoor}
          className="p-3 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/25 cursor-pointer hover:border-primary/50 transition-colors"
          title="Click to simulate opening/closing chamber hatch"
        >
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-primary text-[20px]">sensor_door</span>
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                chamber.doorClosed ? 'bg-primary' : 'bg-error animate-ping'
              }`}
            ></span>
          </div>
          <div className="mt-2">
            <div className="text-[10px] uppercase font-semibold text-on-surface-variant">Seal Sensor</div>
            <div className="text-sm font-semibold text-on-surface">
              {chamber.doorClosed ? 'Closed (OK)' : 'Breach Detected!'}
            </div>
            <div className="text-[10px] text-on-surface-variant mt-0.5">
              {chamber.doorClosed ? `Zero breach in ${chamber.lastDoorBreachMinutes}m` : 'Hatch open - Close now'}
            </div>
          </div>
        </div>

        {/* Pre-cool Switch Card */}
        <div className="p-3 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/25">
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-secondary text-[20px]">bolt</span>
            {/* Native Toggle */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={chamber.turboBoostActive}
                onChange={(e) => onToggleTurbo(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div className="mt-2">
            <div className="text-[10px] uppercase font-semibold text-on-surface-variant">Solar Surge Boost</div>
            <div className="text-sm font-semibold text-on-surface">Pre-Cool Mode</div>
            <div
              className={`text-[10px] mt-0.5 ${
                chamber.turboBoostActive ? 'text-primary font-semibold' : 'text-on-surface-variant'
              }`}
            >
              {chamber.turboBoostActive ? 'Engaged: Max 100% PWM' : 'Standby for peak PV'}
            </div>
          </div>
        </div>
      </div>

      {/* Manual Forced Defrost / Diagnostic Safety Override Button */}
      <div className="pt-1">
        <button
          onClick={onTriggerFlush}
          disabled={isFlushing}
          className="w-full min-h-[48px] py-2.5 px-4 rounded-lg bg-surface-container text-sm font-semibold text-on-surface hover:bg-surface-container-high active:scale-[0.99] transition-all flex items-center justify-center gap-2 border border-outline-variant/30 disabled:opacity-75"
          type="button"
        >
          {isFlushing ? (
            <>
              <span className="material-symbols-outlined text-[20px] animate-spin text-primary">sync</span>
              <span>Circulating Hydronic Loop...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px] text-secondary">mode_fan</span>
              <span>Force Thermal Equalization Flush</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
