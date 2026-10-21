import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  ThumbsUp,
  Calendar,
  Clock,
  XCircle,
  PhoneOff,
  Play,
  Pause,
  Download,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  X,
  FileText,
  Target,
  AlertTriangle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SALES_STATUSES } from '../data/saasProducts';

export default function CallSummaryModal({
  isOpen,
  onClose,
  analysisData,
  audioBlob,
  callDuration,
  product,
  transcript,
  onViewHistory
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [showFullTranscript, setShowFullTranscript] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [audioBlob]);

  useEffect(() => {
    if (isOpen && analysisData?.salesStatus === 'Converted') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [isOpen, analysisData]);

  if (!isOpen || !analysisData) return null;

  const statusConfig = SALES_STATUSES.find(s => s.id === analysisData.salesStatus) || SALES_STATUSES[1];

  const getStatusIcon = (statusId) => {
    switch (statusId) {
      case 'Converted': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'Interested': return <ThumbsUp className="w-5 h-5 text-blue-400" />;
      case 'Demo Requested': return <Calendar className="w-5 h-5 text-purple-400" />;
      case 'Follow-up Required': return <Clock className="w-5 h-5 text-amber-400" />;
      case 'Not Interested': return <XCircle className="w-5 h-5 text-rose-400" />;
      default: return <PhoneOff className="w-5 h-5 text-slate-400" />;
    }
  };

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

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || callDuration || 0);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#111827] border border-[#263247] rounded-3xl shadow-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#263247] bg-[#161F30]/70">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <h3 className="text-base font-bold text-white tracking-tight">AI Post-Call Intelligence Brief</h3>
          </div>
          <button
            onClick={onClose}
            className="btn-icon text-slate-400 hover:text-white"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          <div
            className="p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ backgroundColor: statusConfig.bg, borderColor: statusConfig.border }}
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-[#080B12]/60 shadow-inner">
                {getStatusIcon(analysisData.salesStatus)}
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Automated Sales Status
                </span>
                <h4 className="text-xl font-extrabold" style={{ color: statusConfig.color }}>
                  {analysisData.salesStatus}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">{statusConfig.desc}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-[#080B12]/50 px-4 py-2 rounded-xl border border-white/5">
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Close Probability</span>
                <span className="text-lg font-black text-violet-400">{analysisData.dealScore || 75}%</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#161F30]/70 border border-[#263247] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Call Audio Recording</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-violet-300 bg-violet-950/40 px-2.5 py-1 rounded-full border border-violet-800/40">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Recorded with Consent</span>
              </div>
            </div>

            {audioUrl ? (
              <div className="flex flex-col gap-2 pt-1">
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-600/30 transition-all active:scale-[0.98]"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>

                  <div className="flex-1 flex flex-col gap-1">
                    <input
                      type="range"
                      min="0"
                      max={duration || callDuration || 1}
                      step="0.1"
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full accent-violet-500 h-1.5 bg-[#080B12] rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration || callDuration)}</span>
                    </div>
                  </div>

                  <a
                    href={audioUrl}
                    download={`sales-call-${product?.name?.toLowerCase()?.replace(/\s+/g, '-') || 'voxsales'}-${Date.now()}.webm`}
                    className="btn-icon bg-[#080B12]/60 hover:bg-[#080B12] text-slate-300 hover:text-white border border-[#263247]"
                    title="Download Audio File"
                    aria-label="Download audio recording"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-2">Audio recording processing or mic unavailable.</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#161F30]/50 border border-[#263247]">
              <div className="flex items-center gap-2 mb-2 text-violet-400">
                <FileText className="w-4 h-4" />
                <h5 className="text-xs font-bold uppercase tracking-wider">Executive Conversation Summary</h5>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">{analysisData.summary}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#161F30]/50 border border-[#263247]">
                <div className="flex items-center gap-2 mb-2 text-emerald-400">
                  <Target className="w-4 h-4" />
                  <h5 className="text-xs font-bold uppercase tracking-wider">Customer Requirements</h5>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{analysisData.customerRequirements || 'Standard inquiry regarding workflow optimization.'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#161F30]/50 border border-[#263247]">
                <div className="flex items-center gap-2 mb-2 text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <h5 className="text-xs font-bold uppercase tracking-wider">Objections Handled</h5>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{analysisData.objections || 'No major objections voiced.'}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#161F30]/50 border border-[#263247]">
              <div className="flex items-center gap-2 mb-2 text-purple-400">
                <ArrowRight className="w-4 h-4" />
                <h5 className="text-xs font-bold uppercase tracking-wider">Actionable Next Steps</h5>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">{analysisData.nextSteps}</p>
            </div>
          </div>

          <div className="border border-[#263247] rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowFullTranscript(!showFullTranscript)}
              className="w-full flex items-center justify-between p-4 bg-[#161F30]/40 hover:bg-[#161F30]/80 text-left transition-colors"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                View Full Conversation Transcript ({transcript.length} lines)
              </span>
              {showFullTranscript ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {showFullTranscript && (
              <div className="p-4 bg-[#080B12]/80 max-h-60 overflow-y-auto space-y-2.5 text-xs">
                {transcript.map((line, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className={`font-bold ${line.sender === 'bot' ? 'text-violet-400' : 'text-emerald-400'}`}>
                      {line.sender === 'bot' ? 'Agent:' : 'Client:'}
                    </span>
                    <span className="text-slate-300">{line.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#263247] bg-[#161F30]/60">
          <button
            onClick={() => {
              onClose();
              if (onViewHistory) onViewHistory();
            }}
            className="btn-base btn-secondary text-xs py-2 px-4"
          >
            View in Call History
          </button>
          <button
            onClick={onClose}
            className="btn-base btn-primary text-xs py-2 px-5"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
