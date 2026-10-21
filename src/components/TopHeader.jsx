import React from 'react';
import { PhoneCall, ChevronRight, Menu, Settings, Radio } from 'lucide-react';
import { LANGUAGES } from '../data/saasProducts';

export default function TopHeader({
  activePage,
  onNavigate,
  selectedLanguage,
  onSelectLanguage,
  onToggleMobileMenu,
  isCallActive
}) {
  const getPageInfo = () => {
    switch (activePage) {
      case 'overview': return { section: 'Sales Workspace', title: 'Overview Dashboard' };
      case 'studio': return { section: 'Voice Studio', title: 'Live Calling Cockpit' };
      case 'history': return { section: 'Intelligence Records', title: 'Call History' };
      case 'products': return { section: 'Product Catalog', title: 'SaaS Solutions' };
      case 'settings': return { section: 'Configuration', title: 'System Settings' };
      default: return { section: 'Sales Workspace', title: 'Overview' };
    }
  };

  const { title, section } = getPageInfo();

  return (
    <header className="h-16 px-4 sm:px-6 border-b border-[#263247] bg-[#0C111D]/90 backdrop-blur-xl flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05]"
          aria-label="Open navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold">{section}</span>
          <ChevronRight className="w-3 h-3 text-slate-500" />
          <h1 className="font-extrabold text-white tracking-tight text-sm">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isCallActive && activePage !== 'studio' && (
          <button
            onClick={() => onNavigate('studio')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-bold animate-pulse hover:bg-cyan-500/25 transition-all shadow-md shadow-cyan-500/20"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>Active Call In Progress • Return to Studio</span>
          </button>
        )}

        <div className="flex items-center bg-[#111827] border border-[#263247] hover:border-violet-500/40 rounded-xl px-3 py-1.5 text-xs text-slate-300 gap-2 transition-all shadow-sm">
          <span className="text-sm">{selectedLanguage.flag}</span>
          <select
            value={selectedLanguage.code}
            aria-label="Conversation Language"
            onChange={(e) => {
              const lang = LANGUAGES.find(l => l.code === e.target.value);
              if (lang) onSelectLanguage(lang);
            }}
            className="bg-transparent border-none text-xs font-bold text-slate-200 focus:outline-none cursor-pointer pr-1"
          >
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code} className="bg-[#111827] text-white">
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {activePage !== 'studio' && !isCallActive && (
          <button
            onClick={() => onNavigate('studio')}
            className="btn-base btn-primary px-3.5 py-2 rounded-xl shadow-md shadow-violet-600/25"
            aria-label="Start a voice sales call"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Start Voice Call</span>
          </button>
        )}

        <button
          onClick={() => onNavigate('settings')}
          className="btn-icon p-2 rounded-xl bg-[#111827] border border-[#263247] hover:border-violet-500/40"
          title="System Settings"
          aria-label="System Settings"
        >
          <Settings className="w-4 h-4 text-slate-300" />
        </button>
      </div>
    </header>
  );
}
