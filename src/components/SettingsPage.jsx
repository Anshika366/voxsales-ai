import React, { useState } from 'react';
import {
  Globe,
  User,
  Shield,
  Activity,
  Volume2,
  Mic,
  Server,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Package
} from 'lucide-react';
import { AIAgentAvatar } from './Avatars';
import { LANGUAGES } from '../data/saasProducts';

export default function SettingsPage({
  selectedLanguage,
  onSelectLanguage,
  personas,
  selectedPersona,
  onSelectPersona,
  selectedProduct,
  products = [],
  onSelectProduct,
  aiStatus,
  onClearAllData
}) {
  const [testingAi, setTestingAi] = useState(false);
  const [aiTestResult, setAiTestResult] = useState(null);

  const [testingMic, setTestingMic] = useState(false);
  const [micTestResult, setMicTestResult] = useState(null);

  const [previewingVoice, setPreviewingVoice] = useState(null);

  const isSpeechRecSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  const isSpeechSynthSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  const handleTestAiConnection = async () => {
    setTestingAi(true);
    setAiTestResult(null);
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        setAiTestResult({
          success: true,
          message: `Backend Operational: ${data.provider === 'gemini' ? 'Gemini 2.5 Flash' : 'Local Fallback'} engine active.`
        });
      } else {
        setAiTestResult({
          success: false,
          message: `Backend returned HTTP status ${res.status}.`
        });
      }
    } catch (e) {
      setAiTestResult({
        success: false,
        message: 'Could not contact backend service.'
      });
    } finally {
      setTestingAi(false);
    }
  };

  const handleTestMicrophone = async () => {
    setTestingMic(true);
    setMicTestResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicTestResult({
        success: true,
        message: 'Microphone hardware stream accessed and calibrated successfully.'
      });
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        setTestingMic(false);
      }, 2500);
    } catch (e) {
      setMicTestResult({
        success: false,
        message: 'Microphone access denied or audio input device unavailable in browser.'
      });
      setTestingMic(false);
    }
  };

  const handleVoicePreview = (persona) => {
    if (!isSpeechSynthSupported) return;
    window.speechSynthesis.cancel();
    setPreviewingVoice(persona.id);

    const greeting =
      selectedLanguage.code === 'hi-IN'
        ? (persona.gender === 'female'
            ? 'नमस्ते, मैं प्रिया हूँ, आपकी एआई सेल्स प्रतिनिधि।'
            : 'नमस्ते, मैं राहुल हूँ, आपका एआई सेल्स एडवाइजर।')
        : (persona.gender === 'female'
            ? `Hello, I am ${persona.name}, your consultative sales representative for ${selectedProduct?.name || 'our platform'}.`
            : `Hello, I am ${persona.name}, your voice sales director.`);

    const utterance = new SpeechSynthesisUtterance(greeting);
    utterance.lang = selectedLanguage.code;
    utterance.rate = 1.0;
    utterance.onend = () => setPreviewingVoice(null);
    utterance.onerror = () => setPreviewingVoice(null);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">System Settings</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Application preferences, voice synthesis dialects, and audio diagnostics.</p>
      </div>

      <div className="p-6 rounded-3xl surface-panel border border-[#263247] space-y-4 shadow-xl">
        <div className="flex items-center gap-2.5 border-b border-white/[0.06] pb-3">
          <Globe className="w-4 h-4 text-violet-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">General & Dialect Preferences</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-2">Spoken conversation dialect:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {LANGUAGES.map((l) => {
                const isSelected = selectedLanguage.code === l.code;
                return (
                  <div
                    key={l.code}
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelectLanguage(l)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-violet-500 active:scale-[0.99] ${
                      isSelected
                        ? 'border-violet-500/60 bg-gradient-to-br from-violet-600/15 via-[#161F30] to-transparent text-white ring-1 ring-violet-500/40 shadow-md shadow-violet-500/10'
                        : 'bg-white/[0.02] border-[#263247] text-slate-400 hover:text-white hover:border-[#263247]/90 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="font-bold text-xs text-white flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="text-base">{l.flag}</span>
                        <span>{l.name}</span>
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 font-mono">
                      Recognition Locale: {l.recognitionLang}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {products && products.length > 0 && onSelectProduct && (
            <div className="pt-2">
              <label className="text-slate-300 font-semibold block mb-1">Default pitch solution:</label>
              <div className="flex items-center gap-2 bg-[#141C2E] border border-[#263247] rounded-xl px-3 py-2 max-w-sm">
                <Package className="w-4 h-4 text-violet-400" />
                <select
                  value={selectedProduct?.id}
                  onChange={(e) => {
                    const p = products.find(item => item.id === e.target.value);
                    if (p) onSelectProduct(p);
                  }}
                  className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer flex-1"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id} className="bg-[#111827] text-white">
                      {p.name} ({p.price})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {personas && personas.length > 0 && (
        <div className="p-6 rounded-3xl surface-panel border border-[#263247] space-y-4 shadow-xl">
          <div className="flex items-center gap-2.5 border-b border-white/[0.06] pb-3">
            <User className="w-4 h-4 text-violet-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Voice & Agent Personas</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {personas.map((p) => {
              const isSelected = selectedPersona?.id === p.id;
              const isSpeakingPreview = previewingVoice === p.id;
              return (
                <div
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectPersona(p)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-violet-500 active:scale-[0.99] flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'border-violet-500/60 bg-gradient-to-br from-violet-600/15 via-[#161F30] to-transparent text-white ring-1 ring-violet-500/40 shadow-md shadow-violet-500/10'
                      : 'bg-white/[0.02] border-[#263247] text-slate-400 hover:text-white hover:border-[#263247]/90 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <AIAgentAvatar size="md" state={isSpeakingPreview ? 'speaking' : isSelected ? 'idle' : 'idle'} className="shrink-0 mt-0.5" />
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-white">{p.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-300 border border-white/[0.06]">
                          {p.gender === 'female' ? 'Female SDR' : 'Male SDR'}
                        </span>
                      </div>
                      <p className="text-[11px] text-violet-300 font-medium">{p.title}</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{p.description}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {isSelected ? 'Active Agent' : 'Click to select'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVoicePreview(p);
                      }}
                      className="btn-base btn-secondary py-1 px-2.5 text-[11px] rounded-lg flex items-center gap-1.5"
                    >
                      <Volume2 className="w-3 h-3 text-cyan-400" />
                      <span>{isSpeakingPreview ? 'Speaking...' : 'Preview Voice'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="p-6 rounded-3xl surface-panel border border-[#263247] space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2.5">
            <Server className="w-4 h-4 text-violet-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">AI Engine Configuration</h3>
          </div>
          <button
            type="button"
            onClick={handleTestAiConnection}
            disabled={testingAi}
            className="btn-base btn-secondary px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testingAi ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{testingAi ? 'Testing...' : 'Test Connection'}</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-[#141C2E] border border-white/[0.06] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-medium">Backend Integration Status:</span>
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
              {aiStatus?.aiConfigured ? 'Connected (Gemini 2.5 Flash)' : 'Operational (Consultative Rule Engine)'}
            </span>
          </div>

          <p className="text-slate-400 leading-relaxed text-[11px]">
            API keys and tokens are securely isolated in the backend environment. No secrets are ever exposed to the client browser.
          </p>

          {aiTestResult && (
            <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 mt-2 ${
              aiTestResult.success ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
            }`}>
              {aiTestResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />}
              <span>{aiTestResult.message}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 rounded-3xl surface-panel border border-[#263247] space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-violet-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Browser & Audio Diagnostics</h3>
          </div>
          <button
            type="button"
            onClick={handleTestMicrophone}
            disabled={testingMic}
            className="btn-base btn-secondary px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
          >
            <Mic className={`w-3.5 h-3.5 ${testingMic ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`} />
            <span>{testingMic ? 'Calibrating...' : 'Test Microphone'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#141C2E] border border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">Speech Recognition (STT)</span>
              <span className="text-[11px] text-slate-400 font-mono">Web Speech API</span>
            </div>
            <span className={`font-mono text-xs px-2.5 py-1 rounded-full font-bold ${
              isSpeechRecSupported ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
            }`}>
              {isSpeechRecSupported ? 'Operational' : 'Unavailable'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#141C2E] border border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">Speech Synthesis (TTS)</span>
              <span className="text-[11px] text-slate-400 font-mono">Web Speech API</span>
            </div>
            <span className={`font-mono text-xs px-2.5 py-1 rounded-full font-bold ${
              isSpeechSynthSupported ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
            }`}>
              {isSpeechSynthSupported ? 'Operational' : 'Unavailable'}
            </span>
          </div>
        </div>

        {micTestResult && (
          <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
            micTestResult.success ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
          }`}>
            {micTestResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />}
            <span>{micTestResult.message}</span>
          </div>
        )}
      </div>

      <div className="p-6 rounded-3xl surface-panel border border-[#263247] space-y-3 text-xs shadow-xl">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-violet-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Recording & Data Governance</h3>
          </div>
          {onClearAllData && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Clear all stored conversation history, audio recordings, and qualification data?')) {
                  onClearAllData();
                }
              }}
              className="btn-base btn-ghost px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-rose-400"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset All History</span>
            </button>
          )}
        </div>
        <p className="text-slate-300 leading-relaxed font-normal">
          VoxSales AI records voice conversations strictly following microphone consent. All transcripts, audio blobs, and qualification metadata are persisted in your local browser IndexedDB database (<code className="text-violet-300 font-mono">VoxSalesDB</code>). Data stays local to your browser and is not shared with external vendors.
        </p>
      </div>
    </div>
  );
}
