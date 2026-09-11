import { useState, useMemo } from 'react';
import { Plus, Trash2, AlertTriangle, Package, Minus as MinusIcon, Plus as PlusIcon, Check } from 'lucide-react';
import { useBusinessData } from '../context/BusinessDataContext';
import { formatNaira } from '../utils/currency';
import Modal from '../components/Modal';
import AddInventoryForm from '../components/AddInventoryForm';

export default function Inventory() {
  const { inventory, updateInventoryQuantity, deleteInventoryItem } = useBusinessData();
  const [showModal, setShowModal] = useState(false);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const lowStockItems = useMemo(
    () => inventory.filter((i) => i.quantity <= i.lowStockThreshold),
    [inventory]
  );

  const filtered = showLowStockOnly ? lowStockItems : inventory;

  const totalStockValue = inventory.reduce((sum, i) => sum + i.quantity * i.costPrice, 0);
  const potentialRevenue = inventory.reduce((sum, i) => sum + i.quantity * i.sellingPrice, 0);

  const adjustQuantity = (id: string, current: number, delta: number) => {
    const newQty = Math.max(0, current + delta);
    updateInventoryQuantity(id, newQty);
  };

  const startEditing = (id: string, currentQty: number) => {
    setEditingId(id);
    setEditValue(String(currentQty));
  };

  const confirmEdit = (id: string) => {
    const newQty = Number(editValue);
    if (!isNaN(newQty) && newQty >= 0) {
      updateInventoryQuantity(id, newQty);
    }
    setEditingId(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline text-2xl md:text-3xl font-bold text-brand-ink mb-1">
            Inventory
          </h1>
          <p className="font-body text-sm text-brand-ink/60">
            Know what's in stock before it runs out.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-brand-primary text-brand-bg font-body text-sm font-bold px-5 py-2.5 rounded-lg hover:opacity-90 transition"
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      {/* Low stock alert banner */}
      {lowStockItems.length > 0 && (
        <button
          onClick={() => setShowLowStockOnly(!showLowStockOnly)}
          className="w-full flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-5 py-4 mb-8 text-left hover:bg-red-100/60 transition"
        >
          <AlertTriangle size={20} className="text-red-500 shrink-0" />
          <div className="flex-1">
            <p className="font-body text-sm font-bold text-red-700">
              {lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''} running low
            </p>
            <p className="font-body text-xs text-red-600/70">
              {showLowStockOnly ? 'Showing low stock items only — click to show all' : 'Click to view only low stock items'}
            </p>
          </div>
        </button>
      )}

      {/* Summary cards */}
      <div className="grid sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-brand-primary/10">
          <div className="w-10 h-10 rounded-lg bg-brand-bg flex items-center justify-center mb-3">
            <Package size={18} className="text-brand-primary" />
          </div>
          <p className="font-body text-xs text-brand-ink/60 mb-1">Total Items</p>
          <p className="font-headline text-2xl font-extrabold text-brand-ink">{inventory.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-brand-primary/10">
          <p className="font-body text-xs text-brand-ink/60 mb-1">Stock Value (at cost)</p>
          <p className="font-headline text-2xl font-extrabold text-brand-ink">{formatNaira(totalStockValue)}</p>
        </div>
        <div className="bg-brand-primary rounded-2xl p-6">
          <p className="font-body text-xs text-brand-bg/70 mb-1">Potential Revenue</p>
          <p className="font-headline text-2xl font-extrabold text-brand-bg">{formatNaira(potentialRevenue)}</p>
        </div>
      </div>

      {/* Inventory list */}
      <div className="bg-white rounded-2xl border border-brand-primary/10 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-14">
            <p className="font-body text-sm text-brand-ink/50">
              {showLowStockOnly ? 'No low stock items. 🎉' : 'No inventory items yet.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-brand-primary/5">
            {filtered.map((item) => {
              const isLow = item.quantity <= item.lowStockThreshold;
              const margin = item.sellingPrice - item.costPrice;
              const isEditing = editingId === item.id;

              return (
                <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
                  <div className="min-w-[140px]">
                    <div className="flex items-center gap-2">
                      <p className="font-body font-bold text-brand-ink">{item.name}</p>
                      {isLow && (
                        <span className="font-body text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                          Low
                        </span>
                      )}
                    </div>
                    <p className="font-body text-xs text-brand-ink/50">
                      Cost {formatNaira(item.costPrice)} · Sells {formatNaira(item.sellingPrice)} · Margin {formatNaira(margin)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {isEditing ? (
                      <>
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') confirmEdit(item.id);
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          onBlur={() => confirmEdit(item.id)}
                          autoFocus
                          min="0"
                          className="w-24 font-body text-sm font-bold text-center px-2 py-1.5 rounded-lg border-2 border-brand-primary bg-white focus:outline-none"
                        />
                        <span className="font-body text-xs text-brand-ink/50">{item.unit}</span>
                        <button
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => confirmEdit(item.id)}
                          className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center hover:opacity-90 transition"
                        >
                          <Check size={14} className="text-brand-bg" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => adjustQuantity(item.id, item.quantity, -1)}
                          className="w-8 h-8 rounded-lg bg-brand-bg/40 flex items-center justify-center hover:bg-brand-bg/60 transition"
                        >
                          <MinusIcon size={14} className="text-brand-ink" />
                        </button>
                        <button
                          onClick={() => startEditing(item.id, item.quantity)}
                          className={`font-body text-sm font-bold w-20 text-center py-1 rounded-lg hover:bg-brand-bg/30 transition ${
                            isLow ? 'text-red-600' : 'text-brand-ink'
                          }`}
                          title="Click to type a number"
                        >
                          {item.quantity} {item.unit}
                        </button>
                        <button
                          onClick={() => adjustQuantity(item.id, item.quantity, 1)}
                          className="w-8 h-8 rounded-lg bg-brand-bg/40 flex items-center justify-center hover:bg-brand-bg/60 transition"
                        >
                          <PlusIcon size={14} className="text-brand-ink" />
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => confirm(`Remove ${item.name} from inventory?`) && deleteInventoryItem(item.id)}
                      className="text-brand-ink/20 hover:text-red-500 transition ml-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Inventory Item">
        <AddInventoryForm onSuccess={() => setShowModal(false)} />
      </Modal>
    </div>
  );
}