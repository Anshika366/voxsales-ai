import React from 'react';
import { X, Settings, Key, Globe, Shield, Sliders } from 'lucide-react';
import { LANGUAGES } from '../data/saasProducts';

export default function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  onApiKeyChange,
  selectedLanguage,
  onLanguageChange,
  recordingConsent,
  onToggleRecordingConsent
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white tracking-tight">System & AI Voice Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-300">
              <Globe className="w-4 h-4 text-indigo-400" />
              <label className="text-xs font-bold uppercase tracking-wider">Voice Language & Accent</label>
            </div>
            <select
              value={selectedLanguage.code}
              onChange={(e) => {
                const found = LANGUAGES.find(l => l.code === e.target.value);
                if (found) onLanguageChange(found);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500">
              Bot speaks and recognizes speech in the chosen dialect (English, Hindi, Telugu, or Spanish).
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <Key className="w-4 h-4 text-amber-400" />
                <label className="text-xs font-bold uppercase tracking-wider">Google Gemini API Key (Optional)</label>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Zero-setup fallback active</span>
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              placeholder="AIzaSy... (leave blank to use built-in sales AI)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <p className="text-[11px] text-slate-500">
              If left blank, VoxSales AI automatically runs with high-fidelity built-in consultative sales heuristics.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold">Call Recording Consent</span>
              </div>
              <input
                type="checkbox"
                checked={recordingConsent}
                onChange={onToggleRecordingConsent}
                className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Recording consent complies with telecom regulations. Audio is saved locally in your browser's private database for replay and analysis.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-800 bg-slate-950/50">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
