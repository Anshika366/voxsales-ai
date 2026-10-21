import React from 'react';

export function AIAgentAvatar({ size = 'md', state = 'idle', className = '' }) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24 sm:w-28 sm:h-28'
  };

  const isSpeaking = state === 'speaking';
  const isThinking = state === 'thinking';
  const isListening = state === 'listening';

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeMap[size] || sizeMap.md} ${className}`}>
      {isSpeaking && (
        <>
          <span className="absolute inset-0 rounded-full bg-violet-500/30 animate-ping opacity-75" />
          <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-cyan-400 opacity-60 blur-sm animate-pulse" />
          <span className="absolute -inset-2.5 rounded-full border border-violet-400/40 animate-spin" style={{ animationDuration: '6s' }} />
        </>
      )}

      {isThinking && (
        <>
          <span className="absolute -inset-1 rounded-full bg-amber-500/25 blur-sm animate-pulse" />
          <span className="absolute -inset-2 rounded-full border-2 border-dashed border-amber-400/50 animate-spin" style={{ animationDuration: '4s' }} />
        </>
      )}

      {isListening && (
        <>
          <span className="absolute -inset-1.5 rounded-full bg-emerald-500/20 blur-sm animate-pulse" />
          <span className="absolute -inset-1 rounded-full border border-emerald-400/40" />
        </>
      )}

      <div className={`relative w-full h-full rounded-full overflow-hidden p-0.5 bg-gradient-to-tr ${
        isSpeaking
          ? 'from-violet-500 via-fuchsia-500 to-cyan-400 shadow-lg shadow-violet-500/40'
          : isThinking
          ? 'from-amber-400 via-orange-500 to-violet-500'
          : isListening
          ? 'from-emerald-400 via-teal-500 to-cyan-400'
          : 'from-violet-600/70 via-indigo-600/50 to-slate-700/60'
      }`}>
        <svg viewBox="0 0 100 100" className="w-full h-full rounded-full bg-[#0D1322]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="aiSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBD5B5" />
              <stop offset="100%" stopColor="#F5B289" />
            </linearGradient>
            <linearGradient id="aiHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#312E81" />
              <stop offset="50%" stopColor="#1E1B4B" />
              <stop offset="100%" stopColor="#4C1D95" />
            </linearGradient>
            <linearGradient id="aiBlazerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
            <linearGradient id="aiHeadsetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>
          </defs>

          <circle cx="50" cy="50" r="50" fill="#0D1322" />
          <path d="M50 18 C32 18 24 30 24 48 C24 64 34 78 50 78 C66 78 76 64 76 48 C76 30 68 18 50 18 Z" fill="url(#aiHairGrad)" />
          <path d="M50 26 C38 26 33 36 33 50 C33 63 41 71 50 71 C59 71 67 63 67 50 C67 36 62 26 50 26 Z" fill="url(#aiSkinGrad)" />
          <path d="M33 34 C38 24 62 24 67 34 C64 39 60 41 50 41 C40 41 36 39 33 34 Z" fill="url(#aiHairGrad)" />
          <path d="M30 40 C34 46 36 54 36 60 C32 58 29 52 30 40 Z" fill="url(#aiHairGrad)" />
          <path d="M70 40 C66 46 64 54 64 60 C68 58 71 52 70 40 Z" fill="url(#aiHairGrad)" />
          <ellipse cx="43" cy="49" rx="3.5" ry="2" fill="#1E1B4B" />
          <ellipse cx="57" cy="49" rx="3.5" ry="2" fill="#1E1B4B" />
          <circle cx="44" cy="48.5" r="1" fill="#FFFFFF" />
          <circle cx="58" cy="48.5" r="1" fill="#FFFFFF" />
          <path d="M40 44 Q43 42 46 44" stroke="#1E1B4B" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M54 44 Q57 42 60 44" stroke="#1E1B4B" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M50 50 L49 55 L51 55 Z" fill="#E09F7D" />
          <path d="M45 61 Q50 65 55 61" stroke="#BE185D" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M22 100 C22 84 34 76 50 76 C66 76 78 84 78 100 Z" fill="url(#aiBlazerGrad)" />
          <path d="M44 76 L50 88 L56 76 Z" fill="#F8FAFC" />
          <path d="M47 84 L50 98 L53 84 Z" fill="#8B5CF6" />
          <path d="M28 36 C28 22 72 22 72 36" stroke="url(#aiHeadsetGrad)" strokeWidth="3" strokeLinecap="round" fill="none" />
          <rect x="25" y="44" width="5" height="11" rx="2.5" fill="#06B6D4" />
          <rect x="70" y="44" width="5" height="11" rx="2.5" fill="#06B6D4" />
          <path d="M28 52 C28 64 36 66 45 66" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="45" cy="66" r="2.5" fill={isSpeaking ? '#A78BFA' : '#22D3EE'} />
          {isSpeaking && <circle cx="45" cy="66" r="4.5" stroke="#A78BFA" strokeWidth="1" fill="none" className="animate-ping" />}
        </svg>
      </div>

      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#080B12] ${
        isSpeaking
          ? 'bg-violet-400 shadow-sm shadow-violet-400'
          : isThinking
          ? 'bg-amber-400'
          : isListening
          ? 'bg-emerald-400'
          : 'bg-slate-500'
      }`} />
    </div>
  );
}

export function CustomerAvatar({ size = 'md', isSpeaking = false, className = '' }) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24 sm:w-28 sm:h-28'
  };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeMap[size] || sizeMap.md} ${className}`}>
      {isSpeaking && (
        <>
          <span className="absolute inset-0 rounded-full bg-cyan-500/30 animate-ping opacity-75" />
          <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 opacity-60 blur-sm animate-pulse" />
        </>
      )}

      <div className={`relative w-full h-full rounded-full overflow-hidden p-0.5 bg-gradient-to-tr ${
        isSpeaking
          ? 'from-cyan-400 via-teal-400 to-emerald-400 shadow-lg shadow-cyan-500/30'
          : 'from-slate-600 via-slate-700 to-slate-800'
      }`}>
        <svg viewBox="0 0 100 100" className="w-full h-full rounded-full bg-[#0D1526]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="clientSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5D0B5" />
              <stop offset="100%" stopColor="#E2AC8A" />
            </linearGradient>
            <linearGradient id="clientSuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="clientHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#292524" />
              <stop offset="100%" stopColor="#1C1917" />
            </linearGradient>
          </defs>

          <circle cx="50" cy="50" r="50" fill="#0D1526" />
          <path d="M50 20 C36 20 32 30 32 40 C32 42 33 46 33 50 C33 63 41 71 50 71 C59 71 67 63 67 50 C67 46 68 42 68 40 C68 30 64 20 50 20 Z" fill="url(#clientSkinGrad)" />
          <path d="M31 38 C31 22 42 16 50 16 C60 16 69 20 69 34 C63 31 56 31 50 31 C43 31 36 33 31 38 Z" fill="url(#clientHairGrad)" />
          <path d="M31 36 C30 42 31 48 32 50 C33 46 33 41 33 37 Z" fill="url(#clientHairGrad)" />
          <path d="M69 36 C70 42 69 48 68 50 C67 46 67 41 67 37 Z" fill="url(#clientHairGrad)" />
          <ellipse cx="43" cy="48" rx="3" ry="2" fill="#1C1917" />
          <ellipse cx="57" cy="48" rx="3" ry="2" fill="#1C1917" />
          <circle cx="44" cy="47.5" r="0.9" fill="#FFFFFF" />
          <circle cx="58" cy="47.5" r="0.9" fill="#FFFFFF" />
          <path d="M39 43 Q43 41 46 43" stroke="#1C1917" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M54 43 Q57 41 61 43" stroke="#1C1917" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M50 49 L49 55 L52 55 Z" fill="#D39572" />
          <path d="M46 61 Q50 64 54 61" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M20 100 C20 82 34 75 50 75 C66 75 80 82 80 100 Z" fill="url(#clientSuitGrad)" />
          <path d="M45 75 L50 86 L55 75 Z" fill="#F8FAFC" />
          <path d="M48 83 L50 98 L52 83 Z" fill="#0284C7" />
        </svg>
      </div>

      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#080B12] ${
        isSpeaking ? 'bg-cyan-400 shadow-sm shadow-cyan-400' : 'bg-slate-500'
      }`} />
    </div>
  );
}

export function NeutralLeadAvatar({ size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 rounded-full bg-slate-800/80 border border-slate-700/60 p-1 text-slate-300 ${sizeMap[size] || sizeMap.md} ${className}`}>
      <svg viewBox="0 0 24 24" className="w-full h-full fill-slate-400/80" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  );
}
