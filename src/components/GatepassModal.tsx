import React, { useState } from 'react';
import { ProduceBatch } from '../types';

interface GatepassModalProps {
  isOpen: boolean;
  onClose: () => void;
  batches: ProduceBatch[];
}

export const GatepassModal: React.FC<GatepassModalProps> = ({ isOpen, onClose, batches }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const totalKg = batches.reduce((acc, b) => acc + b.weightKg, 0);
  const totalCrates = batches.reduce((acc, b) => acc + b.crates, 0);
  const gatepassCode = `NER04-GP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-9841`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(
      `SolFrigo NER Mandi e-Gatepass: ${gatepassCode}\nChamber: Unit NER-04 (Kohima)\nTotal Crates: ${totalCrates} (${totalKg} kg)\nAvg Temp Maintained: 3.8°C (PCM Latent Verified)\nStatus: 100% Quality Retained`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest text-on-surface w-full max-w-sm rounded-2xl p-5 shadow-2xl border border-outline-variant/30 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-surface-container pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">qr_code_2</span>
            <div>
              <h3 className="text-base font-bold text-on-surface">Mandi e-Gatepass</h3>
              <p className="text-[10px] text-on-surface-variant font-mono">Cold-Chain Compliance Verified</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Gatepass Certificate Card */}
        <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/30 space-y-3">
          {/* Header Info */}
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2.5">
            <div>
              <span className="text-[10px] uppercase font-mono text-on-surface-variant block">Pass Identifier</span>
              <span className="text-xs font-bold font-mono text-primary">{gatepassCode}</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-fixed text-on-primary-fixed uppercase">
              Authenticated
            </span>
          </div>

          {/* QR Code representation */}
          <div className="flex flex-col items-center justify-center p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/30">
            {/* SVG Crisp QR Code */}
            <svg className="w-36 h-36" viewBox="0 0 120 120" fill="currentColor">
              {/* Corner markers */}
              <rect x="10" y="10" width="30" height="30" rx="4" fill="#003521" />
              <rect x="15" y="15" width="20" height="20" rx="2" fill="#ffffff" />
              <rect x="20" y="20" width="10" height="10" rx="1" fill="#003521" />

              <rect x="80" y="10" width="30" height="30" rx="4" fill="#003521" />
              <rect x="85" y="15" width="20" height="20" rx="2" fill="#ffffff" />
              <rect x="90" y="20" width="10" height="10" rx="1" fill="#003521" />

              <rect x="10" y="80" width="30" height="30" rx="4" fill="#003521" />
              <rect x="15" y="85" width="20" height="20" rx="2" fill="#ffffff" />
              <rect x="20" y="90" width="10" height="10" rx="1" fill="#003521" />

              {/* Data dots matrix */}
              <rect x="45" y="12" width="6" height="6" rx="1" fill="#003521" />
              <rect x="55" y="12" width="6" height="6" rx="1" fill="#003521" />
              <rect x="65" y="12" width="6" height="6" rx="1" fill="#003521" />
              <rect x="45" y="24" width="6" height="6" rx="1" fill="#003521" />
              <rect x="65" y="24" width="6" height="6" rx="1" fill="#003521" />
              <rect x="55" y="34" width="6" height="6" rx="1" fill="#003521" />

              <rect x="12" y="45" width="6" height="6" rx="1" fill="#003521" />
              <rect x="24" y="55" width="6" height="6" rx="1" fill="#003521" />
              <rect x="34" y="45" width="6" height="6" rx="1" fill="#003521" />
              <rect x="12" y="65" width="6" height="6" rx="1" fill="#003521" />

              <rect x="45" y="45" width="10" height="10" rx="2" fill="#0e4d34" />
              <rect x="60" y="45" width="6" height="6" rx="1" fill="#003521" />
              <rect x="50" y="60" width="6" height="6" rx="1" fill="#003521" />
              <rect x="62" y="58" width="8" height="8" rx="1" fill="#003521" />

              <rect x="80" y="45" width="6" height="6" rx="1" fill="#003521" />
              <rect x="95" y="45" width="6" height="6" rx="1" fill="#003521" />
              <rect x="85" y="60" width="6" height="6" rx="1" fill="#003521" />
              <rect x="100" y="65" width="8" height="8" rx="1" fill="#003521" />

              <rect x="45" y="80" width="6" height="6" rx="1" fill="#003521" />
              <rect x="60" y="80" width="6" height="6" rx="1" fill="#003521" />
              <rect x="50" y="95" width="10" height="6" rx="1" fill="#003521" />
              <rect x="75" y="85" width="8" height="8" rx="1" fill="#003521" />
              <rect x="90" y="85" width="6" height="6" rx="1" fill="#003521" />
              <rect x="85" y="98" width="12" height="6" rx="1" fill="#003521" />
            </svg>
            <span className="text-[10px] text-on-surface-variant font-mono mt-1">
              Scan at APMC Checkpoint or Mandi Gate
            </span>
          </div>

          {/* Batch Breakdown */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-on-surface">
              <span className="text-on-surface-variant">Origin Unit:</span>
              <span className="font-semibold">Unit NER-04 • Kohima Hub</span>
            </div>
            <div className="flex justify-between items-center text-on-surface">
              <span className="text-on-surface-variant">Cold Integrity:</span>
              <span className="font-semibold text-primary">3.8°C Steady (Zero Breach)</span>
            </div>
            <div className="flex justify-between items-center text-on-surface">
              <span className="text-on-surface-variant">Active Batches:</span>
              <span className="font-semibold">{batches.length} Lots ({totalCrates} Crates)</span>
            </div>
            <div className="flex justify-between items-center text-on-surface">
              <span className="text-on-surface-variant">Gross Stored Weight:</span>
              <span className="font-semibold font-mono">{totalKg} kg</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="w-1/2 h-11 rounded-lg bg-surface-container font-semibold text-xs text-on-surface hover:bg-surface-container-high flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-[17px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied Link' : 'Copy Data'}</span>
          </button>
          <button
            onClick={() => {
              alert(`Mandi Gatepass ${gatepassCode} downloaded successfully.`);
              onClose();
            }}
            className="w-1/2 h-11 rounded-lg bg-primary text-on-primary font-semibold text-xs shadow-md active:scale-95 transition-transform flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-[17px]">download</span>
            <span>Download Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
};
