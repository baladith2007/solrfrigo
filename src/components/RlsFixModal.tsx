import React, { useState } from 'react';

interface RlsFixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
  isRetrying?: boolean;
  onUseLocalPreview?: () => void;
  errorMessage?: string | null;
}

const SQL_RECOMMENDED = `-- ==========================================
-- SOLFRIGO COLD STORAGE SUPABASE RLS FIX
-- Run this in your Supabase SQL Editor:
-- ==========================================

-- 1. Enable Row-Level Security on sensor_readings
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;

-- 2. Allow anonymous role (anon) to INSERT sensor telemetry
DROP POLICY IF EXISTS "Allow anon insert" ON public.sensor_readings;
CREATE POLICY "Allow anon insert" 
ON public.sensor_readings 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- 3. Allow anonymous role (anon) to READ sensor telemetry
DROP POLICY IF EXISTS "Allow anon select" ON public.sensor_readings;
CREATE POLICY "Allow anon select" 
ON public.sensor_readings 
FOR SELECT 
TO anon 
USING (true);`;

const SQL_DISABLE = `-- Quickest alternative: Disable RLS completely for IoT table
ALTER TABLE public.sensor_readings DISABLE ROW LEVEL SECURITY;`;

export const RlsFixModal: React.FC<RlsFixModalProps> = ({
  isOpen,
  onClose,
  onRetry,
  isRetrying = false,
  onUseLocalPreview,
  errorMessage
}) => {
  const [copiedType, setCopiedType] = useState<'policy' | 'disable' | null>(null);
  const [activeTab, setActiveTab] = useState<'policy' | 'disable'>('policy');

  if (!isOpen) return null;

  const handleCopy = (sql: string, type: 'policy' | 'disable') => {
    navigator.clipboard.writeText(sql);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedType(null);
    }, 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-surface p-6 shadow-2xl border border-outline-variant/30 text-on-surface max-h-[90vh] overflow-y-auto space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-outline-variant/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[24px]">security</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-on-surface">Supabase RLS Policy Fix</h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-200">
                  Error 42501
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Grant anonymous write permission to <code className="font-mono text-primary font-semibold">sensor_readings</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Error Context Callout */}
        <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200 text-rose-950 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-rose-900">
            <span className="material-symbols-outlined text-[16px] text-rose-600">error</span>
            Why did this error happen?
          </div>
          <p className="text-[11px] leading-relaxed text-rose-800">
            {errorMessage || 'new row violates row-level security policy for table "sensor_readings"'}
          </p>
          <p className="text-[11px] leading-relaxed text-rose-900 mt-1">
            In Supabase, Row-Level Security (RLS) is enabled by default. Because the SolFrigo dashboard connects with your public <code className="font-mono bg-rose-100 px-1 py-0.2 rounded font-semibold">anon</code> key, PostgreSQL blocks inserts until you allow it.
          </p>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[16px]">terminal</span>
            Quick 10-Second Fix in Supabase
          </div>
          <ol className="text-xs text-on-surface-variant space-y-1.5 pl-5 list-decimal marker:font-bold marker:text-primary leading-normal">
            <li>
              Open your{' '}
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-primary font-bold hover:underline inline-flex items-center gap-0.5"
              >
                Supabase Dashboard
                <span className="material-symbols-outlined text-[12px]">open_in_new</span>
              </a>
            </li>
            <li>Click <strong>SQL Editor</strong> in the left navigation sidebar.</li>
            <li>Paste the SQL script below and click <strong>RUN</strong>.</li>
            <li>Come back and click <strong>&quot;Retry Insert&quot;</strong> below!</li>
          </ol>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-outline-variant/20 pt-1">
          <button
            onClick={() => setActiveTab('policy')}
            className={`px-3 py-1.5 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'policy'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Option 1: Add RLS Policy (Recommended)
          </button>
          <button
            onClick={() => setActiveTab('disable')}
            className={`px-3 py-1.5 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'disable'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Option 2: Disable RLS (Fastest)
          </button>
        </div>

        {/* SQL Code Box */}
        <div className="relative rounded-xl bg-slate-950 p-3.5 border border-slate-800 text-slate-100 font-mono text-[11px] leading-relaxed overflow-x-auto shadow-inner">
          <button
            onClick={() => handleCopy(activeTab === 'policy' ? SQL_RECOMMENDED : SQL_DISABLE, activeTab)}
            className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-sans text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 border border-white/10"
          >
            <span className="material-symbols-outlined text-[14px]">
              {copiedType === activeTab ? 'check' : 'content_copy'}
            </span>
            {copiedType === activeTab ? 'Copied to Clipboard!' : 'Copy SQL'}
          </button>
          <pre className="pr-20 text-slate-300">
            {activeTab === 'policy' ? SQL_RECOMMENDED : SQL_DISABLE}
          </pre>
        </div>

        {/* Actions Footer */}
        <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between gap-2 flex-wrap">
          {onUseLocalPreview && (
            <button
              onClick={() => {
                onUseLocalPreview();
                onClose();
              }}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-primary hover:bg-primary/10 transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              Use Local Preview Now
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Close
            </button>
            {onRetry && (
              <button
                onClick={onRetry}
                disabled={isRetrying}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-on-primary hover:bg-primary/90 active:scale-95 transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[16px] ${isRetrying ? 'animate-spin' : ''}`}>
                  refresh
                </span>
                {isRetrying ? 'Inserting...' : 'Retry Supabase Insert'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
