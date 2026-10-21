import React, { useEffect, useRef, useState } from 'react';
import { Send, Volume2 } from 'lucide-react';

export default function LiveChatScreen({
  transcript,
  interimText,
  isCallActive,
  onSendTextMessage,
  product
}) {
  const [inputText, setInputText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, interimText]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendTextMessage(inputText.trim());
    setInputText('');
  };

  const quickPrompts = [
    'How much does it cost?',
    'Can I see a 15-minute demo?',
    'We already use another tool',
    'Ready to sign up!'
  ];

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto surface-panel rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#263247] bg-[#161F30]/50 text-xs">
        <span className="text-slate-300 font-medium">Live Transcript</span>
        <span className="text-slate-400 font-mono text-[11px]">{transcript.length} messages</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 min-h-[220px] max-h-[380px]">
        {transcript.length === 0 && !interimText && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500 text-xs">
            <p className="text-slate-300 font-medium">Ready for conversation</p>
            <p className="mt-1 text-slate-500">Click "Start Voice Call" above to begin speaking.</p>
          </div>
        )}

        {transcript.map((msg, idx) => {
          const isBot = msg.sender === 'bot';
          return (
            <div key={idx} className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-400">
                <span className="font-medium text-slate-300">{isBot ? `Alex (${product?.name || 'Assistant'})` : 'You'}</span>
                <span>•</span>
                <span className="font-mono text-[10px] text-slate-500">{msg.timestamp || 'now'}</span>
              </div>

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                  isBot
                    ? 'bg-[#161F30] text-slate-100 border border-[#263247]'
                    : 'bg-violet-600 text-white shadow-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                {isBot && (
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-violet-300">
                    <Volume2 className="w-3 h-3" />
                    <span>Spoken aloud</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {interimText && (
          <div className="flex flex-col items-end">
            <div className="max-w-[80%] rounded-2xl px-3.5 py-2 text-xs bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 italic">
              <span className="block text-[10px] not-italic text-emerald-400 uppercase tracking-wider mb-0.5 font-mono">Listening...</span>
              "{interimText}"
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {isCallActive && (
        <div className="p-3 border-t border-[#263247] bg-[#161F30]/40 space-y-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onSendTextMessage(prompt)}
                className="shrink-0 px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-[11px] border border-white/[0.08] transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Or type a response if in a noisy room..."
              className="input-base flex-1 py-1.5 text-xs"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="btn-icon bg-violet-600 hover:bg-violet-500 disabled:opacity-30 text-white p-2"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
