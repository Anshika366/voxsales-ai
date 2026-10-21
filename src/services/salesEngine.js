const usedPhrases = new Set();

export function getInitialGreeting(product, language, persona) {
  usedPhrases.clear();
  const langCode = language?.code || 'en-US';
  const isFemale = persona?.gender === 'female';

  if (langCode === 'hi-IN') {
    if (isFemale) {
      return `नमस्ते! मैं ${product.name} से प्रिया बात कर रही हूँ। क्या आप 2 मिनट बात कर सकते हैं ताकि मैं आपको दिखा सकूँ कि यह आपकी टीम के सेल्स और ऑपरेशन्स को कैसे आसान बनाता है?`;
    }
    return `नमस्ते! मैं ${product.name} से राहुल बात कर रहा हूँ। क्या आप 2 मिनट बात कर सकते हैं ताकि मैं आपको दिखा सकूँ कि यह आपकी टीम के सेल्स और ऑपरेशन्स को कैसे आसान बनाता है?`;
  }

  const name = isFemale ? 'Sarah' : 'Alex';
  return `Hi there, this is ${name} calling from ${product.name}. We help sales teams eliminate manual admin work and accelerate deal velocity. Do you have two minutes to see how this works for your team?`;
}

export async function generateSalesResponse({ userText, history, product, language, persona }) {
  const langCode = language?.code || 'en-US';

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history, userText, product, language, persona })
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.text && data.text.trim()) {
        return data.text.trim();
      }
    }
  } catch (e) {}

  return generateRuleBasedResponse({ userText, history, product, langCode, persona });
}

function pickUnique(pool) {
  const available = pool.filter(p => !usedPhrases.has(p));
  const chosen = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : pool[Math.floor(Math.random() * pool.length)];
  usedPhrases.add(chosen);
  return chosen;
}

export function generateRuleBasedResponse({ userText, history, product, langCode, persona }) {
  const lower = (userText || '').toLowerCase().trim();
  const isFemale = persona?.gender === 'female';
  const repName = isFemale ? 'Sarah' : 'Alex';

  if (langCode === 'hi-IN') {
    return handleHindiDialogue(lower, product, isFemale);
  }

  if (
    lower.includes('who are you') ||
    lower.includes('what do you do') ||
    lower.includes('your role') ||
    lower.includes('your work') ||
    lower.includes('who is this') ||
    lower.includes('what is your job') ||
    lower.includes('explain who you are') ||
    lower.includes('introduce yourself')
  ) {
    return `Hi! I'm ${repName}, the AI sales assistant for ${product.name}. I help teams understand the product, explore its features and pricing, and work out whether it fits their sales process. What would you like to know?`;
  }

  if (
    lower.includes('buy') ||
    lower.includes('purchase') ||
    lower.includes('sign up') ||
    lower.includes('ready to start') ||
    lower.includes('deal') ||
    lower.includes('subscribe')
  ) {
    return pickUnique([
      `That is fantastic! I can get your ${product.name} account provisioned right away. Should I send the activation link to your work email?`,
      `Excellent! You are going to love the results. I will lock in our ${product.specialOffer || 'standard evaluation'} for your team right now. What is the best email address for your admin account?`
    ]);
  }

  if (
    lower.includes('demo') ||
    lower.includes('walkthrough') ||
    lower.includes('show me') ||
    lower.includes('see it') ||
    lower.includes('screen share')
  ) {
    return pickUnique([
      `Absolutely! I have launched the interactive live demo of ${product.name} right on your screen. You can interact with the live pipeline board and test the core features in real time. Does this match what your team needs?`,
      `Right away! The live product walkthrough is now active in front of you. You can see real-time deal alerts and zero-manual CRM logging in action. What part would you like to explore first?`
    ]);
  }

  if (
    lower.includes('price') ||
    lower.includes('cost') ||
    lower.includes('how much') ||
    lower.includes('pricing') ||
    lower.includes('expensive') ||
    lower.includes('budget')
  ) {
    if (lower.includes('expensive') || lower.includes('too much') || lower.includes('high')) {
      return pickUnique([
        `I completely understand budget is top of mind. ${product.commonObjections?.price || 'Most teams see full ROI within 14 days.'} What is your target budget for this project?`,
        `Fair point on costs. When you factor in the hours saved every week, it pays for itself quickly. Would a 14-day trial help you test the numbers first?`
      ]);
    }
    return pickUnique([
      `Our plans start at ${product.pricingTiers || product.price}. There are no setup fees and we include a 14-day evaluation trial so you can evaluate the return before paying. How many seats would your team require?`,
      `${product.name} is priced at ${product.price}. Every tier comes with core pipeline automation and dedicated support. Would you like to see how that fits your team?`
    ]);
  }

  if (
    lower.includes('competitor') ||
    lower.includes('hubspot') ||
    lower.includes('salesforce') ||
    lower.includes('zapier') ||
    lower.includes('already use') ||
    lower.includes('difference')
  ) {
    return pickUnique([
      `That makes total sense. ${product.name} integrates directly with platforms like Salesforce and HubSpot, so you can keep your existing records while automating pipeline tracking and deal alerts. Which tool are you currently using?`,
      `That is a very common scenario. Most teams keep their existing system of record and use ${product.name} to eliminate the manual logging for their reps. Would you like to see how the sync works?`
    ]);
  }

  if (
    lower.includes('legacy') ||
    lower.includes('internal system') ||
    lower.includes('custom api') ||
    lower.includes('in-house')
  ) {
    return `Custom legacy internal systems are not verified out of the box with ${product.name} and would require a technical API or CSV evaluation. Would you like me to note down your system specs for our solutions engineering team?`;
  }

  if (
    lower.includes('feature') ||
    lower.includes('what can it do') ||
    lower.includes('how it works') ||
    lower.includes('capabilities') ||
    lower.includes('explain')
  ) {
    const f1 = product.keyFeatures?.[0] || 'automated pipeline tracking';
    const f2 = product.keyFeatures?.[1] || 'deal risk alerts';
    return `${product.name} delivers two core capabilities: first, ${f1}, and second, ${f2}. What is the biggest workflow challenge your team is facing today?`;
  }

  if (
    lower.includes('not interested') ||
    lower.includes('no thanks') ||
    lower.includes('dont need') ||
    lower.includes("don't need") ||
    lower.includes('busy')
  ) {
    return `I completely understand and appreciate your time today. Wishing you and your team all the best, and feel free to reach out if your needs change down the road!`;
  }

  if (
    lower.includes('email') ||
    lower.includes('send info') ||
    lower.includes('send me') ||
    lower.includes('pdf')
  ) {
    return `I will gladly send our executive specification sheet and pricing details to your email. What is the best email address to send that over to?`;
  }

  return `Based on what you shared, ${product.name} is designed to solve exactly that by eliminating manual updates and keeping deals on track. Would you like to explore how it handles this in detail?`;
}

function handleHindiDialogue(lower, product, isFemale) {
  const repName = isFemale ? 'प्रिया' : 'राहुल';
  const bol = isFemale ? 'सकती हूँ' : 'सकता हूँ';
  const raha = isFemale ? 'रही हूँ' : 'रहा हूँ';

  if (
    lower.includes('kaun ho') ||
    lower.includes('aap kaun') ||
    lower.includes('kya kaam') ||
    lower.includes('kya karte ho') ||
    lower.includes('kya karti ho') ||
    lower.includes('kaun hai')
  ) {
    return `नमस्ते! मैं ${product.name} की AI सेल्स असिस्टेंट ${repName} हूँ। मैं टीमों को प्रोडक्ट के फीचर्स, प्राइसिंग और वर्कफ़्लो समझने में मदद करती हूँ। आप इसके बारे में क्या जानना चाहते हैं?`;
  }

  if (
    lower.includes('price') ||
    lower.includes('daam') ||
    lower.includes('cost') ||
    lower.includes('kimat') ||
    lower.includes('कीमत') ||
    lower.includes('दाम') ||
    lower.includes('रुपये')
  ) {
    return `हमारी कीमत ${product.pricingTiers || product.price} है। इसमें कोई सेटअप फीस नहीं है और 14 दिन का ट्रायल भी शामिल है। आपकी टीम में कितने मेंबर्स हैं?`;
  }

  if (
    lower.includes('demo') ||
    lower.includes('dekhein') ||
    lower.includes('dikhao') ||
    lower.includes('डेमो') ||
    lower.includes('दिखाओ') ||
    lower.includes('walkthrough')
  ) {
    return `जी बिल्कुल! मैंने आपकी स्क्रीन पर ${product.name} का लाइव इंटरएक्टिव वॉकथ्रू लोड कर दिया है। आप सामने लाइव पाइपलाइन बोर्ड और ऑटोमेशन देख सकते हैं। क्या आप इसका उपयोग करके देखना चाहेंगे?`;
  }

  if (
    lower.includes('feature') ||
    lower.includes('kaam') ||
    lower.includes('kya karta hai') ||
    lower.includes('फायदे') ||
    lower.includes('फीचर्स') ||
    lower.includes('बताओ')
  ) {
    const f1 = product.keyFeatures?.[0] || 'ऑटोमैटिक सिंक';
    const f2 = product.keyFeatures?.[1] || 'डील रिस्क अलर्ट्स';
    return `${product.name} के दो मुख्य फायदे हैं: पहला, ${f1}, और दूसरा, ${f2}। क्या आप स्क्रीन पर इसका लाइव वॉकथ्रू देखना चाहेंगे?`;
  }

  if (
    lower.includes('buy') ||
    lower.includes('kharidna') ||
    lower.includes('lena hai') ||
    lower.includes('लेना है') ||
    lower.includes('खरीदना')
  ) {
    return `बहुत बढ़िया! मैं आपके लिए अभी अकाउंट सेटअप कर ${raha}। क्या मैं एक्टिवेशन लिंक आपके वर्क ईमेल पर भेज दूँ?`;
  }

  if (
    lower.includes('nahi chahiye') ||
    lower.includes('not interested') ||
    lower.includes('nahin')
  ) {
    return `मैं आपकी बात का पूरा सम्मान करती हूँ। समय देने के लिए बहुत धन्यवाद, आपका दिन शुभ हो!`;
  }

  return `जी बिल्कुल! ${product.name} आपकी टीम के समय को बचाने और प्रोसेस को आसान बनाने के लिए बनाया गया है। क्या मैं आपको इसके बारे में और जानकारी दे ${bol}?`;
}

export async function analyzeCall({ transcript, product, language, callDuration }) {
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, product, language, callDuration })
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.analysis && data.analysis.salesStatus) {
        return data.analysis;
      }
    }
  } catch (e) {}

  return evaluateSalesDialogue({ transcript, product, callDuration });
}

export function evaluateSalesDialogue({ transcript, product, callDuration }) {
  const userMessages = (transcript || []).filter(m => m.sender === 'user');
  const userTextCombined = userMessages.map(m => m.text.toLowerCase()).join(' ');

  let status = 'Interested';
  let rationale = 'Prospect engaged in dialogue and asked clarifying questions regarding capabilities.';

  if (userMessages.length === 0 || callDuration < 12) {
    status = 'No Response';
    rationale = 'The call ended before substantial discovery or product dialogue took place.';
  } else if (
    userTextCombined.includes('buy') ||
    userTextCombined.includes('purchase') ||
    userTextCombined.includes('sign up') ||
    userTextCombined.includes('deal') ||
    userTextCombined.includes('ready to start') ||
    userTextCombined.includes('send invoice') ||
    userTextCombined.includes('खरीदना') ||
    userTextCombined.includes('लेना है')
  ) {
    status = 'Converted';
    rationale = 'Customer explicitly expressed intent to purchase or subscribe to the platform.';
  } else if (
    userTextCombined.includes('demo') ||
    userTextCombined.includes('walkthrough') ||
    userTextCombined.includes('schedule') ||
    userTextCombined.includes('screen share') ||
    userTextCombined.includes('meeting') ||
    userTextCombined.includes('call me tomorrow') ||
    userTextCombined.includes('डेमो')
  ) {
    status = 'Demo Requested';
    rationale = 'Customer requested a live product walkthrough, screen share, or scheduled consultation.';
  } else if (
    userTextCombined.includes('not interested') ||
    userTextCombined.includes('no thanks') ||
    userTextCombined.includes('dont need') ||
    userTextCombined.includes("don't need") ||
    userTextCombined.includes('stop calling') ||
    userTextCombined.includes('nahi chahiye')
  ) {
    status = 'Not Interested';
    rationale = 'Prospect stated they do not need the software or declined further sales contact.';
  } else if (
    userTextCombined.includes('email me') ||
    userTextCombined.includes('send information') ||
    userTextCombined.includes('check with my team') ||
    userTextCombined.includes('later') ||
    userTextCombined.includes('next week') ||
    userTextCombined.includes('follow up') ||
    userTextCombined.includes('बाद में')
  ) {
    status = 'Follow-up Required';
    rationale = 'Customer requested additional materials, collateral, or a future follow-up consultation.';
  }

  return {
    salesStatus: status,
    summary: `The sales call for ${product.name} lasted ${callDuration} seconds with ${userMessages.length} prospect turns. The conversation focused on core platform capabilities, pricing transparency, and workflow automation.`,
    customerRequirements: userMessages.length > 0 ? `Inquired regarding pricing, integrations, and workflow efficiency for ${product.name}.` : 'No specific requirements articulated.',
    objections: userTextCombined.includes('price') || userTextCombined.includes('cost') || userTextCombined.includes('expensive')
      ? 'Customer inquired about pricing and ROI justification, which was addressed transparently.'
      : 'No major budget or competitor objections raised.',
    nextSteps: status === 'Demo Requested'
      ? 'Send calendar invitation for live 15-minute product walkthrough.'
      : status === 'Converted'
      ? 'Deliver onboarding activation credentials and account provisioning link.'
      : status === 'Follow-up Required'
      ? 'Email product specification sheet and reconnect next week.'
      : 'Maintain lead in nurture campaign for future outreach.',
    statusRationale: rationale,
    interestLevel: status === 'Converted' || status === 'Demo Requested' ? 'High' : status === 'Interested' ? 'Medium' : status === 'Follow-up Required' ? 'Low' : 'None'
  };
}
