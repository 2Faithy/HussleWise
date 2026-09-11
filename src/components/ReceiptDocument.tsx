import { forwardRef } from 'react';
import { User, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { formatNaira } from '../utils/currency';
import husslewiseLogo from '../assets/images/logo.png';

export interface ReceiptItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface ReceiptData {
  receiptNumber: string;
  date: string;
  businessName: string;
  businessPhone?: string;
  businessEmail?: string;
  businessAddress?: string;
  businessLogo?: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  items: ReceiptItem[];
  paymentMethod: string;
  notes?: string;
  discount?: number;
  debtInfo?: {
    totalOwed: number;
    amountPaidToDate: number;
    balanceRemaining: number;
  };
}

const ReceiptDocument = forwardRef<HTMLDivElement, { data: ReceiptData }>(({ data }, ref) => {
  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discount = data.discount ?? 0;
  const total = Math.max(0, subtotal - discount);

  return (
    <div
      ref={ref}
      className="bg-white border-2 border-brand-primary/15 rounded-lg p-6 md:p-10 max-w-xl mx-auto relative font-body"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-brand-primary rounded-t-lg" />

      {/* Header */}
      <div className="border-b-2 border-brand-primary/10 pb-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-2">
            <img src={husslewiseLogo} alt="" className="h-4" />
            <span className="font-headline text-xs font-bold text-brand-ink/40">Powered by Husslewise</span>
          </div>
          {data.businessLogo && (
            <img src={data.businessLogo} alt="" className="w-12 h-12 rounded object-cover border border-brand-primary/10" />
          )}
        </div>

        <h1 className="font-headline text-2xl font-extrabold text-brand-ink uppercase tracking-wide mb-2">
          {data.businessName}
        </h1>
        <div className="space-y-1">
          {data.businessPhone && (
            <p className="flex items-center gap-2 font-body text-sm text-brand-ink/60">
              <Phone size={13} /> {data.businessPhone}
            </p>
          )}
          {data.businessEmail && (
            <p className="flex items-center gap-2 font-body text-sm text-brand-ink/60">
              <Mail size={13} /> {data.businessEmail}
            </p>
          )}
          {data.businessAddress && (
            <p className="flex items-center gap-2 font-body text-sm text-brand-ink/60">
              <MapPin size={13} /> {data.businessAddress}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2 mt-5 pt-4 border-t border-brand-primary/10">
          <span className="font-headline font-bold text-brand-primary text-sm">
            RECEIPT #{data.receiptNumber}
          </span>
          <span className="flex items-center gap-1.5 font-body text-xs text-brand-ink/50">
            <Calendar size={12} /> {data.date}
          </span>
        </div>
      </div>

      {/* Bill To */}
      <div className="border border-brand-primary/10 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 font-headline text-xs font-bold text-brand-ink uppercase tracking-wide mb-3">
          <User size={14} /> Bill To
        </div>
        <p className="font-headline font-bold text-brand-ink mb-1">{data.customerName}</p>
        {data.customerPhone && (
          <p className="flex items-center gap-1.5 font-body text-xs text-brand-ink/50">
            <Phone size={11} /> {data.customerPhone}
          </p>
        )}
        {data.customerEmail && (
          <p className="flex items-center gap-1.5 font-body text-xs text-brand-ink/50">
            <Mail size={11} /> {data.customerEmail}
          </p>
        )}
      </div>

      {/* Items */}
      <div className="mb-6">
        <p className="font-headline text-xs font-bold text-brand-ink uppercase tracking-wide border-b-2 border-brand-primary/10 pb-2 mb-3">
          Items & Services
        </p>
        <div className="border border-brand-primary/10 rounded-lg overflow-hidden">
          <div className="grid grid-cols-[2fr_0.6fr_1fr_1fr] gap-2 bg-brand-bg/30 px-3 py-2 font-headline text-xs font-bold text-brand-ink uppercase">
            <span>Description</span>
            <span className="text-center">Qty</span>
            <span className="text-right">Price</span>
            <span className="text-right">Total</span>
          </div>
          {data.items.map((item, i) => (
            <div
              key={i}
              className={`grid grid-cols-[2fr_0.6fr_1fr_1fr] gap-2 px-3 py-2.5 font-body text-xs text-brand-ink ${i % 2 ? 'bg-brand-bg/10' : ''}`}
            >
              <span className="font-bold">{item.description}</span>
              <span className="text-center">{item.quantity}</span>
              <span className="text-right">{formatNaira(item.unitPrice)}</span>
              <span className="text-right font-bold">{formatNaira(item.quantity * item.unitPrice)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="border-2 border-brand-primary/10 rounded-lg p-4 mb-6">
        <p className="font-headline text-xs font-bold text-brand-ink uppercase tracking-wide pb-3 mb-3 border-b border-brand-primary/10">
          Payment Method: {data.paymentMethod.toUpperCase()}
        </p>
        {discount > 0 && (
          <div className="space-y-1.5 mb-3 pb-3 border-b border-brand-primary/10">
            <div className="flex justify-between font-body text-sm text-brand-ink/70">
              <span>Subtotal</span>
              <span>{formatNaira(subtotal)}</span>
            </div>
            <div className="flex justify-between font-body text-sm text-red-500">
              <span>Discount</span>
              <span>-{formatNaira(discount)}</span>
            </div>
          </div>
        )}
        <div className="flex justify-between font-headline font-extrabold text-brand-primary uppercase text-lg">
          <span>Total</span>
          <span>{formatNaira(total)}</span>
        </div>
      </div>

      {/* Debt balance */}
      {data.debtInfo && (
        <div className="border-2 border-amber-200 bg-amber-50 rounded-lg p-4 mb-6">
          <p className="font-headline text-xs font-bold text-amber-800 uppercase tracking-wide border-b border-amber-200 pb-2 mb-3">
            Credit Balance
          </p>
          <div className="space-y-1.5">
            <div className="flex justify-between font-body text-sm text-brand-ink/70">
              <span>Total Owed</span>
              <span>{formatNaira(data.debtInfo.totalOwed)}</span>
            </div>
            <div className="flex justify-between font-body text-sm text-green-700">
              <span>Paid to Date</span>
              <span>{formatNaira(data.debtInfo.amountPaidToDate)}</span>
            </div>
            <div className="flex justify-between font-headline font-extrabold text-amber-800 text-base pt-1.5 border-t border-amber-200">
              <span>Balance Remaining</span>
              <span>{formatNaira(data.debtInfo.balanceRemaining)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      {data.notes && (
        <div className="border border-brand-primary/10 rounded-lg p-4 mb-6">
          <p className="font-headline text-xs font-bold text-brand-ink uppercase tracking-wide border-b border-brand-primary/10 pb-2 mb-2">
            Additional Notes
          </p>
          <p className="font-body text-sm text-brand-ink/70">{data.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="text-center border-t-2 border-brand-primary/10 pt-5">
        <p className="font-headline text-sm font-bold text-brand-ink uppercase tracking-wide mb-2">
          Thank you for your business!
        </p>
        <p className="font-body text-xs text-brand-ink/50">
          Powered by <span className="font-bold text-brand-primary">Husslewise</span>
        </p>
        <p className="font-body text-xs text-brand-ink/30 mt-1">
          Generated on {new Date().toLocaleString('en-NG')}
        </p>
      </div>
    </div>
  );
});

ReceiptDocument.displayName = 'ReceiptDocument';
export default ReceiptDocument;