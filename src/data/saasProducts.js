export const DEFAULT_SAAS_PRODUCTS = [
  {
    id: 'flowdesk',
    name: 'FlowDesk CRM',
    isDemo: true,
    tagline: 'Automated CRM Pipeline for High-Growth Sales Teams',
    category: 'Sales & CRM',
    price: '$49 / seat / month',
    pricingTiers: 'Starter at $29/seat, Growth at $49/seat, Enterprise at $89/seat',
    description: 'FlowDesk CRM automates sales pipeline tracking, syncs multi-channel customer communications, and provides real-time deal closing intelligence.',
    keyFeatures: [
      'Automatic call, email, and meeting sync with zero manual logging',
      'Deal-risk alerts and automated pipeline revenue forecasting',
      'One-click personalized email cadences and LinkedIn sequences'
    ],
    pitch: 'FlowDesk CRM gives your sales team unfair speed by eliminating manual data entry and warning reps before high-value deals slip, increasing quota attainment by 28%.',
    valueProposition: 'Eliminate 5 hours of manual CRM updates per rep each week while speeding up sales velocity.',
    specialOffer: '14-day standard evaluation trial',
    faqs: [
      { q: 'How long does setup take?', a: 'Under 10 minutes with native 1-click Google Workspace and Microsoft 365 integrations.' },
      { q: 'Can we import from existing CRM?', a: 'Yes, full automated 2-way sync with HubSpot, Salesforce, and CSV data.' }
    ],
    commonObjections: {
      price: 'At $49 a seat, closing just one additional deal per quarter completely pays for your annual team subscription.',
      competitors: 'Unlike legacy bloated CRMs, FlowDesk is lightweight, fast, and does the manual logging for your reps automatically.',
      time: 'Migration takes under 15 minutes with our automated CRM data ingestion wizard.'
    },
    comparisonPoints: 'When comparing CRMs, evaluate price, core features, sales pipeline automation, native integrations, ease of use, and support. FlowDesk costs $49/seat/month ($29 Starter, $89 Enterprise), eliminates 5 hours of manual logging per rep weekly, and sets up in under 10 minutes.',
    keyDifferentiators: 'Zero-manual data entry via automatic activity logging, real-time deal-risk alerts with pipeline forecasting, and transparent per-seat pricing with dedicated support included.'
  },
  {
    id: 'omniflow',
    name: 'OmniFlow AI',
    isDemo: true,
    tagline: 'Autonomous Enterprise Workflow & Operations Platform',
    category: 'Operations',
    price: '$199 / month',
    pricingTiers: 'Starter at $99/mo, Pro at $199/mo, Enterprise custom',
    description: 'OmniFlow replaces brittle manual business processes with autonomous software agents that run 24/7 across your enterprise software stack.',
    keyFeatures: [
      'Task execution across 500+ cloud business apps',
      'Intelligent document extraction & automated financial ETL',
      'Zero-code workflow canvas with SOC2 enterprise governance'
    ],
    pitch: 'OmniFlow eliminates repetitive operational busywork by deploying autonomous digital workers, saving enterprise teams over 70 hours of manual labor every month.',
    valueProposition: 'Cut operational bottlenecks by 80% with enterprise autonomous agents.',
    specialOffer: '14-day risk-free pilot + complimentary architecture consultation',
    faqs: [
      { q: 'Does it require coding?', a: 'No, build complex pipelines visually or via plain English instructions.' }
    ],
    commonObjections: {
      price: 'At $199/month, saving 20 engineering hours in your first week provides an immediate 10x ROI.',
      competitors: 'Unlike Zapier or Make, OmniFlow handles unexpected data exceptions and complex reasoning automatically.',
      time: 'Pre-built workflow templates allow you to launch production automations in minutes.'
    }
  },
  {
    id: 'cyberarmor',
    name: 'CyberArmor Cloud',
    isDemo: true,
    tagline: 'Cloud Workload & Identity Threat Shield',
    category: 'Security',
    price: '$299 / month',
    pricingTiers: 'Core at $149/mo, Shield Pro at $299/mo, Enterprise Shield at $599/mo',
    description: 'CyberArmor continuously monitors cloud infrastructure, detecting identity compromises and isolating unauthorized access attempts in milliseconds.',
    keyFeatures: [
      'Real-time behavioral identity threat detection (ITDR)',
      'Automated SOC2, HIPAA, and ISO 27001 continuous compliance auditing',
      'Sub-second incident isolation with zero impact on production workloads'
    ],
    pitch: 'CyberArmor neutralizes unauthorized lateral movement in your cloud perimeter before data breach occurs, providing audit-ready compliance in a single agentless setup.',
    valueProposition: 'Agentless cloud security with continuous compliance guarantees.',
    specialOffer: 'Complimentary cloud security risk assessment included with every evaluation',
    faqs: [
      { q: 'Is an agent required on servers?', a: '100% agentless setup via read-only cloud IAM roles.' }
    ],
    commonObjections: {
      price: 'The average enterprise breach costs $4.45M. CyberArmor costs $299/month and includes continuous compliance audit proof.',
      competitors: 'Traditional SIEMs produce endless false positives. CyberArmor stops threats in under 50ms.',
      time: 'Connects to AWS, Azure, or GCP in under 10 minutes.'
    }
  }
];

export const VOICE_PERSONAS = [
  {
    id: 'female',
    name: 'Sarah',
    gender: 'female',
    hindiName: 'प्रिया',
    title: 'Senior Account Executive',
    pitch: 1.08,
    rate: 1.0,
    avatarColor: 'from-violet-600 to-fuchsia-600',
    description: 'Warm, consultative, empathetic tone'
  },
  {
    id: 'male',
    name: 'Alex',
    gender: 'male',
    hindiName: 'राहुल',
    title: 'Sales Director',
    pitch: 0.93,
    rate: 1.0,
    avatarColor: 'from-indigo-600 to-blue-600',
    description: 'Confident, direct, analytical tone'
  }
];

export const LANGUAGES = [
  { code: 'en-US', name: 'English', flag: 'EN', recognitionLang: 'en-US', sampleVoice: 'en-US' },
  { code: 'hi-IN', name: 'Hindi (हिन्दी)', flag: 'HI', recognitionLang: 'hi-IN', sampleVoice: 'hi-IN' }
];

export const SALES_STATUSES = [
  {
    id: 'Converted',
    label: 'Converted',
    color: '#22C55E',
    bg: 'rgba(34, 197, 94, 0.12)',
    border: 'rgba(34, 197, 94, 0.28)',
    desc: 'Customer explicitly agreed to purchase or subscribe'
  },
  {
    id: 'Interested',
    label: 'Interested',
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.12)',
    border: 'rgba(59, 130, 246, 0.28)',
    desc: 'Expressed strong interest but needs further review'
  },
  {
    id: 'Demo Requested',
    label: 'Demo Requested',
    color: '#8B5CF6',
    bg: 'rgba(139, 92, 246, 0.12)',
    border: 'rgba(139, 92, 246, 0.28)',
    desc: 'Customer requested a live product walkthrough or meeting'
  },
  {
    id: 'Follow-up Required',
    label: 'Follow-up Required',
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.28)',
    desc: 'Prospect wants future contact, proposal, or team review'
  },
  {
    id: 'Not Interested',
    label: 'Not Interested',
    color: '#94A3B8',
    bg: 'rgba(148, 163, 184, 0.12)',
    border: 'rgba(148, 163, 184, 0.28)',
    desc: 'Prospect explicitly declined the offer'
  },
  {
    id: 'No Response',
    label: 'No Response',
    color: '#64748B',
    bg: 'rgba(100, 116, 139, 0.12)',
    border: 'rgba(100, 116, 139, 0.28)',
    desc: 'Call ended prematurely with no substantive dialogue'
  }
];
