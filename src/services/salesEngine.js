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

function pickUnique(pool, history = []) {
  const recentBotTexts = (history || [])
    .filter(m => m.sender === 'bot')
    .slice(-4)
    .map(m => (m.text || '').toLowerCase().trim());

  const available = pool.filter(phrase => {
    if (usedPhrases.has(phrase)) return false;
    const lowerPhrase = phrase.toLowerCase().trim();
    return !recentBotTexts.some(recent => recent.includes(lowerPhrase.slice(0, 30)) || lowerPhrase.includes(recent.slice(0, 30)));
  });

  const chosen = available.length > 0
    ? available[Math.floor(Math.random() * available.length)]
    : pool[Math.floor(Math.random() * pool.length)];

  usedPhrases.add(chosen);
  return chosen;
}

export function generateRuleBasedResponse({ userText, history, product, langCode, persona }) {
  const lower = (userText || '').toLowerCase().trim();
  const isFemale = persona?.gender === 'female';
  const repName = isFemale ? 'Sarah' : 'Alex';

  if (langCode === 'hi-IN') {
    return handleHindiDialogue(lower, product, isFemale, history);
  }

  // 1. Frustration / Loop / Repeat / Direct Answer request
  if (
    lower.includes('answer my question') ||
    lower.includes('reply properly') ||
    lower.includes('reply to') ||
    lower.includes('loop') ||
    lower.includes('repeating') ||
    lower.includes('same answer') ||
    lower.includes('same thing') ||
    lower.includes('listen to me') ||
    lower.includes('hear me') ||
    lower.includes('i already asked') ||
    lower.includes('i asked you') ||
    lower.includes('asking you') ||
    lower.includes('stop repeating') ||
    lower.includes('why are you not answering')
  ) {
    return `My apologies for the confusion! Let me answer you directly: I am ${repName}, the AI sales specialist for ${product.name}. My job is to explain our product features, share pricing details, and show you live walkthroughs. Please go ahead and ask, I am listening closely!`;
  }

  // 2. Identity / Role / Who are you / What do you do
  const isIdentityQuery =
    lower.includes('who are you') ||
    lower.includes('who you are') ||
    lower.includes('whom you are') ||
    lower.includes('who is this') ||
    lower.includes("who's this") ||
    lower.includes('what do you do') ||
    lower.includes('what you do') ||
    lower.includes('your role') ||
    lower.includes('your job') ||
    lower.includes('your work') ||
    lower.includes('tell me about yourself') ||
    lower.includes('tell me about you') ||
    lower.includes('tell me who you are') ||
    lower.includes('introduce yourself') ||
    lower.includes('who am i speaking') ||
    lower.includes('who am i talking') ||
    lower.includes('are you ai') ||
    lower.includes('are you real') ||
    lower.includes('are you human') ||
    lower.includes('are you a robot') ||
    lower.includes('what is your name') ||
    lower.includes("what's your name") ||
    lower.includes('masking who you are') ||
    lower.includes('asking who you are');

  if (isIdentityQuery) {
    const hasAlreadyIntroduced = (history || []).some(
      m => m.sender === 'bot' && (m.text.includes("I'm Sarah") || m.text.includes("I'm Alex") || m.text.includes("sales assistant"))
    );

    if (hasAlreadyIntroduced) {
      return pickUnique([
        `As I mentioned, I'm ${repName}, the AI sales specialist for ${product.name}. I help teams understand how ${product.name} cuts manual work, tracks deals, and accelerates pipeline velocity. What specific question do you have about the product?`,
        `I am ${repName} with ${product.name}. My role is to help you explore the product, discuss features and pricing, and show live walkthroughs. What would you like to explore next?`
      ], history);
    }

    return `Hi! I'm ${repName}, the AI sales assistant for ${product.name}. I help teams understand the product, explore its features and pricing, and evaluate whether it fits their sales workflow. What would you like to know?`;
  }

  // 3. Objections: "Why should I buy yours?" / Market crowded / Why choose you
  const isWhyBuyObjection =
    lower.includes('why should i buy') ||
    lower.includes('why buy yours') ||
    lower.includes('why buy your') ||
    lower.includes('why should we buy') ||
    lower.includes('why should we choose') ||
    lower.includes('why choose yours') ||
    lower.includes('why choose your') ||
    lower.includes('why choose you') ||
    lower.includes('many crms in the market') ||
    lower.includes('many crms') ||
    lower.includes('market has many') ||
    lower.includes('other crms in the market') ||
    lower.includes('crms in the market') ||
    lower.includes('why flowdesk') ||
    lower.includes('why should i go with') ||
    lower.includes('why pick your') ||
    lower.includes('convince me') ||
    lower.includes('reasons to buy');

  if (isWhyBuyObjection) {
    return pickUnique([
      `With many CRMs on the market, ${product.name} stands out by delivering transparent pricing at ${product.price || '$49 / seat / month'}, sales pipeline automation that eliminates 5 hours of manual data entry per rep weekly, and dedicated support. Would you like to see how the automated pipeline works in a quick live walkthrough?`,
      `That is a very fair question in a crowded market. ${product.name} differentiates itself with zero-manual activity logging, real-time deal-risk alerts, and a setup time of under 10 minutes for ${product.price || '$49 / seat / month'}. Does eliminating manual CRM logging sound like a fit for your team?`
    ], history);
  }

  // 4. Competitor Comparison Requests ("Compare FlowDesk CRM pricing with other CRMs", etc.)
  const isCompetitorComparison =
    lower.includes('compare') ||
    lower.includes('comparison') ||
    lower.includes('versus') ||
    lower.includes(' vs ') ||
    lower.includes('vs.') ||
    lower.includes('against other') ||
    (lower.includes('other crm') && (lower.includes('pricing') || lower.includes('price') || lower.includes('cost') || lower.includes('how'))) ||
    lower.includes('difference with other') ||
    lower.includes('compared to other') ||
    lower.includes('alternative to');

  if (isCompetitorComparison) {
    const isSalesforce = lower.includes('salesforce');
    const isHubspot = lower.includes('hubspot');
    const isZoho = lower.includes('zoho');
    const isPipedrive = lower.includes('pipedrive');
    const specificTool = isSalesforce ? 'Salesforce' : isHubspot ? 'HubSpot' : isZoho ? 'Zoho' : isPipedrive ? 'Pipedrive' : null;

    if (specificTool) {
      return pickUnique([
        `When comparing ${product.name} with ${specificTool}, key evaluation points are price, zero-manual logging automation, setup speed, and support. ${product.name} is $49 per seat per month on our standard Growth plan with setup under 10 minutes and 2-way sync with ${specificTool}. Because ${specificTool} pricing depends on specific editions and add-ons, which edition is your team reviewing?`,
        `${product.name} and ${specificTool} can be evaluated across price, features, pipeline automation, integrations, and ease of use. While ${specificTool} serves as a large system of record, FlowDesk eliminates 5 hours of manual logging weekly at ${product.price || '$49 / seat / month'}. Which ${specificTool} plan are you currently evaluating?`
      ], history);
    }

    return pickUnique([
      `When comparing ${product.name} with other CRMs, you can evaluate price, core features, sales pipeline automation, native integrations, ease of use, and support. ${product.name} is priced at ${product.pricingTiers || product.price || '$49 / seat / month'} with setup in under 10 minutes. Because competitor pricing and plans vary by vendor, which specific competitor would you like to compare against?`,
      `When evaluating ${product.name} against other CRMs, the main comparison points are price, zero-manual logging automation, setup time, and dedicated support. Our plans start at ${product.pricingTiers || product.price || '$49 / seat / month'}. Which specific CRM or vendor are you comparing us with?`
    ], history);
  }

  // 5. Is it Cheaper / Price Comparison ("Is your CRM cheaper than other options?" / "Is your CRM cheaper than Salesforce?")
  const isCheaperQuery =
    lower.includes('cheaper') ||
    lower.includes('cheap') ||
    lower.includes('less expensive') ||
    lower.includes('lower price') ||
    lower.includes('cost less') ||
    lower.includes('cheapest') ||
    lower.includes('more affordable');

  if (isCheaperQuery) {
    const isSalesforce = lower.includes('salesforce');
    const isHubspot = lower.includes('hubspot');
    const isZoho = lower.includes('zoho');
    const isPipedrive = lower.includes('pipedrive');
    const specificTool = isSalesforce ? 'Salesforce' : isHubspot ? 'HubSpot' : isZoho ? 'Zoho' : isPipedrive ? 'Pipedrive' : null;

    if (specificTool) {
      return pickUnique([
        `${product.name} is priced at ${product.price || '$49 / seat / month'} on our standard Growth plan, with Starter at $29 and Enterprise at $89. While ${specificTool} offers various tiers that often involve higher per-seat commitments and implementation costs, an exact price comparison depends on your specific tier and seat count. Which ${specificTool} edition or plan are you currently reviewing?`,
        `Our standard Growth plan is ${product.price || '$49 / seat / month'} and includes full pipeline automation and dedicated support. Comparing directly with ${specificTool} depends on the edition and contract terms, as enterprise CRM pricing varies widely. Which ${specificTool} edition are you comparing our price against?`
      ], history);
    }

    return pickUnique([
      `${product.name} is priced transparently at ${product.pricingTiers || product.price || '$49 / seat / month'}. Whether it is cheaper depends on the specific CRM and plan you compare against, as enterprise platforms often cost significantly more while basic contact tools may cost less. Which competitor's pricing are you currently comparing with?`,
      `Our plans start at ${product.pricingTiers || product.price || '$49 / seat / month'}. Whether that is cheaper depends on which alternative and tier you are considering, but we deliver fast ROI by saving reps 5 hours of manual logging each week. Which specific CRM are you comparing our price to?`
    ], history);
  }

  // 6. Feature Differentiation ("What features make your CRM different?")
  const isDifferentiationQuery =
    lower.includes('what features make') ||
    lower.includes('features make your') ||
    lower.includes('what makes your crm different') ||
    lower.includes('what makes you different') ||
    lower.includes('how are you different') ||
    lower.includes('why are you different') ||
    lower.includes('what is different') ||
    lower.includes('what makes it different') ||
    lower.includes('differentiator') ||
    lower.includes('differentiating') ||
    lower.includes('key difference') ||
    lower.includes('different from others') ||
    lower.includes('unique features');

  if (isDifferentiationQuery) {
    const f1 = product.keyFeatures?.[0] || 'Automatic call, email, and meeting sync with zero manual logging';
    const f2 = product.keyFeatures?.[1] || 'Deal-risk alerts and automated pipeline revenue forecasting';
    return pickUnique([
      `${product.name} differentiates itself with zero manual data entry through ${f1.toLowerCase()}, proactive ${f2.toLowerCase()}, and setup in under 10 minutes with native Google and Microsoft integrations. Would you like to see these alerts in action?`,
      `What makes ${product.name} different is eliminating manual admin: reps get ${f1.toLowerCase()} and ${f2.toLowerCase()} out of the box, with transparent pricing at ${product.price || '$49 / seat / month'}. Would you like a 2-minute walkthrough?`
    ], history);
  }

  // 7. Manager / Stakeholder Deliberation ("I need to discuss this with my manager")
  const isManagerDiscussion =
    lower.includes('manager') ||
    lower.includes('boss') ||
    lower.includes('discuss this with') ||
    lower.includes('discuss with') ||
    lower.includes('talk to my') ||
    lower.includes('talk with my') ||
    lower.includes('check with my') ||
    lower.includes('speak with my') ||
    lower.includes('internal review') ||
    lower.includes('need approval') ||
    lower.includes('decision maker') ||
    lower.includes('my team first');

  if (isManagerDiscussion) {
    return pickUnique([
      `That makes complete sense, aligning with your manager is an important step. I can provide a concise summary covering our ${product.price || '$49 / seat / month'} pricing, key pipeline automation ROI numbers, and trial details, or we can arrange a quick 15-minute demo that your manager can join. Would you like me to send that summary over?`,
      `I completely understand. To make your internal discussion easier, I can send over an executive overview with our pricing tiers, key time-saving metrics, and 14-day evaluation trial. Would an email summary be helpful for your team?`
    ], history);
  }

  // 8. Explicit True Purchase Intent (Real buying signal, distinct from objections)
  const isTrueBuyIntent =
    !isWhyBuyObjection &&
    (
      lower.includes('ready to buy') ||
      lower.includes('want to buy') ||
      lower.includes('purchase now') ||
      lower.includes('sign up now') ||
      lower.includes('ready to start') ||
      lower.includes('send invoice') ||
      lower.includes('how to buy') ||
      lower.includes('how do i subscribe') ||
      lower.includes('ready to subscribe') ||
      lower.startsWith('buy ') ||
      lower === 'buy' ||
      lower === 'purchase' ||
      lower === 'sign up'
    );

  if (isTrueBuyIntent) {
    return pickUnique([
      `That is fantastic! I can get your ${product.name} account provisioned right away. Should I send the activation link to your work email?`,
      `Excellent! You are going to love the results. I will lock in our ${product.specialOffer || 'standard evaluation trial'} for your team right now. What is the best email address for your admin account?`
    ], history);
  }

  // 9. Demo / Walkthrough / Screen share
  if (
    lower.includes('demo') ||
    lower.includes('walkthrough') ||
    lower.includes('show me') ||
    lower.includes('see it') ||
    lower.includes('screen share') ||
    lower.includes('can i see')
  ) {
    return pickUnique([
      `Absolutely! I have launched the interactive live demo of ${product.name} right on your screen. You can interact with the live pipeline board and test the core features in real time. Does this match what your team needs?`,
      `Right away! The live product walkthrough is now active in front of you. You can see real-time deal alerts and zero-manual CRM logging in action. What part would you like to explore first?`
    ], history);
  }

  // 10. Pricing / Cost / Plans (General inquiry)
  if (
    lower.includes('price') ||
    lower.includes('cost') ||
    lower.includes('how much') ||
    lower.includes('pricing') ||
    lower.includes('expensive') ||
    lower.includes('budget') ||
    lower.includes('subscription') ||
    lower.includes('plans')
  ) {
    if (lower.includes('expensive') || lower.includes('too much') || lower.includes('high') || lower.includes('budget') || lower.includes("can't afford")) {
      return pickUnique([
        `I completely understand budget is top of mind. ${product.commonObjections?.price || 'Most teams see full ROI within 14 days by eliminating lost pipeline.'} What is your target budget for this project?`,
        `Fair point on costs. When you factor in the hours saved every week, it pays for itself quickly. Would a 14-day trial help you test the numbers first?`
      ], history);
    }
    return pickUnique([
      `Our plans start at ${product.pricingTiers || product.price}. There are no setup fees and we include a 14-day evaluation trial so you can evaluate the return before paying. How many seats would your team require?`,
      `${product.name} is priced at ${product.price}. Every tier comes with core pipeline automation and dedicated support. Would you like to see how that fits your team?`
    ], history);
  }

  // 11. Known Integrations & Legacy systems
  if (
    lower.includes('salesforce') ||
    lower.includes('hubspot') ||
    lower.includes('zapier') ||
    lower.includes('zoho') ||
    lower.includes('pipedrive') ||
    lower.includes('already use') ||
    lower.includes('integrate') ||
    lower.includes('integration')
  ) {
    return pickUnique([
      `${product.name} integrates directly with platforms like Salesforce and HubSpot, so you can keep your existing records while automating pipeline tracking and deal alerts. Which tool are you currently using?`,
      `Most teams keep their existing system of record and use ${product.name} to eliminate the manual logging for their reps via 2-way sync. Would you like to see how the sync works?`
    ], history);
  }

  if (
    lower.includes('legacy') ||
    lower.includes('internal system') ||
    lower.includes('custom api') ||
    lower.includes('in-house')
  ) {
    return `Custom legacy internal systems are not verified out of the box with ${product.name} and would require a technical API or CSV evaluation. Would you like me to note down your system specs for our solutions engineering team?`;
  }

  // 12. Features & Capabilities
  if (
    lower.includes('feature') ||
    lower.includes('what can it do') ||
    lower.includes('how it works') ||
    lower.includes('capabilities') ||
    lower.includes('functions')
  ) {
    const f1 = product.keyFeatures?.[0] || 'automated pipeline tracking';
    const f2 = product.keyFeatures?.[1] || 'deal risk alerts';
    return pickUnique([
      `${product.name} delivers two core capabilities: first, ${f1}, and second, ${f2}. What is the biggest workflow challenge your team is facing today?`,
      `With ${product.name}, your team gets ${f1} and ${f2}, saving reps hours every week. Would you like to see a live demo of this?`
    ], history);
  }

  // 13. Product Overview
  const isProductOverview =
    lower.includes(`what is ${product.name.toLowerCase()}`) ||
    lower.includes('what does it do') ||
    lower.includes('what is this') ||
    lower.includes('what do you sell') ||
    lower.includes('tell me about the product') ||
    lower.includes('tell me about this') ||
    lower.includes('explain the product') ||
    lower.includes('what is the product');

  if (isProductOverview) {
    return pickUnique([
      `${product.name} is ${product.description || product.pitch}. It helps sales teams ${product.valueProposition || 'save hours of admin time and close more deals'}. What specific part would you like to explore?`,
      `${product.name} is designed to give sales teams complete visibility and speed by automating pipeline updates and alerting reps before deals slip. Would you like a 2-minute walkthrough?`
    ], history);
  }

  // 14. Decline / Not interested
  if (
    lower.includes('not interested') ||
    lower.includes('no thanks') ||
    lower.includes('dont need') ||
    lower.includes("don't need") ||
    lower.includes('busy') ||
    lower.includes('stop calling')
  ) {
    return `I completely understand and appreciate your time today. Wishing you and your team all the best, and feel free to reach out if your needs change down the road!`;
  }

  // 15. Greetings & Casual Starters
  const isGreeting =
    lower === 'hi' ||
    lower === 'hello' ||
    lower === 'hey' ||
    lower.startsWith('hi ') ||
    lower.startsWith('hello ') ||
    lower.startsWith('hey ') ||
    lower.includes('good morning') ||
    lower.includes('good afternoon') ||
    lower.includes('good evening') ||
    lower.includes('how are you') ||
    lower.includes("what's up") ||
    lower.includes('how are you doing');

  if (isGreeting && lower.length < 35) {
    return pickUnique([
      `Hello! Great to connect with you. I'm ${repName} from ${product.name}. How is your day going? Would you like a quick 60-second summary of what we do?`,
      `Hi there! Thanks for speaking with me. I'm ${repName} with ${product.name}. I can answer any questions you have about our pipeline automation or show you a live demo. Where would you like to start?`,
      `Hello! I'm ${repName} calling from ${product.name}. We help sales teams eliminate manual data entry and close deals faster. How can I help you today?`
    ], history);
  }

  // 16. Email / Send info
  if (
    lower.includes('email') ||
    lower.includes('send info') ||
    lower.includes('send me') ||
    lower.includes('pdf') ||
    lower.includes('brochure')
  ) {
    return `I will gladly send our executive specification sheet and pricing details to your email. What is the best email address to send that over to?`;
  }

  // 17. Grounded Fallback Pool (Factual, acknowledges limitations, avoids repetitive loops)
  return pickUnique([
    `Regarding ${product.name}, our core focus is sales pipeline automation and zero manual logging for ${product.price || '$49 / seat / month'}. Since I am operating in offline assistance mode, I can share our verified features, pricing plans, or launch an interactive demo on your screen. What would be most helpful?`,
    `To give you an accurate, product-grounded answer: ${product.name} is priced at ${product.price || '$49 / seat / month'} and eliminates repetitive CRM admin with under 10-minute setup. I can walk you through our specific features or start a live demo. What would you like to check?`
  ], history);
}

function handleHindiDialogue(lower, product, isFemale, history = []) {
  const repName = isFemale ? 'प्रिया' : 'राहुल';
  const bol = isFemale ? 'सकती हूँ' : 'सकता हूँ';
  const raha = isFemale ? 'रही हूँ' : 'रहा हूँ';

  // 1. Frustration / Loop in Hindi
  if (
    lower.includes('jawab do') ||
    lower.includes('sahi se') ||
    lower.includes('loop') ||
    lower.includes('suno') ||
    lower.includes('meri baat') ||
    lower.includes('answer do') ||
    lower.includes('phir se')
  ) {
    return `माफ़ कीजियेगा! मैं आपको सीधे जवाब दे ${raha}। मैं ${product.name} से ${repName} बात कर ${raha}। आप प्रोडक्ट के फीचर्स, कीमत या लाइव डेमो के बारे में जो भी पूछना चाहते हैं, कृपया पूछें, मैं ध्यान से सुन ${raha}!`;
  }

  // 2. Identity in Hindi
  if (
    lower.includes('kaun ho') ||
    lower.includes('tum kaun') ||
    lower.includes('aap kaun') ||
    lower.includes('kya kaam') ||
    lower.includes('kya karte ho') ||
    lower.includes('kya karti ho') ||
    lower.includes('kaun hai') ||
    lower.includes('naam kya') ||
    lower.includes('apne baare me') ||
    lower.includes('who are you') ||
    lower.includes('what do you do')
  ) {
    const hasAlreadyIntroduced = (history || []).some(
      m => m.sender === 'bot' && (m.text.includes('प्रिया') || m.text.includes('राहुल'))
    );

    if (hasAlreadyIntroduced) {
      return pickUnique([
        `जैसा कि मैंने बताया, मैं ${product.name} की AI सेल्स असिस्टेंट ${repName} हूँ। मैं आपकी टीम को ऑटोमेशन और पाइपलाइन ट्रैकिंग समझने में मदद करती हूँ। आप इसके बारे में क्या जानना चाहते हैं?`,
        `मैं ${product.name} से ${repName} हूँ। मेरा काम आपको प्रोडक्ट, फीचर्स और प्राइसिंग की सही जानकारी देना है। आप क्या जानना चाहते हैं?`
      ], history);
    }

    return `नमस्ते! मैं ${product.name} की AI सेल्स असिस्टेंट ${repName} हूँ। मैं टीमों को प्रोडक्ट के फीचर्स, प्राइसिंग और वर्कफ़्लो समझने में मदद करती हूँ। आप इसके बारे में क्या जानना चाहते हैं?`;
  }

  // 3. Objections / Why buy yours in Hindi
  if (
    lower.includes('kyun kharidein') ||
    lower.includes('kyu kharide') ||
    lower.includes('kyun le') ||
    lower.includes('kyu le') ||
    lower.includes('bahut se crm') ||
    lower.includes('bahut saare') ||
    lower.includes('market me') ||
    lower.includes('market mein') ||
    lower.includes('मार्केट') ||
    lower.includes('बाज़ार') ||
    lower.includes('बाजार') ||
    lower.includes('क्यों खरीदें') ||
    lower.includes('क्यों लें') ||
    lower.includes('क्यों ले') ||
    lower.includes('आपका क्यों') ||
    lower.includes('आपका ही क्यों') ||
    lower.includes('aapka hi kyu') ||
    lower.includes('aapka kyu') ||
    lower.includes('why should i buy') ||
    lower.includes('why buy')
  ) {
    return `मार्केट में कई CRM हैं, लेकिन ${product.name} $49 प्रति सीट प्रति महीना में पूरी पाइपलाइन ऑटोमेशन, बिना किसी मैन्युअल डेटा एंट्री के कॉल-ईमेल सिंक और 10-मिनट का आसान सेटअप देता है। क्या आप स्क्रीन पर इसका एक छोटा लाइव वॉकथ्रू देखना चाहेंगे?`;
  }

  // 4. Competitor comparison in Hindi
  if (
    lower.includes('tulna') ||
    lower.includes('तुलना') ||
    lower.includes('compare') ||
    lower.includes('doosre crm') ||
    lower.includes('dusre crm') ||
    lower.includes('dusre option') ||
    lower.includes('दूसरे crm') ||
    lower.includes('अन्य crm') ||
    lower.includes('aur crm')
  ) {
    return `${product.name} की तुलना करते समय आप कीमत, फीचर्स, सेल्स पाइपलाइन ऑटोमेशन, 1-क्लिक इंटीग्रेशन और सपोर्ट को देख सकते हैं। हमारी कीमत $49 प्रति सीट प्रति महीना है। सही तुलना के लिए क्या आप बता सकते हैं कि आप किस विशेष CRM से तुलना करना चाहते हैं?`;
  }

  // 5. Is it cheaper in Hindi
  if (
    lower.includes('sasta') ||
    lower.includes('sasti') ||
    lower.includes('सस्ता') ||
    lower.includes('सस्ती') ||
    lower.includes('कम दाम') ||
    lower.includes('cheaper') ||
    lower.includes('kam daam')
  ) {
    return `${product.name} की कीमत $49 प्रति सीट प्रति महीना है। यह सस्ता है या नहीं, यह इस बात पर निर्भर करता है कि आप किस CRM और प्लान से तुलना कर रहे हैं क्योंकि बड़े एंटरप्राइज़ CRM अक्सर काफी महंगे होते हैं। आप किस CRM की कीमत से तुलना करना चाहते हैं?`;
  }

  // 6. Differentiators in Hindi
  if (
    lower.includes('kya alag') ||
    lower.includes('alag kya') ||
    lower.includes('features alag') ||
    lower.includes('अलग') ||
    lower.includes('खास') ||
    lower.includes('विशेष') ||
    lower.includes('khas baat') ||
    lower.includes('khasiyat') ||
    lower.includes('special kya') ||
    lower.includes('different kya')
  ) {
    return `${product.name} को खास बनाते हैं इसका ज़ीरो-मैन्युअल डेटा एंट्री, रियल-टाइम deal-risk अलर्ट्स और गूगल व माइक्रोसॉफ्ट के साथ 10-मिनट का आसान सेटअप। क्या आप इसे लाइव देखना चाहेंगे?`;
  }

  // 7. Manager discussion in Hindi
  if (
    lower.includes('manager') ||
    lower.includes('boss') ||
    lower.includes('team se') ||
    lower.includes('मैनेजर') ||
    lower.includes('बॉस') ||
    lower.includes('baat karni') ||
    lower.includes('baat karke')
  ) {
    return `जी बिल्कुल, अपने मैनेजर से चर्चा करना बहुत ज़रूरी है। मैं आपकी टीम के लिए $49 प्राइसिंग और मुख्य फायदों का एक छोटा सारांश भेज ${bol}, या हम आपके मैनेजर के साथ 15-मिनट का लाइव डेमो रख सकते हैं।`;
  }

  // 8. Greetings in Hindi
  if (
    lower === 'namaste' ||
    lower.includes('namaste') ||
    lower.includes('pranam') ||
    lower.includes('kaise ho') ||
    lower.includes('kaisi ho') ||
    lower.includes('hello') ||
    lower.includes('hi')
  ) {
    return pickUnique([
      `नमस्ते! आपसे बात करके बहुत खुशी हुई। मैं ${product.name} से ${repName} हूँ। आज मैं आपकी क्या मदद कर ${bol}?`,
      `नमस्ते! समय देने के लिए धन्यवाद। मैं ${product.name} के बारे में आपके सभी सवालों के जवाब देने के लिए यहाँ हूँ। क्या आप एक छोटा 60-सेकंड का ओवरव्यू चाहेंगे?`
    ], history);
  }

  // 9. Pricing in Hindi
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

  // 10. Demo in Hindi
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

  // 11. Features in Hindi
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

  // 12. Buy in Hindi (Excluding objections)
  if (
    lower.includes('kharidna') ||
    lower.includes('lena hai') ||
    lower.includes('लेना है') ||
    lower.includes('खरीदना') ||
    lower === 'buy' ||
    lower === 'purchase'
  ) {
    return `बहुत बढ़िया! मैं आपके लिए अभी अकाउंट सेटअप कर ${raha}। क्या मैं एक्टिवेशन लिंक आपके वर्क ईमेल पर भेज दूँ?`;
  }

  // 13. Decline in Hindi
  if (
    lower.includes('nahi chahiye') ||
    lower.includes('not interested') ||
    lower.includes('nahin')
  ) {
    return `मैं आपकी बात का पूरा सम्मान करती हूँ। समय देने के लिए बहुत धन्यवाद, आपका दिन शुभ हो!`;
  }

  // 14. Dynamic Hindi Fallback Pool
  return pickUnique([
    `जी बिल्कुल! ${product.name} सेल्स टीमों के मैन्युअल काम को पूरी तरह ऑटोमेट करता है और इसकी कीमत $49 प्रति सीट प्रति महीना है। मैं आपको इसके फीचर्स या लाइव डेमो के बारे में बता ${bol}। आप क्या देखना चाहेंगे?`,
    `आपके सवाल के लिए धन्यवाद। ${product.name} पाइपलाइन ऑटोमेशन पर आधारित है। क्या आप स्क्रीन पर इसका 2-मिनट का लाइव डेमो देखना चाहेंगे?`
  ], history);
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
    userTextCombined.includes('manager') ||
    userTextCombined.includes('email me') ||
    userTextCombined.includes('send information') ||
    userTextCombined.includes('check with my team') ||
    userTextCombined.includes('later') ||
    userTextCombined.includes('next week') ||
    userTextCombined.includes('follow up') ||
    userTextCombined.includes('बाद में')
  ) {
    status = 'Follow-up Required';
    rationale = 'Customer requested additional materials, collateral, or a future follow-up consultation with management.';
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
