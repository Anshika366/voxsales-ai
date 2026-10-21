import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  ShieldCheck,
  Check,
  Play,
  Pause,
  Download,
  Send,
  Zap,
  Clock,
  Sparkles,
  Package,
  Globe,
  User,
  ChevronDown,
  ChevronUp,
  FileText,
  X,
  RotateCcw
} from 'lucide-react';
import { AIAgentAvatar, CustomerAvatar } from './Avatars';
import { LANGUAGES } from '../data/saasProducts';

export default function LiveCallStudio({
  products,
  selectedProduct,
  onSelectProduct,
  selectedLanguage,
  onSelectLanguage,
  personas,
  selectedPersona,
  onSelectPersona,
  isCallActive,
  callStatus,
  callDuration,
  isMuted,
  transcript,
  interimText,
  onStartCall,
  onEndCall,
  onToggleMute,
  onSendTextMessage,
  completedCallRecord,
  onOpenProductModal,
  onOpenLiveDemo
}) {
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showExecutiveModal, setShowExecutiveModal] = useState(false);
  const [consentGranted, setConsentGranted] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showMoreSuggestions, setShowMoreSuggestions] = useState(false);

  const transcriptScrollRef = useRef(null);
  const audioPlayerRef = useRef(null);

  useEffect(() => {
    if (isScrolledToBottom && transcriptScrollRef.current) {
      transcriptScrollRef.current.scrollTop = transcriptScrollRef.current.scrollHeight;
    }
  }, [transcript, interimText, isScrolledToBottom]);

  const handleScroll = () => {
    if (!transcriptScrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = transcriptScrollRef.current;
    setIsScrolledToBottom(scrollHeight - scrollTop - clientHeight < 40);
  };

  const handleStartCallClick = () => {
    if (!consentGranted) {
      setShowConsentModal(true);
    } else {
      onStartCall();
    }
  };

  const handleConfirmConsent = () => {
    setConsentGranted(true);
    setShowConsentModal(false);
    onStartCall();
  };

  const handleStarterPromptClick = (promptText) => {
    if (!isCallActive) {
      if (!consentGranted) {
        setShowConsentModal(true);
      } else {
        onStartCall();
        setTimeout(() => {
          onSendTextMessage(promptText);
        }, 1200);
      }
    } else {
      onSendTextMessage(promptText);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusDetails = () => {
    switch (callStatus) {
      case 'listening':
        return {
          label: 'Listening',
          badgeClass: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
          dotClass: 'bg-cyan-400 animate-pulse',
          isCustomerSpeaking: true,
          isAiSpeaking: false
        };
      case 'speaking':
        return {
          label: 'AI Speaking',
          badgeClass: 'text-violet-300 bg-violet-500/15 border-violet-500/30',
          dotClass: 'bg-violet-400 animate-pulse',
          isCustomerSpeaking: false,
          isAiSpeaking: true
        };
      case 'processing':
      case 'thinking':
        return {
          label: 'Processing',
          badgeClass: 'text-amber-300 bg-amber-500/15 border-amber-500/30',
          dotClass: 'bg-amber-400 animate-pulse',
          isCustomerSpeaking: false,
          isAiSpeaking: false
        };
      case 'connecting':
        return {
          label: 'Connecting...',
          badgeClass: 'text-blue-300 bg-blue-500/15 border-blue-500/30',
          dotClass: 'bg-blue-400 animate-pulse',
          isCustomerSpeaking: false,
          isAiSpeaking: false
        };
      case 'ending':
        return {
          label: 'Ending & Classifying...',
          badgeClass: 'text-rose-300 bg-rose-500/15 border-rose-500/30',
          dotClass: 'bg-rose-400 animate-pulse',
          isCustomerSpeaking: false,
          isAiSpeaking: false
        };
      case 'ended':
        return {
          label: 'Call Ended',
          badgeClass: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30',
          dotClass: 'bg-emerald-400',
          isCustomerSpeaking: false,
          isAiSpeaking: false
        };
      default:
        return {
          label: 'Standby • Ready',
          badgeClass: 'text-slate-400 bg-white/[0.04] border-white/[0.08]',
          dotClass: 'bg-slate-500',
          isCustomerSpeaking: false,
          isAiSpeaking: false
        };
    }
  };

  const statusInfo = getStatusDetails();

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendTextMessage(inputText.trim());
    setInputText('');
  };

  const toggleRecordingPlay = () => {
    if (!audioPlayerRef.current) return;
    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const isHindi = selectedLanguage.code === 'hi-IN';
  const personaDisplayName = isHindi
    ? (selectedPersona.gender === 'female' ? 'प्रिया' : 'राहुल')
    : (selectedPersona.gender === 'female' ? 'Sarah' : 'Alex');

  const defaultPrompts = [
    'Explain your pricing',
    'Tell me about integrations',
    'Can we schedule a demo?'
  ];

  const additionalPrompts = [
    `How does ${selectedProduct.name} solve workflow delays?`,
    'I want to initiate a 14-day evaluation trial'
  ];

  const visiblePrompts = showMoreSuggestions
    ? [...defaultPrompts, ...additionalPrompts]
    : defaultPrompts;

  const isCallEnded = !isCallActive && (Boolean(completedCallRecord) || callStatus === 'ended');

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-white/[0.06]">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Live Call Studio
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Voice turn-taking AI sales session with verified product grounding.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${statusInfo.badgeClass}`}>
            <span className={`w-2 h-2 rounded-full ${statusInfo.dotClass}`} />
            <span>{statusInfo.label}</span>
          </div>

          {(isCallActive || isCallEnded) && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161F30] border border-[#263247] font-mono text-xs text-slate-200">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold">
                {isCallActive ? formatTimer(callDuration) : (completedCallRecord?.durationFormatted || formatTimer(callDuration))}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#111827] border border-[#263247] rounded-xl p-2.5 sm:px-3 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-[#161F30] border border-[#263247] hover:border-violet-500/40 rounded-lg px-2.5 py-1.5">
            <Package className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <span className="text-slate-400 font-medium">Product:</span>
            <select
              value={selectedProduct.id}
              disabled={isCallActive}
              aria-label="Select target sales product"
              onChange={(e) => {
                const prod = products.find(p => p.id === e.target.value);
                if (prod) onSelectProduct(prod);
              }}
              className="font-bold text-white bg-transparent focus:outline-none cursor-pointer pr-1"
            >
              {products.map(p => (
                <option key={p.id} value={p.id} className="bg-[#111827] text-white">
                  {p.name} ({p.price})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#161F30] border border-[#263247] hover:border-violet-500/40 rounded-lg px-2.5 py-1.5">
            <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-slate-400 font-medium">Language:</span>
            <select
              value={selectedLanguage.code}
              disabled={isCallActive}
              aria-label="Select call dialogue language"
              onChange={(e) => {
                const lang = LANGUAGES.find(l => l.code === e.target.value);
                if (lang) onSelectLanguage(lang);
              }}
              className="font-bold text-white bg-transparent focus:outline-none cursor-pointer pr-1"
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code} className="bg-[#111827] text-white">
                  {l.name} ({l.nativeName})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#161F30] border border-[#263247] hover:border-violet-500/40 rounded-lg px-2.5 py-1.5">
            <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-slate-400 font-medium">Persona:</span>
            <select
              value={selectedPersona.id}
              disabled={isCallActive}
              aria-label="Select voice persona agent"
              onChange={(e) => {
                const person = personas.find(p => p.id === e.target.value);
                if (person) onSelectPersona(person);
              }}
              className="font-bold text-white bg-transparent focus:outline-none cursor-pointer pr-1"
            >
              {personas.map(p => (
                <option key={p.id} value={p.id} className="bg-[#111827] text-white">
                  {p.name} ({p.gender === 'female' ? 'Female' : 'Male'})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px] px-2 py-1 rounded-md bg-white/[0.02] border border-white/[0.05]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Audio Consent: {consentGranted ? 'Granted' : 'Pending'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-8 flex flex-col rounded-2xl bg-[#0F1626] border border-[#263247] overflow-hidden min-h-[580px] shadow-xl">
          <div className="p-3.5 px-4 sm:px-5 border-b border-[#263247] bg-[#141C2E]/70 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <AIAgentAvatar
                size="sm"
                state={isCallActive ? (statusInfo.isAiSpeaking ? 'speaking' : callStatus === 'processing' ? 'thinking' : 'idle') : 'idle'}
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white tracking-tight">{personaDisplayName}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    AI Sales Assistant
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {isCallActive ? `Live conversation for ${selectedProduct.name}` : isCallEnded ? `Call completed for ${selectedProduct.name}` : 'Ready to talk'}
                </p>
              </div>
            </div>

            {isCallActive ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 h-6 px-2.5 rounded-full bg-[#111827] border border-white/[0.06]">
                  <span className={`w-1 rounded-full wave-bar-1 ${statusInfo.isAiSpeaking ? 'bg-violet-400' : 'bg-cyan-400'}`} style={{ height: '12px' }} />
                  <span className={`w-1 rounded-full wave-bar-2 ${statusInfo.isAiSpeaking ? 'bg-violet-400' : 'bg-cyan-400'}`} style={{ height: '18px' }} />
                  <span className={`w-1 rounded-full wave-bar-3 ${statusInfo.isAiSpeaking ? 'bg-violet-400' : 'bg-cyan-400'}`} style={{ height: '14px' }} />
                  <span className={`w-1 rounded-full wave-bar-4 ${statusInfo.isAiSpeaking ? 'bg-violet-400' : 'bg-cyan-400'}`} style={{ height: '20px' }} />
                  <span className={`w-1 rounded-full wave-bar-5 ${statusInfo.isAiSpeaking ? 'bg-violet-400' : 'bg-cyan-400'}`} style={{ height: '10px' }} />
                </div>

                <button
                  type="button"
                  onClick={onToggleMute}
                  className={`btn-base px-2.5 py-1.5 rounded-lg text-xs font-medium ${
                    isMuted
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-[#161F30] text-slate-300 border border-[#263247] hover:border-violet-500/40'
                  }`}
                  title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {isMuted ? <MicOff className="w-3.5 h-3.5 text-rose-400" /> : <Mic className="w-3.5 h-3.5 text-cyan-400" />}
                  <span className="hidden sm:inline">{isMuted ? 'Unmute' : 'Mute'}</span>
                </button>

                <button
                  type="button"
                  onClick={onEndCall}
                  className="btn-base btn-destructive px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md shadow-rose-600/30"
                >
                  <PhoneOff className="w-3.5 h-3.5" />
                  <span>End Call</span>
                </button>
              </div>
            ) : callStatus === 'ending' ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                <span>Finalizing & Generating Summary...</span>
              </div>
            ) : isCallEnded ? (
              <div className="flex items-center flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setShowExecutiveModal(true)}
                  className="btn-base btn-secondary px-3 py-1.5 rounded-lg text-xs font-semibold text-violet-200 border-violet-500/30 hover:border-violet-500/50"
                >
                  <FileText className="w-3.5 h-3.5 text-violet-400" />
                  <span>View Summary</span>
                </button>
                <button
                  type="button"
                  onClick={handleStartCallClick}
                  className="btn-base btn-primary px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md shadow-violet-600/30 hover:scale-105 active:scale-95 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start New Call</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleStartCallClick}
                className="btn-base btn-primary px-4 py-1.5 rounded-lg text-xs font-bold shadow-md shadow-violet-600/30 hover:scale-105 active:scale-95 transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Start Voice Call</span>
              </button>
            )}
          </div>

          {isCallEnded && completedCallRecord && (
            <div className="bg-[#141C2E] border-b border-[#263247] p-2.5 px-4 sm:px-5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono font-bold text-[11px]">
                  Call Ended
                </span>
                <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono font-bold text-[11px]">
                  {completedCallRecord.salesStatus || 'Interested'}
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  Duration: {completedCallRecord.durationFormatted}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 font-mono text-[11px]">
                  Transcript: {transcript.length} turns saved
                </span>
              </div>

              <div className="flex items-center gap-2">
                {completedCallRecord.audioUrl && (
                  <button
                    type="button"
                    onClick={toggleRecordingPlay}
                    className="btn-base px-2.5 py-1 rounded-md bg-[#161F30] border border-[#263247] text-slate-200 hover:text-white text-[11px]"
                  >
                    {isPlayingAudio ? <Pause className="w-3 h-3 text-violet-400" /> : <Play className="w-3 h-3 text-violet-400 fill-current" />}
                    <span>{isPlayingAudio ? 'Pause Audio' : 'Play Recording'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowExecutiveModal(true)}
                  className="btn-base px-2.5 py-1 rounded-md bg-violet-600/20 text-violet-300 border border-violet-500/30 hover:bg-violet-600/30 font-medium text-[11px]"
                >
                  <Sparkles className="w-3 h-3 text-violet-400" />
                  <span>Executive Insights</span>
                </button>
              </div>
            </div>
          )}

          <div
            ref={transcriptScrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5"
          >
            {transcript.length === 0 && !interimText && !isCallEnded && (
              <div className="h-full min-h-[340px] flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shadow-sm">
                  <AIAgentAvatar size="sm" state="idle" />
                </div>

                <div className="space-y-1 max-w-sm">
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    Ready for your first conversation?
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    Start a voice call to explore features, pricing, and live intelligence with {personaDisplayName}.
                  </p>
                </div>

                <div className="pt-2 w-full max-w-md">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono block mb-2">
                    Try asking:
                  </span>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {visiblePrompts.map((prompt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleStarterPromptClick(prompt)}
                        className="px-2.5 py-1 rounded-md text-[11px] bg-[#141C2E] text-slate-300 border border-[#263247] hover:border-violet-500/40 hover:text-white transition-all cursor-pointer text-left"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowMoreSuggestions(prev => !prev)}
                    className="text-[10px] text-violet-400 hover:text-violet-300 mt-2 font-mono flex items-center justify-center gap-1 mx-auto transition-colors cursor-pointer"
                  >
                    <span>{showMoreSuggestions ? 'Fewer suggestions' : 'More suggestions'}</span>
                    {showMoreSuggestions ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            )}

            {transcript.map((msg, idx) => {
              const isBot = msg.sender === 'bot';
              return (
                <div key={idx} className={`flex gap-2.5 items-start ${isBot ? 'justify-start' : 'justify-end'}`}>
                  {isBot && (
                    <AIAgentAvatar
                      size="sm"
                      state={idx === transcript.length - 1 && callStatus === 'speaking' ? 'speaking' : 'idle'}
                      className="mt-0.5"
                    />
                  )}

                  <div
                    className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      isBot
                        ? 'bg-[#141C2E] text-slate-100 border border-[#263247] rounded-tl-xs shadow-sm'
                        : 'bg-violet-600 text-white rounded-tr-xs shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-1 text-[10px] opacity-75 font-mono">
                      <span className="font-semibold">
                        {isBot ? `${personaDisplayName} (AI Assistant)` : 'You (Prospect)'}
                      </span>
                      <span>{msg.timestamp || 'now'}</span>
                    </div>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    {isBot && (
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-cyan-300 font-mono">
                        <Volume2 className="w-3 h-3" />
                        <span>Spoken</span>
                      </div>
                    )}
                  </div>

                  {!isBot && (
                    <CustomerAvatar
                      size="sm"
                      isSpeaking={idx === transcript.length - 1 && callStatus === 'listening'}
                      className="mt-0.5"
                    />
                  )}
                </div>
              );
            })}

            {(callStatus === 'processing' || callStatus === 'thinking') && (
              <div className="flex gap-2.5 items-start justify-start">
                <AIAgentAvatar size="sm" state="thinking" className="mt-0.5" />
                <div className="bg-[#141C2E] border border-amber-500/30 rounded-xl rounded-tl-xs px-3.5 py-2 text-xs text-amber-200 flex items-center gap-2">
                  <span className="text-[11px] font-mono">Consulting product intelligence</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {interimText && (
              <div className="flex gap-2.5 items-start justify-end">
                <div className="max-w-[80%] rounded-xl rounded-tr-xs px-3.5 py-2 text-xs bg-cyan-950/40 text-cyan-200 border border-cyan-500/30 italic">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-[10px] not-italic font-mono text-cyan-400 uppercase tracking-wider font-bold">
                      Listening to your question...
                    </span>
                  </div>
                  "{interimText}"
                </div>
                <CustomerAvatar size="sm" isSpeaking={true} className="mt-0.5" />
              </div>
            )}
          </div>

          <div className="p-3 px-4 border-t border-[#263247] bg-[#0C111D]/90 flex items-center gap-2 shrink-0">
            <form onSubmit={handleTextSubmit} className="flex items-center gap-2 w-full">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isCallActive ? "Type a response or objection..." : isCallEnded ? "Type to continue dialogue or click Start New Call..." : "Type a message to initiate conversation..."}
                className="input-base flex-1 rounded-lg text-xs py-1.5"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="btn-base btn-primary p-2 rounded-lg"
                title="Send text message"
                aria-label="Send text message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-2xl bg-[#0F1626] border border-[#263247] space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  Product Context
                </span>
              </div>
              <button
                onClick={onOpenProductModal}
                disabled={isCallActive}
                className="text-xs text-violet-400 hover:text-violet-300 font-semibold disabled:opacity-50"
              >
                Switch
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">{selectedProduct.name}</h4>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {selectedProduct.price}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedProduct.description}</p>
            </div>

            <div className="space-y-1 pt-1.5 border-t border-white/[0.06]">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">
                Key Value Points:
              </span>
              <ul className="space-y-1 text-xs">
                {selectedProduct.keyFeatures.slice(0, 3).map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-1.5 border-t border-[#263247]">
              <button
                type="button"
                onClick={() => onOpenLiveDemo && onOpenLiveDemo(selectedProduct)}
                className="btn-base btn-secondary w-full py-2 px-3 rounded-lg text-xs font-semibold text-violet-200 border-violet-500/30 hover:border-violet-500/50"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Interactive Walkthrough</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0F1626] border border-[#263247] space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#263247] pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  Call Intelligence
                </span>
              </div>
              {isCallActive && (
                <div className="flex items-center gap-1 text-[11px] text-rose-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>Live</span>
                </div>
              )}
            </div>

            {isCallActive ? (
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-[#141C2E] border border-white/[0.06] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Buyer Intent:</span>
                    <span className="text-emerald-400 font-mono font-bold">Active Discussion</span>
                  </div>
                  <div className="w-full bg-[#1F2B42] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-violet-500 to-emerald-400 h-full rounded-full w-[80%]" />
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-200 text-xs">
                  <span className="font-bold block mb-0.5">Recommended Next Action:</span>
                  Answer questions directly and address workflow fit transparently.
                </div>
              </div>
            ) : completedCallRecord ? (
              <div className="space-y-2.5 text-xs">
                <div className="p-2 rounded-lg bg-[#141C2E] border border-[#263247] flex items-center justify-between">
                  <span className="text-slate-400">Outcome:</span>
                  <span className="font-bold text-white px-2 py-0.5 rounded bg-violet-500/20 border border-violet-500/30 font-mono">
                    {completedCallRecord.salesStatus}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#141C2E] border border-[#263247] space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">
                    Executive Summary:
                  </span>
                  <p className="text-slate-200 leading-relaxed line-clamp-3">{completedCallRecord.summary}</p>
                </div>

                {completedCallRecord.audioUrl && (
                  <div className="pt-1">
                    <audio
                      ref={audioPlayerRef}
                      src={completedCallRecord.audioUrl}
                      onEnded={() => setIsPlayingAudio(false)}
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleRecordingPlay}
                        className="btn-base btn-primary flex-1 py-1.5 px-3 rounded-lg"
                      >
                        {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                        <span>{isPlayingAudio ? 'Pause Audio' : 'Play Audio'}</span>
                      </button>

                      <a
                        href={completedCallRecord.audioUrl}
                        download={`call-${completedCallRecord.id}.webm`}
                        className="btn-icon p-1.5 rounded-lg bg-[#161F30] border border-[#263247]"
                        title="Download call audio"
                        aria-label="Download call audio"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-5 text-center text-slate-400 space-y-1">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Insights and qualification appear automatically during and after the call.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showExecutiveModal && completedCallRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#111827] border border-[#263247] p-6 space-y-4 shadow-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#263247] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Executive Call Intelligence</h3>
                  <p className="text-xs text-slate-400">{completedCallRecord.product?.name} • Duration {completedCallRecord.durationFormatted}</p>
                </div>
              </div>
              <button
                onClick={() => setShowExecutiveModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#141C2E] border border-[#263247] flex items-center justify-between">
                <span className="text-slate-400 font-medium">Sales Outcome:</span>
                <span className="px-2.5 py-1 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30 font-bold font-mono">
                  {completedCallRecord.salesStatus}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#141C2E] border border-[#263247] space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Executive Summary
                </span>
                <p className="text-slate-200 leading-relaxed">{completedCallRecord.summary}</p>
              </div>

              {completedCallRecord.statusRationale && (
                <div className="p-3.5 rounded-xl bg-[#141C2E] border border-[#263247] space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Outcome Evidence & Rationale
                  </span>
                  <p className="text-slate-200 leading-relaxed">{completedCallRecord.statusRationale}</p>
                </div>
              )}

              {completedCallRecord.customerRequirements && (
                <div className="p-3.5 rounded-xl bg-[#141C2E] border border-[#263247] space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Customer Requirements
                  </span>
                  <p className="text-slate-200 leading-relaxed">{completedCallRecord.customerRequirements}</p>
                </div>
              )}

              {completedCallRecord.objections && (
                <div className="p-3.5 rounded-xl bg-[#141C2E] border border-[#263247] space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Objections & Discussion
                  </span>
                  <p className="text-slate-200 leading-relaxed">{completedCallRecord.objections}</p>
                </div>
              )}

              {completedCallRecord.nextSteps && (
                <div className="p-3.5 rounded-xl bg-violet-500/10 border border-violet-500/30 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-violet-300 font-mono">
                    Recommended Next Step
                  </span>
                  <p className="text-violet-100 leading-relaxed">{completedCallRecord.nextSteps}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-[#263247]">
              <button
                type="button"
                onClick={() => setShowExecutiveModal(false)}
                className="btn-base btn-primary px-4 py-1.5 rounded-lg text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {showConsentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#111827] border border-[#263247] p-6 space-y-4 shadow-2xl rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Audio Recording Consent</h3>
                <p className="text-xs text-slate-400">Compliance & Intelligence Protocol</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              VoxSales AI records microphone audio and generates a live text transcript to qualify buyer interest and generate follow-ups. All audio and transcript records are stored privately in your local browser storage.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#263247]">
              <button
                type="button"
                onClick={() => setShowConsentModal(false)}
                className="btn-base btn-ghost px-3.5 py-1.5 rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmConsent}
                className="btn-base btn-primary px-4 py-1.5 rounded-lg text-xs font-bold"
              >
                Agree & Start Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
