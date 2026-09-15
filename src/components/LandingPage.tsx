import React, { useState } from 'react';

interface LandingPageProps {
  onLaunchDashboard: () => void;
  onOpenArchitecture: () => void;
}

interface CropRate {
  name: string;
  variety: string;
  marketPricePerKg: number;
  shelfLifeAmbientDays: number;
  shelfLifeColdDays: number;
  origin: string;
}

const CROP_RATES: Record<string, CropRate> = {
  chilli: {
    name: 'Naga King Chilli (Bhut Jolokia)',
    variety: 'GI-Tagged Hot Pepper',
    marketPricePerKg: 380,
    shelfLifeAmbientDays: 3,
    shelfLifeColdDays: 28,
    origin: 'Nagaland (Kohima & Peren)'
  },
  mandarin: {
    name: 'Khasi Mandarin',
    variety: 'Sweet Citrus reticulata',
    marketPricePerKg: 95,
    shelfLifeAmbientDays: 6,
    shelfLifeColdDays: 45,
    origin: 'Meghalaya (East Khasi Hills)'
  },
  ginger: {
    name: 'Organic Sikkim Ginger (Bhaise)',
    variety: 'High Oleoresin Rhizome',
    marketPricePerKg: 140,
    shelfLifeAmbientDays: 8,
    shelfLifeColdDays: 60,
    origin: 'Sikkim (Namchi Cluster)'
  },
  cabbage: {
    name: 'Highland Mountain Cabbage',
    variety: 'Brassica oleracea',
    marketPricePerKg: 42,
    shelfLifeAmbientDays: 4,
    shelfLifeColdDays: 35,
    origin: 'Nagaland & Manipur Hills'
  }
};

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchDashboard, onOpenArchitecture }) => {
  const [selectedCrop, setSelectedCrop] = useState<string>('chilli');
  const [harvestWeightKg, setHarvestWeightKg] = useState<number>(450);
  const [isPilotModalOpen, setIsPilotModalOpen] = useState(false);
  const [pilotSubmitted, setPilotSubmitted] = useState(false);

  // Calculator calculations
  const cropData = CROP_RATES[selectedCrop];
  const typicalLossWithoutColdStorage = 0.35; // 35% typical NER spoilage
  const lossWithSolFrigo = 0.02; // Under 2% spoilage
  const savedKg = Math.round(harvestWeightKg * (typicalLossWithoutColdStorage - lossWithSolFrigo));
  const addedRevenue = savedKg * cropData.marketPricePerKg;
  const extensionFactor = Math.round(cropData.shelfLifeColdDays / cropData.shelfLifeAmbientDays);

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 w-full z-40 bg-surface/90 backdrop-blur-xl border-b border-surface-container-high/60 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-fixed shadow-sm">
              <span className="material-symbols-outlined text-[24px]">solar_power</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-on-surface">SolFrigo</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed">
                  NER India
                </span>
              </div>
              <span className="text-xs text-on-surface-variant font-medium">
                Solar Smart Mini Cold Storage
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-on-surface-variant">
            <a href="#innovations" className="hover:text-primary transition-colors">Core Innovations</a>
            <a href="#pcm-buffering" className="hover:text-primary transition-colors">PCM Technology</a>
            <a href="#calculator" className="hover:text-primary transition-colors">Impact Calculator</a>
            <a href="#specs" className="hover:text-primary transition-colors">Technical Specs</a>
            <a href="#deployments" className="hover:text-primary transition-colors">NER Footprint</a>
          </nav>

          {/* Right Action: Launch Live Dashboard */}
          <div className="flex items-center gap-3">
            <button
              onClick={onLaunchDashboard}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-semibold text-xs sm:text-sm shadow-md active:scale-95 transition-all"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-fixed opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-fixed"></span>
              </span>
              <span>Launch Live Dashboard</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-surface-container-high/40">
        {/* Subtle decorative clean-tech background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-primary-fixed-dim/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-secondary-fixed/25 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/40 text-xs font-semibold text-primary">
                <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                <span>Tailored for North Eastern Region (NER) Farmers</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-on-surface leading-[1.15]">
                Solar-Powered Mini Cold Storage with <span className="text-primary-container">Thermal PCM Buffering</span>
              </h1>

              <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed max-w-2xl">
                Combating rural grid deficits and post-harvest losses across Nagaland, Meghalaya, Sikkim, and Assam. Powered by solid-state thermoelectric cooling, Phase Change Material latent retention, and ESP-12E IoT automation.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onLaunchDashboard}
                  className="px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">monitor_heart</span>
                  <span>View Live Chamber Telemetry (Unit NER-04)</span>
                </button>

                <button
                  onClick={onOpenArchitecture}
                  className="px-6 py-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-semibold text-sm border border-outline-variant/40 transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px] text-secondary">schema</span>
                  <span>System Architecture Flow</span>
                </button>
              </div>

              {/* Micro Metric Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-surface-container-high/60">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-primary">100%</div>
                  <div className="text-xs text-on-surface-variant mt-0.5">Off-Grid Solar Powered</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-secondary">14.5h</div>
                  <div className="text-xs text-on-surface-variant mt-0.5">PCM Latent Hold (No Sun)</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-tertiary-container">&lt; 2%</div>
                  <div className="text-xs text-on-surface-variant mt-0.5">Produce Spoilage Rate</div>
                </div>
              </div>
            </div>

            {/* Hero Right: Live Telemetry Preview Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-xl border border-outline-variant/30 relative overflow-hidden space-y-4">
                <div className="flex items-center justify-between border-b border-surface-container pb-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse"></span>
                    <span className="text-xs font-bold text-on-surface">Unit NER-04 • Kohima Hub</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-semibold">
                    ESP-12E TLS Active
                  </span>
                </div>

                {/* Primary Chamber Thermal Snapshot */}
                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-on-surface-variant block">
                      Internal Chamber State
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-4xl font-extrabold font-mono text-on-surface">3.8</span>
                      <span className="text-lg text-on-surface-variant font-medium">°C</span>
                    </div>
                    <span className="text-[11px] text-primary font-medium mt-0.5 block">
                      Target 4.0°C • Optimal Chill
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary mb-1 ml-auto">
                      <span className="material-symbols-outlined text-[24px]">ac_unit</span>
                    </div>
                    <span className="text-xs font-semibold text-on-surface">88% RH</span>
                  </div>
                </div>

                {/* Micro Subsystems Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {/* Solar Bus */}
                  <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 space-y-1">
                    <div className="flex items-center justify-between text-on-surface-variant text-[11px]">
                      <span>Solar MPPT</span>
                      <span className="material-symbols-outlined text-[15px] text-tertiary-container">wb_sunny</span>
                    </div>
                    <div className="text-base font-bold font-mono text-on-surface">840 W</div>
                    <div className="text-[10px] text-primary font-medium">38.4V • 21.9A Inflow</div>
                  </div>

                  {/* Battery Bus */}
                  <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 space-y-1">
                    <div className="flex items-center justify-between text-on-surface-variant text-[11px]">
                      <span>LiFePO4 Bank</span>
                      <span className="material-symbols-outlined text-[15px] text-primary">battery_charging_full</span>
                    </div>
                    <div className="text-base font-bold font-mono text-on-surface">92% SOC</div>
                    <div className="text-[10px] text-on-surface-variant">54.1V • +7.8A Charge</div>
                  </div>

                  {/* PCM Thermal Buffer */}
                  <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 space-y-1">
                    <div className="flex items-center justify-between text-on-surface-variant text-[11px]">
                      <span>PCM Salt Matrix</span>
                      <span className="material-symbols-outlined text-[15px] text-secondary">layers</span>
                    </div>
                    <div className="text-base font-bold font-mono text-secondary">84% Solid</div>
                    <div className="text-[10px] text-on-surface-variant">14.5h Cold Reserve</div>
                  </div>

                  {/* Produce Held */}
                  <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 space-y-1">
                    <div className="flex items-center justify-between text-on-surface-variant text-[11px]">
                      <span>Produce Value</span>
                      <span className="material-symbols-outlined text-[15px] text-primary">local_florist</span>
                    </div>
                    <div className="text-base font-bold font-mono text-primary">₹48,500</div>
                    <div className="text-[10px] text-on-surface-variant">36 Crates Protected</div>
                  </div>
                </div>

                <button
                  onClick={onLaunchDashboard}
                  className="w-full py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Open Full Dashboard Controls</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Challenge in North Eastern Region */}
      <section className="py-16 bg-surface-container-low border-b border-surface-container-high/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              The Post-Harvest Crisis in NER India
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-on-surface">
              Why Conventional Cold Storage Fails in Remote Hill Tracts
            </h2>
            <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">
              Farmers in Nagaland, Meghalaya, and Sikkim produce premium high-value crops like Bhut Jolokia and Khasi Mandarin. Yet, terrain isolation and grid vulnerability cause massive economic drain:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {/* Problem 1 */}
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-error-container text-error flex items-center justify-center">
                <span className="material-symbols-outlined text-[26px]">power_off</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface">Erratic Rural Power Grids</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Rural hill villages endure 8 to 14 hours of daily load-shedding and transmission cuts during monsoon landslides, destroying mechanical compressor-based cold rooms.
              </p>
            </div>

            {/* Problem 2 */}
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-[26px]">trending_down</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface">35–40% Post-Harvest Losses</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Without immediate pre-cooling, fresh mountain produce spoils within 3 to 5 days, forcing distressed sales at mandi gates for pennies on the rupee.
              </p>
            </div>

            {/* Problem 3 */}
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-[26px]">terrain</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface">Complex Mountain Logistics</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Heavy industrial 50-ton cold storage facilities cannot be built in steep hill terraced villages. Farmers require decentralized mini modular systems at the village cluster level.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Innovation Architecture (5 Subsystems) */}
      <section id="innovations" className="py-20 border-b border-surface-container-high/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Integrated Hardware Engineering
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-on-surface mt-1">
                The 5 Core Pillars of SolFrigo Technology
              </h2>
            </div>
            <button
              onClick={onOpenArchitecture}
              className="px-4 py-2 rounded-lg bg-surface-container text-primary font-semibold text-xs flex items-center gap-1.5 self-start md:self-auto hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">account_tree</span>
              <span>Open Interactive Blueprint</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pillar 1: Solar & MPPT */}
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-3 hover:border-primary/40 transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">solar_power</span>
              </div>
              <h3 className="text-base font-bold text-on-surface">1. Photovoltaic & MPPT Tracking</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                High-efficiency 1.3 kWp monocrystalline array paired with a dual-channel MPPT solar charge controller yielding 98.4% efficiency even during overcast hill weather.
              </p>
              <div className="pt-2 text-[11px] font-mono text-primary font-semibold border-t border-surface-container">
                48V DC Bus • 16S LiFePO4 100Ah Storage
              </div>
            </div>

            {/* Pillar 2: Solid-State Thermoelectric */}
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-3 hover:border-secondary/40 transition-all">
              <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-900 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">ac_unit</span>
              </div>
              <h3 className="text-base font-bold text-on-surface">2. Solid-State Peltier (TEC) Cooling</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Replaces bulky, leak-prone mechanical compressors with solid-state Thermoelectric Peltier elements modulated via PWM duty cycle with brushless fan arrays and hydronic fluid loops.
              </p>
              <div className="pt-2 text-[11px] font-mono text-secondary font-semibold border-t border-surface-container">
                Zero Refrigerant Gases • No Moving Compressor
              </div>
            </div>

            {/* Pillar 3: PCM Latent Heat Buffer */}
            <div id="pcm-buffering" className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-3 hover:border-purple-400 transition-all">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">layers</span>
              </div>
              <h3 className="text-base font-bold text-on-surface">3. PCM Latent Thermal Battery</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Inorganic hydrated salt matrix with a -1.2°C to 0°C phase-change plateau. Solar surplus is stored as latent solid cold, sustaining 14.5 hours of autonomous cooling during nights and rain.
              </p>
              <div className="pt-2 text-[11px] font-mono text-purple-800 font-semibold border-t border-surface-container">
                14.5h Autonomy Buffer • Non-Toxic Salt Blend
              </div>
            </div>

            {/* Pillar 4: ESP-12E Autonomous Controller */}
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-3 hover:border-amber-400 transition-all">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">memory</span>
              </div>
              <h3 className="text-base font-bold text-on-surface">4. ESP-12E Closed-Loop Brain</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                High-efficiency ESP-12E (ESP8266) micro-controller evaluates temperature probes (DS18B20) and voltage/current sensors (INA226) in real time to regulate PWM cooling, fan speeds, and pumps.
              </p>
              <div className="pt-2 text-[11px] font-mono text-amber-800 font-semibold border-t border-surface-container">
                100ms Decision Loop • Fail-Safe Relays
              </div>
            </div>

            {/* Pillar 5: Rural IoT & Mandi Linkage */}
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-3 hover:border-teal-400 transition-all">
              <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-900 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">smartphone</span>
              </div>
              <h3 className="text-base font-bold text-on-surface">5. Mobile IoT & Mandi e-Gatepass</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Farmer dashboard transmits live telemetry over Wi-Fi/LoRa/GSM, logs cycles on offline flash buffer, and generates authenticated Mandi QR e-Gatepasses verifying cold integrity.
              </p>
              <div className="pt-2 text-[11px] font-mono text-teal-800 font-semibold border-t border-surface-container">
                APMC Verification • SMS Failure Fallback
              </div>
            </div>

            {/* CTA Box */}
            <div className="p-6 rounded-2xl bg-primary text-on-primary flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-mono text-primary-fixed block">
                  Field Ready Prototype
                </span>
                <h3 className="text-lg font-bold mt-1">Experience SolFrigo in Real Time</h3>
                <p className="text-xs text-primary-fixed-dim mt-2 leading-relaxed">
                  Interact with real sensor buses, stepper controls, resilience mode selectors, and crate manifests.
                </p>
              </div>
              <button
                onClick={onLaunchDashboard}
                className="w-full py-2.5 rounded-lg bg-surface text-primary font-bold text-xs shadow-sm hover:bg-surface-bright transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Launch Telemetry Console</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Crop Preservation & Financial ROI Calculator */}
      <section id="calculator" className="py-20 bg-surface-container-low border-b border-surface-container-high/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Farmer Economic Impact Simulator
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-on-surface">
              Calculate Post-Harvest Loss Prevention
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Select your regional horticultural crop and monthly harvest capacity to see the revenue unlocked by preventing post-harvest distress spoilage:
            </p>
          </div>

          <div className="mt-12 bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-md border border-outline-variant/30">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Calculator Inputs */}
              <div className="md:col-span-6 space-y-6">
                {/* Crop Selector */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">
                    Select Regional Horticulture Crop
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(CROP_RATES).map(([key, crop]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedCrop(key)}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          selectedCrop === key
                            ? 'bg-primary-fixed/40 border-primary text-primary font-bold shadow-xs'
                            : 'bg-surface-container-low border-outline-variant/30 text-on-surface hover:bg-surface-container'
                        }`}
                      >
                        <div className="text-xs leading-snug">{crop.name}</div>
                        <div className="text-[10px] text-on-surface-variant mt-1">₹{crop.marketPricePerKg}/kg</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Harvest Weight Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-on-surface-variant uppercase">
                      Harvest Intake Batch
                    </label>
                    <span className="text-sm font-bold font-mono text-primary">{harvestWeightKg} kg</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1500"
                    step="50"
                    value={harvestWeightKg}
                    onChange={(e) => setHarvestWeightKg(Number(e.target.value))}
                    className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-on-surface-variant mt-1">
                    <span>100 kg (4 crates)</span>
                    <span>750 kg</span>
                    <span>1,500 kg (Full Capacity)</span>
                  </div>
                </div>

                {/* Crop Origin & Extension Info */}
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Regional Origin:</span>
                    <span className="font-semibold text-on-surface">{cropData.origin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Ambient Shelf Life:</span>
                    <span className="font-semibold text-error">{cropData.shelfLifeAmbientDays} Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">SolFrigo Cold Shelf Life:</span>
                    <span className="font-semibold text-primary">{cropData.shelfLifeColdDays} Days ({extensionFactor}x Extension)</span>
                  </div>
                </div>
              </div>

              {/* Calculator Output / Value Projection */}
              <div className="md:col-span-6 bg-gradient-to-br from-primary-container to-primary rounded-2xl p-6 text-on-primary flex flex-col justify-between shadow-lg relative overflow-hidden">
                <div className="space-y-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white inline-block">
                    Net Projected Savings
                  </span>

                  <div>
                    <div className="text-xs text-primary-fixed-dim">Additional Farmer Revenue Protected</div>
                    <div className="text-4xl sm:text-5xl font-extrabold font-mono text-white mt-1">
                      ₹{addedRevenue.toLocaleString()}
                    </div>
                    <div className="text-xs text-primary-fixed mt-1">
                      Per Harvest Cycle (Saved {savedKg} kg from Spoilage)
                    </div>
                  </div>

                  {/* Comparative Spoilage Comparison */}
                  <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-white/80">Conventional Spoilage (No Cold Storage):</span>
                        <span className="font-bold text-red-300">35% Loss (~{Math.round(harvestWeightKg * 0.35)} kg)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-black/20 overflow-hidden">
                        <div className="bg-red-400 h-full w-[35%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-white/80">SolFrigo Solar Cold Storage:</span>
                        <span className="font-bold text-emerald-300">&lt; 2% Spoilage (~{Math.round(harvestWeightKg * 0.02)} kg)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-black/20 overflow-hidden">
                        <div className="bg-emerald-400 h-full w-[2%]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-white/15">
                  <button
                    onClick={onLaunchDashboard}
                    className="w-full py-3 rounded-xl bg-white text-primary font-bold text-xs shadow-md hover:bg-surface-bright active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Inspect Unit Telemetry with This Crop</span>
                    <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications Sheet */}
      <section id="specs" className="py-20 border-b border-surface-container-high/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Engineering Parameters
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-on-surface">
              Technical Specifications
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Designed for off-grid decentralization, ease of village transport, and zero refrigerant maintenance.
            </p>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
            <div className="divide-y divide-surface-container">
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs">
                <span className="font-bold text-on-surface">Cooling Mechanism</span>
                <span className="sm:col-span-2 text-on-surface-variant">Solid-State Thermoelectric Peltier (TEC) array with PWM regulation</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs bg-surface-container-low">
                <span className="font-bold text-on-surface">Chamber Temperature Range</span>
                <span className="sm:col-span-2 font-mono text-primary font-semibold">2.0°C to 8.0°C (Configurable Target Setpoint)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs">
                <span className="font-bold text-on-surface">Thermal Energy Storage</span>
                <span className="sm:col-span-2 text-on-surface-variant">Inorganic Hydrated Salt Phase Change Material (PCM) with 14.5h latent hold</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs bg-surface-container-low">
                <span className="font-bold text-on-surface">Solar Photovoltaic Array</span>
                <span className="sm:col-span-2 text-on-surface-variant">4x 330W Monocrystalline PV Panels (1.32 kWp total, MPPT regulated 48V DC bus)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs">
                <span className="font-bold text-on-surface">Battery Backup Chemistry</span>
                <span className="sm:col-span-2 font-mono text-on-surface">LiFePO4 (Lithium Iron Phosphate) 16S Pack • 48V / 100Ah (4.8 kWh reserve)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs bg-surface-container-low">
                <span className="font-bold text-on-surface">Chamber Capacity</span>
                <span className="sm:col-span-2 text-on-surface-variant">1.5 Metric Tons (~48 Standard Agricultural Plastic Crates)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs">
                <span className="font-bold text-on-surface">Microcontroller & Telemetry</span>
                <span className="sm:col-span-2 text-on-surface-variant">ESP-12E (ESP8266 80/160MHz, 4MB Flash, 802.11 b/g/n Wi-Fi, Deep-Sleep IoT, Supabase REST/TLS sync)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs bg-surface-container-low">
                <span className="font-bold text-on-surface">Sensors Integrated</span>
                <span className="sm:col-span-2 text-on-surface-variant">DS18B20 digital probes (chamber + PCM core), INA226 current/voltage, magnetic reed door switch</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional NER Footprint & Pilots */}
      <section id="deployments" className="py-20 bg-surface-container-low border-b border-surface-container-high/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Field Deployments
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-on-surface">
              North Eastern Region Deployment Footprint
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Decentralized micro cold rooms placed directly at tribal village clusters and Farmer Producer Organizations (FPOs):
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Unit 1 */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-primary">Unit NER-04</span>
                <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[10px] font-bold">
                  ACTIVE
                </span>
              </div>
              <h3 className="text-sm font-bold text-on-surface">Kohima District, Nagaland</h3>
              <p className="text-xs text-on-surface-variant">
                Jakhama FPO Cluster • Primary Crop: GI Naga King Chilli & French Beans.
              </p>
              <div className="pt-2 text-[11px] text-primary font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                <span>Zero spoilage in 45 days</span>
              </div>
            </div>

            {/* Unit 2 */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-secondary">Unit NER-02</span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">
                  ACTIVE
                </span>
              </div>
              <h3 className="text-sm font-bold text-on-surface">East Khasi Hills, Meghalaya</h3>
              <p className="text-xs text-on-surface-variant">
                Sohra Horticulture Hub • Primary Crop: Khasi Mandarin Citrus & Strawberries.
              </p>
              <div className="pt-2 text-[11px] text-secondary font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                <span>Preemptive sub-cooling verified</span>
              </div>
            </div>

            {/* Unit 3 */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-tertiary-container">Unit NER-07</span>
                <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                  ACTIVE
                </span>
              </div>
              <h3 className="text-sm font-bold text-on-surface">Namchi Cluster, Sikkim</h3>
              <p className="text-xs text-on-surface-variant">
                Organic Certified FPO • Primary Crop: Bhaise Ginger & Large Cardamom.
              </p>
              <div className="pt-2 text-[11px] text-tertiary-container font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                <span>Rhizome curing stage held</span>
              </div>
            </div>

            {/* Unit 4 */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-primary-container">Unit NER-09</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] font-bold">
                  STAGING
                </span>
              </div>
              <h3 className="text-sm font-bold text-on-surface">Darrang Mandi, Assam</h3>
              <p className="text-xs text-on-surface-variant">
                Brahmaputra Basin Transit Hub • Multi-crop dispatch and cold aggregation.
              </p>
              <div className="pt-2 text-[11px] text-on-surface-variant font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">sync</span>
                <span>Commissioning Phase</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-primary text-on-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Explore the Live Solar Cold Storage Telemetry?
          </h2>
          <p className="text-primary-fixed-dim text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Directly control target temperature setpoints, inspect the MPPT live power matrix, trigger pre-cool mode, and simulate Mandi e-Gatepass issuance.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onLaunchDashboard}
              className="px-8 py-4 rounded-xl bg-surface text-primary font-bold text-sm sm:text-base shadow-xl hover:bg-surface-bright active:scale-95 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">monitor_heart</span>
              <span>Launch Live IoT Dashboard</span>
            </button>
            <button
              onClick={() => setIsPilotModalOpen(true)}
              className="px-8 py-4 rounded-xl bg-primary-container hover:bg-primary-container/80 text-on-primary font-semibold text-sm sm:text-base border border-primary-fixed/30 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">mail</span>
              <span>Request Village Pilot</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-surface border-t border-surface-container-high/60 text-xs text-on-surface-variant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary text-primary-fixed flex items-center justify-center text-xs">
              <span className="material-symbols-outlined text-[16px]">solar_power</span>
            </div>
            <span className="font-bold text-on-surface">SolFrigo IoT System</span>
            <span>• North Eastern Region Rural Horticulture Preservation Initiative</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onLaunchDashboard} className="hover:text-primary font-medium">
              Live Monitor
            </button>
            <button onClick={onOpenArchitecture} className="hover:text-primary font-medium">
              System Blueprint
            </button>
            <a href="#calculator" className="hover:text-primary font-medium">
              Crop Calculator
            </a>
          </div>
        </div>
      </footer>

      {/* Request Pilot Modal */}
      {isPilotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest text-on-surface w-full max-w-md rounded-2xl p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">hub</span>
                <h3 className="text-base font-bold text-on-surface">Request SolFrigo Pilot Unit</h3>
              </div>
              <button
                onClick={() => {
                  setIsPilotModalOpen(false);
                  setPilotSubmitted(false);
                }}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {pilotSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary-fixed text-primary flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[28px]">check_circle</span>
                </div>
                <h4 className="text-base font-bold text-on-surface">Pilot Request Recorded</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Our NER field engineering team will contact the FPO coordinator to review village solar azimuth and crate requirements.
                </p>
                <button
                  onClick={() => {
                    setIsPilotModalOpen(false);
                    setPilotSubmitted(false);
                  }}
                  className="px-6 py-2.5 rounded-lg bg-primary text-on-primary font-semibold text-xs"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setPilotSubmitted(true);
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1">
                    Farmer Producer Organization (FPO) / Village Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jakhama Horticultural Cooperative"
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/50 text-on-surface"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1">
                    State / District
                  </label>
                  <select className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/50 text-on-surface">
                    <option>Nagaland (Kohima / Dimapur / Mokokchung)</option>
                    <option>Meghalaya (East Khasi Hills / Ri-Bhoi)</option>
                    <option>Sikkim (Namchi / Gangtok)</option>
                    <option>Assam (Kamrup / Darrang)</option>
                    <option>Arunachal Pradesh / Manipur / Mizoram / Tripura</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1">
                    Primary Horticultural Produce
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Naga King Chilli, Mandarin, Ginger, Vegetables"
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/50 text-on-surface"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1">
                    Contact Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98620 XXXXX"
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/50 text-on-surface font-mono"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPilotModalOpen(false)}
                    className="w-1/2 h-10 rounded-lg bg-surface-container font-semibold text-on-surface-variant hover:bg-surface-container-high"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 h-10 rounded-lg bg-primary text-on-primary font-semibold shadow-md active:scale-95 transition-transform"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
