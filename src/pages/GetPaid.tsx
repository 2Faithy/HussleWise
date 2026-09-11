import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Copy, Check, Landmark, Download, Share2 } from 'lucide-react';
import { useBusinessData } from '../context/BusinessDataContext';

export default function GetPaid() {
  const { businessProfile, updateBusinessProfile } = useBusinessData();
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(!businessProfile.accountNumber);
  const [form, setForm] = useState({
    bankName: businessProfile.bankName,
    accountNumber: businessProfile.accountNumber,
    accountName: businessProfile.accountName,
  });

  const hasBankDetails = businessProfile.accountNumber && businessProfile.bankName;

  const qrValue = hasBankDetails
    ? `Bank: ${businessProfile.bankName}\nAccount Name: ${businessProfile.accountName}\nAccount Number: ${businessProfile.accountNumber}`
    : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(businessProfile.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessProfile({ ...businessProfile, ...form });
    setEditing(false);
  };

  const handleDownloadQR = () => {
    const canvas = document.getElementById('payment-qr') as HTMLCanvasElement;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'husslewise-payment-qr.png';
    link.click();
  };

  const handleShare = () => {
    const message = `Pay ${businessProfile.businessName} via:%0ABank: ${businessProfile.bankName}%0AAccount Name: ${businessProfile.accountName}%0AAccount Number: ${businessProfile.accountNumber}`;
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const inputClass =
    'w-full font-body text-sm px-4 py-2.5 rounded-lg border border-brand-primary/20 bg-brand-bg/10 focus:outline-none focus:ring-2 focus:ring-brand-primary/40';
  const labelClass = 'block font-body text-xs font-bold text-brand-ink/70 mb-1.5';

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline text-2xl md:text-3xl font-bold text-brand-ink mb-1">
          Get Paid
        </h1>
        <p className="font-body text-sm text-brand-ink/60">
          Share your account details or QR code so customers can pay you instantly.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Bank details / edit form */}
        <div className="bg-white rounded-2xl p-6 border border-brand-primary/10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-brand-bg flex items-center justify-center">
              <Landmark size={18} className="text-brand-primary" />
            </div>
            <h3 className="font-headline font-bold text-brand-ink">Account Details</h3>
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className={labelClass}>Bank Name</label>
                <input
                  type="text"
                  value={form.bankName}
                  onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                  placeholder="e.g. GTBank"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Account Name</label>
                <input
                  type="text"
                  value={form.accountName}
                  onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                  placeholder="e.g. Nkechi Okafor"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Account Number</label>
                <input
                  type="text"
                  value={form.accountNumber}
                  onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                  placeholder="e.g. 0123456789"
                  required
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-brand-primary text-brand-bg font-body font-bold px-6 py-3 rounded-lg hover:opacity-90 transition"
              >
                Save Details
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="font-body text-xs text-brand-ink/50 mb-0.5">Bank</p>
                <p className="font-body font-bold text-brand-ink">{businessProfile.bankName}</p>
              </div>
              <div>
                <p className="font-body text-xs text-brand-ink/50 mb-0.5">Account Name</p>
                <p className="font-body font-bold text-brand-ink">{businessProfile.accountName}</p>
              </div>
              <div>
                <p className="font-body text-xs text-brand-ink/50 mb-0.5">Account Number</p>
                <div className="flex items-center gap-2">
                  <p className="font-headline font-bold text-brand-ink text-lg">{businessProfile.accountNumber}</p>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 font-body text-xs font-bold text-brand-primary hover:underline"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="font-body text-xs font-bold text-brand-ink/50 hover:text-brand-ink/70 pt-2"
              >
                Edit Details
              </button>
            </div>
          )}
        </div>

        {/* QR Code */}
        <div className="bg-white rounded-2xl p-6 border border-brand-primary/10 flex flex-col items-center justify-center text-center">
          {hasBankDetails ? (
            <>
              <h3 className="font-headline font-bold text-brand-ink mb-1">Scan to Pay</h3>
              <p className="font-body text-xs text-brand-ink/50 mb-5">
                Let customers scan this to see your payment details
              </p>

              <div className="bg-white p-4 rounded-xl border border-brand-primary/10 mb-5">
                <QRCodeCanvas
                  id="payment-qr"
                  value={qrValue}
                  size={180}
                  fgColor="#1c5b56"
                  bgColor="#ffffff"
                  level="M"
                />
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={handleDownloadQR}
                  className="flex-1 flex items-center justify-center gap-2 bg-brand-primary text-brand-bg font-body text-xs font-bold px-4 py-2.5 rounded-lg hover:opacity-90 transition"
                >
                  <Download size={14} /> Download
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white font-body text-xs font-bold px-4 py-2.5 rounded-lg hover:opacity-90 transition"
                >
                  <Share2 size={14} /> Share
                </button>
              </div>
            </>
          ) : (
            <p className="font-body text-sm text-brand-ink/50 py-10">
              Add your account details to generate a payment QR code.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}