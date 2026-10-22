import React, { useState } from 'react';
import {
  Check,
  Edit3,
  ArrowRight,
  Zap,
  X,
  Package,
  Shield,
  Cloud,
  Bot,
  Plus,
  Eye
} from 'lucide-react';

export default function ProductsPage({
  products,
  selectedProduct,
  onSelectProduct,
  onUpdateProduct,
  onAddProduct,
  onOpenLiveDemo
}) {
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    description: '',
    pitch: '',
    benefits: ''
  });

  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: 'Enterprise SaaS',
    price: '$49 / seat / month',
    description: '',
    pitch: '',
    benefits: 'Automated 2-way data sync\nAI consultative assistant\nEnterprise SOC2 compliance'
  });

  const [formError, setFormError] = useState('');

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setEditForm({
      name: p.name,
      price: p.price,
      description: p.description,
      pitch: p.pitch,
      benefits: (p.keyFeatures || []).join('\n')
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    const updated = {
      ...editingProduct,
      name: editForm.name.trim(),
      price: editForm.price.trim(),
      description: editForm.description.trim(),
      pitch: editForm.pitch.trim(),
      keyFeatures: editForm.benefits.split('\n').filter(b => b.trim().length > 0)
    };
    onUpdateProduct(updated);
    setEditingProduct(null);
  };

  const handleSaveNewProduct = (e) => {
    e.preventDefault();
    if (!newProductForm.name.trim() || !newProductForm.description.trim()) {
      setFormError('Please enter a product name and description.');
      return;
    }

    const newProd = {
      id: `prod_${Date.now()}`,
      name: newProductForm.name.trim(),
      category: newProductForm.category.trim(),
      price: newProductForm.price.trim(),
      description: newProductForm.description.trim(),
      pitch: newProductForm.pitch.trim() || newProductForm.description.trim(),
      keyFeatures: newProductForm.benefits.split('\n').filter(b => b.trim().length > 0),
      faqs: [
        {
          q: 'How does onboarding work?',
          a: 'Our solution deploys in 24 hours with dedicated solutions engineering support.'
        }
      ]
    };

    if (onAddProduct) {
      onAddProduct(newProd);
    }
    setIsAddModalOpen(false);
    setNewProductForm({
      name: '',
      category: 'Enterprise SaaS',
      price: '$49 / seat / month',
      description: '',
      pitch: '',
      benefits: 'Automated 2-way data sync\nAI consultative assistant\nEnterprise SOC2 compliance'
    });
    setFormError('');
  };

  const getProductIcon = (id) => {
    switch (id) {
      case 'prod_1':
        return <Bot className="w-5 h-5 text-violet-400" />;
      case 'prod_2':
        return <Cloud className="w-5 h-5 text-cyan-400" />;
      case 'prod_3':
        return <Shield className="w-5 h-5 text-emerald-400" />;
      default:
        return <Package className="w-5 h-5 text-violet-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Products</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Manage product information used by your AI sales agent during voice calls.</p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormError('');
            setIsAddModalOpen(true);
          }}
          className="btn-base btn-primary px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-violet-600/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((p) => {
          const isSelected = selectedProduct.id === p.id;
          return (
            <div
              key={p.id}
              className={`surface-panel p-6 rounded-3xl flex flex-col justify-between transition-all duration-200 border ${
                isSelected
                  ? 'border-violet-500/60 ring-1 ring-violet-500/40 shadow-xl shadow-violet-500/10 bg-gradient-to-b from-[#161F32] to-[#111827]'
                  : 'border-[#263247] hover:border-[#263247]/90'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-[#161F30] border border-white/[0.08] shadow-sm">
                      {getProductIcon(p.id)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-extrabold text-white">
                          {p.name}
                        </h3>
                        {p.isDemo && (
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30">
                            Active
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400 mt-1 inline-block bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        {p.price}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewingProduct(p)}
                      className="btn-icon p-1.5 rounded-lg text-slate-400 hover:text-white"
                      title="View product details"
                      aria-label={`View details of ${p.name}`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="btn-icon p-1.5 rounded-lg text-slate-400 hover:text-white"
                      title="Edit product parameters"
                      aria-label={`Edit ${p.name}`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{p.description}</p>

                <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">
                    Core Capabilities:
                  </span>
                  <ul className="space-y-1.5 text-xs">
                    {(p.keyFeatures || []).slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-white/[0.06] space-y-2.5">
                <button
                  type="button"
                  onClick={() => onOpenLiveDemo && onOpenLiveDemo(p)}
                  className="btn-base btn-secondary w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-violet-200 border-violet-500/30 hover:border-violet-500/50"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Interactive Walkthrough</span>
                </button>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 font-mono">{p.category}</span>
                  <button
                    onClick={() => onSelectProduct(p)}
                    className={`btn-base text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 font-bold transition-all ${
                      isSelected ? 'btn-primary' : 'btn-secondary'
                    }`}
                  >
                    <span>{isSelected ? 'In Live Studio' : 'Use in Call'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {viewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg surface-panel rounded-3xl p-6 space-y-4 shadow-2xl border border-violet-500/30">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2.5">
                <Package className="w-5 h-5 text-violet-400" />
                <h3 className="text-sm font-bold text-white">{viewingProduct.name}</h3>
              </div>
              <button
                onClick={() => setViewingProduct(null)}
                className="btn-icon text-slate-400 hover:text-white"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#141C2E] border border-white/[0.06]">
                <span className="text-slate-400">Standard Pricing:</span>
                <span className="font-mono text-emerald-400 font-bold">{viewingProduct.price}</span>
              </div>

              {viewingProduct.pricingTiers && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#141C2E]/60 border border-white/[0.04]">
                  <span className="text-slate-400">Available Tiers:</span>
                  <span className="font-mono text-slate-300 font-medium text-right">{viewingProduct.pricingTiers}</span>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Description:</span>
                <p className="text-slate-200 leading-relaxed">{viewingProduct.description}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Consultative Pitch:</span>
                <p className="text-slate-300 leading-relaxed italic">{viewingProduct.pitch}</p>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Key Features:</span>
                <ul className="space-y-1">
                  {(viewingProduct.keyFeatures || []).map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-200">
                      <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {viewingProduct.faqs && viewingProduct.faqs.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Objection Battlecards:</span>
                  <div className="p-3 rounded-xl bg-[#141C2E] border border-white/[0.06] space-y-1">
                    <p className="font-bold text-white">{viewingProduct.faqs[0].q}</p>
                    <p className="text-slate-300">{viewingProduct.faqs[0].a}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setViewingProduct(null)}
                className="btn-base btn-secondary py-2 px-4 rounded-xl text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectProduct(viewingProduct);
                  setViewingProduct(null);
                }}
                className="btn-base btn-primary py-2 px-4 rounded-xl text-xs font-bold"
              >
                Use in Call
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg surface-panel rounded-3xl p-6 space-y-4 shadow-2xl border border-violet-500/30">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h3 className="text-sm font-bold text-white">Add New SaaS Product</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="btn-icon text-slate-400 hover:text-white"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveNewProduct} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SalesPulse AI"
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  className="input-base w-full py-2 text-xs rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Category</label>
                  <input
                    type="text"
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="input-base w-full py-2 text-xs rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Pricing Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="$49 / seat / month"
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                    className="input-base w-full py-2 text-xs font-mono rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Short Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="One sentence summary of the product's primary value"
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  className="input-base w-full py-2 text-xs resize-none rounded-xl"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Consultative Sales Pitch</label>
                <textarea
                  rows={2}
                  placeholder="Value proposition to be articulated by the voice AI SDR"
                  value={newProductForm.pitch}
                  onChange={(e) => setNewProductForm({ ...newProductForm, pitch: e.target.value })}
                  className="input-base w-full py-2 text-xs resize-none rounded-xl"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Key Capabilities (one per line)</label>
                <textarea
                  rows={3}
                  value={newProductForm.benefits}
                  onChange={(e) => setNewProductForm({ ...newProductForm, benefits: e.target.value })}
                  className="input-base w-full py-2 text-xs font-mono rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-base btn-ghost text-xs py-2 px-4 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-base btn-primary text-xs py-2 px-5 rounded-xl font-bold"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg surface-panel rounded-3xl p-6 space-y-4 shadow-2xl border border-violet-500/30">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h3 className="text-sm font-bold text-white">Edit Product: {editingProduct.name}</h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="btn-icon text-slate-400 hover:text-white"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Product Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="input-base w-full py-2 text-xs rounded-xl"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Pricing Model</label>
                <input
                  type="text"
                  required
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  className="input-base w-full py-2 text-xs font-mono rounded-xl"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Short Description</label>
                <textarea
                  rows={2}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="input-base w-full py-2 text-xs resize-none rounded-xl"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Sales Pitch Value Proposition</label>
                <textarea
                  rows={2}
                  value={editForm.pitch}
                  onChange={(e) => setEditForm({ ...editForm, pitch: e.target.value })}
                  className="input-base w-full py-2 text-xs resize-none rounded-xl"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Key Capabilities (one per line)</label>
                <textarea
                  rows={3}
                  value={editForm.benefits}
                  onChange={(e) => setEditForm({ ...editForm, benefits: e.target.value })}
                  className="input-base w-full py-2 text-xs font-mono rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="btn-base btn-ghost text-xs py-2 px-4 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-base btn-primary text-xs py-2 px-5 rounded-xl font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
