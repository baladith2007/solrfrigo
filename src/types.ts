export type TabType = 'chamber' | 'solar' | 'produce' | 'alerts';

export type ResilienceMode = 'eco' | 'pcm' | 'battery';

export interface ChamberTelemetry {
  currentTemp: number; // e.g. 3.8 °C
  targetSetpoint: number; // e.g. 4.0 °C
  humidity: number; // e.g. 88 %
  vpd: number; // Vapor Pressure Deficit e.g. 0.18 kPa
  pcmSolidPercentage: number; // e.g. 84 %
  pcmHoursBuffer: number; // e.g. 14.5 hours
  pcmState: 'Solidified (Latent Hold)' | 'Super-chilling' | 'Phase Transitioning';
  doorClosed: boolean;
  lastDoorBreachMinutes: number;
  turboBoostActive: boolean;
  equalizationFlushActive: boolean;
}

export interface ActuatorState {
  tecPeltierWatts: number; // 119W
  tecPwmDuty: number; // 72%
  tecVoltage: number; // 14.2V
  tecCurrent: number; // 8.4A
  fanRpm: number; // 1850 RPM
  fanStatus: 'Optimal Forced Convection' | 'Low Noise Eco' | 'High Surge';
  pumpFlowLpm: number; // 1.8 L/min
  pumpVoltage: number; // 12.2V
}

export interface SolarTelemetry {
  irradianceWm2: number; // 810 W/m²
  solarWatts: number; // 840W
  solarVolts: number; // 38.4V
  solarAmps: number; // 21.9A
  mpptEfficiency: number; // 98.4%
  capacityFactor: number; // 63.6%
  sunAzimuth: string; // "Clear Azimuth 142°"
  chamberLoadWatts: number; // 420W
  batteryChargeWatts: number; // +420W
}

export interface BatteryTelemetry {
  socPercentage: number; // 92%
  terminalVoltage: number; // 54.1V
  chargingCurrent: number; // +7.8A
  cellTemp: number; // 26.4°C
  sohPercentage: number; // 99%
  autonomyHours: number; // 19h 40m
  autonomyMinutes: number;
}

export interface EnergyLedger {
  solarGenKwh: number; // 4.8 kWh
  chamberUseKwh: number; // 2.9 kWh
  gridDrawKwh: number; // 0.0 kWh
  selfConsumptionRatio: number; // 60.4%
  surplusStoredRatio: number; // 39.6%
}

export interface ProduceBatch {
  id: string;
  batchCode: string;
  cropName: string;
  variety: string;
  category: string;
  tag?: string;
  weightKg: number;
  crates: number;
  freshnessPercent: number;
  qualityGrade: string;
  storedDays: number;
  targetMandi: string;
  dispatchDaysLeft: number;
  imageUrl: string;
  statusNote: string;
  farmerName: string;
}

export interface SystemAlert {
  id: string;
  type: 'advisory' | 'resolved' | 'warning';
  title: string;
  category: string;
  timeStr: string;
  description: string;
  active: boolean;
}

export interface SensorBusItem {
  id: string;
  name: string;
  busType: string;
  value: string;
  unit: string;
  subValue?: string;
  statusText: string;
  nominal: boolean;
  icon: string;
}
