import { useState, useMemo, useRef } from 'react';
import { Download, MessageCircle, Mail, Share2, Search, CheckCircle2, FileText, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBusinessData } from '../context/BusinessDataContext';
import { formatNaira } from '../utils/currency';
import { generateReceiptPDF } from '../utils/generateReceipt';
import { generateReceiptNumber } from '../utils/receiptNumber';
import ReceiptDocument, { type ReceiptData } from '../components/ReceiptDocument';
import Modal from '../components/Modal';

export default function Receipts() {
  const { sales, debts, businessProfile, receiptsSentIds, markReceiptSent } = useBusinessData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSaleId, setActiveSaleId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  const sortedSales = useMemo(() => [...sales].sort((a, b) => b.date.localeCompare(a.date)), [sales]);
  const filtered = sortedSales.filter((s) => s.item.toLowerCase().includes(searchTerm.toLowerCase()));
  const activeSale = sales.find((s) => s.id === activeSaleId);

  const openReceiptFor = (saleId: string) => {
    setActiveSaleId(saleId);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setReceiptNumber(generateReceiptNumber());
  };

  const buildReceiptData = (): ReceiptData | null => {
    if (!activeSale) return null;

    const quantity = activeSale.quantity ?? 1;
    const discount = activeSale.discount ?? 0;
    // Back out the pre-discount unit price from the stored (already-discounted) total,
    // so "quantity × unit price" displays correctly instead of always showing "1 × total".
    const unitPrice = quantity > 0 ? (activeSale.amount + discount) / quantity : activeSale.amount;

    const linkedDebt = activeSale.debtId ? debts.find((d) => d.id === activeSale.debtId) : undefined;
    const debtInfo = linkedDebt
      ? {
          totalOwed: linkedDebt.amount,
          amountPaidToDate: linkedDebt.amountPaid,
          balanceRemaining: Math.max(0, linkedDebt.amount - linkedDebt.amountPaid),
        }
      : undefined;

    return {
      receiptNumber,
      date: activeSale.date,
      businessName: businessProfile.businessName,
      businessPhone: businessProfile.phone || undefined,
      businessEmail: businessProfile.email || undefined,
      businessAddress: businessProfile.address || undefined,
      businessLogo: businessProfile.businessLogo || undefined,
      customerName: customerName || linkedDebt?.customerName || 'Walk-in Customer',
      customerPhone: customerPhone || linkedDebt?.phone || undefined,
      customerEmail: customerEmail || undefined,
      items: [{ description: activeSale.item, quantity, unitPrice }],
      paymentMethod: activeSale.paymentMethod,
      discount: discount > 0 ? discount : undefined,
      debtInfo,
    };
  };

  const handleDownload = async () => {
    if (!receiptRef.current || !activeSale) return;
    setIsGeneratingPdf(true);
    setDownloadError('');
    try {
      await generateReceiptPDF(receiptRef.current, receiptNumber);
      await markReceiptSent(activeSale.id);
    } catch (err) {
      console.error('PDF generation failed:', err);
      setDownloadError('Could not generate the PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleWhatsAppShare = () => {
    if (!activeSale) return;
    const message = `Hi${customerName ? ' ' + customerName : ''}! Receipt from ${businessProfile.businessName}:%0A%0AReceipt #${receiptNumber}%0AItem: ${activeSale.item}%0AAmount: ${formatNaira(activeSale.amount)}%0ADate: ${activeSale.date}%0A%0AThank you! - via Husslewise`;
    window.open(`https://wa.me/?text=${message}`, '_blank');
    markReceiptSent(activeSale.id);
  };

  const handleEmailShare = () => {
    if (!activeSale) return;
    const subject = `Receipt from ${businessProfile.businessName} - ${receiptNumber}`;
    const body = `Dear ${customerName || 'Customer'},%0A%0AThank you for your business! Receipt details:%0A%0AReceipt #: ${receiptNumber}%0ADate: ${activeSale.date}%0AItem: ${activeSale.item}%0ATotal: ${formatNaira(activeSale.amount)}%0APayment: ${activeSale.paymentMethod}%0A%0ABest regards,%0A${businessProfile.businessName}`;
    window.open(`mailto:${customerEmail}?subject=${encodeURIComponent(subject)}&body=${body}`, '_blank');
    markReceiptSent(activeSale.id);
  };

  const handleNativeShare = async () => {
    if (!activeSale) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Receipt from ${businessProfile.businessName}`,
          text: `Receipt #${receiptNumber} — ${activeSale.item} — ${formatNaira(activeSale.amount)}`,
        });
        markReceiptSent(activeSale.id);
      } catch {
        // user cancelled share — no action needed
      }
    } else {
      alert('Native sharing is not supported on this device/browser.');
    }
  };

  const closeModal = () => setActiveSaleId(null);
  const receiptData = buildReceiptData();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline text-2xl md:text-3xl font-bold text-brand-ink mb-1">Receipts</h1>
          <p className="font-body text-sm text-brand-ink/60">Generate professional receipts, ready to download or send.</p>
        </div>
        <Link
          to="/app/receipts/custom"
          className="flex items-center gap-2 bg-brand-primary text-brand-bg font-body text-sm font-bold px-5 py-2.5 rounded-lg hover:opacity-90 transition"
        >
          <Plus size={16} /> Create Custom Receipt
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-brand-primary/10 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-brand-bg flex items-center justify-center">
            <FileText size={20} className="text-brand-primary" />
          </div>
          <div>
            <p className="font-body text-xs text-brand-ink/60">Total Sales</p>
            <p className="font-headline text-xl font-extrabold text-brand-ink">{sales.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-brand-primary/10 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
            <CheckCircle2 size={20} className="text-green-600" />
          </div>
          <div>
            <p className="font-body text-xs text-brand-ink/60">Receipts Sent</p>
            <p className="font-headline text-xl font-extrabold text-brand-ink">{receiptsSentIds.length}</p>
          </div>
        </div>
      </div>

      <div className="relative mb-5">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-ink/40" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search sales by item..."
          className="w-full font-body text-sm pl-10 pr-4 py-2.5 rounded-lg border border-brand-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
        />
      </div>

      <div className="bg-white rounded-2xl border border-brand-primary/10 overflow-hidden">
        {filtered.length === 0 ? (
          <p className="font-body text-sm text-brand-ink/50 text-center py-14">No sales found.</p>
        ) : (
          <div className="divide-y divide-brand-primary/5">
            {filtered.map((sale) => {
              const alreadySent = receiptsSentIds.includes(sale.id);
              return (
                <div key={sale.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-body text-sm font-bold text-brand-ink">{sale.item}</p>
                      {alreadySent && (
                        <span className="flex items-center gap-1 font-body text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={11} /> Sent
                        </span>
                      )}
                    </div>
                    <p className="font-body text-xs text-brand-ink/50 capitalize">
                      {sale.paymentMethod} · {sale.date} · {formatNaira(sale.amount)}
                    </p>
                  </div>
                  <button
                    onClick={() => openReceiptFor(sale.id)}
                    className="font-body text-xs font-bold bg-brand-primary text-brand-bg px-4 py-2 rounded-lg hover:opacity-90 transition"
                  >
                    Generate Receipt
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal isOpen={!!activeSale} onClose={closeModal} title="Generate Receipt">
        {activeSale && receiptData && (
          <div>
            <div className="mb-5">
              <label className="block font-body text-xs font-bold text-brand-ink/70 mb-1.5">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Tolu Adebayo"
                className="w-full font-body text-sm px-4 py-2.5 rounded-lg border border-brand-primary/20 bg-brand-bg/10 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 mb-3"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Phone (optional)"
                  className="font-body text-sm px-4 py-2.5 rounded-lg border border-brand-primary/20 bg-brand-bg/10 focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                />
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Email (optional)"
                  className="font-body text-sm px-4 py-2.5 rounded-lg border border-brand-primary/20 bg-brand-bg/10 focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                />
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto mb-5">
              <ReceiptDocument ref={receiptRef} data={receiptData} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleWhatsAppShare} className="flex items-center justify-center gap-2 bg-green-600 text-white font-body text-xs font-bold px-4 py-3 rounded-lg hover:opacity-90 transition">
                <MessageCircle size={15} /> WhatsApp
              </button>
              <button onClick={handleEmailShare} disabled={!customerEmail} className="flex items-center justify-center gap-2 bg-blue-600 text-white font-body text-xs font-bold px-4 py-3 rounded-lg hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed">
                <Mail size={15} /> Email
              </button>
                            <button
                onClick={handleDownload}
                disabled={isGeneratingPdf}
                className="flex items-center justify-center gap-2 bg-brand-primary text-brand-bg font-body text-xs font-bold px-4 py-3 rounded-lg hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isGeneratingPdf ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Download size={15} /> Download
                  </>
                )}
              </button>
              <button onClick={handleNativeShare} className="flex items-center justify-center gap-2 bg-purple-600 text-white font-body text-xs font-bold px-4 py-3 rounded-lg hover:opacity-90 transition">
                <Share2 size={15} /> Share
              </button>
            </div>

            {downloadError && (
              <p className="font-body text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-3">
                {downloadError}
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}