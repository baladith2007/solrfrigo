import React, { useState } from 'react';
import { ChamberTelemetry, ProduceBatch } from '../types';
import { InflowModal } from './InflowModal';
import { GatepassModal } from './GatepassModal';

interface ProduceTabProps {
  chamber: ChamberTelemetry;
  batches: ProduceBatch[];
  onAddBatch: (batch: ProduceBatch) => void;
  onShowToast: (msg: string) => void;
}

export const ProduceTab: React.FC<ProduceTabProps> = ({
  chamber,
  batches,
  onAddBatch,
  onShowToast
}) => {
  const [isInflowOpen, setIsInflowOpen] = useState(false);
  const [isGatepassOpen, setIsGatepassOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'all' | 'fruits' | 'vegetables' | 'gi'>('all');

  // Dynamic capacity & value calculations
  const totalCrates = batches.reduce((acc, b) => acc + b.crates, 0);
  const maxCrates = 48;
  const capacityPercent = Math.min(100, Math.round((totalCrates / maxCrates) * 100));
  const availableCrates = Math.max(0, maxCrates - totalCrates);
  const totalWeightTons = (batches.reduce((acc, b) => acc + b.weightKg, 0) / 1000).toFixed(1);

  const totalValuation = batches.reduce((acc, b) => {
    // Estimated valuation per kg based on crop type
    let rate = 65;
    if (b.cropName.includes('Chilli')) rate = 350;
    else if (b.cropName.includes('Kiwi')) rate = 220;
    else if (b.cropName.includes('Ginger')) rate = 140;
    else if (b.cropName.includes('Mandarin')) rate = 95;
    else if (b.cropName.includes('Pineapple')) rate = 85;
    else if (b.cropName.includes('Cabbage')) rate = 45;
    return acc + b.weightKg * rate;
  }, 0);

  const filteredBatches = batches.filter((batch) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'gi') return Boolean(batch.tag?.includes('GI'));
    if (filterCategory === 'fruits') {
      return (
        batch.category.includes('FRUIT') ||
        batch.category.includes('CITRUS') ||
        batch.cropName.includes('Mandarin') ||
        batch.cropName.includes('Pineapple') ||
        batch.cropName.includes('Kiwi')
      );
    }
    if (filterCategory === 'vegetables') {
      return (
        batch.category.includes('VEG') ||
        batch.category.includes('PEPPERS') ||
        batch.cropName.includes('Chilli') ||
        batch.cropName.includes('Ginger') ||
        batch.cropName.includes('Cabbage')
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full px-4 pb-20 space-y-4 max-w-md mx-auto">
      {/* Value Protected & Loss Prevention Hero Card */}
      <div className="rounded-xl bg-gradient-to-br from-primary-container to-primary p-4 text-on-primary shadow-md relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-primary-fixed-dim/10 pointer-events-none"></div>

        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 bg-surface-container-lowest/15 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
            <span className="material-symbols-outlined text-[14px] text-primary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            <span className="text-[10px] text-primary-fixed tracking-wide uppercase font-semibold">
              Kohima Unit • Fruit & Veg Storage
            </span>
          </div>
          <div className="flex items-center gap-1 bg-surface-container-lowest/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed animate-pulse"></span>
            <span className="text-[10px] text-primary-fixed font-medium">IoT Synced</span>
          </div>
        </div>

        <div className="mt-2">
          <p className="text-xs text-primary-fixed-dim">Estimated Fruit & Vegetable Crop Value Protected</p>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-3xl font-bold tracking-tight text-on-primary font-mono">
              ₹{totalValuation.toLocaleString()}
            </span>
            <span className="text-xs text-primary-fixed-dim">NER Regional Mandi Valuation</span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 bg-surface-container-lowest/10 -mx-4 -mb-4 px-4 py-2.5 flex items-center justify-between border-t border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary-fixed-dim">eco</span>
            <span className="text-xs text-on-primary font-medium">Post-harvest weight loss reduced by 94%</span>
          </div>
          <span className="text-xs text-primary-fixed font-bold">Cold Chain Protected</span>
        </div>
      </div>

      {/* Chamber Atmosphere & Capacity Module */}
      <div className="rounded-xl bg-surface-container-lowest p-4 shadow-sm space-y-3 border border-outline-variant/25">
        {/* Header with Live Metric Chips */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-on-surface">Chamber Cold Storage Overview</h2>
            <p className="text-xs text-on-surface-variant">Optimal cold atmosphere for hill horticulture</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 bg-surface-container px-2 py-1 rounded-lg">
              <span className="material-symbols-outlined text-[15px] text-secondary">device_thermostat</span>
              <span className="text-xs font-semibold text-on-surface font-mono">
                {chamber.currentTemp.toFixed(1)}°C
              </span>
            </div>
            <div className="flex items-center gap-1 bg-surface-container px-2 py-1 rounded-lg">
              <span className="material-symbols-outlined text-[15px] text-secondary">water_drop</span>
              <span className="text-xs font-semibold text-on-surface font-mono">{chamber.humidity}%</span>
            </div>
          </div>
        </div>

        {/* Capacity Bar & Stats */}
        <div className="bg-surface-container-low rounded-lg p-3 space-y-2 border border-outline-variant/20">
          <div className="flex items-center justify-between text-on-surface">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">inventory_2</span>
              <span className="text-xs font-semibold">{totalWeightTons} Metric Tons Stored</span>
            </div>
            <span className="text-xs text-on-surface-variant font-medium">
              {totalCrates} / {maxCrates} Standard Crates
            </span>
          </div>

          {/* Segmented Bar */}
          <div className="w-full bg-surface-variant/70 h-2.5 rounded-full overflow-hidden flex">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${capacityPercent}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between pt-0.5 text-xs">
            <span className="text-on-surface-variant">{capacityPercent}% Chamber Utilization</span>
            <span className="text-primary font-bold">{availableCrates} Crates Available</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs for Fruits vs Vegetables */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            filterCategory === 'all'
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          All Crops ({batches.length})
        </button>
        <button
          onClick={() => setFilterCategory('fruits')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
            filterCategory === 'fruits'
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">nutrition</span>
          Fresh Fruits
        </button>
        <button
          onClick={() => setFilterCategory('vegetables')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
            filterCategory === 'vegetables'
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">spa</span>
          Vegetables & Spices
        </button>
        <button
          onClick={() => setFilterCategory('gi')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            filterCategory === 'gi'
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          GI Tagged
        </button>
      </div>

      {/* Produce Batches Section Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-primary">spa</span>
          <h3 className="text-sm font-semibold text-on-surface">Cold Storage Crate Inventory</h3>
        </div>
        <span className="bg-surface-container-high text-on-surface-variant px-2.5 py-0.5 rounded-full text-xs font-semibold">
          {filteredBatches.length} Batches
        </span>
      </div>

      {/* Produce Batch Cards List */}
      <div className="flex flex-col space-y-3">
        {filteredBatches.map((batch) => (
          <div
            key={batch.id}
            className="rounded-xl bg-surface-container-lowest p-3.5 shadow-sm space-y-2.5 relative border border-outline-variant/25"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3 min-w-0">
                <img
                  className="w-16 h-16 rounded-lg object-cover shrink-0 border border-outline-variant/30"
                  src={batch.imageUrl}
                  alt={batch.cropName}
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {batch.tag && (
                      <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
                        {batch.tag}
                      </span>
                    )}
                    <span className="text-[10px] text-on-surface-variant font-mono">{batch.batchCode}</span>
                  </div>
                  <h4 className="text-sm font-bold text-on-surface truncate mt-0.5">{batch.cropName}</h4>
                  <p className="text-xs text-on-surface-variant">
                    {batch.variety} • {batch.weightKg} kg ({batch.crates} crates)
                  </p>
                  <p className="text-[10px] text-primary font-medium truncate mt-0.5">
                    {batch.farmerName}
                  </p>
                </div>
              </div>

              {/* Freshness Progress Badge */}
              <div className="flex flex-col items-center shrink-0 bg-surface-container-low px-2 py-1.5 rounded-lg text-center border border-outline-variant/20">
                <div className="flex items-baseline">
                  <span className="text-lg font-bold text-primary leading-tight font-mono">
                    {batch.freshnessPercent}
                  </span>
                  <span className="text-xs font-bold text-primary">%</span>
                </div>
                <span className="text-[9px] text-on-surface-variant uppercase font-medium">
                  {batch.qualityGrade}
                </span>
              </div>
            </div>

            {/* Quality status note */}
            {batch.statusNote && (
              <div className="text-[11px] px-2 py-1 rounded bg-surface-container-low text-on-surface-variant flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-primary">check_circle</span>
                <span className="truncate">{batch.statusNote}</span>
              </div>
            )}

            {/* Freshness Details Bar */}
            <div className="bg-surface-container-low rounded-lg p-2.5 flex items-center justify-between text-on-surface text-xs border border-outline-variant/15">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-primary">schedule</span>
                <span>Stored {batch.storedDays} days ago</span>
              </div>
              <div className="flex items-center gap-1 text-on-tertiary-container font-medium">
                <span className="material-symbols-outlined text-[15px]">local_shipping</span>
                <span>Dispatch in {batch.dispatchDaysLeft} days</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Quick Actions for Field Workers */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => setIsInflowOpen(true)}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-on-primary rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.98]"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>Register Inflow Fruit / Veg Batch</span>
        </button>

        <button
          onClick={() => setIsGatepassOpen(true)}
          className="w-full h-12 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-transform active:scale-[0.98] border border-outline-variant/30"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px] text-secondary">qr_code_scanner</span>
          <span>Generate Mandi Gatepass / QR Code</span>
        </button>
      </div>

      {/* Inflow Modal Dialog */}
      <InflowModal
        isOpen={isInflowOpen}
        onClose={() => setIsInflowOpen(false)}
        onAddBatch={(batch) => {
          onAddBatch(batch);
          onShowToast(`Added ${batch.crates} crates of ${batch.cropName} to cold chamber.`);
        }}
      />

      {/* Gatepass Modal Dialog */}
      <GatepassModal
        isOpen={isGatepassOpen}
        onClose={() => setIsGatepassOpen(false)}
        batches={batches}
      />
    </div>
  );
};
