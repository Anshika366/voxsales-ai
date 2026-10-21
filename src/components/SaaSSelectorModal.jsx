import React, { useState } from 'react';
import { X, Check, Plus, Layers } from 'lucide-react';

export default function SaaSSelectorModal({
  isOpen,
  onClose,
  products,
  selectedProduct,
  onSelectProduct,
  onAddCustomProduct
}) {
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [customForm, setCustomForm] = useState({
    name: '',
    tagline: '',
    category: 'Custom SaaS',
    price: '$99 / month',
    pitch: '',
    keyFeatures: ['', '', ''],
    specialOffer: '14-day risk-free trial + personalized onboarding'
  });

  if (!isOpen) return null;

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customForm.name.trim() || !customForm.pitch.trim()) return;

    const newProduct = {
      id: `custom-${Date.now()}`,
      name: customForm.name.trim(),
      tagline: customForm.tagline.trim() || 'Modern SaaS Solution',
      category: customForm.category || 'Software',
      price: customForm.price.trim() || '$99 / month',
      pricingTiers: customForm.price.trim(),
      pitch: customForm.pitch.trim(),
      keyFeatures: customForm.keyFeatures.filter(f => f.trim().length > 0),
      valueProposition: customForm.tagline || customForm.name,
      specialOffer: customForm.specialOffer || '14-day trial',
      commonObjections: {
        price: 'Our clients typically see full ROI within the first month of adoption.',
        competitors: 'Our architecture is built specifically for agility and rapid time to value.',
        time: 'Setup takes under 15 minutes.'
      }
    };

    onAddCustomProduct(newProduct);
    onSelectProduct(newProduct);
    setIsCreatingCustom(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#111827] border border-[#263247] rounded-3xl shadow-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#263247] bg-[#161F30]/60">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-violet-400" />
            <h3 className="text-base font-bold text-white tracking-tight">Select SaaS Product to Sell</h3>
          </div>
          <button
            onClick={onClose}
            className="btn-icon text-slate-400 hover:text-white"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {!isCreatingCustom ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Choose which SaaS product the AI sales agent will pitch and close during calls.
                </p>
                <button
                  onClick={() => setIsCreatingCustom(true)}
                  className="btn-base btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 text-violet-300 border-violet-500/30 hover:border-violet-500/50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Custom SaaS</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {products.map((p) => {
                  const isSelected = selectedProduct.id === p.id;
                  return (
                    <div
                      key={p.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        onSelectProduct(p);
                        onClose();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectProduct(p);
                          onClose();
                        }
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-violet-500 active:scale-[0.99] ${
                        isSelected
                          ? 'bg-violet-950/40 border-violet-500 ring-1 ring-violet-500/30'
                          : 'bg-[#161F30]/40 border-[#263247] hover:border-violet-500/40 hover:bg-[#161F30]/70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{p.name}</span>
                            <span className="text-[10px] font-mono text-violet-300 bg-violet-950/80 px-2 py-0.5 rounded-md border border-violet-800/40">
                              {p.price}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 font-medium">{p.tagline}</p>
                          <p className="text-xs text-slate-400 line-clamp-2 mt-1">{p.pitch}</p>
                        </div>

                        <div className={`p-1.5 rounded-full border ${isSelected ? 'bg-violet-600 border-violet-400 text-white' : 'border-[#263247] text-transparent'}`}>
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#263247]">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Configure Custom SaaS Product</span>
                <button
                  type="button"
                  onClick={() => setIsCreatingCustom(false)}
                  className="btn-base btn-ghost text-xs py-1 px-2.5"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={customForm.name}
                    onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                    placeholder="e.g. DataPulse AI"
                    className="input-base w-full py-1.5 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Pricing *</label>
                  <input
                    type="text"
                    required
                    value={customForm.price}
                    onChange={(e) => setCustomForm({ ...customForm, price: e.target.value })}
                    placeholder="e.g. $79 / month"
                    className="input-base w-full py-1.5 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Tagline / Subtitle</label>
                <input
                  type="text"
                  value={customForm.tagline}
                  onChange={(e) => setCustomForm({ ...customForm, tagline: e.target.value })}
                  placeholder="e.g. Real-Time Customer Analytics Platform"
                  className="input-base w-full py-1.5 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Elevator Sales Pitch *</label>
                <textarea
                  rows={2}
                  required
                  value={customForm.pitch}
                  onChange={(e) => setCustomForm({ ...customForm, pitch: e.target.value })}
                  placeholder="e.g. DataPulse AI unifies product analytics and sends predictive churn alerts directly into Slack, saving 15 hours weekly."
                  className="input-base w-full py-1.5 text-xs resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Top 3 Key Features</label>
                {[0, 1, 2].map((idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={customForm.keyFeatures[idx]}
                    onChange={(e) => {
                      const updated = [...customForm.keyFeatures];
                      updated[idx] = e.target.value;
                      setCustomForm({ ...customForm, keyFeatures: updated });
                    }}
                    placeholder={`Feature ${idx + 1}`}
                    className="input-base w-full py-1.5 text-xs"
                  />
                ))}
              </div>

              <button
                type="submit"
                className="btn-base btn-primary w-full py-2.5 text-xs"
              >
                Save & Activate Custom SaaS
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
