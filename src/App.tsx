import React, { useState, useEffect } from 'react';
import {
  ActuatorState,
  BatteryTelemetry,
  ChamberTelemetry,
  EnergyLedger,
  ProduceBatch,
  ResilienceMode,
  SensorBusItem,
  SolarTelemetry,
  SystemAlert,
  TabType
} from './types';
import {
  INITIAL_ALERTS,
  INITIAL_PRODUCE_BATCHES,
  INITIAL_SENSOR_BUSES
} from './data/initialData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ChamberTab } from './components/ChamberTab';
import { SolarPowerTab } from './components/SolarPowerTab';
import { ProduceTab } from './components/ProduceTab';
import { AlertsTab } from './components/AlertsTab';
import { ArchitectureModal } from './components/ArchitectureModal';
import { LandingPage } from './components/LandingPage';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [activeTab, setActiveTab] = useState<TabType>('chamber');
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [lastSyncedSeconds, setLastSyncedSeconds] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Chamber State
  const [chamber, setChamber] = useState<ChamberTelemetry>({
    currentTemp: 3.8,
    targetSetpoint: 4.0,
    humidity: 88,
    vpd: 0.18,
    pcmSolidPercentage: 84,
    pcmHoursBuffer: 14.5,
    pcmState: 'Solidified (Latent Hold)',
    doorClosed: true,
    lastDoorBreachMinutes: 42,
    turboBoostActive: false,
    equalizationFlushActive: false
  });

  // Actuator State
  const [actuators, setActuators] = useState<ActuatorState>({
    tecPeltierWatts: 119,
    tecPwmDuty: 72,
    tecVoltage: 14.2,
    tecCurrent: 8.4,
    fanRpm: 1850,
    fanStatus: 'Optimal Forced Convection',
    pumpFlowLpm: 1.8,
    pumpVoltage: 12.2
  });

  // Solar State
  const [solar, setSolar] = useState<SolarTelemetry>({
    irradianceWm2: 810,
    solarWatts: 840,
    solarVolts: 38.4,
    solarAmps: 21.9,
    mpptEfficiency: 98.4,
    capacityFactor: 63.6,
    sunAzimuth: 'Clear Azimuth 142°',
    chamberLoadWatts: 420,
    batteryChargeWatts: 420
  });

  // Battery State
  const [battery, setBattery] = useState<BatteryTelemetry>({
    socPercentage: 92,
    terminalVoltage: 54.1,
    chargingCurrent: 7.8,
    cellTemp: 26.4,
    sohPercentage: 99,
    autonomyHours: 19,
    autonomyMinutes: 40
  });

  // Energy Ledger
  const [energyLedger, setEnergyLedger] = useState<EnergyLedger>({
    solarGenKwh: 4.8,
    chamberUseKwh: 2.9,
    gridDrawKwh: 0.0,
    selfConsumptionRatio: 60.4,
    surplusStoredRatio: 39.6
  });

  // Resilience Mode
  const [resilienceMode, setResilienceMode] = useState<ResilienceMode>('eco');

  // Produce Batches & Alerts
  const [batches, setBatches] = useState<ProduceBatch[]>(INITIAL_PRODUCE_BATCHES);
  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_ALERTS);
  const [sensorBuses, setSensorBuses] = useState<SensorBusItem[]>(INITIAL_SENSOR_BUSES);

  const [isPollingSolar, setIsPollingSolar] = useState(false);
  const [isFlushing, setIsFlushing] = useState(false);

  // Toast notifier helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Synchronized closed-loop cycle ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setLastSyncedSeconds((prev) => (prev >= 12 ? 1 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Closed-Loop Automation Simulation: Adjust actuators when setpoint, door, or turbo mode changes
  useEffect(() => {
    const tempDelta = chamber.currentTemp - chamber.targetSetpoint;

    let targetPwm = 72;
    let targetWatts = 119;
    let targetFanRpm = 1850;
    let targetFlow = 1.8;

    if (chamber.turboBoostActive) {
      targetPwm = 100;
      targetWatts = 168;
      targetFanRpm = 2250;
      targetFlow = 2.4;
    } else if (!chamber.doorClosed) {
      targetPwm = 95;
      targetWatts = 155;
      targetFanRpm = 2100;
      targetFlow = 2.2;
    } else if (tempDelta > 0.5) {
      targetPwm = 88;
      targetWatts = 142;
      targetFanRpm = 2000;
      targetFlow = 2.0;
    } else if (tempDelta < -0.5) {
      targetPwm = 50;
      targetWatts = 82;
      targetFanRpm = 1400;
      targetFlow = 1.4;
    }

    setActuators((prev) => ({
      ...prev,
      tecPwmDuty: targetPwm,
      tecPeltierWatts: targetWatts,
      tecCurrent: Number((targetWatts / prev.tecVoltage).toFixed(1)),
      fanRpm: targetFanRpm,
      pumpFlowLpm: targetFlow
    }));

    setSensorBuses((prev) =>
      prev.map((s) => {
        if (s.id === 'sensor-ds1') {
          return { ...s, value: chamber.currentTemp.toFixed(1) };
        }
        if (s.id === 'sensor-ntc-peltier') {
          return {
            ...s,
            value: chamber.turboBoostActive ? '37.8' : '34.2',
            statusText: `Fan at ${targetFanRpm.toLocaleString()} RPM`
          };
        }
        return s;
      })
    );
  }, [chamber.targetSetpoint, chamber.currentTemp, chamber.turboBoostActive, chamber.doorClosed]);

  // Setpoint stepper change
  const handleUpdateSetpoint = (delta: number) => {
    setChamber((prev) => {
      const nextSetpoint = Math.min(12.0, Math.max(0.5, Number((prev.targetSetpoint + delta).toFixed(1))));
      return { ...prev, targetSetpoint: nextSetpoint };
    });
    setLastSyncedSeconds(1);
  };

  // Turbo boost toggle
  const handleToggleTurbo = (active: boolean) => {
    setChamber((prev) => ({ ...prev, turboBoostActive: active }));
    if (active) {
      showToast('Solar Surge Boost Engaged: TEC modulated to 100% PWM');
    } else {
      showToast('Pre-Cool Mode Deactivated: Normal closed-loop thermal regulation');
    }
  };

  // Simulate Door Open/Close
  const handleToggleDoor = () => {
    setChamber((prev) => {
      const nextState = !prev.doorClosed;
      if (!nextState) {
        const doorAlert: SystemAlert = {
          id: `alert-${Date.now()}`,
          type: 'warning',
          title: 'Chamber Hatch Access Triggered',
          category: 'Breach Advisory',
          timeStr: 'Just now',
          description: 'Magnetic reed sensor unsealed. Rapid air exchange detected; ESP32 boosting cooling output.',
          active: true
        };
        setAlerts((al) => [doorAlert, ...al]);
        showToast('Chamber door opened! ESP32 closed-loop compensation engaged.');
      } else {
        showToast('Chamber door resealed safely.');
      }
      return {
        ...prev,
        doorClosed: nextState,
        lastDoorBreachMinutes: nextState ? 0 : prev.lastDoorBreachMinutes
      };
    });
  };

  // Thermal equalization flush button action
  const handleTriggerFlush = () => {
    setIsFlushing(true);
    showToast('Engaged high-flow hydronic equalization flush across PCM cold plates.');

    setTimeout(() => {
      setIsFlushing(false);
      showToast('Chamber thermal equalization completed: Fluid loop stable at 1.8 L/min.');
    }, 2200);
  };

  // Solar Poll action
  const handlePollSensors = () => {
    setIsPollingSolar(true);
    setTimeout(() => {
      setIsPollingSolar(false);
      setSolar((prev) => ({
        ...prev,
        irradianceWm2: 810 + Math.floor(Math.random() * 20 - 10),
        solarWatts: 840 + Math.floor(Math.random() * 25 - 12)
      }));
      setLastSyncedSeconds(1);
    }, 900);
  };

  // Resilience mode change
  const handleChangeResilienceMode = (mode: ResilienceMode) => {
    setResilienceMode(mode);
    if (mode === 'eco') {
      showToast('Switched to Eco-Thermal Priority (Peak Solar Sync)');
    } else if (mode === 'pcm') {
      showToast('Switched to Max PCM Sub-cooling (Latent Buffer Priority)');
    } else {
      showToast('Switched to Battery Preservation Mode (Throttle Load)');
    }
  };

  // Add Produce Batch
  const handleAddBatch = (newBatch: ProduceBatch) => {
    setBatches((prev) => [newBatch, ...prev]);
  };

  // Active Alert Count
  const activeAlertCount = alerts.filter((a) => a.active).length;

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface flex flex-col antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      {currentView === 'landing' ? (
        /* Landing Page View */
        <LandingPage
          onLaunchDashboard={() => setCurrentView('dashboard')}
          onOpenArchitecture={() => setIsArchitectureOpen(true)}
        />
      ) : (
        /* Live IoT Monitoring Dashboard View */
        <>
          {/* Top Header */}
          <Header
            onOpenArchitecture={() => setIsArchitectureOpen(true)}
            onBackToLanding={() => setCurrentView('landing')}
            lastSyncedSeconds={lastSyncedSeconds}
          />

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col w-full max-w-md mx-auto pt-20 pb-20">
            {activeTab === 'chamber' && (
              <ChamberTab
                chamber={chamber}
                actuators={actuators}
                lastSyncedSeconds={lastSyncedSeconds}
                onUpdateSetpoint={handleUpdateSetpoint}
                onToggleTurbo={handleToggleTurbo}
                onToggleDoor={handleToggleDoor}
                onTriggerFlush={handleTriggerFlush}
                isFlushing={isFlushing}
              />
            )}

            {activeTab === 'solar' && (
              <SolarPowerTab
                solar={solar}
                battery={battery}
                energyLedger={energyLedger}
                resilienceMode={resilienceMode}
                onChangeResilienceMode={handleChangeResilienceMode}
                onPollSensors={handlePollSensors}
                isPolling={isPollingSolar}
              />
            )}

            {activeTab === 'produce' && (
              <ProduceTab
                chamber={chamber}
                batches={batches}
                onAddBatch={handleAddBatch}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'alerts' && (
              <AlertsTab
                alerts={alerts}
                sensorBuses={sensorBuses}
                onShowToast={showToast}
              />
            )}
          </main>

          {/* Persistent Bottom Navigation */}
          <BottomNav
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            alertCount={activeAlertCount}
          />
        </>
      )}

      {/* Shared System Hardware Architecture Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 max-w-xs w-full px-4 py-2.5 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-2xl text-xs font-medium z-50 flex items-center justify-center gap-2 border border-white/10 animate-bounce">
          <span className="material-symbols-outlined text-primary-fixed text-[18px]">check_circle</span>
          <span className="truncate">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

