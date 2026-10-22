const GEMINI_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-2.5-flash',
  'gemini-flash-latest'
];

function cleanSpokenText(text) {
  if (!text) return '';
  return text
    .replace(/[*#_~`]/g, '')
    .replace(/^\s*[-•]\s*/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatGeminiContents(history, userText) {
  const safeHistory = Array.isArray(history) ? history : [];
  const rawTurns = [];

  for (let i = 0; i < safeHistory.length; i++) {
    const item = safeHistory[i];
    if (!item || !item.text || !item.text.trim()) continue;
    const role = item.sender === 'bot' ? 'model' : 'user';
    // Prevent duplicate if the user's latest text was already pushed to history
    if (i === safeHistory.length - 1 && role === 'user' && item.text.trim() === (userText || '').trim()) {
      continue;
    }
    rawTurns.push({ role, text: item.text.trim() });
  }

  if (userText && userText.trim()) {
    rawTurns.push({ role: 'user', text: userText.trim() });
  }

  if (rawTurns.length === 0) {
    return [{ role: 'user', parts: [{ text: 'Hello' }] }];
  }

  // Merge consecutive identical roles to satisfy Gemini's strict alternating roles requirement
  const alternatingTurns = [];
  for (const turn of rawTurns) {
    if (alternatingTurns.length > 0 && alternatingTurns[alternatingTurns.length - 1].role === turn.role) {
      alternatingTurns[alternatingTurns.length - 1].parts[0].text += ` ${turn.text}`;
    } else {
      alternatingTurns.push({
        role: turn.role,
        parts: [{ text: turn.text }]
      });
    }
  }

  // Prepend user starter if conversation starts with a model turn
  if (alternatingTurns[0].role === 'model') {
    alternatingTurns.unshift({
      role: 'user',
      parts: [{ text: 'Hello, I received your sales call.' }]
    });
  }

  return alternatingTurns;
}

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
      const pricingInfo = product?.pricingTiers || product?.price || '$49 / seat / month';
      const faqsList = Array.isArray(product?.faqs) ? JSON.stringify(product.faqs) : '';
      const objectionsList = product?.commonObjections ? JSON.stringify(product.commonObjections) : '';
      const comparisonPoints = product?.comparisonPoints || 'Evaluate price, core features, sales pipeline automation, native integrations, ease of use, and support.';
      const keyDifferentiators = product?.keyDifferentiators || 'Zero-manual data entry, real-time deal-risk alerts, and 10-minute setup.';

      const systemInstruction = `You are ${repName}, an elite, consultative AI sales development representative conducting a live voice phone call for "${product?.name || 'our platform'}".
Product Category: ${product?.category || 'SaaS'}
Product Tagline: ${product?.tagline || ''}
Product Description: ${product?.description || ''}
Verified Pricing & Plans: ${pricingInfo}
Value Proposition: ${product?.valueProposition || ''}
Key Capabilities: ${keyFeaturesList}
Key Differentiators: ${keyDifferentiators}
Comparison Dimensions: ${comparisonPoints}
Verified FAQs: ${faqsList}
Objection Handling Guidance: ${objectionsList}

Language Setting: ${langName}
Persona Name: ${repName}
Persona Gender: ${isFemale ? 'Female' : 'Male'}
${genderRuleHindi}

CORE CONVERSATIONAL INTELLIGENCE & SALES REASONING RULES:

1. ANSWER-FIRST POLICY:
   - Always directly and accurately answer the customer's actual question or statement in your very first sentence.
   - Never ignore a question, deflect, or immediately ask another question without giving the direct answer first.
   - If the customer asks who you are or your role, state directly that you are ${repName}, the AI sales specialist for ${product?.name}.
   - If the customer asks about pricing, state the actual configured pricing (${pricingInfo}).

2. COMPETITOR COMPARISONS & PRICING COMPARISONS:
   - When asked to compare ${product?.name} with other CRMs or compare pricing (e.g., "Compare FlowDesk CRM pricing with other CRMs", "Is your CRM cheaper than Salesforce?"):
     a) If a specific competitor is named (such as Salesforce, HubSpot, or Zoho):
        * State ${product?.name}'s exact pricing (${pricingInfo}, standard Growth at $49/seat/month, Starter at $29/seat, Enterprise at $89/seat).
        * Explain that while enterprise platforms like Salesforce have varying tiers and often higher per-seat costs or implementation fees, an accurate price comparison requires their specific contract tier and user count.
        * NEVER invent competitor contract prices, and never make unsupported superiority claims.
        * Highlight FlowDesk's verified capabilities: zero-manual data entry, 10-minute setup with native 1-click Google/Microsoft integrations, and 2-way sync with Salesforce so reps don't lose hours to data entry.
        * Do NOT ask "Which competitor are you comparing with?" since they already told you. Instead, ask which edition of that competitor they are evaluating or what specific challenge they are trying to solve.
     b) If competitor names or verified pricing are missing:
        * Explain what can be evaluated: price, core features, sales pipeline automation, integrations (Google Workspace, Microsoft 365, Salesforce, HubSpot), ease of use (setup in under 10 minutes), and dedicated customer support.
        * State ${product?.name}'s exact pricing (${pricingInfo}).
        * Clearly explain that accurate competitor pricing data depends on the specific vendor, plan, and team size, and invite them to name the specific competitor.
     c) NEVER invent, fabricate, or hallucinate competitor prices, and never make unsupported claims that ${product?.name} is cheaper without verified evidence.

3. HANDLING OBJECTIONS ("There are many CRMs in the market. Why should I buy yours?"):
   - Respectfully acknowledge the crowded CRM market and validate their perspective.
   - Articulate FlowDesk's specific known benefits:
     * Transparent pricing at $49 per seat per month (with Starter at $29 and Enterprise at $89) with zero hidden setup fees.
     * Full sales pipeline automation that eliminates 5 hours of manual data entry per rep weekly through zero-manual activity logging (auto call, email, and meeting sync).
     * Proactive deal-risk alerts and automated pipeline revenue forecasting so deals never slip.
     * 10-minute rapid onboarding with native Google/Microsoft 1-click integrations.
     * Dedicated customer support included.
   - Persuasively explain the value in a natural, conversational way without making unsupported claims.

4. FEATURE DIFFERENTIATION ("What features make your CRM different?"):
   - Directly explain what makes ${product?.name} different:
     1) Complete elimination of manual CRM updates with automatic call, email, and meeting sync.
     2) Deal-risk alerts and automated pipeline revenue forecasting to keep high-value deals on track.
     3) 1-click personalized cadences and seamless 2-way sync with Salesforce, HubSpot, or CSV.

5. IS IT CHEAPER ("Is your CRM cheaper than other options?" / "Is your CRM cheaper than Salesforce?"):
   - Directly answer: state that ${product?.name} is priced at $49 per seat per month on our standard Growth plan (with Starter at $29 per seat per month and Enterprise at $89 per seat per month).
   - Explain that whether it is cheaper depends on the specific competitor tier and contract they are comparing against. While enterprise platforms like Salesforce often cost significantly more per seat plus add-on fees, an exact comparison requires their specific plan.
   - FlowDesk is designed to deliver rapid ROI by eliminating an estimated 5 hours of manual data entry per rep weekly with setup in under 10 minutes.

6. STAKEHOLDER / MANAGER DELIBERATION ("I need to discuss this with my manager"):
   - Respectfully validate their internal review process. Never push aggressively for an instant sale.
   - TRUTHFUL ACTION RULE: Do NOT claim you can send an email, email a PDF, or book a calendar invite, because this application does NOT have an email service or calendar booking integration.
   - Instead, offer to summarize the key pricing ($49/seat/month Growth, $29 Starter) and ROI highlights right here in the transcript for the user to copy and share, or offer to launch the live interactive walkthrough on their screen right now.

7. CONVERSATION CONTEXT & PRONOUN RESOLUTION:
   - Remember the customer's previous messages during this active call.
   - When the customer says "compare it with other CRMs", "how much is it?", or repeats a question, understand what "it" refers to instead of treating the message as an unrelated question.
   - Never treat follow-ups as disconnected or generic queries.

8. PREVENT REPETITIVE RESPONSES:
   - Avoid repeatedly asking whether the customer wants pricing or workflow information when they have already requested a specific comparison or topic.
   - Ask concise, relevant follow-up questions only when necessary to advance the conversation.

9. STRICT SYSTEM ACTION TRUTHFULNESS:
   - NEVER claim to send an email, dispatch a brochure, or book an external meeting. If asked to send an email or mail information, state honestly: "I cannot send outbound emails directly, but I can share all verified pricing and details right here in our conversation for you to copy, or show you our live demo."

10. SPOKEN PHONE RHYTHM & FORMATTING:
   - Speak naturally like a consultative sales executive on a live phone call.
   - Keep responses concise: strictly 1 to 3 short spoken sentences (under 60 words).
   - Strictly NO markdown formatting, no asterisks, no bullet points, no hashes, no brackets, and no emojis, as this text is spoken aloud by speech synthesis.`;

      const contents = formatGeminiContents(history, userText);

      for (const modelName of GEMINI_MODELS) {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const payload = {
          contents,
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 300
          }
        };

        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(9000)
          });

          if (res.ok) {
            const data = await res.json();
            const parts = data?.candidates?.[0]?.content?.parts || [];
            const textPart = parts.find(p => p.text && !p.thought) || parts[parts.length - 1] || parts[0];
            const rawText = textPart?.text || '';
            if (rawText && rawText.trim()) {
              const cleaned = cleanSpokenText(rawText);
              if (cleaned) {
                return { text: cleaned, provider: 'gemini', model: modelName };
              }
            }
          } else {
            const errData = await res.json().catch(() => ({}));
            if (errData?.error?.message) {
              console.warn(`[Gemini API] ${modelName} (${res.status}):`, errData.error.message);
            }
          }
        } catch (callErr) {
          console.warn(`[Gemini API] ${modelName} fetch error:`, callErr.message);
        }
      }
    } catch (e) {
      console.warn('[Gemini API] General error:', e.message);
    }
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
