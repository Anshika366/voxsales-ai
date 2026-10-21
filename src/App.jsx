import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import OverviewDashboard from './components/OverviewDashboard';
import LiveCallStudio from './components/LiveCallStudio';
import CallHistoryPage from './components/CallHistoryPage';
import ProductsPage from './components/ProductsPage';
import SettingsPage from './components/SettingsPage';
import CallDetailModal from './components/CallDetailModal';
import LiveProductDemoModal from './components/LiveProductDemoModal';
import { DEFAULT_SAAS_PRODUCTS, LANGUAGES, VOICE_PERSONAS } from './data/saasProducts';
import { VoiceManager } from './services/voiceService';
import { getInitialGreeting, generateSalesResponse, analyzeCall } from './services/salesEngine';
import { saveCallRecord, getAllCallRecords, deleteCallRecord, clearAllCallRecords } from './services/storageService';

export default function App() {
  const [activePage, setActivePage] = useState('overview');
  const [products, setProducts] = useState(DEFAULT_SAAS_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState(DEFAULT_SAAS_PRODUCTS[0]);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [selectedPersona, setSelectedPersona] = useState(VOICE_PERSONAS[0]);

  const [calls, setCalls] = useState([]);
  const [selectedCallDetail, setSelectedCallDetail] = useState(null);
  const [isLiveDemoOpen, setIsLiveDemoOpen] = useState(false);
  const [liveDemoProduct, setLiveDemoProduct] = useState(DEFAULT_SAAS_PRODUCTS[0]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('ALL');

  const [isCallActive, setIsCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const [transcript, setTranscript] = useState([]);
  const [interimText, setInterimText] = useState('');
  const [completedCallRecord, setCompletedCallRecord] = useState(null);
  const [aiStatus, setAiStatus] = useState({ aiConfigured: false, provider: 'local' });

  const voiceManagerRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const callDurationRef = useRef(0);
  const transcriptRef = useRef([]);
  const isCallActiveRef = useRef(false);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    callDurationRef.current = callDuration;
  }, [callDuration]);

  useEffect(() => {
    isCallActiveRef.current = isCallActive;
  }, [isCallActive]);

  const fetchAiStatus = async () => {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        setAiStatus(data);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const loadCalls = async () => {
    try {
      const records = await getAllCallRecords();
      const hydrated = records.map(rec => {
        let validAudioUrl = null;
        if (rec.audioBlob instanceof Blob && rec.audioBlob.size > 0) {
          try {
            validAudioUrl = URL.createObjectURL(rec.audioBlob);
          } catch (e) {}
        }
        return { ...rec, audioUrl: validAudioUrl };
      });
      setCalls(hydrated);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    loadCalls();
    fetchAiStatus();
  }, []);

  const startTimer = () => {
    setCallDuration(0);
    callDurationRef.current = 0;
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setCallDuration((prev) => {
        const next = prev + 1;
        callDurationRef.current = next;
        return next;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const handleUserSpeech = async (userText) => {
    if (!userText || !userText.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user', text: userText.trim(), timestamp: timeStr };

    const updatedTranscript = [...transcriptRef.current, userMsg];
    setTranscript(updatedTranscript);
    transcriptRef.current = updatedTranscript;

    setCallStatus('processing');
    if (voiceManagerRef.current) {
      voiceManagerRef.current.pauseListeningForProcessing();
    }

    try {
      const botResponse = await generateSalesResponse({
        userText: userText.trim(),
        history: updatedTranscript,
        product: selectedProduct,
        language: selectedLanguage,
        persona: selectedPersona
      });

      const botTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const botMsg = { sender: 'bot', text: botResponse, timestamp: botTimeStr };

      const finalTranscript = [...updatedTranscript, botMsg];
      setTranscript(finalTranscript);
      transcriptRef.current = finalTranscript;

      const lowerUser = (userText || '').toLowerCase();
      const lowerBot = (botResponse || '').toLowerCase();
      if (
        lowerUser.includes('demo') ||
        lowerUser.includes('walkthrough') ||
        lowerUser.includes('dikhao') ||
        lowerUser.includes('dekhein') ||
        lowerUser.includes('डेमो') ||
        lowerUser.includes('दिखाओ') ||
        lowerUser.includes('show me') ||
        lowerBot.includes('walkthrough') ||
        lowerBot.includes('वॉकथ्रू') ||
        lowerBot.includes('लाइव डेमो')
      ) {
        setLiveDemoProduct(selectedProduct);
        setIsLiveDemoOpen(true);
      }

      const active = isCallActive || isCallActiveRef.current || Boolean(voiceManagerRef.current?.isCallActive);
      if (voiceManagerRef.current && active) {
        voiceManagerRef.current.speak(botResponse);
      } else {
        setCallStatus(active ? 'listening' : 'idle');
      }
    } catch (error) {
      const active = isCallActive || isCallActiveRef.current || Boolean(voiceManagerRef.current?.isCallActive);
      if (voiceManagerRef.current && active) {
        voiceManagerRef.current.resumeListening();
      }
      setCallStatus(active ? 'listening' : 'idle');
    }
  };

  const handleStartCall = async () => {
    try {
      setTranscript([]);
      transcriptRef.current = [];
      setInterimText('');
      setCompletedCallRecord(null);
      setCallStatus('connecting');

      const vm = new VoiceManager({
        onUserSpeech: (text) => handleUserSpeech(text),
        onInterimSpeech: (text) => setInterimText(text),
        onStatusChange: (status) => setCallStatus(status)
      });

      vm.setPersona(selectedPersona);
      voiceManagerRef.current = vm;
      await vm.startCall({ languageCode: selectedLanguage.recognitionLang, persona: selectedPersona });

      setIsCallActive(true);
      setIsMuted(false);
      startTimer();

      const greetingText = getInitialGreeting(selectedProduct, selectedLanguage, selectedPersona);
      const greetingTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const initialMsg = { sender: 'bot', text: greetingText, timestamp: greetingTimeStr };

      setTranscript([initialMsg]);
      transcriptRef.current = [initialMsg];

      vm.speak(greetingText);
    } catch (err) {
      alert('Microphone access is required to speak with the sales representative. Please ensure permissions are granted in your browser.');
      setIsCallActive(false);
      setCallStatus('idle');
      stopTimer();
    }
  };

  const handleEndCall = async () => {
    stopTimer();
    setIsCallActive(false);
    setCallStatus('ending');
    setInterimText('');

    let recordedAudioBlob = null;
    if (voiceManagerRef.current) {
      recordedAudioBlob = await voiceManagerRef.current.stopCall();
      voiceManagerRef.current = null;
    }

    const duration = callDurationRef.current;
    const mins = Math.floor(duration / 60);
    const secs = duration % 60;
    const durationFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    const analysis = await analyzeCall({
      transcript: transcriptRef.current,
      product: selectedProduct,
      language: selectedLanguage,
      callDuration: duration
    });

    const callRecord = {
      id: `call_${Date.now()}`,
      timestamp: Date.now(),
      customerName: 'Enterprise Prospect',
      duration,
      durationFormatted,
      product: selectedProduct,
      language: selectedLanguage,
      persona: selectedPersona,
      salesStatus: analysis.salesStatus,
      summary: analysis.summary,
      customerRequirements: analysis.customerRequirements,
      objections: analysis.objections,
      nextSteps: analysis.nextSteps,
      statusRationale: analysis.statusRationale,
      interestLevel: analysis.interestLevel,
      transcript: [...transcriptRef.current],
      audioBlob: recordedAudioBlob,
      audioUrl: recordedAudioBlob instanceof Blob && recordedAudioBlob.size > 0 ? URL.createObjectURL(recordedAudioBlob) : null
    };

    setCompletedCallRecord(callRecord);
    setCallStatus('ended');

    try {
      await saveCallRecord(callRecord);
      setCalls(prev => [callRecord, ...prev]);
    } catch (e) {}
  };

  const handleToggleMute = () => {
    if (voiceManagerRef.current) {
      const muted = voiceManagerRef.current.toggleMute();
      setIsMuted(muted);
    }
  };

  const handleDeleteCall = async (id) => {
    if (window.confirm('Delete this call record?')) {
      await deleteCallRecord(id);
      setCalls(prev => prev.filter(c => c.id !== id));
      if (selectedCallDetail?.id === id) {
        setSelectedCallDetail(null);
      }
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('Clear all call history and recordings? This operation cannot be undone.')) {
      await clearAllCallRecords();
      setCalls([]);
      setSelectedCallDetail(null);
    }
  };

  const handleUpdateProduct = (updated) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    if (selectedProduct.id === updated.id) {
      setSelectedProduct(updated);
    }
  };

  const handleAddProduct = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleUpdateCallStatus = async (callId, newStatus) => {
    const updatedCalls = calls.map(c => c.id === callId ? { ...c, salesStatus: newStatus } : c);
    setCalls(updatedCalls);
    const target = updatedCalls.find(c => c.id === callId);
    if (selectedCallDetail?.id === callId && target) {
      setSelectedCallDetail(target);
    }
    if (target) {
      try {
        await saveCallRecord(target);
      } catch (e) {}
    }
  };

  const handleNavigate = (page, filter = null) => {
    if (filter) {
      setHistoryFilter(filter);
    }
    setActivePage(page);
  };

  return (
    <div className="h-screen w-screen bg-[#080B12] text-slate-100 flex overflow-hidden selection:bg-violet-500 selection:text-white">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        pendingCount={calls.length}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        isCallActive={isCallActive}
      />

      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        <TopHeader
          activePage={activePage}
          onNavigate={handleNavigate}
          selectedLanguage={selectedLanguage}
          onSelectLanguage={(lang) => {
            setSelectedLanguage(lang);
            if (voiceManagerRef.current) {
              voiceManagerRef.current.setLanguage(lang.recognitionLang);
            }
          }}
          onToggleMobileMenu={() => setIsMobileSidebarOpen(prev => !prev)}
          isCallActive={isCallActive}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-5 w-full max-w-7xl mx-auto">
          {activePage === 'overview' && (
            <OverviewDashboard
              calls={calls}
              onStartCall={() => setActivePage('studio')}
              onViewCall={(call) => setSelectedCallDetail(call)}
              onNavigate={handleNavigate}
            />
          )}

          {activePage === 'studio' && (
            <LiveCallStudio
              products={products}
              selectedProduct={selectedProduct}
              onSelectProduct={setSelectedProduct}
              selectedLanguage={selectedLanguage}
              onSelectLanguage={(lang) => {
                setSelectedLanguage(lang);
                if (voiceManagerRef.current) {
                  voiceManagerRef.current.setLanguage(lang.recognitionLang);
                }
              }}
              personas={VOICE_PERSONAS}
              selectedPersona={selectedPersona}
              onSelectPersona={(persona) => {
                setSelectedPersona(persona);
                if (voiceManagerRef.current) {
                  voiceManagerRef.current.setPersona(persona);
                }
              }}
              isCallActive={isCallActive}
              callStatus={callStatus}
              callDuration={callDuration}
              isMuted={isMuted}
              transcript={transcript}
              interimText={interimText}
              onStartCall={handleStartCall}
              onEndCall={handleEndCall}
              onToggleMute={handleToggleMute}
              onSendTextMessage={handleUserSpeech}
              completedCallRecord={completedCallRecord}
              onOpenProductModal={() => setActivePage('products')}
              onOpenLiveDemo={(prod) => {
                setLiveDemoProduct(prod || selectedProduct);
                setIsLiveDemoOpen(true);
              }}
            />
          )}

          {activePage === 'history' && (
            <CallHistoryPage
              calls={calls}
              products={products}
              onViewCall={(call) => setSelectedCallDetail(call)}
              onDeleteCall={handleDeleteCall}
              onClearHistory={handleClearHistory}
              onStartCall={() => setActivePage('studio')}
              onUpdateCallStatus={handleUpdateCallStatus}
              initialFilter={historyFilter}
            />
          )}

          {activePage === 'products' && (
            <ProductsPage
              products={products}
              selectedProduct={selectedProduct}
              onSelectProduct={(p) => {
                setSelectedProduct(p);
                setActivePage('studio');
              }}
              onUpdateProduct={handleUpdateProduct}
              onAddProduct={handleAddProduct}
              onOpenLiveDemo={(prod) => {
                setLiveDemoProduct(prod || selectedProduct);
                setIsLiveDemoOpen(true);
              }}
            />
          )}

          {activePage === 'settings' && (
            <SettingsPage
              products={products}
              selectedProduct={selectedProduct}
              onSelectProduct={setSelectedProduct}
              selectedLanguage={selectedLanguage}
              onSelectLanguage={setSelectedLanguage}
              selectedPersona={selectedPersona}
              onSelectPersona={setSelectedPersona}
              aiStatus={aiStatus}
              onRefreshAiStatus={fetchAiStatus}
            />
          )}
        </main>
      </div>

      {selectedCallDetail && (
        <CallDetailModal
          call={selectedCallDetail}
          onClose={() => setSelectedCallDetail(null)}
          onUpdateStatus={handleUpdateCallStatus}
        />
      )}

      {isLiveDemoOpen && (
        <LiveProductDemoModal
          product={liveDemoProduct}
          onClose={() => setIsLiveDemoOpen(false)}
        />
      )}
    </div>
  );
}
