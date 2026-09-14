import React, { useState } from 'react';
import { BatteryTelemetry, EnergyLedger, ResilienceMode, SolarTelemetry, SupabaseTelemetryState } from '../types';

interface SolarPowerTabProps {
  solar: SolarTelemetry;
  battery: BatteryTelemetry;
  energyLedger: EnergyLedger;
  resilienceMode: ResilienceMode;
  supabaseTelemetry?: SupabaseTelemetryState;
  onChangeResilienceMode: (mode: ResilienceMode) => void;
  onPollSensors: () => void;
  isPolling: boolean;
}

export const SolarPowerTab: React.FC<SolarPowerTabProps> = ({
  solar,
  battery,
  energyLedger,
  resilienceMode,
  supabaseTelemetry,
  onChangeResilienceMode,
  onPollSensors,
  isPolling
}) => {
  const [pollSuccessText, setPollSuccessText] = useState<string | null>(null);

  // Dynamic calculation for the SVG circle gauge (r=40, circumference ~ 251.2)
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (battery.socPercentage / 100) * circumference;

  const handlePoll = () => {
    onPollSensors();
    setPollSuccessText('Telemetry Refreshed');
    setTimeout(() => setPollSuccessText(null), 2500);
  };

  return (
    <div className="flex flex-col w-full px-4 pb-20 space-y-4 max-w-md mx-auto">
      {/* Hub Header Status Capsule */}
      <div className="flex items-center justify-between bg-surface-container-low rounded-xl px-4 py-3 shadow-sm border border-outline-variant/30">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse shrink-0"></span>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-on-surface truncate">Solar & Power Node</span>
              {supabaseTelemetry?.isConnected && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Supabase Live
                </span>
              )}
            </div>
            <span className="text-[11px] text-on-surface-variant truncate font-mono">
              MPPT Dual-Channel • Bus 48V Active
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-surface-container-highest px-2.5 py-1 rounded-full shrink-0">
          <span className="material-symbols-outlined text-[16px] text-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
            wb_sunny
          </span>
          <span className="text-xs text-on-surface font-semibold font-mono">{solar.irradianceWm2} W/m²</span>
        </div>
      </div>

      {/* Real-Time Dynamic Energy Flow Card */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm space-y-3 border border-outline-variant/25">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary-container">
              <span className="material-symbols-outlined text-[18px]">alt_route</span>
            </div>
            <div>
              <span className="text-sm font-semibold text-on-surface block">Live Power Matrix</span>
              <p className="text-[11px] text-on-surface-variant">Real-time split telemetry</p>
            </div>
          </div>
          <span className="bg-primary-fixed text-on-primary-fixed text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
            <span className="material-symbols-outlined text-[13px]">bolt</span> MPPT {solar.mpptEfficiency}%
          </span>
        </div>

        {/* Solar Producer Node */}
        <div className="bg-surface-container-low rounded-xl p-3.5 relative overflow-hidden border border-outline-variant/25">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-tertiary-fixed-dim/40 flex items-center justify-center text-on-tertiary-container shrink-0">
                <span className="material-symbols-outlined text-[24px]">solar_power</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl text-on-surface font-bold font-mono">{solar.solarWatts} W</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-bold uppercase">
                    Generating
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant">4x 330W Monocrystalline (Kohima Mount)</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-on-surface block font-semibold font-mono">{solar.solarVolts}V</span>
              <span className="text-[11px] text-on-surface-variant font-mono">{solar.solarAmps}A Inflow</span>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-on-surface-variant text-xs">
            <span>Capacity factor: {solar.capacityFactor}%</span>
            <span className="text-primary font-medium">{solar.sunAzimuth}</span>
          </div>
        </div>

        {/* Directional SVG Energy Split Diagram */}
        <div className="relative py-1">
          <svg className="w-full h-20" fill="none" preserveAspectRatio="none" viewBox="0 0 340 76">
            <path
              className="text-surface-container-highest"
              d="M170 4 V 34 M170 34 H 80 V 72 M170 34 H 260 V 72"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
            {/* Animated pulses Solar -> Chamber Load */}
            <circle className="fill-secondary" r="3.5">
              <animateMotion dur="1.8s" path="M170 4 V 34 H 80 V 72" repeatCount="indefinite" />
            </circle>
            {/* Animated pulses Solar -> Battery Bank */}
            <circle className="fill-primary" r="3.5">
              <animateMotion dur="1.8s" path="M170 4 V 34 H 260 V 72" repeatCount="indefinite" />
            </circle>
            {/* Central junction badge */}
            <circle className="fill-surface-container-lowest stroke-primary" cx="170" cy="34" r="7" strokeWidth="2" />
            <circle className="fill-primary" cx="170" cy="34" r="2.5" />
          </svg>
          <div className="absolute inset-x-0 top-6 flex justify-center pointer-events-none">
            <span className="bg-surface-container-high text-on-surface text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm border border-outline-variant/30">
              50/50 Balanced Split
            </span>
          </div>
        </div>

        {/* Power Consumption Consumers Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* TEC Cold Storage Active Load */}
          <div className="bg-secondary-fixed/30 rounded-xl p-3 flex flex-col justify-between border border-secondary-fixed-dim/40">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="material-symbols-outlined text-[18px] text-secondary">mode_fan</span>
                <span className="text-[10px] bg-secondary-fixed text-on-secondary-fixed-variant px-1.5 py-0.5 rounded-full font-semibold">
                  Chamber Run
                </span>
              </div>
              <span className="text-xs text-on-surface-variant block">Cold Load Draw</span>
              <span className="text-base text-on-surface font-bold font-mono">{solar.chamberLoadWatts} W</span>
            </div>
            <p className="text-[10px] text-on-surface-variant mt-2 pt-1 border-t border-secondary-fixed-dim/30">
              TEC Pumping + 12V Hydronic Circuit
            </p>
          </div>

          {/* Battery Storage Inflow */}
          <div className="bg-primary-fixed/30 rounded-xl p-3 flex flex-col justify-between border border-primary-fixed-dim/40">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="material-symbols-outlined text-[18px] text-primary">battery_charging_full</span>
                <span className="text-[10px] bg-primary-fixed text-on-primary-fixed font-semibold px-1.5 py-0.5 rounded-full">
                  Surplus Stored
                </span>
              </div>
              <span className="text-xs text-on-surface-variant block">Pack Charge</span>
              <span className="text-base text-on-surface font-bold font-mono">+{solar.batteryChargeWatts} W</span>
            </div>
            <p className="text-[10px] text-primary mt-2 pt-1 font-medium border-t border-primary-fixed-dim/30">
              +{battery.chargingCurrent}A at {battery.terminalVoltage}V Float Buffer
            </p>
          </div>
        </div>
      </div>

      {/* Li-ion Battery Bank & Storage Telemetry */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm space-y-3 border border-outline-variant/25">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">energy_savings_leaf</span>
            </div>
            <div>
              <span className="text-sm font-semibold text-on-surface block">LiFePO4 Core Bank</span>
              <p className="text-[11px] text-on-surface-variant">16S Pack • 48V / 100Ah Modular</p>
            </div>
          </div>
          <span className="text-xs bg-surface-container-high text-on-surface px-2 py-0.5 rounded-full font-semibold">
            SOH {battery.sohPercentage}%
          </span>
        </div>

        <div className="flex items-center gap-4 bg-surface-container-low rounded-xl p-3.5 border border-outline-variant/25">
          {/* Circular Progress Ring Gauge */}
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
              <circle
                className="text-surface-container-highest"
                cx="48"
                cy="48"
                fill="none"
                r={radius}
                stroke="currentColor"
                strokeWidth="7"
              />
              <circle
                className="text-primary"
                cx="48"
                cy="48"
                fill="none"
                r={radius}
                stroke="currentColor"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                strokeWidth="7"
                style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-bold leading-tight text-on-surface font-sans">
                {battery.socPercentage}%
              </span>
              <span className="text-[9px] text-primary uppercase font-bold tracking-wider">SOC</span>
            </div>
          </div>

          {/* Battery Pack Vital Telemetry */}
          <div className="flex-1 min-w-0 space-y-1.5 text-xs">
            <div className="flex justify-between items-baseline">
              <span className="text-on-surface-variant">Terminal Volts</span>
              <span className="font-semibold text-on-surface font-mono">
                {battery.terminalVoltage} V <span className="text-[10px] text-on-surface-variant font-normal">(48V Nom)</span>
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-on-surface-variant">Charging Current</span>
              <span className="font-semibold text-primary font-mono">+{battery.chargingCurrent} A</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-on-surface-variant">Mean Cell Temp</span>
              <span className="font-semibold text-on-surface font-mono">{battery.cellTemp}°C</span>
            </div>
          </div>
        </div>

        {/* Battery Autonomy Projection Banner */}
        <div className="bg-surface-container flex items-center justify-between p-2.5 rounded-lg border border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">schedule</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Cold Storage Autonomy</span>
              <span className="text-xs font-bold text-on-surface">
                {battery.autonomyHours}h {battery.autonomyMinutes}m total runtime
              </span>
            </div>
          </div>
          <span className="text-[10px] text-on-surface bg-surface-container-lowest px-2 py-0.5 rounded shadow-sm">
            Without Solar Input
          </span>
        </div>
      </div>

      {/* Weather Forecast & Preemptive PCM Charging */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm space-y-3 border border-outline-variant/25">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary-container">
              <span className="material-symbols-outlined text-[18px]">cloud_sync</span>
            </div>
            <div>
              <span className="text-sm font-semibold text-on-surface block">Predictive Insolation</span>
              <p className="text-[11px] text-on-surface-variant">Kohima Range Microclimate</p>
            </div>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold">
            Auto Forecast Sync
          </span>
        </div>

        <div className="bg-surface-container-low rounded-xl p-3.5 space-y-2.5 border border-outline-variant/20">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-surface-container-highest text-tertiary-container shrink-0">
              <span className="material-symbols-outlined text-[22px]">thunderstorm</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-on-surface">Monsoon Squall at 15:30</span>
                <span className="text-xs text-error font-medium">-72% Insolation</span>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                Cloud cover expected across Kohima spine. Solar generation projected to dip below 220W for ~2.5 hrs.
              </p>
            </div>
          </div>

          {/* Smart Controller Action Capsule */}
          <div className="bg-surface-container-lowest rounded-lg p-2.5 flex items-center gap-2.5 border border-outline-variant/30">
            <span className="material-symbols-outlined text-[20px] text-secondary shrink-0">ac_unit</span>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-on-surface block">Preemptive Thermal Sub-cooling</span>
              <span className="text-[10px] text-on-surface-variant block truncate">
                Supercharging PCM cold-plates to 100% capacity prior to cloud arrival
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-semibold">
              Active Now
            </span>
          </div>
        </div>
      </div>

      {/* Daily Energy Balance Analytics */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm space-y-3 border border-outline-variant/25">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
              <span className="material-symbols-outlined text-[18px]">query_stats</span>
            </div>
            <div>
              <span className="text-sm font-semibold text-on-surface block">Energy Analytics</span>
              <p className="text-[11px] text-on-surface-variant">Today's cumulative ledger</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full text-[10px] font-bold">
            <span className="material-symbols-outlined text-[12px]">verified</span> 100% Off-Grid
          </div>
        </div>

        {/* Triple Metric Balance Grid */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="bg-surface-container-low rounded-xl p-2.5 text-center border border-outline-variant/20">
            <span className="text-[10px] text-on-surface-variant uppercase block">Solar Gen</span>
            <span className="text-base text-on-surface font-bold font-mono">{energyLedger.solarGenKwh}</span>
            <span className="text-[10px] text-tertiary-container block font-medium">kWh Yield</span>
          </div>
          <div className="bg-surface-container-low rounded-xl p-2.5 text-center border border-outline-variant/20">
            <span className="text-[10px] text-on-surface-variant uppercase block">Chamber Use</span>
            <span className="text-base text-on-surface font-bold font-mono">{energyLedger.chamberUseKwh}</span>
            <span className="text-[10px] text-secondary block font-medium">kWh Consumed</span>
          </div>
          <div className="bg-surface-container-low rounded-xl p-2.5 text-center border border-outline-variant/20">
            <span className="text-[10px] text-on-surface-variant uppercase block">Grid Draw</span>
            <span className="text-base text-primary font-bold font-mono">{energyLedger.gridDrawKwh.toFixed(1)}</span>
            <span className="text-[10px] text-primary block font-medium">kWh Used</span>
          </div>
        </div>

        {/* Comparative Visual Ratio Bar */}
        <div className="pt-1">
          <div className="flex justify-between text-[10px] text-on-surface-variant mb-1">
            <span>Self-Consumption Ratio: {energyLedger.selfConsumptionRatio}%</span>
            <span>Surplus Stored: {energyLedger.surplusStoredRatio}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-surface-container-highest overflow-hidden flex">
            <div className="h-full bg-secondary" style={{ width: `${energyLedger.selfConsumptionRatio}%` }}></div>
            <div className="h-full bg-primary-container" style={{ width: `${energyLedger.surplusStoredRatio}%` }}></div>
          </div>
        </div>
      </div>

      {/* Low-Sunlight Resilience Operating Profile Selector */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm space-y-2.5 border border-outline-variant/25">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-on-surface">
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </div>
            <div>
              <span className="text-sm font-semibold text-on-surface block">Resilience Profile</span>
              <p className="text-[11px] text-on-surface-variant">Algorithmic weather adaptations</p>
            </div>
          </div>
          <span className="text-xs text-primary font-semibold">
            {resilienceMode === 'eco' ? 'Eco-Active' : resilienceMode === 'pcm' ? 'PCM-Priority' : 'Battery-Safe'}
          </span>
        </div>

        <div className="space-y-2 pt-1">
          {/* Profile Option 1: Eco-Thermal Priority */}
          <button
            onClick={() => onChangeResilienceMode('eco')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all active:scale-[0.99] border ${
              resilienceMode === 'eco'
                ? 'bg-surface-container border-primary/40 shadow-sm'
                : 'bg-surface-container-low border-transparent hover:bg-surface-container'
            }`}
            type="button"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">eco</span>
              </div>
              <div>
                <span className="text-xs font-bold text-on-surface block">Eco-Thermal Priority</span>
                <span className="text-[11px] text-on-surface-variant block">
                  Sync cooling cycles exclusively with peak irradiance hours
                </span>
              </div>
            </div>
            <span
              className={`material-symbols-outlined text-[20px] ${
                resilienceMode === 'eco' ? 'text-primary' : 'text-outline'
              }`}
              style={{ fontVariationSettings: resilienceMode === 'eco' ? "'FILL' 1" : "'FILL' 0" }}
            >
              {resilienceMode === 'eco' ? 'check_circle' : 'radio_button_unchecked'}
            </span>
          </button>

          {/* Profile Option 2: Max PCM Charging */}
          <button
            onClick={() => onChangeResilienceMode('pcm')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all active:scale-[0.99] border ${
              resilienceMode === 'pcm'
                ? 'bg-surface-container border-primary/40 shadow-sm'
                : 'bg-surface-container-low border-transparent hover:bg-surface-container'
            }`}
            type="button"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-container-highest text-on-surface-variant flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">severe_cold</span>
              </div>
              <div>
                <span className="text-xs font-bold text-on-surface block">Max PCM Sub-cooling</span>
                <span className="text-[11px] text-on-surface-variant block">
                  Channel excess watts into Phase Change Material buffer
                </span>
              </div>
            </div>
            <span
              className={`material-symbols-outlined text-[20px] ${
                resilienceMode === 'pcm' ? 'text-primary' : 'text-outline'
              }`}
              style={{ fontVariationSettings: resilienceMode === 'pcm' ? "'FILL' 1" : "'FILL' 0" }}
            >
              {resilienceMode === 'pcm' ? 'check_circle' : 'radio_button_unchecked'}
            </span>
          </button>

          {/* Profile Option 3: Battery Preservation */}
          <button
            onClick={() => onChangeResilienceMode('battery')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all active:scale-[0.99] border ${
              resilienceMode === 'battery'
                ? 'bg-surface-container border-primary/40 shadow-sm'
                : 'bg-surface-container-low border-transparent hover:bg-surface-container'
            }`}
            type="button"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-container-highest text-on-surface-variant flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">battery_saver</span>
              </div>
              <div>
                <span className="text-xs font-bold text-on-surface block">Battery Preservation</span>
                <span className="text-[11px] text-on-surface-variant block">
                  Throttle non-critical TEC modules to maximize reserve runtime
                </span>
              </div>
            </div>
            <span
              className={`material-symbols-outlined text-[20px] ${
                resilienceMode === 'battery' ? 'text-primary' : 'text-outline'
              }`}
              style={{ fontVariationSettings: resilienceMode === 'battery' ? "'FILL' 1" : "'FILL' 0" }}
            >
              {resilienceMode === 'battery' ? 'check_circle' : 'radio_button_unchecked'}
            </span>
          </button>
        </div>
      </div>

      {/* Manual Telemetry Sync Button */}
      <button
        onClick={handlePoll}
        disabled={isPolling}
        className="w-full h-12 bg-primary-container hover:bg-primary-container/90 text-on-primary rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all disabled:opacity-80"
        type="button"
      >
        <span className={`material-symbols-outlined text-[20px] ${isPolling ? 'animate-spin' : ''}`}>
          refresh
        </span>
        <span>
          {isPolling
            ? 'Querying ESP32 INA226 Telemetry...'
            : pollSuccessText || 'Poll Solar Sensors Now'}
        </span>
      </button>
    </div>
  );
};
