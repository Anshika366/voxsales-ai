import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Play,
  RotateCcw,
  Mail,
  Shield,
  Zap,
  Sparkles,
  TrendingUp,
  Check
} from 'lucide-react';

export default function LiveProductDemoModal({
  product,
  onClose,
  onClaimTrial
}) {
  const [syncStatus, setSyncStatus] = useState('Idle');
  const [syncedCount, setSyncedCount] = useState(14);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [testCadenceSent, setTestCadenceSent] = useState(false);
  const [trialClaimed, setTrialClaimed] = useState(false);

  const [omniFlowRunning, setOmniFlowRunning] = useState(false);
  const [omniStep, setOmniStep] = useState(0);

  const [cyberThreatBlocked, setCyberThreatBlocked] = useState(false);
  const [cyberSimulating, setCyberSimulating] = useState(false);

  if (!product) return null;

  const handleSimulateSync = () => {
    setSyncStatus('Syncing Google Workspace & Microsoft 365...');
    setTimeout(() => {
      setSyncedCount(prev => prev + 5);
      setSyncStatus('Completed (19 interactions synced in 140ms)');
      setTimeout(() => setSyncStatus('Idle'), 3000);
    }, 800);
  };

  const handleTriggerCadence = () => {
    setTestCadenceSent(true);
    setTimeout(() => setTestCadenceSent(false), 4000);
  };

  const handleRunOmniFlow = () => {
    setOmniFlowRunning(true);
    setOmniStep(1);
    setTimeout(() => {
      setOmniStep(2);
      setTimeout(() => {
        setOmniStep(3);
        setTimeout(() => {
          setOmniFlowRunning(false);
        }, 1200);
      }, 1000);
    }, 800);
  };

  const handleSimulateCyberAttack = () => {
    setCyberSimulating(true);
    setCyberThreatBlocked(false);
    setTimeout(() => {
      setCyberSimulating(false);
      setCyberThreatBlocked(true);
    }, 700);
  };

  const handleClaimTrialClick = () => {
    setTrialClaimed(true);
    if (onClaimTrial) onClaimTrial(product);
  };

  const sampleDeals = [
    {
      id: 'd1',
      company: 'Acme Enterprises',
      value: '$48,000',
      stage: 'Discovery Scheduled',
      risk: 'Low Risk',
      riskColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      rep: 'Sarah M.',
      activity: '3 emails, 1 meeting auto-logged'
    },
    {
      id: 'd2',
      company: 'Starlight Digital Media',
      value: '$24,500',
      stage: 'Proposal Under Review',
      risk: 'Slippage Alert',
      riskColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      rep: 'Alex R.',
      activity: 'Follow-up email cadence due today'
    },
    {
      id: 'd3',
      company: 'Apex Financial Services',
      value: '$96,000',
      stage: 'Final Negotiation',
      risk: 'High Intent',
      riskColor: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
      rep: 'Sarah M.',
      activity: 'Contract viewed 4x via secure portal'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#111827] border border-[#263247] rounded-3xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
        <div className="p-4 px-6 border-b border-[#263247] bg-[#161F30]/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/30">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white tracking-tight">{product.name}</h3>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Interactive Walkthrough
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{product.tagline}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-icon text-slate-400 hover:text-white"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {trialClaimed ? (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 to-teal-950/40 border border-emerald-500/40 text-center space-y-3 shadow-xl">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-extrabold text-white">30-Day Extended Evaluation Provisioned!</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Your workspace is ready with complimentary 1-click migration from Salesforce or HubSpot. An activation link and executive onboarding packet have been queued.
              </p>
              <button
                onClick={() => setTrialClaimed(false)}
                className="btn-base btn-secondary py-2 px-4 text-xs font-bold"
              >
                Back to Live Walkthrough
              </button>
            </div>
          ) : (
            <>
              {product.id === 'flowdesk' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] shadow-inner space-y-1">
                      <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Active Pipeline Value</span>
                      <div className="text-xl font-extrabold text-white">$168,500</div>
                      <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" /> +28% closing speed
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] shadow-inner space-y-1">
                      <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Zero-Manual CRM Sync</span>
                      <div className="text-xl font-extrabold text-white">{syncedCount} Synced Today</div>
                      <span className="text-[11px] text-violet-300 font-mono">Calls, Emails & Meetings</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] shadow-inner space-y-1">
                      <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Deal Risk Monitor</span>
                      <div className="text-xl font-extrabold text-emerald-400">0 Critical Risks</div>
                      <span className="text-[11px] text-slate-400 font-medium">Predictive AI alerts active</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSimulateSync}
                        className="btn-base btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Simulate 2-Way Sync</span>
                      </button>

                      <button
                        onClick={handleTriggerCadence}
                        className="btn-base btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5 text-violet-400" />
                        <span>Test 1-Click Email Cadence</span>
                      </button>
                    </div>

                    {syncStatus !== 'Idle' && (
                      <span className="text-xs font-mono text-emerald-400 font-bold animate-pulse">
                        {syncStatus}
                      </span>
                    )}

                    {testCadenceSent && (
                      <span className="text-xs font-mono text-violet-300 font-bold bg-violet-950/60 px-2.5 py-1 rounded-lg border border-violet-800/40">
                        Personalized cadence sent to 3 high-value accounts!
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono block">
                      Live CRM Deal Board (Interactive):
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {sampleDeals.map((deal) => (
                        <div
                          key={deal.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => setSelectedDeal(deal)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedDeal(deal);
                            }
                          }}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-violet-500 active:scale-[0.99] ${
                            selectedDeal?.id === deal.id
                              ? 'bg-violet-950/40 border-violet-500 ring-1 ring-violet-500/30'
                              : 'bg-white/[0.03] border-white/[0.08] hover:border-violet-500/40 hover:bg-white/[0.05]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-white">{deal.company}</span>
                            <span className="text-xs font-extrabold text-emerald-400 font-mono">{deal.value}</span>
                          </div>

                          <div className="space-y-1.5 text-[11px]">
                            <div className="flex items-center justify-between text-slate-400">
                              <span>Stage:</span>
                              <span className="text-slate-200 font-medium">{deal.stage}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Status:</span>
                              <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold border ${deal.riskColor}`}>
                                {deal.risk}
                              </span>
                            </div>
                            <div className="pt-2 border-t border-white/[0.06] text-slate-400 font-mono text-[10px] flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>{deal.activity}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {product.id === 'omniflow' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Autonomous Enterprise Pipeline Canvas</span>
                      <button
                        onClick={handleRunOmniFlow}
                        disabled={omniFlowRunning}
                        className="btn-base btn-primary text-xs py-1.5 px-3.5 flex items-center gap-2"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{omniFlowRunning ? 'Executing Pipeline...' : 'Run Test Autonomous Flow'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className={`p-3.5 rounded-xl border text-xs space-y-1 transition-all ${
                        omniStep >= 1 ? 'bg-violet-950/50 border-violet-500 text-white shadow-md' : 'bg-white/[0.02] border-white/[0.06] text-slate-400'
                      }`}>
                        <span className="font-mono text-[10px] font-bold text-violet-400">Step 1</span>
                        <div className="font-bold">Webhook Trigger Received</div>
                        <p className="text-[11px] text-slate-300">Ingested vendor invoice PDF via cloud hook</p>
                      </div>

                      <div className={`p-3.5 rounded-xl border text-xs space-y-1 transition-all ${
                        omniStep >= 2 ? 'bg-emerald-950/50 border-emerald-500 text-white shadow-md' : 'bg-white/[0.02] border-white/[0.06] text-slate-400'
                      }`}>
                        <span className="font-mono text-[10px] font-bold text-emerald-400">Step 2</span>
                        <div className="font-bold">Autonomous Data Extraction</div>
                        <p className="text-[11px] text-slate-300">Extracted $14,250 line items with 99.8% precision</p>
                      </div>

                      <div className={`p-3.5 rounded-xl border text-xs space-y-1 transition-all ${
                        omniStep >= 3 ? 'bg-blue-950/50 border-blue-500 text-white shadow-md' : 'bg-white/[0.02] border-white/[0.06] text-slate-400'
                      }`}>
                        <span className="font-mono text-[10px] font-bold text-blue-400">Step 3</span>
                        <div className="font-bold">ERP Reconciliation Complete</div>
                        <p className="text-[11px] text-slate-300">NetSuite & Slack notified in 380ms total runtime</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {product.id === 'cyberarmor' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-400" />
                        <span className="text-xs font-bold text-white">Live Identity Threat Detection & Cloud Perimeter</span>
                      </div>
                      <button
                        onClick={handleSimulateCyberAttack}
                        disabled={cyberSimulating}
                        className="btn-base btn-destructive text-xs py-1.5 px-3.5 flex items-center gap-2"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>{cyberSimulating ? 'Simulating Attack Vector...' : 'Simulate Privilege Escalation'}</span>
                      </button>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.08] font-mono text-xs space-y-2">
                      <div className="text-slate-400 flex items-center justify-between">
                        <span>AWS Account: 8492-3810-4491 (Agentless IAM Read-Only)</span>
                        <span className="text-emerald-400 font-bold">Continuous SOC2: 99.8%</span>
                      </div>

                      {cyberThreatBlocked ? (
                        <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center justify-between">
                          <span>[THREAT NEUTRALIZED] Rogue IAM AssumeRole isolated in 14ms</span>
                          <span className="font-bold">Zero Impact</span>
                        </div>
                      ) : (
                        <div className="text-slate-500 text-[11px]">
                          Perimeter telemetry active. Sub-50ms isolation standing by...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-purple-950/40 border border-violet-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                <div className="space-y-0.5">
                  <div className="text-xs font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Special Incentive: {product.specialOffer || '14-Day Risk-Free Trial'}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Pricing starts at {product.pricingTiers || product.price}. Zero credit card required to test.
                  </p>
                </div>

                <button
                  onClick={handleClaimTrialClick}
                  className="btn-base text-xs font-bold py-2.5 px-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Activate 30-Day Extended Trial</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
