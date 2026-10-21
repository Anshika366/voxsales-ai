const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash'
];

export async function handleApiChat(reqBody, serverApiKey) {
  const { history, userText, product, language, persona } = reqBody;
  const apiKey = (serverApiKey || process.env.GEMINI_API_KEY || '').trim();

  if (apiKey && apiKey.length > 10) {
    try {
      const langName = language?.name || 'English';
      const isHindi = language?.code === 'hi-IN';
      const isFemale = persona?.gender === 'female';
      const repName = isHindi ? (isFemale ? 'प्रिया' : 'राहुल') : (isFemale ? 'Sarah' : 'Alex');

      const genderRuleHindi = isFemale
        ? 'CRITICAL HINDI GRAMMAR (FEMALE): You are a FEMALE sales executive named Priya (प्रिया). Whenever speaking in Hindi or Hinglish, you MUST strictly use feminine first-person verb forms and self-references (e.g., "मैं बात कर रही हूँ", "मैं समझ सकती हूँ", "मैं आपको बता सकती हूँ", "मैं प्रिया हूँ"). NEVER use masculine verbs like "कर रहा हूँ" or "सकता हूँ".'
        : 'CRITICAL HINDI GRAMMAR (MALE): You are a MALE sales executive named Rahul (राहुल). Whenever speaking in Hindi or Hinglish, you MUST strictly use masculine first-person verb forms and self-references (e.g., "मैं बात कर रहा हूँ", "मैं समझ सकता हूँ", "मैं आपको बता सकता हूँ", "मैं राहुल हूँ"). NEVER use feminine verbs like "कर रही हूँ" or "सकती हूँ".';

      const keyFeaturesList = Array.isArray(product?.keyFeatures) ? product.keyFeatures.join('; ') : '';
      const pricingInfo = product?.pricingTiers || product?.price || 'Custom pricing';
      const faqsList = Array.isArray(product?.faqs) ? JSON.stringify(product.faqs) : '';
      const objectionsList = product?.commonObjections ? JSON.stringify(product.commonObjections) : '';

      const systemInstruction = `You are ${repName}, the professional AI sales development assistant representing "${product?.name || 'our platform'}".
Product Category: ${product?.category || 'SaaS'}
Product Tagline: ${product?.tagline || ''}
Product Description: ${product?.description || ''}
Verified Pricing & Plans: ${pricingInfo}
Value Proposition: ${product?.valueProposition || ''}
Key Capabilities: ${keyFeaturesList}
Verified FAQs: ${faqsList}
Objection Handling Guidance: ${objectionsList}

Language Setting: ${langName}
Persona Name: ${repName}
Persona Gender: ${isFemale ? 'Female' : 'Male'}
${genderRuleHindi}

CORE CONVERSATIONAL INTELLIGENCE RULES:
1. ANSWER-FIRST POLICY:
   - Always directly and accurately answer the customer's exact question or comment before discussing anything else.
   - Never evade a question or reply with a canned, unrelated sales pitch.
   - If the customer asks who you are or what you do (e.g., "who are you and what is your work", "tell me about yourself"), directly introduce yourself as ${repName}, the AI sales assistant for ${product?.name || 'our platform'}. State that you help teams understand the product, explore features and pricing, and see if it fits their workflow.
   - If the customer asks about pricing, state the actual configured pricing (${pricingInfo}).
   - If the customer asks about integrations or capabilities, use only the verified facts above. If an integration or capability is unknown or not explicitly listed (e.g., an internal legacy custom system), honestly state that it is not verified out of the box and requires technical verification.
   - If the customer expresses an objection or says they already use another tool, respectfully acknowledge their existing setup and discuss how ${product?.name} can complement or improve their workflow without aggressive pushing.
   - If the customer says they are not interested, gracefully and politely respect their decision without pressuring them.
2. STRICT PRODUCT GROUNDING:
   - Ground every statement strictly in the verified product data above.
   - NEVER invent unverified discounts, trial lengths, complimentary migration, or guarantees not present in the verified facts.
   - When asked for a live walkthrough or demo, inform them that you can guide them through the core features right here.
3. CONVERSATION CONTEXT & MEMORY:
   - Remember details the customer shared earlier in the call (e.g., team size, current tools, budget, key concerns).
   - If the customer refers to "that", "the price", or "it", interpret their reference using recent conversation turns.
   - Never ask for information the customer has already provided.
   - Avoid repeating the same phrasing across consecutive turns.
4. SPOKEN PHONE RHYTHM:
   - Speak naturally like a knowledgeable, consultative sales professional on a live phone call.
   - Keep each response concise (strictly 1 to 3 short spoken sentences).
   - Absolutely NO markdown formatting, asterisks, bullet points, hashes, brackets, or emojis, as this text is spoken aloud by speech synthesis.`;

      const safeHistory = Array.isArray(history) ? history : [];
      const contents = [];

      for (let i = 0; i < safeHistory.length; i++) {
        const item = safeHistory[i];
        if (!item || !item.text || !item.text.trim()) continue;
        const role = item.sender === 'bot' ? 'model' : 'user';
        if (i === safeHistory.length - 1 && role === 'user' && item.text.trim() === (userText || '').trim()) {
          continue;
        }
        contents.push({
          role,
          parts: [{ text: item.text.trim() }]
        });
      }

      if (userText && userText.trim()) {
        contents.push({
          role: 'user',
          parts: [{ text: userText.trim() }]
        });
      }

      for (const modelName of GEMINI_MODELS) {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const payload = {
          contents,
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 256
          }
        };

        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(4500)
          });

          if (res.ok) {
            const data = await res.json();
            const parts = data?.candidates?.[0]?.content?.parts || [];
            const textPart = parts.find(p => p.text && !p.thought) || parts[parts.length - 1] || parts[0];
            const rawText = textPart?.text || '';
            if (rawText && rawText.trim()) {
              const cleaned = rawText.replace(/[*#_~`]/g, '').trim();
              return { text: cleaned, provider: 'gemini', model: modelName };
            }
          } else {
            const errData = await res.json().catch(() => ({}));
            if (errData?.error?.message) {
              console.warn(`[Gemini API] ${modelName} error:`, errData.error.message);
            }
          }
        } catch (callErr) {}
      }
    } catch (e) {}
  }

  return { text: null, provider: 'local' };
}

export async function handleApiAnalyze(reqBody, serverApiKey) {
  const { transcript, product, language, callDuration } = reqBody;
  const apiKey = (serverApiKey || process.env.GEMINI_API_KEY || '').trim();

  if (apiKey && apiKey.length > 10) {
    try {
      const log = (transcript || []).map(m => `${(m.sender || 'USER').toUpperCase()}: ${m.text}`).join('\n');
      const prompt = `You are a Revenue Intelligence analyst reviewing a completed sales call for "${product?.name || 'SaaS Product'}".
Transcript of Conversation:
${log || 'No conversation recorded'}
Call Duration in Seconds: ${callDuration || 0}
Language: ${language?.name || 'English'}

Categorize the sales outcome into EXACTLY ONE of these 6 statuses:
- Converted
- Interested
- Demo Requested
- Follow-up Required
- Not Interested
- No Response

Return strictly a valid JSON object without markdown fences, comments, or backticks:
{
  "salesStatus": "Converted | Interested | Demo Requested | Follow-up Required | Not Interested | No Response",
  "summary": "Concise 2-3 sentence executive recap based strictly on what was actually discussed",
  "customerRequirements": "Specific needs, pain points, and requirements stated by the customer",
  "objections": "Any objections voiced regarding price, competitors, or complexity and how they were handled",
  "nextSteps": "Specific actionable next step for the sales team",
  "statusRationale": "Direct conversational evidence explaining why this status was selected",
  "interestLevel": "High | Medium | Low | None"
}`;

      for (const modelName of GEMINI_MODELS) {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const analyzePayload = {
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 1024,
            responseMimeType: 'application/json'
          }
        };

        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(analyzePayload),
            signal: AbortSignal.timeout(6000)
          });

          if (res.ok) {
            const data = await res.json();
            const parts = data?.candidates?.[0]?.content?.parts || [];
            const textPart = parts.find(p => p.text && !p.thought) || parts[parts.length - 1] || parts[0];
            const rawText = textPart?.text || '';
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              if (parsed && parsed.salesStatus) {
                return { analysis: parsed, provider: 'gemini', model: modelName };
              }
            }
          }
        } catch (callErr) {}
      }
    } catch (e) {}
  }

  return { analysis: null, provider: 'local' };
}
