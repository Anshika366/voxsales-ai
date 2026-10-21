import React, { useState } from 'react';
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
  Trash2,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SALES_STATUSES } from '../data/saasProducts';

export default function CallHistory({ calls, onDeleteCall, onClearHistory }) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const getStatusConfig = (statusId) => {
    return SALES_STATUSES.find(s => s.id === statusId) || SALES_STATUSES[1];
  };

  const getStatusIcon = (statusId) => {
    switch (statusId) {
      case 'Converted': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Interested': return <ThumbsUp className="w-3.5 h-3.5 text-blue-400" />;
      case 'Demo Requested': return <Calendar className="w-3.5 h-3.5 text-purple-400" />;
      case 'Follow-up Required': return <Clock className="w-3.5 h-3.5 text-amber-400" />;
      case 'Not Interested': return <XCircle className="w-3.5 h-3.5 text-rose-400" />;
      default: return <PhoneOff className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const filteredCalls = calls.filter((c) => {
    const matchesFilter = activeFilter === 'ALL' || c.salesStatus === activeFilter;
    const matchesSearch =
      searchQuery === '' ||
      c.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handlePlayToggle = (callId) => {
    const audioEl = document.getElementById(`history-audio-${callId}`);
    if (!audioEl) return;

    if (playingId === callId) {
      audioEl.pause();
      setPlayingId(null);
    } else {
      if (playingId) {
        const prev = document.getElementById(`history-audio-${playingId}`);
        if (prev) prev.pause();
      }
      audioEl.play();
      setPlayingId(callId);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <h2 className="text-base font-bold text-white">Previous Calls & Recordings</h2>
          <p className="text-xs text-slate-400">Review voice recordings, automated summaries, and sales qualification</p>
        </div>

        {calls.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeFilter === 'ALL'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All ({calls.length})
          </button>
          {SALES_STATUSES.map((st) => {
            const count = calls.filter(c => c.salesStatus === st.id).length;
            return (
              <button
                key={st.id}
                onClick={() => setActiveFilter(st.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${
                  activeFilter === st.id
                    ? 'border-indigo-500 text-white bg-indigo-950/40'
                    : 'border-slate-800 text-slate-400 hover:text-white bg-slate-900/60'
                }`}
              >
                {st.label} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search calls..."
            className="w-full pl-8 pr-3 py-1 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {filteredCalls.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-xs bg-slate-900/30 border border-slate-800/60 rounded-2xl">
          <p>No call records found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCalls.map((call) => {
            const st = getStatusConfig(call.salesStatus);
            const isPlaying = playingId === call.id;
            const isExpanded = expandedId === call.id;

            return (
              <div
                key={call.id}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 space-y-3 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{call.product?.name || 'SaaS Product'}</span>
                      <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
                        {call.durationFormatted || `${call.duration}s`}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {new Date(call.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>

                  <div
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border"
                    style={{ backgroundColor: st.bg, borderColor: st.border, color: st.color }}
                  >
                    {getStatusIcon(call.salesStatus)}
                    <span>{call.salesStatus}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{call.summary}</p>

                {call.audioUrl && (
                  <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                    <audio
                      id={`history-audio-${call.id}`}
                      src={call.audioUrl}
                      onEnded={() => setPlayingId(null)}
                    />
                    <button
                      onClick={() => handlePlayToggle(call.id)}
                      className="flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
                    >
                      {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                      <span>{isPlaying ? 'Pause' : 'Play Voice Recording'}</span>
                    </button>

                    <a
                      href={call.audioUrl}
                      download={`recording-${call.id}.webm`}
                      className="p-1 rounded text-slate-400 hover:text-white"
                      title="Download audio"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : call.id)}
                    className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                  >
                    <span>{isExpanded ? 'Hide Details' : 'View Full Details & Transcript'}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  <button
                    onClick={() => onDeleteCall(call.id)}
                    className="text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 text-xs">
                    {call.customerRequirements && (
                      <div>
                        <span className="font-semibold text-slate-400 block mb-0.5">Requirements:</span>
                        <p className="text-slate-300">{call.customerRequirements}</p>
                      </div>
                    )}
                    {call.nextSteps && (
                      <div>
                        <span className="font-semibold text-slate-400 block mb-0.5">Next Steps:</span>
                        <p className="text-slate-300">{call.nextSteps}</p>
                      </div>
                    )}
                    <div className="pt-2 border-t border-slate-800/60 space-y-1 max-h-44 overflow-y-auto">
                      <span className="font-semibold text-slate-400 block mb-1">Transcript:</span>
                      {(call.transcript || []).map((t, i) => (
                        <div key={i} className="flex gap-1.5 text-[11px]">
                          <span className={t.sender === 'bot' ? 'text-indigo-400 font-medium' : 'text-emerald-400 font-medium'}>
                            {t.sender === 'bot' ? 'Alex:' : 'Customer:'}
                          </span>
                          <span className="text-slate-300">{t.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
