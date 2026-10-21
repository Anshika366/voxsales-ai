import React from 'react';
import {
  LayoutDashboard,
  PhoneCall,
  History,
  Package,
  Settings,
  X,
  Radio,
  Sparkles
} from 'lucide-react';

export default function Sidebar({
  activePage,
  onNavigate,
  pendingCount,
  isOpen,
  onClose,
  isCallActive
}) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    {
      id: 'studio',
      label: 'Live Call Studio',
      icon: PhoneCall,
      badge: isCallActive ? 'Live' : null
    },
    { id: 'history', label: 'Call History', icon: History, count: pendingCount },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleItemClick = (id) => {
    onNavigate(id);
    if (onClose) onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 shrink-0 h-screen bg-[#0C111D] border-r border-[#263247] flex flex-col justify-between select-none transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="h-16 px-4 flex items-center justify-between border-b border-[#263247] shrink-0 bg-gradient-to-r from-violet-950/20 to-transparent">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-violet-600/30">
                <div className="w-full h-full rounded-[10px] bg-[#0A0E1A] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                  </svg>
                </div>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping opacity-75" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight text-white">
                    VoxSales
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    AI
                  </span>
                </div>
                <span className="text-[10px] tracking-tight text-slate-400 font-medium">Talk Smart. Sell Smarter.</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05]"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 space-y-1.5 flex-1 mt-2">
            <span className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-2 font-mono">
              Sales Command Center
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 text-left select-none cursor-pointer active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600/20 via-violet-500/15 to-transparent text-white border-l-2 border-violet-400 shadow-sm shadow-violet-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border-l-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg transition-colors ${
                      isActive ? 'bg-violet-600/30 text-violet-300' : 'text-slate-400 group-hover:text-slate-200'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="tracking-tight">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {item.badge}
                      </span>
                    )}

                    {item.count !== undefined && item.count > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#161F30] text-slate-300 font-mono border border-[#263247]">
                        {item.count}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 mx-3 mb-3 rounded-xl bg-gradient-to-br from-violet-950/30 via-[#111827] to-[#161F30] border border-violet-500/20 space-y-2">
            <div className="flex items-center gap-1.5 text-violet-300 text-[11px] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Conversational Engine</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Real-time consultative voice SDR with live objection handling and lead qualification.
            </p>
          </div>
        </div>

        <div className="p-3 border-t border-[#263247] shrink-0 bg-[#0A0E1A]/80">
          <div className="p-2.5 rounded-xl bg-[#111827] border border-[#263247] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <span className={`w-2.5 h-2.5 rounded-full block ${isCallActive ? 'bg-cyan-400' : 'bg-emerald-400'}`} />
                <span className={`w-2.5 h-2.5 rounded-full absolute inset-0 animate-ping opacity-60 ${isCallActive ? 'bg-cyan-400' : 'bg-emerald-400'}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider">Browser Voice Line</span>
                <span className="text-xs font-semibold text-slate-200">
                  {isCallActive ? 'Call In Progress' : 'Online & Ready'}
                </span>
              </div>
            </div>
            <Radio className={`w-4 h-4 animate-pulse ${isCallActive ? 'text-cyan-400' : 'text-emerald-400'}`} />
          </div>
        </div>
      </aside>
    </>
  );
}
