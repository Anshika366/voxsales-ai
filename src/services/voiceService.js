export class VoiceManager {
  constructor({ onUserSpeech, onInterimSpeech, onBotStartSpeaking, onBotStopSpeaking, onStatusChange }) {
    this.onUserSpeech = onUserSpeech;
    this.onInterimSpeech = onInterimSpeech;
    this.onBotStartSpeaking = onBotStartSpeaking;
    this.onBotStopSpeaking = onBotStopSpeaking;
    this.onStatusChange = onStatusChange;

    this.callState = 'idle';
    this.recognition = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.micStream = null;
    this.audioContext = null;
    this.analyser = null;
    this.isCallActive = false;
    this.isMuted = false;
    this.selectedLanguage = 'en-US';
    this.persona = { id: 'female', gender: 'female', pitch: 1.08, rate: 1.0 };
    this.preferredVoice = null;
    this.speechTimeoutRef = null;

    this.initSpeechSynthesis();
  }

  setCallState(nextState) {
    this.callState = nextState;
    if (this.onStatusChange) {
      this.onStatusChange(nextState);
    }
  }

  initSpeechSynthesis() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          this.updateVoiceForLanguage(this.selectedLanguage);
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  setLanguage(langCode) {
    this.selectedLanguage = langCode;
    if (this.recognition) {
      this.recognition.lang = langCode;
    }
    this.updateVoiceForLanguage(langCode);
  }

  setPersona(persona) {
    if (!persona) return;
    this.persona = persona;
    this.updateVoiceForLanguage(this.selectedLanguage);
  }

  updateVoiceForLanguage(langCode) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    const prefix = (langCode || 'en-US').slice(0, 2).toLowerCase();
    const isFemale = this.persona?.gender === 'female';

    const langVoices = voices.filter(v =>
      v.lang.toLowerCase() === (langCode || 'en-US').toLowerCase() ||
      v.lang.toLowerCase().startsWith(prefix)
    );
    const pool = langVoices.length > 0 ? langVoices : voices;

    const femaleKeywords = ['female', 'zira', 'jenny', 'samantha', 'victoria', 'karen', 'pooja', 'heera', 'swara', 'veena', 'neerja', 'shruti'];
    const maleKeywords = ['male', 'david', 'guy', 'george', 'daniel', 'ravi', 'hemant', 'mark', 'madhur', 'prabhat'];
    const targetKeywords = isFemale ? femaleKeywords : maleKeywords;

    let matched = pool.find(v => {
      const name = v.name.toLowerCase();
      return targetKeywords.some(k => name.includes(k));
    });

    if (!matched) {
      matched = pool.find(v => v.lang.toLowerCase() === (langCode || 'en-US').toLowerCase());
    }

    if (!matched) {
      matched = pool[0] || voices[0];
    }

    this.preferredVoice = matched;
  }

  async startCall({ languageCode = 'en-US', persona = null } = {}) {
    this.selectedLanguage = languageCode;
    if (persona) {
      this.persona = persona;
    }
    this.isCallActive = true;
    this.audioChunks = [];
    this.setCallState('requesting_permission');

    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      this.setCallState('connecting');
      this.setupAudioAnalysis(this.micStream);
      this.setupMediaRecorder(this.micStream);
      this.setupSpeechRecognition(languageCode);
      this.updateVoiceForLanguage(languageCode);

      this.setCallState('listening');
      return true;
    } catch (error) {
      this.isCallActive = false;
      this.setCallState('error');
      throw error;
    }
  }

  setupAudioAnalysis(stream) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.8;

      const source = this.audioContext.createMediaStreamSource(stream);
      source.connect(this.analyser);
    } catch (e) {}
  }

  getFrequencyData() {
    if (!this.analyser) {
      return new Uint8Array(64);
    }
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  setupMediaRecorder(stream) {
    try {
      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
          mimeType = 'audio/ogg;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else {
          mimeType = '';
        }
      }

      this.mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(250);
    } catch (err) {}
  }

  setupSpeechRecognition(langCode) {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      return;
    }

    this.recognition = new SpeechRec();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = langCode;

    this.recognition.onstart = () => {};

    this.recognition.onresult = (event) => {
      if (!this.isCallActive || this.callState !== 'listening' || this.isMuted) {
        return;
      }

      let interim = '';
      let finalSpeech = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          finalSpeech += item[0].transcript;
        } else {
          interim += item[0].transcript;
        }
      }

      if (interim && this.onInterimSpeech && this.callState === 'listening') {
        this.onInterimSpeech(interim);
      }

      if (finalSpeech.trim()) {
        if (this.speechTimeoutRef) {
          clearTimeout(this.speechTimeoutRef);
        }

        const candidateText = finalSpeech.trim();
        this.speechTimeoutRef = setTimeout(() => {
          if (this.onInterimSpeech) this.onInterimSpeech('');
          if (this.isCallActive && this.callState === 'listening' && !this.isMuted) {
            this.pauseListeningForProcessing();
            if (this.onUserSpeech) {
              this.onUserSpeech(candidateText);
            }
          }
        }, 300);
      }
    };

    this.recognition.onerror = (event) => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.warn('Recognition error:', event.error);
      }
    };

    this.recognition.onend = () => {
      if (this.isCallActive && this.callState === 'listening') {
        try {
          this.recognition.start();
        } catch (e) {}
      }
    };

    try {
      this.recognition.start();
    } catch (e) {}
  }

  pauseListeningForProcessing() {
    this.setCallState('processing');
    if (this.speechTimeoutRef) {
      clearTimeout(this.speechTimeoutRef);
      this.speechTimeoutRef = null;
    }
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {}
    }
  }

  resumeListening() {
    if (!this.isCallActive) return;
    this.setCallState('listening');
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {}
      try {
        this.recognition.start();
      } catch (e) {}
    }
  }

  speak(text, { onEnd } = {}) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      this.resumeListening();
      return;
    }

    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {}
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.preferredVoice) {
      utterance.voice = this.preferredVoice;
    }
    utterance.lang = this.selectedLanguage;
    utterance.rate = this.persona?.rate || 1.0;
    utterance.pitch = this.persona?.pitch || 1.0;

    this.setCallState('speaking');
    if (this.onBotStartSpeaking) this.onBotStartSpeaking();

    let finished = false;
    const finalizeSpeech = () => {
      if (finished) return;
      finished = true;
      if (this.onBotStopSpeaking) this.onBotStopSpeaking();
      if (this.isCallActive) {
        this.resumeListening();
      } else {
        this.setCallState('ended');
      }
      if (onEnd) onEnd();
    };

    utterance.onend = finalizeSpeech;
    utterance.onerror = finalizeSpeech;

    window.speechSynthesis.speak(utterance);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.micStream) {
      this.micStream.getAudioTracks().forEach(track => {
        track.enabled = !this.isMuted;
      });
    }
    return this.isMuted;
  }

  async stopCall() {
    this.isCallActive = false;
    this.setCallState('ending');

    if (this.speechTimeoutRef) {
      clearTimeout(this.speechTimeoutRef);
      this.speechTimeoutRef = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (this.recognition) {
      try {
        this.recognition.onresult = null;
        this.recognition.onend = null;
        this.recognition.onerror = null;
        this.recognition.abort();
      } catch (e) {}
      this.recognition = null;
    }

    if (this.micStream) {
      this.micStream.getTracks().forEach(t => t.stop());
      this.micStream = null;
    }

    if (this.audioContext) {
      try {
        await this.audioContext.close();
      } catch (e) {}
      this.audioContext = null;
      this.analyser = null;
    }

    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        const audioBlob = this.audioChunks.length > 0 ? new Blob(this.audioChunks, { type: 'audio/webm' }) : null;
        this.setCallState('ended');
        resolve(audioBlob);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });
        this.setCallState('ended');
        resolve(audioBlob);
      };

      try {
        this.mediaRecorder.stop();
      } catch (e) {
        const audioBlob = this.audioChunks.length > 0 ? new Blob(this.audioChunks, { type: 'audio/webm' }) : null;
        this.setCallState('ended');
        resolve(audioBlob);
      }
    });
  }
}
