# 🎙️ VoxSales AI — Talk Smart. Sell Smarter.

<div align="center">

![VoxSales AI Banner](https://img.shields.io/badge/AI-Voice_Sales_Assistant-8B5CF6?style=for-the-badge&logo=openai&logoColor=white)
![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS v4](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)

**An Enterprise-Grade Autonomous AI Voice Sales Representative that listens, speaks, qualifies leads, handles objections, and closes deals in real time.**

[🌐 Live Application (Vercel)](https://voxsales-ai.vercel.app) • [⚡ Render Mirror](https://voxsales-ai.onrender.com) • [📖 Documentation](#-key-features)

</div>

---

## 🌟 Overview

**VoxSales AI** is a production-quality, consultative AI voice sales SaaS platform. It replaces scripted cold-calling bots with an intelligent, adaptive conversational sales agent (Sarah / Alex in English, Priya / Rahul in Hindi) that speaks naturally, listens attentively, handles complex objections, quotes verified pricing, and automatically classifies sales dispositions upon call completion.

---

## ✨ Key Features

### 🧠 1. Consultative Conversational Intelligence
- **Answer-First Policy:** Always directly answers the customer's question (identity, pricing, capabilities, integrations) before suggesting next steps.
- **Strict Product Grounding:** Only communicates verified facts from the product catalog. Never invents discounts, unverified trial durations, or unsupported integrations.
- **Context Memory:** Remembers customer team size, legacy tools, budget, and stated pain points across conversation turns.

### 🎙️ 2. Real-Time Voice Turn-Taking & Echo Prevention
- **Low-Latency Streaming:** Native Web Speech API streaming speech-to-text with real-time interim transcription.
- **Zero Self-Recognition Feedback:** Automatically pauses and aborts recognition while the AI processes or speaks, preventing microphone echo loops.
- **Natural Phone Rhythm:** Concise spoken responses (1–3 sentences) synthesized aloud with dialect-tailored native voices.

### 🌐 3. Multilingual Voice Support
- **English (`en-US`):** Persona **Sarah** (Warm, consultative Senior Account Executive) or **Alex** (Sales Director).
- **Hindi (`hi-IN`):** Persona **Priya** (Empathetic, consultative Hindi sales executive with feminine first-person verb agreement) or **Rahul**.
- Dynamic speech recognition and voice engine switching on the fly.

### 📊 4. Automated Post-Call Intelligence
- **6 Standard Sales Dispositions:**
  - 🟢 `Converted` — Customer agreed to purchase or subscribe.
  - 🔵 `Interested` — Strong customer interest; evaluating options.
  - 🟣 `Demo Requested` — Prospect requested a live walkthrough or presentation.
  - 🟡 `Follow-up Required` — Inquired about pricing/spec sheets; scheduled follow-up.
  - ⚪ `Not Interested` — Respectfully acknowledged customer refusal.
  - ⚫ `No Response` — Call disconnected prematurely with no substantive dialogue.
- **Grounded Executive Summary:** Automatically generates conversation summary, customer requirements, objections raised, and actionable next steps.

### 💾 5. Persistent Local Architecture & Privacy
- **Browser-Native IndexedDB Storage (`VoxSalesDB`):** Preserves call duration, transcripts, executive summaries, and audio recordings.
- **Survives Page Refresh:** Safe session rehydration without stale blob errors.
- **Interactive Audio Playback:** Review and play back your recorded calls directly in the browser or download as `.webm`.

### ⚡ 6. Interactive Live Product Walkthrough
- Built-in live demo simulation sandboxes for:
  - **FlowDesk CRM** ($49/seat/month)
  - **OmniFlow AI** ($199/team/month)
  - **CyberArmor Cloud** ($299/month)
- Demonstrates real-time 2-way sync, deal risk alerts, and autonomous pipelines.

---

## 🏗️ Architecture & Tech Stack

```
   ┌─────────────────────────────────────────────────────────┐
   │                    Client (React 19)                    │
   │  ┌─────────────────┐ ┌───────────────┐ ┌──────────────┐ │
   │  │ Web Speech API  │ │ Web Audio API │ │  IndexedDB   │ │
   │  │   (STT / TTS)   │ │  Visualizer   │ │ Call Records │ │
   │  └────────┬────────┘ └───────────────┘ └──────────────┘ │
   └───────────┼─────────────────────────────────────────────┘
               │ JSON / SSE
   ┌───────────▼─────────────────────────────────────────────┐
   │             Express Backend Proxy (Vite Node)           │
   │  ┌───────────────────────┐   ┌───────────────────────┐  │
   │  │       /api/chat       │   │     /api/analyze      │  │
   │  │   Multi-Model Fallback│   │   Outcome Classifier  │  │
   │  └───────────┬───────────┘   └───────────┬───────────┘  │
   └──────────────┼───────────────────────────┼──────────────┘
                  │ Secure Server-Side Key    │
   ┌──────────────▼───────────────────────────▼──────────────┐
   │                   Google Gemini AI                      │
   │    (gemini-flash-lite-latest / gemini-3.1-flash-lite)   │
   └─────────────────────────────────────────────────────────┘
```

- **Frontend:** React 19, Vite 8.3, TailwindCSS v4, Lucide React, Canvas Confetti
- **Audio & Voice:** Web Speech API (`SpeechRecognition`, `SpeechSynthesis`), Web Audio API (`AudioContext`, `AnalyserNode`), `MediaRecorder`
- **Backend API:** Node.js Vite server middleware
- **AI Models:** Google Gemini (`gemini-flash-lite-latest`, `gemini-flash-latest`, `gemini-3.1-flash-lite`) with rule-based consultative fallback
- **Storage:** Browser IndexedDB (`VoxSalesDB`)

---

## 📁 Project Structure

```
VoxSales AI/
├── public/                 # Static assets & icons
├── src/
│   ├── components/         # React UI Components
│   │   ├── Avatars.jsx             # AI & Customer Avatar components
│   │   ├── CallDetailModal.jsx     # Full call inspection & audio player modal
│   │   ├── CallHistoryPage.jsx     # Searchable history table with filters
│   │   ├── LiveCallStudio.jsx      # Primary interactive calling workspace
│   │   ├── LiveProductDemoModal.jsx# Interactive product walkthrough sandbox
│   │   ├── OverviewDashboard.jsx   # Sales metrics & analytics dashboard
│   │   ├── ProductsPage.jsx        # Product catalog & configuration
│   │   ├── SettingsPage.jsx        # Voice persona, language & diagnostics
│   │   ├── Sidebar.jsx             # Navigation sidebar
│   │   └── TopHeader.jsx           # Top header bar & language selector
│   ├── data/
│   │   └── saasProducts.js         # Verified product catalog & voice personas
│   ├── server/
│   │   └── apiHandler.js           # Server-side Gemini chat & analyze handlers
│   ├── services/
│   │   ├── salesEngine.js          # Answer-first rule-based fallback engine
│   │   ├── storageService.js       # IndexedDB persistence layer
│   │   └── voiceService.js         # Turn-taking voice manager & audio recorder
│   ├── App.jsx             # Main application orchestrator
│   ├── index.css           # Global Tailwind & design tokens
│   └── main.jsx            # React root entry
├── .env.example            # Environment configuration template
├── package.json            # Dependencies & build scripts
├── vite.config.js          # Vite configuration & backend API plugin
└── README.md               # Project documentation
```

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Anshika366/voxsales-ai.git
cd voxsales-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note:** The Gemini API key remains strictly on the server and is never exposed to client browsers. If no API key is provided, the application runs smoothly on the built-in consultative rule-based sales engine.

### 4. Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to: **`http://localhost:5173/`**

### 5. Build for Production
```bash
npm run build
npm run preview
```

---

## 🎯 How to Test Voice Calling

1. Open `http://localhost:5173/` in a Chromium browser (**Chrome**, **Edge**, or **Brave**).
2. Go to **Live Call Studio**.
3. Select **FlowDesk CRM** and persona **Sarah**.
4. Click **Start Voice Call** and allow microphone permissions.
5. Try asking:
   - *"Who are you and what do you do?"* → Sarah introduces herself and explains her consultative role.
   - *"How much does it cost?"* → Quotes verified Starter ($29), Growth ($49), and Enterprise ($89) tiers.
   - *"We already use Salesforce. Why should we switch?"* → Sarah explains FlowDesk's automated 2-way sync without inventing fake migration offers.
   - *"Can I see a demo?"* → Launches the interactive product walkthrough.
6. Click **End Call** → The call transcript remains 100% visible, audio is saved, and executive insights are generated.
7. Open **Call History** to play back the recorded audio, review the transcript, and inspect the assigned disposition.

---

## 🛡️ Security & Privacy
- **Explicit Recording Consent:** Audio recording only begins after the user reviews and confirms the audio consent dialog.
- **Private Local Storage:** Recordings and conversation transcripts are stored locally in your browser's IndexedDB.
- **Server-Side API Keys:** The Gemini API key is never bundled in frontend JavaScript.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
Built with ❤️ for Modern Revenue & Sales Teams.
</div>
