import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Eye, Download, MessageCircle, Mail, Share2 } from 'lucide-react';
import { useBusinessData } from '../context/BusinessDataContext';
import { generateReceiptPDF } from '../utils/generateReceipt';
import { generateReceiptNumber } from '../utils/receiptNumber';
import { formatNaira } from '../utils/currency';
import ReceiptDocument, { type ReceiptData, type ReceiptItem } from '../components/ReceiptDocument';

export default function CustomReceipt() {
  const { businessProfile } = useBusinessData();
  const [showPreview, setShowPreview] = useState(false);
  const [receiptNumber] = useState(generateReceiptNumber());
  
  // Ref to target the Receipt element in DOM for PDF generation
  const receiptRef = useRef<HTMLDivElement>(null);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<ReceiptItem[]>([{ description: '', quantity: 1, unitPrice: 0 }]);

  const inputClass =
    'w-full font-body text-sm px-4 py-2.5 rounded-lg border border-brand-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/40';
  const labelClass = 'block font-body text-xs font-bold text-brand-ink/70 mb-1.5';

  const updateItem = (index: number, field: keyof ReceiptItem, value: string) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, [field]: field === 'description' ? value : Number(value) || 0 }
          : item
      )
    );
  };

  const addItem = () => setItems((prev) => [...prev, { description: '', quantity: 1, unitPrice: 0 }]);
  const removeItem = (index: number) => {
    if (items.length > 1) setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const isValid = customerName.trim() && items.every((i) => i.description.trim() && i.unitPrice > 0);

  const receiptData: ReceiptData = {
    receiptNumber,
    date: new Date().toISOString().split('T')[0],
    businessName: businessProfile.businessName,
    businessPhone: businessProfile.phone || undefined,
    businessEmail: businessProfile.email || undefined,
    businessAddress: businessProfile.address || undefined,
    businessLogo: businessProfile.businessLogo || undefined,
    customerName: customerName || 'Walk-in Customer',
    customerPhone: customerPhone || undefined,
    customerEmail: customerEmail || undefined,
    items,
    paymentMethod,
    notes: notes || undefined,
  };

  // Fixed handler: Passes the HTML element reference to generateReceiptPDF
  const handleDownload = () => {
    if (receiptRef.current) {
      generateReceiptPDF(receiptRef.current, `Receipt-${receiptNumber}`);
    }
  };

  const handleWhatsAppShare = () => {
    const itemsList = items.map((i) => `${i.description} - ${i.quantity} x ${formatNaira(i.unitPrice)}`).join('%0A');
    const message = `*RECEIPT FROM ${businessProfile.businessName.toUpperCase()}*%0A%0AReceipt #${receiptNumber}%0A%0A${itemsList}%0A%0A*Total: ${formatNaira(total)}*%0APayment: ${paymentMethod.toUpperCase()}%0A%0AThank you! - via Husslewise`;
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleEmailShare = () => {
    const subject = `Receipt from ${businessProfile.businessName} - ${receiptNumber}`;
    const body = `Dear ${customerName},%0A%0AThank you! Total: ${formatNaira(total)}%0APayment: ${paymentMethod}%0A%0ABest regards,%0A${businessProfile.businessName}`;
    window.open(`mailto:${customerEmail}?subject=${encodeURIComponent(subject)}&body=${body}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `Receipt from ${businessProfile.businessName}`, text: `Receipt #${receiptNumber} — Total ${formatNaira(total)}` });
      } catch {
        // cancelled
      }
    } else {
      alert('Native sharing is not supported on this device/browser.');
    }
  };

  if (showPreview) {
    return (
      <div>
        <button
          onClick={() => setShowPreview(false)}
          className="flex items-center gap-1.5 font-body text-sm font-bold text-brand-ink/60 hover:text-brand-ink mb-6"
        >
          <ArrowLeft size={16} /> Back to Edit
        </button>

        {/* Attached receiptRef here */}
        <div className="mb-6" ref={receiptRef}>
          <ReceiptDocument data={receiptData} />
        </div>

        <div className="max-w-xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button onClick={handleWhatsAppShare} className="flex flex-col items-center gap-1.5 bg-green-600 text-white font-body text-xs font-bold px-3 py-3.5 rounded-lg hover:opacity-90 transition">
            <MessageCircle size={18} /> WhatsApp
          </button>
          <button onClick={handleEmailShare} disabled={!customerEmail} className="flex flex-col items-center gap-1.5 bg-blue-600 text-white font-body text-xs font-bold px-3 py-3.5 rounded-lg hover:opacity-90 transition disabled:opacity-40">
            <Mail size={18} /> Email
          </button>
          <button onClick={handleDownload} className="flex flex-col items-center gap-1.5 bg-brand-primary text-brand-bg font-body text-xs font-bold px-3 py-3.5 rounded-lg hover:opacity-90 transition">
            <Download size={18} /> Download
          </button>
          <button onClick={handleNativeShare} className="flex flex-col items-center gap-1.5 bg-purple-600 text-white font-body text-xs font-bold px-3 py-3.5 rounded-lg hover:opacity-90 transition">
            <Share2 size={18} /> Share
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link to="/app/receipts" className="flex items-center gap-1.5 font-body text-sm font-bold text-brand-ink/60 hover:text-brand-ink mb-6 w-fit">
        <ArrowLeft size={16} /> Back to Receipts
      </Link>

      <div className="mb-8">
        <h1 className="font-headline text-2xl md:text-3xl font-bold text-brand-ink mb-1">Create Custom Receipt</h1>
        <p className="font-body text-sm text-brand-ink/60">Build a multi-item receipt for any transaction, invoice-style.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Customer info */}
        <div className="bg-white rounded-2xl p-6 border border-brand-primary/10">
          <h3 className="font-headline font-bold text-brand-ink mb-4">Customer Information</h3>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Customer Name *</label>
              <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Tolu Adebayo" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Phone</label>
                <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Optional" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="Optional" className={inputClass} />
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl p-6 border border-brand-primary/10">
          <h3 className="font-headline font-bold text-brand-ink mb-4">Items / Services</h3>
          <div className="space-y-3 mb-4">
            {items.map((item, index) => (
              <div key={index} className="bg-brand-bg/20 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="col-span-2">
                    <label className="font-body text-xs text-brand-ink/50 mb-1 block">Description</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Product or service"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs text-brand-ink/50 mb-1 block">Quantity</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      min="1"
                      className={inputClass}
                    />
                  </div>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="font-body text-xs text-brand-ink/50 mb-1 block">Unit Price (₦)</label>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                        min="0"
                        className={inputClass}
                      />
                    </div>
                    {items.length > 1 && (
                      <button onClick={() => removeItem(index)} className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition shrink-0">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={addItem} className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-brand-primary/20 text-brand-ink/60 font-body text-sm font-bold px-4 py-3 rounded-lg hover:border-brand-primary/40 hover:text-brand-ink transition">
            <Plus size={16} /> Add Item
          </button>
        </div>

        {/* Payment + notes */}
        <div className="bg-white rounded-2xl p-6 border border-brand-primary/10">
          <h3 className="font-headline font-bold text-brand-ink mb-4">Payment Details</h3>
          <div className="mb-4">
            <label className={labelClass}>Payment Method</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className={inputClass}>
              <option value="cash">Cash</option>
              <option value="transfer">Bank Transfer</option>
              <option value="pos">POS</option>
              <option value="card">Card</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Notes (optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Additional terms or notes..." className={`${inputClass} resize-none`} />
          </div>
        </div>

        {/* Total + preview */}
        <div className="bg-brand-primary rounded-2xl p-6 flex items-center justify-between">
          <span className="font-headline font-bold text-brand-bg">Total Amount</span>
          <span className="font-headline text-2xl font-extrabold text-brand-bg">{formatNaira(total)}</span>
        </div>

        <button
          onClick={() => setShowPreview(true)}
          disabled={!isValid}
          className="w-full flex items-center justify-center gap-2 bg-brand-primary text-brand-bg font-body font-bold px-6 py-3.5 rounded-lg hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Eye size={16} /> Preview Receipt
        </button>
      </div>
    </div>
  );
}