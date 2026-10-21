import React, { useState, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  Download,
  ShieldCheck,
  Clock,
  Sparkles,
  Volume2,
  Copy,
  Check
} from 'lucide-react';
import { AIAgentAvatar, CustomerAvatar } from './Avatars';
import { SALES_STATUSES } from '../data/saasProducts';

export default function CallDetailModal({ call, onClose, onUpdateStatus }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const audioRef = useRef(null);

  if (!call) return null;

  const statusConfig = SALES_STATUSES.find(s => s.id === call.salesStatus) || SALES_STATUSES[1];

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleCopyTranscript = () => {
    if (!call.transcript || call.transcript.length === 0) return;
    const text = call.transcript
      .map(m => `${m.sender === 'bot' ? 'AI Rep' : 'Prospect'}: ${m.text}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0F1626] border border-[#263247] rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[88vh]">
        <div className="p-4 px-6 border-b border-[#263247] bg-[#141C2E]/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-violet-400 px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 font-bold">
              {call.id}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{call.product?.name || 'SaaS Product'}</span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {call.durationFormatted || `${call.duration}s`}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-icon p-2 rounded-xl text-slate-400 hover:text-white"
            title="Close modal"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          <div
            className="p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
            style={{ backgroundColor: statusConfig.bg, borderColor: statusConfig.border }}
          >
            <div className="flex items-center gap-3.5">
              <CustomerAvatar size="md" isSpeaking={false} />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                  Sales Qualification Outcome
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <h4 className="text-base font-extrabold" style={{ color: statusConfig.color }}>
                    {call.salesStatus}
                  </h4>
                  {onUpdateStatus && (
                    <select
                      value={call.salesStatus}
                      onChange={(e) => onUpdateStatus(call.id, e.target.value)}
                      className="bg-[#111827] text-white border border-[#263247] rounded px-2 py-0.5 text-[11px] font-semibold"
                    >
                      {SALES_STATUSES.map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-0.5">{statusConfig.desc}</p>
              </div>
            </div>

            <div className="text-left sm:text-right font-mono">
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Recorded</span>
              <span className="text-xs text-white">
                {new Date(call.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
              </span>
            </div>
          </div>

          {call.audioUrl && (
            <div className="p-4 rounded-2xl bg-[#141C2E] border border-[#263247] space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  Recorded Browser Audio
                </span>
                <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" /> Consented Recording
                </span>
              </div>
              <audio
                ref={audioRef}
                src={call.audioUrl}
                onEnded={() => setIsPlaying(false)}
              />
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={togglePlay}
                  className="btn-base btn-primary flex-1 py-2.5 px-4 rounded-xl shadow-md"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isPlaying ? 'Pause Audio' : 'Play Voice Recording'}</span>
                </button>

                <a
                  href={call.audioUrl}
                  download={`call-${call.id}.webm`}
                  className="btn-icon p-2.5 rounded-xl bg-[#161F30] border border-[#263247] hover:border-violet-500/40"
                  title="Download recording"
                  aria-label="Download call audio"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-[#141C2E] border border-[#263247] space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Executive Summary
              </span>
              <p className="text-slate-200 leading-relaxed text-xs">{call.summary}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[#141C2E] border border-[#263247] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                  Customer Requirements
                </span>
                <p className="text-slate-300 leading-relaxed">{call.customerRequirements || 'General product exploration.'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#141C2E] border border-[#263247] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                  Objections Raised
                </span>
                <p className="text-slate-300 leading-relaxed">{call.objections || 'No critical blockers recorded.'}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#141C2E] border border-[#263247] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                Recommended Next Step
              </span>
              <p className="text-slate-200 leading-relaxed">{call.nextSteps || 'Maintain in sales sequence.'}</p>
            </div>

            {call.transcript && call.transcript.length > 0 && (
              <div className="p-4 rounded-2xl bg-[#141C2E] border border-[#263247] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Dialogue Transcript ({call.transcript.length} turns)
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyTranscript}
                    className="flex items-center gap-1 text-[11px] text-violet-400 hover:text-violet-300 font-mono font-medium"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
                  {call.transcript.map((m, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs">
                      {m.sender === 'bot' ? (
                        <AIAgentAvatar size="sm" state="idle" className="mt-0.5" />
                      ) : (
                        <CustomerAvatar size="sm" isSpeaking={false} className="mt-0.5" />
                      )}
                      <div className="flex-1 space-y-0.5">
                        <span className={`font-mono text-[10px] font-bold ${m.sender === 'bot' ? 'text-violet-400' : 'text-cyan-400'}`}>
                          {m.sender === 'bot' ? 'AI Voice SDR' : 'Prospect'}
                        </span>
                        <p className="text-slate-200 leading-relaxed">{m.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
