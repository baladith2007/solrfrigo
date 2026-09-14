import React, { useState } from 'react';
import { ProduceBatch } from '../types';

interface InflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBatch: (batch: ProduceBatch) => void;
}

const PRESET_CROPS = [
  { name: 'Queen Pineapple (Tripura Queen)', category: 'FRUIT - BROMELIAD', defaultGrade: 'Grade A+', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnCEsiJGt0W1lEg66RrRph-6AQEYkcPHWAy7KH3RObnXwWXi5V7_vVRH1DOxwJmJ1IE3W89flWQoyEuqUYi8XN_9l0k_zEcfuTRz6fNanw2wP5vLQXWLQWQ8eb4jq0pYwPsQkgwkFV0HI8NZSmxi8PDiKtYZP-Vi4x76cLkQVPGyngvI0tLoXqBc1Wrxywr2q0R16WLnfFeIy7_32Jz33HVPRk_4bLPV8I-zpDRH67Hc4Wje-6BCRb' },
  { name: 'Ziro Organic Kiwi (Valley Green)', category: 'FRUIT - ACTINIDIA', defaultGrade: 'Grade A', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnCEsiJGt0W1lEg66RrRph-6AQEYkcPHWAy7KH3RObnXwWXi5V7_vVRH1DOxwJmJ1IE3W89flWQoyEuqUYi8XN_9l0k_zEcfuTRz6fNanw2wP5vLQXWLQWQ8eb4jq0pYwPsQkgwkFV0HI8NZSmxi8PDiKtYZP-Vi4x76cLkQVPGyngvI0tLoXqBc1Wrxywr2q0R16WLnfFeIy7_32Jz33HVPRk_4bLPV8I-zpDRH67Hc4Wje-6BCRb' },
  { name: 'Khasi Mandarin (Sweet Oranges)', category: 'CITRUS FRUIT', defaultGrade: 'Grade A', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnCEsiJGt0W1lEg66RrRph-6AQEYkcPHWAy7KH3RObnXwWXi5V7_vVRH1DOxwJmJ1IE3W89flWQoyEuqUYi8XN_9l0k_zEcfuTRz6fNanw2wP5vLQXWLQWQ8eb4jq0pYwPsQkgwkFV0HI8NZSmxi8PDiKtYZP-Vi4x76cLkQVPGyngvI0tLoXqBc1Wrxywr2q0R16WLnfFeIy7_32Jz33HVPRk_4bLPV8I-zpDRH67Hc4Wje-6BCRb' },
  { name: 'Naga King Chilli (Bhut Jolokia)', category: 'HOT PEPPERS', defaultGrade: 'Grade A+', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbWRnm6zxC0ZZRHzB0OLldVeFCy97UOz3fRIZ75wB_PvTbSxg5x6GTraeFW8h9gYqgghrSvqB8MNk3iart4s-6fbHoRQzgGp9nJ-yNJR7jVAQNcqH41RKC5ErT_XRVNwXKClVc8b6JEheipEh2uObQOoOptyTaebpId2M-95UxT4u18Izuw-Q79iZpFC-Ypl5hD3MqVFcNBRQoI5SoDZzNTyItimoNuZLIzvEy-D9bYlWonuceJLA0' },
  { name: 'Organic Sikkim Ginger (Bhaise)', category: 'ORGANIC SPICES', defaultGrade: 'Ext. Life', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnvlp29hX9UGMIqvmiDu3SmpHQpMcBLL6l-pvMNMKR46BQ3bTLAUsVnF6ruKIkm9fmgYCqjQxckWxOltA9QLJK_xrciIea3m0Hy0FchjYMljKsy8sY066fm0Rd8GPeg_UhqTZBleDyqjjNJzfz0Q02Ons6lR93wCZlifRjguywlgogb7flqfMCj5dU4lTFU4p8RM4eFAxRe3RrIYoZNv3w2718AEP20DdhKU_P2CO-3cUuM9zWtfEi' },
  { name: 'Mountain Green Cabbage', category: 'HIGHLAND VEG', defaultGrade: 'Optimal', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLlh4SS3weowz3tOw7B61C99DRsCPuH1Dkd0fMw6XJCosnPcVLd3jT31_yTwpRai0m5JIDVmLt20J8JSQ16JvM16-CISvi-dERKHU2_07UZNS0kUHvM_wH4Ceu0u42vKDL4OL6OKfPUf44c6wigRw4WHF3uf_NHuV0thDD4Hy8DNSUZfHTYiuhxmbysQzn8ma3XJG304fL19ZaiCgbqBR78vIlcJMd1IwCLnTdwcAnBa_ztJIx7KrN' },
  { name: 'Local Naga French Beans', category: 'LEGUMES', defaultGrade: 'Grade A', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLlh4SS3weowz3tOw7B61C99DRsCPuH1Dkd0fMw6XJCosnPcVLd3jT31_yTwpRai0m5JIDVmLt20J8JSQ16JvM16-CISvi-dERKHU2_07UZNS0kUHvM_wH4Ceu0u42vKDL4OL6OKfPUf44c6wigRw4WHF3uf_NHuV0thDD4Hy8DNSUZfHTYiuhxmbysQzn8ma3XJG304fL19ZaiCgbqBR78vIlcJMd1IwCLnTdwcAnBa_ztJIx7KrN' }
];

export const InflowModal: React.FC<InflowModalProps> = ({ isOpen, onClose, onAddBatch }) => {
  const [selectedCropIndex, setSelectedCropIndex] = useState(0);
  const [crates, setCrates] = useState(4);
  const [weightKg, setWeightKg] = useState(100);
  const [farmerName, setFarmerName] = useState('Arenla Ao (Kohima Rural)');
  const [targetMandi, setTargetMandi] = useState('Dimapur Regulated Mandi');
  const [dispatchDays, setDispatchDays] = useState(6);

  if (!isOpen) return null;

  const crop = PRESET_CROPS[selectedCropIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBatch: ProduceBatch = {
      id: `batch-${Date.now()}`,
      batchCode: `#SS-${Math.floor(100 + Math.random() * 900)}`,
      cropName: crop.name.split(' (')[0],
      variety: crop.name.includes('(') ? crop.name.split('(')[1].replace(')', '') : 'Local Farm Strain',
      category: crop.category,
      weightKg: Number(weightKg) || 100,
      crates: Number(crates) || 4,
      freshnessPercent: 99,
      qualityGrade: crop.defaultGrade,
      storedDays: 0,
      targetMandi,
      dispatchDaysLeft: Number(dispatchDays) || 5,
      imageUrl: crop.img,
      statusNote: 'Fresh harvest intake registered at chamber',
      farmerName: farmerName || 'NER Cooperative Farmer'
    };

    onAddBatch(newBatch);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest text-on-surface w-full max-w-sm rounded-2xl p-5 shadow-2xl border border-outline-variant/30 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-surface-container pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">add_circle</span>
            <h3 className="text-base font-bold text-on-surface">Register Inflow Crate Batch</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Crop Preset Selector */}
          <div>
            <label className="block font-semibold text-on-surface-variant mb-1">Select Crop Variety</label>
            <select
              value={selectedCropIndex}
              onChange={(e) => setSelectedCropIndex(Number(e.target.value))}
              className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/50 text-on-surface font-medium focus:outline-none focus:border-primary"
            >
              {PRESET_CROPS.map((c, i) => (
                <option key={i} value={i}>
                  {c.name} ({c.category})
                </option>
              ))}
            </select>
          </div>

          {/* Crates & Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-on-surface-variant mb-1">Crates Count</label>
              <input
                type="number"
                min="1"
                max="12"
                value={crates}
                onChange={(e) => {
                  const val = Math.max(1, Number(e.target.value));
                  setCrates(val);
                  setWeightKg(val * 25);
                }}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/50 text-on-surface font-medium"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-on-surface-variant mb-1">Total Weight (kg)</label>
              <input
                type="number"
                min="10"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/50 text-on-surface font-medium"
                required
              />
            </div>
          </div>

          {/* Farmer Name */}
          <div>
            <label className="block font-semibold text-on-surface-variant mb-1">Farmer / Village FPO</label>
            <input
              type="text"
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/50 text-on-surface font-medium"
              placeholder="e.g. Arenla Ao (Kohima Rural)"
              required
            />
          </div>

          {/* Target Mandi Destination */}
          <div>
            <label className="block font-semibold text-on-surface-variant mb-1">Target Mandi Destination</label>
            <input
              type="text"
              value={targetMandi}
              onChange={(e) => setTargetMandi(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/50 text-on-surface font-medium"
              placeholder="e.g. Dimapur Regulated Mandi"
              required
            />
          </div>

          {/* Days until Dispatch */}
          <div>
            <label className="block font-semibold text-on-surface-variant mb-1">Dispatch Target (Days)</label>
            <input
              type="number"
              min="1"
              max="30"
              value={dispatchDays}
              onChange={(e) => setDispatchDays(Number(e.target.value))}
              className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/50 text-on-surface font-medium"
              required
            />
          </div>

          {/* Cold storage setpoint reminder */}
          <div className="p-2.5 rounded-lg bg-primary-fixed/30 border border-primary-fixed text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">ac_unit</span>
            <span className="text-[11px] leading-tight font-medium">
              Chamber auto-regulates to 3.8°C with PCM solid buffer support.
            </span>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 h-11 rounded-lg bg-surface-container font-semibold text-on-surface-variant hover:bg-surface-container-high"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 h-11 rounded-lg bg-primary text-on-primary font-semibold shadow-md active:scale-95 transition-transform"
            >
              Add Crate Batch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
