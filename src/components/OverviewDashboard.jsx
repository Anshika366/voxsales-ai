import React from 'react';
import {
  PhoneCall,
  CheckCircle2,
  ThumbsUp,
  Calendar,
  ChevronRight,
  Clock,
  Layers,
  ArrowUpRight,
  TrendingUp,
  PhoneForwarded,
  Activity,
  Volume2
} from 'lucide-react';
import { CustomerAvatar } from './Avatars';
import { SALES_STATUSES } from '../data/saasProducts';

export default function OverviewDashboard({
  calls,
  onStartCall,
  onViewCall,
  onNavigate
}) {
  const totalCalls = calls.length;
  const conversions = calls.filter(c => c.salesStatus === 'Converted').length;
  const interested = calls.filter(c => c.salesStatus === 'Interested').length;
  const demos = calls.filter(c => c.salesStatus === 'Demo Requested').length;

  const metricCards = [
    {
      id: 'ALL',
      label: 'Total Calls',
      val: totalCalls,
      desc: 'All recorded sessions',
      trend: `${totalCalls} calls`,
      icon: PhoneCall,
      color: 'text-violet-400',
      border: 'hover:border-violet-500/40',
      iconBg: 'bg-violet-500/10 border-violet-500/20 text-violet-400'
    },
    {
      id: 'Interested',
      label: 'Interested Leads',
      val: interested,
      desc: 'Qualified buying interest',
      trend: `${interested > 0 ? Math.round((interested / Math.max(totalCalls, 1)) * 100) : 0}% rate`,
      icon: ThumbsUp,
      color: 'text-cyan-400',
      border: 'hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
    },
    {
      id: 'Converted',
      label: 'Deals Converted',
      val: conversions,
      desc: 'Agreed subscription intent',
      trend: `${conversions > 0 ? Math.round((conversions / Math.max(totalCalls, 1)) * 100) : 0}% rate`,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      border: 'hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
    },
    {
      id: 'Demo Requested',
      label: 'Demos Requested',
      val: demos,
      desc: 'Live walkthroughs',
      trend: `${demos} scheduled`,
      icon: Calendar,
      color: 'text-amber-400',
      border: 'hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400'
    }
  ];

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

  const recentCalls = calls.slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      <div className="relative p-6 sm:p-8 rounded-3xl surface-panel bg-gradient-to-r from-[#111827] via-[#161F32] to-[#111827] border border-violet-500/20 shadow-2xl overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
              Sales Overview
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Track AI Sales Conversations & Lead Outcomes
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl font-normal">
            Pitch SaaS solutions with real-time consultative AI voice synthesis, evaluate buyer objections, and qualify deals with zero friction.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onStartCall}
            className="btn-base btn-primary px-6 py-3 rounded-xl shadow-xl shadow-violet-600/30 text-sm font-bold flex items-center gap-2 w-full sm:w-auto hover:scale-105 transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Start New Call</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              onClick={() => onNavigate('history', m.id)}
              className={`p-5 rounded-2xl surface-card ${m.border} transition-all duration-200 hover:-translate-y-0.5 space-y-3 relative overflow-hidden group cursor-pointer`}
              title={`View ${m.label} in Call History`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                  {m.label}
                </span>
                <div className={`p-2 rounded-xl border ${m.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
                  {m.val}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  <span>{m.trend}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 font-normal">{m.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="p-6 rounded-3xl surface-panel border border-[#263247] space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#263247] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-extrabold text-white tracking-tight">
                Recent Conversations
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Review dialogue history, audio playback, and consultative qualification briefs
            </p>
          </div>

          {calls.length > 0 && (
            <button
              onClick={() => onNavigate('history', 'ALL')}
              className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View all ({calls.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {recentCalls.length === 0 ? (
          <div className="py-14 px-4 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#161F30] border border-[#263247] flex items-center justify-center mx-auto text-violet-400 shadow-md">
              <PhoneForwarded className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 max-w-sm mx-auto">
              <h4 className="text-sm font-bold text-white">Your sales conversations start here</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Click Start Your First Call to begin an interactive AI voice conversation and generate structured qualification insights.
              </p>
            </div>
            <button
              onClick={onStartCall}
              className="btn-base btn-primary px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-violet-600/20"
            >
              Start Your First Call
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#263247]/60">
            {recentCalls.map((call) => (
              <div
                key={call.id}
                onClick={() => onViewCall(call)}
                className="py-3.5 px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.025] rounded-xl transition-all duration-150 cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <CustomerAvatar size="sm" isSpeaking={false} className="shrink-0 group-hover:scale-105 transition-transform" />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors">
                        {call.customerName || 'Enterprise Prospect'}
                      </span>
                      <span className="text-xs text-slate-400">({call.product?.name || 'SaaS Product'})</span>
                      {getStatusBadge(call.salesStatus)}
                      {call.audioUrl && (
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1">
                          <Volume2 className="w-3 h-3 text-cyan-400" />
                          <span>Audio</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2.5 text-[11px] text-slate-400 font-mono">
                      <span>
                        {new Date(call.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {call.durationFormatted || `${call.duration}s`}
                      </span>
                      {call.language && (
                        <>
                          <span>•</span>
                          <span className="text-slate-300">{call.language.flag} {call.language.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <p className="text-xs text-slate-400 line-clamp-1 max-w-sm text-right hidden lg:block">
                    {call.summary || 'Consultative pitch and buyer objection resolution.'}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewCall(call);
                    }}
                    className="btn-icon p-2 rounded-xl bg-[#161F30] border border-[#263247] group-hover:border-violet-500/40"
                    title="View details"
                    aria-label="View details"
                  >
                    <ArrowUpRight className="w-4 h-4 text-slate-300" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-5 rounded-2xl surface-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs border border-[#263247]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-slate-200 font-bold block">Available Pitch Catalog</span>
            <span className="text-slate-400 text-[11px]">3 Enterprise SaaS products with pricing, FAQ battlecards, and interactive sandboxes.</span>
          </div>
        </div>
        <button
          onClick={() => onNavigate('products')}
          className="btn-base btn-secondary px-4 py-2 rounded-xl self-start sm:self-auto text-xs font-semibold"
        >
          <span>Explore Catalog & Pricing</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
