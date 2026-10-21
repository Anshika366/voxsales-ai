import React, { useState, useEffect } from 'react';
import {
  Search,
  Trash2,
  Play,
  Pause,
  Download,
  Clock,
  PhoneCall,
  ArrowUpRight,
  FileText,
  Volume2,
  X
} from 'lucide-react';
import { CustomerAvatar } from './Avatars';
import { SALES_STATUSES } from '../data/saasProducts';

export default function CallHistoryPage({
  calls,
  products = [],
  onViewCall,
  onDeleteCall,
  onClearHistory,
  onStartCall,
  onUpdateCallStatus,
  initialFilter = 'ALL'
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialFilter || 'ALL');
  const [productFilter, setProductFilter] = useState('ALL');
  const [recordingFilter, setRecordingFilter] = useState('ALL');
  const [playingId, setPlayingId] = useState(null);
  const [editingStatusId, setEditingStatusId] = useState(null);

  useEffect(() => {
    if (initialFilter) {
      setStatusFilter(initialFilter);
    }
  }, [initialFilter]);

  const filteredCalls = calls.filter(c => {
    const matchesStatus = statusFilter === 'ALL' || c.salesStatus === statusFilter;
    const matchesProduct = productFilter === 'ALL' || c.product?.id === productFilter;
    const matchesRecording =
      recordingFilter === 'ALL' ||
      (recordingFilter === 'WITH_AUDIO' && Boolean(c.audioUrl)) ||
      (recordingFilter === 'NO_AUDIO' && !c.audioUrl);

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      (c.customerName || 'Enterprise Prospect').toLowerCase().includes(q) ||
      (c.product?.name || '').toLowerCase().includes(q) ||
      (c.summary || '').toLowerCase().includes(q) ||
      (c.transcript || []).some(t => (t.text || '').toLowerCase().includes(q));

    return matchesStatus && matchesProduct && matchesRecording && matchesSearch;
  });

  const isAnyFilterActive =
    statusFilter !== 'ALL' ||
    productFilter !== 'ALL' ||
    recordingFilter !== 'ALL' ||
    searchQuery.trim().length > 0;

  const handleClearAllFilters = () => {
    setStatusFilter('ALL');
    setProductFilter('ALL');
    setRecordingFilter('ALL');
    setSearchQuery('');
  };

  const getStatusBadge = (statusId) => {
    const s = SALES_STATUSES.find(st => st.id === statusId) || SALES_STATUSES[1];
    return (
      <span
        className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold border inline-flex items-center gap-1.5 shadow-sm"
        style={{ backgroundColor: s.bg, borderColor: s.border, color: s.color }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
        {s.label}
      </span>
    );
  };

  const handlePlayToggle = (e, callId) => {
    e.stopPropagation();
    const audioEl = document.getElementById(`audio-history-${callId}`);
    if (!audioEl) return;

    if (playingId === callId) {
      audioEl.pause();
      setPlayingId(null);
    } else {
      if (playingId) {
        const prev = document.getElementById(`audio-history-${playingId}`);
        if (prev) prev.pause();
      }
      audioEl.play();
      setPlayingId(callId);
    }
  };

  const handleStatusChange = (callId, newStatus) => {
    if (onUpdateCallStatus) {
      onUpdateCallStatus(callId, newStatus);
    }
    setEditingStatusId(null);
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Call History</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Review conversations, recordings, summaries and sales outcomes.</p>
        </div>

        <div className="flex items-center gap-2.5">
          {calls.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete all saved call records? This cannot be undone.')) {
                  onClearHistory();
                }
              }}
              className="btn-base btn-ghost px-3.5 py-2 text-slate-400 hover:text-rose-400 rounded-xl"
            >
              Clear All ({calls.length})
            </button>
          )}

          <button
            onClick={onStartCall}
            className="btn-base btn-primary px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-violet-600/20"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Start Voice Call</span>
          </button>
        </div>
      </div>

      <div className="p-4 rounded-2xl surface-panel space-y-3 border border-[#263247]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer, product or transcript..."
              className="input-base pl-9 pr-8 w-full rounded-xl text-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                aria-label="Clear search query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 bg-[#161F30] border border-[#263247] rounded-xl px-2.5 py-1.5">
              <span className="text-slate-400">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by sales status"
                className="font-semibold text-white bg-transparent focus:outline-none cursor-pointer pr-1"
              >
                <option value="ALL" className="bg-[#111827] text-white">All Statuses</option>
                {SALES_STATUSES.map(s => (
                  <option key={s.id} value={s.id} className="bg-[#111827] text-white">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-[#161F30] border border-[#263247] rounded-xl px-2.5 py-1.5">
              <span className="text-slate-400">Product:</span>
              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                aria-label="Filter by product"
                className="font-semibold text-white bg-transparent focus:outline-none cursor-pointer pr-1"
              >
                <option value="ALL" className="bg-[#111827] text-white">All Products</option>
                {products.map(p => (
                  <option key={p.id} value={p.id} className="bg-[#111827] text-white">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-[#161F30] border border-[#263247] rounded-xl px-2.5 py-1.5">
              <span className="text-slate-400">Recording:</span>
              <select
                value={recordingFilter}
                onChange={(e) => setRecordingFilter(e.target.value)}
                aria-label="Filter by recording availability"
                className="font-semibold text-white bg-transparent focus:outline-none cursor-pointer pr-1"
              >
                <option value="ALL" className="bg-[#111827] text-white">All Calls</option>
                <option value="WITH_AUDIO" className="bg-[#111827] text-white">With Recording</option>
                <option value="NO_AUDIO" className="bg-[#111827] text-white">Without Recording</option>
              </select>
            </div>

            {isAnyFilterActive && (
              <button
                onClick={handleClearAllFilters}
                className="btn-base btn-ghost px-2.5 py-1.5 text-xs text-violet-400 hover:text-violet-300 font-semibold"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-3xl surface-panel overflow-hidden border border-[#263247] shadow-xl">
        {filteredCalls.length === 0 ? (
          <div className="py-20 px-4 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#161F30] border border-[#263247] flex items-center justify-center mx-auto text-slate-400">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h4 className="text-sm font-bold text-white">
                {calls.length === 0 ? 'No voice calls recorded yet' : 'No calls matching filter criteria'}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                {calls.length === 0
                  ? 'Initiate a voice sales session from Live Call Studio to test real-time speech and qualification analysis.'
                  : 'Try clearing your search terms or filters to inspect past dialogues.'}
              </p>
            </div>
            {calls.length === 0 ? (
              <button
                onClick={onStartCall}
                className="btn-base btn-primary px-5 py-2.5 rounded-xl text-xs font-bold"
              >
                Launch First Call
              </button>
            ) : (
              <button
                onClick={handleClearAllFilters}
                className="btn-base btn-secondary px-4 py-2 rounded-xl text-xs"
              >
                Reset Search Filters
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[#263247]/60">
            {filteredCalls.map((call) => (
              <div
                key={call.id}
                onClick={() => onViewCall(call)}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.025] transition-all duration-150 cursor-pointer group"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <CustomerAvatar size="sm" isSpeaking={false} className="shrink-0 mt-0.5 group-hover:scale-105 transition-transform" />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors">
                        {call.customerName || 'Enterprise Prospect'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        ({call.product?.name || 'SaaS Product'})
                      </span>

                      {editingStatusId === call.id ? (
                        <select
                          onClick={(e) => e.stopPropagation()}
                          value={call.salesStatus}
                          onChange={(e) => handleStatusChange(call.id, e.target.value)}
                          className="bg-[#111827] border border-violet-500 rounded px-2 py-0.5 text-[11px] font-bold text-white focus:outline-none"
                        >
                          {SALES_STATUSES.map(s => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                          ))}
                        </select>
                      ) : (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingStatusId(call.id);
                          }}
                          title="Click to edit sales status"
                          className="cursor-pointer"
                        >
                          {getStatusBadge(call.salesStatus)}
                        </div>
                      )}

                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(call.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {call.durationFormatted || `${call.duration}s`}
                      </span>
                      {call.audioUrl ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1">
                          <Volume2 className="w-3 h-3 text-cyan-400" />
                          <span>Recording Available</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500">
                          No audio
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {call.summary || 'Consultative voice sales pitch.'}
                    </p>

                    {call.customerRequirements && (
                      <div className="text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-300">Needs Identified:</span> {call.customerRequirements}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-auto" onClick={(e) => e.stopPropagation()}>
                  {call.audioUrl && (
                    <>
                      <audio
                        id={`audio-history-${call.id}`}
                        src={call.audioUrl}
                        onEnded={() => setPlayingId(null)}
                      />
                      <button
                        onClick={(e) => handlePlayToggle(e, call.id)}
                        className="btn-base btn-secondary px-3 py-1.5 text-xs rounded-xl hover:border-violet-500/40"
                      >
                        {playingId === call.id ? <Pause className="w-3.5 h-3.5 text-violet-400" /> : <Play className="w-3.5 h-3.5 text-violet-400 fill-current" />}
                        <span>{playingId === call.id ? 'Pause' : 'Play Audio'}</span>
                      </button>

                      <a
                        href={call.audioUrl}
                        download={`call-${call.id}.webm`}
                        className="btn-icon p-2 rounded-xl bg-[#161F30] border border-[#263247] hover:border-violet-500/40"
                        title="Download audio recording"
                        aria-label="Download audio recording"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </>
                  )}

                  <button
                    onClick={() => onViewCall(call)}
                    className="btn-icon p-2 rounded-xl bg-[#161F30] border border-[#263247] hover:border-violet-500/40"
                    title="View details & transcript"
                    aria-label="View call details"
                  >
                    <ArrowUpRight className="w-4 h-4 text-slate-300" />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm('Delete this call record?')) {
                        onDeleteCall(call.id);
                      }
                    }}
                    className="btn-icon p-2 rounded-xl bg-[#161F30] border border-[#263247] hover:text-rose-400 hover:border-rose-500/40"
                    title="Delete call"
                    aria-label="Delete call record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
