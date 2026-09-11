import { useState, useMemo } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import {
  Store, Copy, Check, Share2, Package, Clock,
  CheckCircle2, XCircle, ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBusinessData } from '../context/BusinessDataContext';
import { formatNaira } from '../utils/currency';

type OrderTab = 'pending' | 'confirmed' | 'completed' | 'declined';

export default function StorefrontManager() {
  const {
    businessProfile, updateBusinessProfile,
    storefrontOrders, confirmStorefrontOrder, declineStorefrontOrder, completeStorefrontOrder,
    inventory,
  } = useBusinessData();

  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<OrderTab>('pending');
  const toggleDelivery = () => {
    updateBusinessProfile({ ...businessProfile, offersDelivery: !businessProfile.offersDelivery });
  };

  const storeUrl = `${window.location.origin}/store/${businessProfile.storefrontSlug}`;

  const filteredOrders = useMemo(
    () => storefrontOrders.filter((o) => o.status === tab),
    [storefrontOrders, tab]
  );

  const pendingCount = storefrontOrders.filter((o) => o.status === 'pending').length;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const message = `Check out my store: ${businessProfile.businessName}%0A${storeUrl}`;
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const toggleStoreStatus = () => {
    updateBusinessProfile({ ...businessProfile, storefrontOpen: !businessProfile.storefrontOpen });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline text-2xl md:text-3xl font-bold text-brand-ink mb-1">
          My Storefront
        </h1>
        <p className="font-body text-sm text-brand-ink/60">
          Share your store link on WhatsApp & Instagram and take orders directly.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Share panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-brand-primary/10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-brand-bg flex items-center justify-center">
                <Store size={20} className="text-brand-primary" />
              </div>
              <div>
                <p className="font-headline font-bold text-brand-ink">{businessProfile.businessName}</p>
                <p className="font-body text-xs text-brand-ink/50">{inventory.length} products listed</p>
              </div>
            </div>

            <button
              onClick={toggleStoreStatus}
              className={`flex items-center gap-2 font-body text-xs font-bold px-3.5 py-2 rounded-full transition-colors ${
                businessProfile.storefrontOpen
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${businessProfile.storefrontOpen ? 'bg-green-500' : 'bg-red-500'}`} />
              {businessProfile.storefrontOpen ? 'Open' : 'Closed'}
            </button>
          </div>

          <label className="block font-body text-xs font-bold text-brand-ink/70 mb-1.5">Your Store Link</label>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 font-body text-sm text-brand-ink bg-brand-bg/20 px-4 py-3 rounded-lg truncate">
              {storeUrl}
            </div>
            <button
              onClick={handleCopyLink}
              className="shrink-0 w-11 h-11 flex items-center justify-center bg-brand-bg/40 rounded-lg hover:bg-brand-bg/60 transition"
              title="Copy link"
            >
              {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-brand-ink" />}
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white font-body text-sm font-bold px-4 py-2.5 rounded-lg hover:opacity-90 transition"
            >
              <Share2 size={16} /> Share via WhatsApp
            </button>
            <Link
              to={`/store/${businessProfile.storefrontSlug}`}
              target="_blank"
              className="flex-1 flex items-center justify-center gap-2 bg-brand-primary text-brand-bg font-body text-sm font-bold px-4 py-2.5 rounded-lg hover:opacity-90 transition"
            >
              <ExternalLink size={16} /> Preview Store
            </Link>
          </div>

          {!businessProfile.storefrontOpen && (
            <p className="font-body text-xs text-red-600 bg-red-50 rounded-lg px-4 py-2.5 mt-4">
              Your store is closed — customers can't place orders until you reopen it.
            </p>
          )}

          {!businessProfile.accountNumber && (
            <div className="flex items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mt-4">
              <p className="font-body text-xs text-amber-700">
                ⚠️ Bank details not set — customers can't pay by transfer until you add them.
              </p>
              <Link
                to="/app/settings"
                className="shrink-0 font-body text-xs font-bold text-amber-800 underline whitespace-nowrap"
              >
                Set it now
              </Link>
            </div>
          )}

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-brand-primary/10">
            <div>
              <p className="font-body text-xs font-bold text-brand-ink">Offer Delivery</p>
              <p className="font-body text-xs text-brand-ink/50">Customers can choose delivery at checkout</p>
            </div>
            <button
              onClick={toggleDelivery}
              className={`w-11 h-6 rounded-full transition-colors relative ${businessProfile.offersDelivery ? 'bg-brand-primary' : 'bg-brand-ink/15'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${businessProfile.offersDelivery ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>

        {/* QR code */}
        <div className="bg-white rounded-2xl p-6 border border-brand-primary/10 flex flex-col items-center justify-center text-center">
          <p className="font-body text-xs font-bold text-brand-ink/60 mb-4">Scan to Visit Store</p>
          <div className="bg-white p-3 rounded-xl border border-brand-primary/10">
            <QRCodeCanvas value={storeUrl} size={140} fgColor="#1c5b56" bgColor="#ffffff" level="M" />
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-headline text-lg font-bold text-brand-ink">Orders</h2>
        {pendingCount > 0 && (
          <span className="font-body text-xs font-bold bg-brand-accent text-brand-ink px-3 py-1 rounded-full">
            {pendingCount} pending
          </span>
        )}
      </div>

      <div className="flex gap-2 mb-5">
        {(['pending', 'confirmed', 'completed', 'declined'] as OrderTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-body text-sm font-bold px-4 py-2 rounded-lg capitalize transition-colors ${
              tab === t
                ? 'bg-brand-primary text-brand-bg'
                : 'bg-white text-brand-ink/60 border border-brand-primary/10 hover:border-brand-primary/30'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-brand-primary/10 text-center py-14">
            <Package size={28} className="text-brand-ink/20 mx-auto mb-3" />
            <p className="font-body text-sm text-brand-ink/50">No {tab} orders.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-brand-primary/10 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-body font-bold text-brand-ink">{order.customerName}</p>
                  <p className="font-body text-xs text-brand-ink/50">{order.customerPhone} · {order.date}</p>
                </div>
                <span className="font-body text-xs font-bold text-brand-primary bg-brand-bg/40 px-2.5 py-1 rounded-full capitalize">
                  {order.deliveryMethod}
                </span>
              </div>

              <div className="space-y-1.5 mb-4">
                {order.items.map((item) => (
                  <div key={item.itemId} className="flex justify-between font-body text-sm">
                    <span className="text-brand-ink/70">{item.quantity}x {item.name}</span>
                    <span className="text-brand-ink font-bold">{formatNaira(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {order.deliveryMethod === 'delivery' && order.deliveryAddress && (
                <p className="font-body text-xs text-brand-ink/50 mb-3">📍 {order.deliveryAddress}</p>
              )}

              <p className="font-body text-xs text-brand-ink/50 mb-3 capitalize">
                Payment: {order.paymentMethod === 'transfer' ? 'Bank Transfer' : 'Pay on Pickup'}
                {order.paymentConfirmed && ' · Confirmed'}
              </p>

              {order.paymentProof && (
                <a href={order.paymentProof} target="_blank" rel="noreferrer" className="block mb-3">
                  <img src={order.paymentProof} alt="Payment proof" className="h-24 rounded-lg border border-brand-primary/10 object-cover" />
                </a>
              )}

              <div className="border-t border-brand-primary/10 pt-3 flex items-center justify-between">
                <div>
                  <p className="font-body text-xs text-brand-ink/50">Total</p>
                  <p className="font-headline font-bold text-brand-primary">{formatNaira(order.total)}</p>
                </div>

                {order.status === 'pending' && order.paymentMethod === 'transfer' && (
                  <div className="flex gap-2">
                    <button onClick={() => declineStorefrontOrder(order.id)} className="flex items-center gap-1.5 font-body text-xs font-bold text-red-600 bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100/60 transition">
                      <XCircle size={14} /> Decline
                    </button>
                    <button onClick={() => confirmStorefrontOrder(order.id)} className="flex items-center gap-1.5 font-body text-xs font-bold bg-brand-primary text-brand-bg px-4 py-2 rounded-lg hover:opacity-90 transition">
                      <CheckCircle2 size={14} /> Confirm Payment
                    </button>
                  </div>
                )}

                {order.status === 'pending' && order.paymentMethod === 'pay_on_pickup' && (
                  <div className="flex gap-2">
                    <button onClick={() => declineStorefrontOrder(order.id)} className="flex items-center gap-1.5 font-body text-xs font-bold text-red-600 bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100/60 transition">
                      <XCircle size={14} /> Decline
                    </button>
                    <button onClick={() => completeStorefrontOrder(order.id)} className="flex items-center gap-1.5 font-body text-xs font-bold bg-brand-primary text-brand-bg px-4 py-2 rounded-lg hover:opacity-90 transition">
                      <CheckCircle2 size={14} /> Mark Picked Up & Paid
                    </button>
                  </div>
                )}

                {order.status === 'confirmed' && (
                  <button onClick={() => completeStorefrontOrder(order.id)} className="flex items-center gap-1.5 font-body text-xs font-bold bg-brand-primary text-brand-bg px-4 py-2 rounded-lg hover:opacity-90 transition">
                    <CheckCircle2 size={14} /> Mark Completed
                  </button>
                )}

                {order.status === 'completed' && (
                  <span className="flex items-center gap-1.5 font-body text-xs font-bold text-green-700">
                    <CheckCircle2 size={14} /> Completed
                    {order.deliveryFee ? ` · Dispatch ₦${order.deliveryFee.toLocaleString('en-NG')}` : ''}
                  </span>
                )}
                {order.status === 'declined' && (
                  <span className="flex items-center gap-1.5 font-body text-xs font-bold text-red-500">
                    <XCircle size={14} /> Declined
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}