import React from 'react';
import { Phone, PhoneOff, Mic, MicOff } from 'lucide-react';

export default function CallControls({
  isCallActive,
  callStatus,
  callDuration,
  isMuted,
  onStartCall,
  onEndCall,
  onToggleMute
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusText = () => {
    switch (callStatus) {
      case 'listening':
        return { text: 'Listening to your voice...', color: 'text-emerald-400', dot: 'bg-emerald-400 animate-pulse' };
      case 'thinking':
        return { text: 'Thinking...', color: 'text-pink-400', dot: 'bg-pink-400 animate-pulse' };
      case 'speaking':
        return { text: 'Alex is speaking...', color: 'text-purple-400', dot: 'bg-purple-400 animate-ping' };
      case 'connecting':
        return { text: 'Connecting...', color: 'text-amber-400', dot: 'bg-amber-400 animate-bounce' };
      default:
        return { text: 'Microphone ready', color: 'text-slate-400', dot: 'bg-slate-500' };
    }
  };

  const st = getStatusText();

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800">
          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></span>
          <span className={`font-medium ${st.color}`}>{st.text}</span>
        </div>

        {isCallActive && (
          <div className="px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 font-mono text-slate-300">
            {formatTime(callDuration)}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 mt-1">
        {!isCallActive ? (
          <button
            onClick={onStartCall}
            className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-all shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95"
          >
            <Phone className="w-4 h-4 fill-current" />
            <span>Start Voice Call</span>
          </button>
        ) : (
          <div className="flex items-center gap-2.5">
            <button
              onClick={onToggleMute}
              className={`p-3 rounded-full border transition-all ${
                isMuted
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              onClick={onEndCall}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all shadow-md shadow-rose-600/20 hover:scale-105 active:scale-95"
            >
              <PhoneOff className="w-4 h-4 fill-current" />
              <span>End Call</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
