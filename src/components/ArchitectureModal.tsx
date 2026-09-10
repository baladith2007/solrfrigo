import React, { useState } from 'react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTier, setActiveTier] = useState<number | null>(null);

  if (!isOpen) return null;

  const TIERS = [
    {
      id: 1,
      name: '1. Solar Power Harvesting & Storage',
      tag: 'Energy Generation',
      bgColor: 'bg-emerald-50 text-emerald-950 border-emerald-300',
      badgeColor: 'bg-emerald-200 text-emerald-900',
      icon: 'solar_power',
      components: [
        { name: 'PV Solar Array', spec: '4x 330W Monocrystalline Panels (1.3 kWp)' },
        { name: 'MPPT Charge Controller', spec: 'Dual-Channel Maximum Power Point Tracker (98.4% eff.)' },
        { name: 'LiFePO4 Battery Pack', spec: '48V / 100Ah (4.8 kWh) Backup Storage' }
      ],
      description: 'Converts solar insolation into regulated 48V DC power with dynamic MPPT tracking; stores surplus energy to sustain the cold chamber off-grid.'
    },
    {
      id: 2,
      name: '2. Temperature Control & Hydronic Transfer',
      tag: 'Active Refrigeration',
      bgColor: 'bg-sky-50 text-sky-950 border-sky-300',
      badgeColor: 'bg-sky-200 text-sky-900',
      icon: 'ac_unit',
      components: [
        { name: 'Thermoelectric (TEC)', spec: 'High-power Peltier module (PWM modulated 0–100%)' },
        { name: 'Forced Heat Sink Fan', spec: 'Brushless dual fan array (1,850 RPM convection)' },
        { name: 'Hydronic Glycol Pump', spec: '12V fluid pump circulating chilled coolant (1.8 L/min)' }
      ],
      description: 'Solid-state thermoelectric heat pump pumps heat out of the produce chamber into a hydronic circulation loop with fan-assisted dissipation.'
    },
    {
      id: 3,
      name: '3. Thermal Energy Buffering (PCM)',
      tag: 'Latent Heat Storage',
      bgColor: 'bg-purple-50 text-purple-950 border-purple-300',
      badgeColor: 'bg-purple-200 text-purple-900',
      icon: 'layers',
      components: [
        { name: 'PCM Storage Matrix', spec: 'Inorganic Hydrated Salt blend (-1.2°C to 0°C plateau)' },
        { name: 'Cold-Plate Heat Exchanger', spec: 'Internal fluid channels bonded to PCM reservoirs' },
        { name: 'Thermal Buffer Autonomy', spec: '14.5+ Hours holding time without battery drain' }
      ],
      description: 'During peak midday solar generation, excess watts freeze the PCM solid. During night hours or monsoon cloud cover, the melting PCM maintains 3.8°C.'
    },
    {
      id: 4,
      name: '4. Embedded Closed-Loop Controller',
      tag: 'ESP32 Automation Core',
      bgColor: 'bg-amber-50 text-amber-950 border-amber-300',
      badgeColor: 'bg-amber-200 text-amber-900',
      icon: 'memory',
      components: [
        { name: 'ESP32 Microcontroller', spec: 'Dual-core 240MHz, Wi-Fi / BLE / LoRa transceiver' },
        { name: 'Sensors (DS18B20 & INA226)', spec: 'One-Wire chamber/PCM probes + I2C volt/current ICs' },
        { name: 'MOSFET / Relay Drivers', spec: 'PWM switching for TEC, fan speed, pump relays' }
      ],
      description: 'Runs continuous 100ms closed-loop feedback: monitors chamber temperature against setpoint, checks solar & battery, and dynamically modulates cooling.'
    },
    {
      id: 5,
      name: '5. IoT Connectivity & Farmer Dashboard',
      tag: 'Remote Intelligence',
      bgColor: 'bg-teal-50 text-teal-950 border-teal-300',
      badgeColor: 'bg-teal-200 text-teal-900',
      icon: 'smartphone',
      components: [
        { name: 'Cloud Telemetry Sync', spec: 'Secure MQTT / TLS IoT link with offline flash buffer' },
        { name: 'Mobile Web Dashboard', spec: 'Real-time chamber, solar, battery & produce UI' },
        { name: 'Mandi Gatepass QR Link', spec: 'Digital cold-chain compliance & APMC market dispatch' }
      ],
      description: 'Enables remote farm monitoring in remote hill tracts, predictive insolation adaptation for NER weather, and rapid digital mandi dispatch.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest text-on-surface w-full max-w-lg rounded-2xl p-5 shadow-2xl border border-outline-variant/30 space-y-4 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-surface-container pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">account_tree</span>
            <div>
              <h3 className="text-base font-bold text-on-surface">System Hardware Architecture</h3>
              <p className="text-xs text-on-surface-variant">SolFrigo Solar Smart Mini Cold Storage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
            aria-label="Close Architecture Modal"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed">
          The 5 integrated subsystems engineered for the high-humidity, intermittent insolation terrain of the North Eastern Region (NER) of India:
        </p>

        {/* 5-Tier Interactive Flow Diagram */}
        <div className="space-y-3">
          {TIERS.map((tier, idx) => (
            <div key={tier.id} className="relative">
              {/* Connector Arrow */}
              {idx > 0 && (
                <div className="flex justify-center -my-1.5 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-outline shadow-sm">
                    <span className="material-symbols-outlined text-[15px]">arrow_downward</span>
                  </div>
                </div>
              )}

              {/* Tier Box */}
              <div
                onClick={() => setActiveTier(activeTier === tier.id ? null : tier.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-sm ${tier.bgColor} hover:shadow-md`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center shadow-xs">
                      <span className="material-symbols-outlined text-[20px]">{tier.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold leading-tight">{tier.name}</h4>
                      <span className={`text-[10px] px-2 py-0.2 rounded-full font-semibold ${tier.badgeColor}`}>
                        {tier.tag}
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[18px]">
                    {activeTier === tier.id ? 'expand_less' : 'expand_more'}
                  </span>
                </div>

                <p className="text-[11px] mt-2 opacity-90 leading-snug">{tier.description}</p>

                {/* Subcomponent specs list */}
                <div className="mt-2.5 grid grid-cols-1 gap-1 pt-2 border-t border-black/10 text-[10px]">
                  {tier.components.map((comp, ci) => (
                    <div key={ci} className="flex items-baseline justify-between bg-white/60 px-2 py-1 rounded">
                      <span className="font-bold">{comp.name}</span>
                      <span className="font-mono text-black/70 truncate ml-2">{comp.spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full h-11 rounded-lg bg-primary text-on-primary font-semibold text-xs shadow-md active:scale-98 transition-transform"
          >
            Back to Live Monitoring Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
