import fs from 'fs';
import { handleApiChat } from './src/server/apiHandler.js';
import { generateRuleBasedResponse } from './src/services/salesEngine.js';
import { DEFAULT_SAAS_PRODUCTS } from './src/data/saasProducts.js';

let envKey = '';
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  for (const line of envContent.split('\n')) {
    if (line.startsWith('GEMINI_API_KEY=')) {
      envKey = line.split('=')[1].trim();
    }
  }
}

const product = DEFAULT_SAAS_PRODUCTS[0]; // FlowDesk CRM

const primaryQuestions = [
  'There are many CRMs in the market. Why should I buy yours?',
  'Is your CRM cheaper than Salesforce?',
  'I need to discuss this with my manager.',
  'What features make FlowDesk CRM different?'
];

console.log('================================================================');
console.log('AUDIT STEP 1: FALLBACK SALES ENGINE VERIFICATION');
console.log('================================================================');

for (const q of primaryQuestions) {
  const reply = generateRuleBasedResponse({
    userText: q,
    history: [{ sender: 'bot', text: 'Hi there, this is Sarah from FlowDesk CRM.' }],
    product,
    langCode: 'en-US'
  });
  console.log(`\nQUESTION: "${q}"`);
  console.log(`FALLBACK REPLY:\n${reply}`);
}

const contextHistory = [
  { sender: 'bot', text: 'Hi there, this is Sarah calling from FlowDesk CRM. We help sales teams eliminate manual admin work and accelerate deal velocity.' },
  { sender: 'user', text: 'What is FlowDesk CRM?' },
  { sender: 'bot', text: 'FlowDesk CRM automates sales pipeline tracking, syncs multi-channel communications, and provides real-time deal closing intelligence.' }
];
const contextQuery = 'Compare it with other CRMs.';
const fallbackContextReply = generateRuleBasedResponse({
  userText: contextQuery,
  history: contextHistory,
  product,
  langCode: 'en-US'
});
console.log(`\nCONTEXT QUESTION: "${contextQuery}"`);
console.log(`FALLBACK CONTEXT REPLY:\n${fallbackContextReply}`);

console.log('\n================================================================');
console.log('AUDIT STEP 2: LIVE GEMINI API VERIFICATION');
console.log('================================================================');

async function testLiveGemini() {
  if (!envKey) {
    console.log('No GEMINI_API_KEY found in .env');
    return;
  }

  for (const q of primaryQuestions) {
    const res = await handleApiChat({
      userText: q,
      history: [{ sender: 'bot', text: 'Hi there, this is Sarah from FlowDesk CRM.' }],
      product
    }, envKey);

    console.log(`\nQUESTION: "${q}"`);
    console.log(`PROVIDER: ${res.provider} | MODEL: ${res.model}`);
    console.log(`GEMINI LIVE REPLY:\n${res.text}`);
    await new Promise(r => setTimeout(r, 600));
  }

  const liveContextRes = await handleApiChat({
    userText: contextQuery,
    history: contextHistory,
    product
  }, envKey);

  console.log(`\nCONTEXT QUESTION: "${contextQuery}"`);
  console.log(`PROVIDER: ${liveContextRes.provider} | MODEL: ${liveContextRes.model}`);
  console.log(`GEMINI CONTEXT REPLY:\n${liveContextRes.text}`);

  console.log('\n================================================================');
  console.log('AUDIT STEP 3: HINDI CONVERSATION VERIFICATION');
  console.log('================================================================');

  const hindiQuestions = [
    'बाज़ार में कई सारे CRM हैं। मुझे आपका CRM क्यों ख़रीदना चाहिए?',
    'इसकी तुलना दूसरे CRM से करें।',
    'क्या आपका CRM Salesforce से सस्ता है?',
    'मुझे इस बारे में अपने मैनेजर से बात करनी होगी।',
    'FlowDesk CRM में क्या अलग फीचर्स हैं?'
  ];

  for (const hq of hindiQuestions) {
    const fbHindi = generateRuleBasedResponse({
      userText: hq,
      history: [{ sender: 'bot', text: 'नमस्ते, मैं FlowDesk CRM से बात कर रही हूँ।' }],
      product,
      langCode: 'hi-IN'
    });
    console.log(`\nHINDI Q: "${hq}"`);
    console.log(`FALLBACK HINDI:\n${fbHindi}`);

    const liveHindi = await handleApiChat({
      userText: hq,
      history: [{ sender: 'bot', text: 'नमस्ते, मैं FlowDesk CRM से बात कर रही हूँ।' }],
      product
    }, envKey);
    console.log(`GEMINI HINDI (${liveHindi.model}):\n${liveHindi.text}`);
    await new Promise(r => setTimeout(r, 600));
  }
}

testLiveGemini();
