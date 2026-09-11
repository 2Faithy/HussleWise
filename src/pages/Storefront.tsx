import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, X, Store, MapPin, Phone, Upload, Loader2, Check } from 'lucide-react';
import { formatNaira } from '../utils/currency';
import { getPublicStore, placePublicOrder, type PublicStoreProduct, type PublicStoreBusiness } from '../lib/api';

interface CartItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  availableStock: number;
}

export default function Storefront() {
  const { businessSlug } = useParams<{ businessSlug: string }>();
  const [business, setBusiness] = useState<PublicStoreBusiness | null>(null);
  const [products, setProducts] = useState<PublicStoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'confirmed'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'pay_on_pickup'>('transfer');
  const [proofFile, setProofFile] = useState<string | null>(null);
  const [proofFileName, setProofFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!businessSlug) return;
    (async () => {
      try {
        const data = await getPublicStore(businessSlug);
        setBusiness(data.business);
        setProducts(data.products);
      } catch {
        setLoadError('Store not found.');
      } finally {
        setLoading(false);
      }
    })();
  }, [businessSlug]);

  const addToCart = (item: PublicStoreProduct) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.itemId === item.id);
      if (existing) {
        return prev.map((c) => (c.itemId === item.id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { itemId: item.id, name: item.name, price: item.sellingPrice, quantity: 1, availableStock: item.quantity }];
    });
    setShowCart(true);
  };

  const adjustCartQty = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev.map((c) => (c.itemId === itemId ? { ...c, quantity: Math.max(0, c.quantity + delta) } : c)).filter((c) => c.quantity > 0)
    );
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => setProofFile(reader.result as string);
    reader.readAsDataURL(file);
  };

  const canSubmit =
    customerName.trim() &&
    customerPhone.trim() &&
    (deliveryMethod === 'pickup' || (deliveryAddress.trim() && paymentMethod === 'transfer')) &&
    (paymentMethod === 'pay_on_pickup' || !!proofFile);

  const handleSubmitOrder = async () => {
    if (!businessSlug || !canSubmit) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await placePublicOrder(businessSlug, {
        items: cart.map((c) => ({ itemId: c.itemId, quantity: c.quantity })),
        customerName,
        customerPhone,
        deliveryMethod,
        deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress : undefined,
        paymentMethod,
        paymentProof: proofFile || undefined,
      });
      setCheckoutStep('confirmed');
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong placing your order.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetOrder = () => {
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setDeliveryAddress('');
    setProofFile(null);
    setProofFileName('');
    setCheckoutStep('cart');
    setShowCart(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-brand-primary" />
      </div>
    );
  }

  if (loadError || !business) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center px-6 text-center">
        <div>
          <Store size={40} className="text-brand-primary mx-auto mb-4" />
          <h1 className="font-headline text-2xl font-bold text-brand-ink mb-2">Store not found</h1>
          <p className="font-body text-sm text-brand-ink/60">This store link may be incorrect or no longer active.</p>
        </div>
      </div>
    );
  }

  if (!business.storefrontOpen) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center px-6 text-center">
        <div>
          <Store size={40} className="text-brand-primary mx-auto mb-4" />
          <h1 className="font-headline text-2xl font-bold text-brand-ink mb-2">
            {business.businessName} is currently closed
          </h1>
          <p className="font-body text-sm text-brand-ink/60">Check back soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg pb-24">
      <div className="bg-brand-primary px-6 py-8 text-center">
        <h1 className="font-headline text-2xl md:text-3xl font-extrabold text-brand-bg mb-2">
          {business.businessName}
        </h1>
        <div className="flex items-center justify-center gap-4 font-body text-xs text-brand-bg/70">
          {business.address && <span className="flex items-center gap-1"><MapPin size={12} /> {business.address}</span>}
          {business.phone && <span className="flex items-center gap-1"><Phone size={12} /> {business.phone}</span>}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="font-headline text-lg font-bold text-brand-ink mb-5">Products</h2>

        {products.length === 0 ? (
          <p className="font-body text-sm text-brand-ink/50 text-center py-14">No products available right now.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((item) => {
              const inCart = cart.find((c) => c.itemId === item.id);
              const outOfStock = item.quantity <= 0;
              return (
                <div key={item.id} className="bg-white rounded-2xl p-5 border border-brand-primary/10">
                  <div className="w-full h-28 bg-brand-bg/30 rounded-xl mb-4 flex items-center justify-center">
                    <Store size={28} className="text-brand-primary/30" />
                  </div>
                  <p className="font-body font-bold text-brand-ink mb-1">{item.name}</p>
                  <p className="font-headline font-bold text-brand-primary mb-3">{formatNaira(item.sellingPrice)}</p>

                  {outOfStock ? (
                    <p className="font-body text-xs font-bold text-red-500 text-center py-2">Out of Stock</p>
                  ) : inCart ? (
                    <div className="flex items-center justify-between bg-brand-bg/30 rounded-lg px-3 py-1.5">
                      <button onClick={() => adjustCartQty(item.id, -1)} className="text-brand-primary"><Minus size={14} /></button>
                      <span className="font-body text-sm font-bold text-brand-ink">{inCart.quantity}</span>
                      <button onClick={() => adjustCartQty(item.id, 1)} className="text-brand-primary"><Plus size={14} /></button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item)}
                      className="w-full flex items-center justify-center gap-1.5 bg-brand-primary text-brand-bg font-body text-xs font-bold px-4 py-2.5 rounded-lg hover:opacity-90 transition"
                    >
                      <Plus size={14} /> Add to Cart
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {cartCount > 0 && !showCart && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-brand-ink text-brand-bg font-body text-sm font-bold px-6 py-3.5 rounded-full shadow-xl"
        >
          <ShoppingCart size={16} /> {cartCount} item{cartCount > 1 ? 's' : ''} · {formatNaira(cartTotal)}
        </button>
      )}

      {showCart && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4">
          <div className="absolute inset-0 bg-brand-ink/50" onClick={() => { setShowCart(false); setCheckoutStep('cart'); }} />

          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[85vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-headline text-lg font-bold text-brand-ink">
                {checkoutStep === 'cart' ? 'Your Cart' : checkoutStep === 'details' ? 'Checkout' : 'Order Placed!'}
              </h3>
              <button onClick={() => { setShowCart(false); setCheckoutStep('cart'); }} className="text-brand-ink/40 hover:text-brand-ink/70">
                <X size={20} />
              </button>
            </div>

            {checkoutStep === 'cart' && (
              <div>
                <div className="space-y-3 mb-5">
                  {cart.map((c) => (
                    <div key={c.itemId} className="flex items-center justify-between">
                      <div>
                        <p className="font-body text-sm font-bold text-brand-ink">{c.name}</p>
                        <p className="font-body text-xs text-brand-ink/50">{formatNaira(c.price)} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => adjustCartQty(c.itemId, -1)} className="w-7 h-7 rounded-lg bg-brand-bg/40 flex items-center justify-center"><Minus size={12} /></button>
                        <span className="font-body text-sm font-bold w-5 text-center">{c.quantity}</span>
                        <button onClick={() => adjustCartQty(c.itemId, 1)} className="w-7 h-7 rounded-lg bg-brand-bg/40 flex items-center justify-center"><Plus size={12} /></button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-brand-primary/10 pt-4 flex justify-between font-body font-bold mb-5">
                  <span className="text-brand-ink">Total</span>
                  <span className="text-brand-primary">{formatNaira(cartTotal)}</span>
                </div>
                <button onClick={() => setCheckoutStep('details')} className="w-full bg-brand-primary text-brand-bg font-body font-bold px-6 py-3 rounded-lg hover:opacity-90 transition">
                  Proceed to Checkout
                </button>
              </div>
            )}

            {checkoutStep === 'details' && (
              <div>
                <div className="space-y-4 mb-5">
                  <div>
                    <label className="block font-body text-xs font-bold text-brand-ink/70 mb-1.5">Your Name</label>
                    <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Tolu Adebayo" className="w-full font-body text-sm px-4 py-2.5 rounded-lg border border-brand-primary/20 bg-brand-bg/10 focus:outline-none focus:ring-2 focus:ring-brand-primary/40" />
                  </div>
                  <div>
                    <label className="block font-body text-xs font-bold text-brand-ink/70 mb-1.5">Phone Number</label>
                    <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="e.g. 0801 234 5678" className="w-full font-body text-sm px-4 py-2.5 rounded-lg border border-brand-primary/20 bg-brand-bg/10 focus:outline-none focus:ring-2 focus:ring-brand-primary/40" />
                  </div>

                  {business.offersDelivery && (
                    <div>
                      <label className="block font-body text-xs font-bold text-brand-ink/70 mb-1.5">Delivery Method</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['pickup', 'delivery'] as const).map((method) => (
                          <button
                            key={method}
                            onClick={() => {
                              setDeliveryMethod(method);
                              if (method === 'delivery') setPaymentMethod('transfer');
                            }}
                            className={`font-body text-xs font-bold px-3 py-2.5 rounded-lg border capitalize transition-colors ${
                              deliveryMethod === method ? 'bg-brand-primary text-brand-bg border-brand-primary' : 'bg-brand-bg/10 text-brand-ink border-brand-primary/10'
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {deliveryMethod === 'delivery' && (
                    <div>
                      <label className="block font-body text-xs font-bold text-brand-ink/70 mb-1.5">Delivery Address</label>
                      <input type="text" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="Street, area, landmark" className="w-full font-body text-sm px-4 py-2.5 rounded-lg border border-brand-primary/20 bg-brand-bg/10 focus:outline-none focus:ring-2 focus:ring-brand-primary/40" />
                      <p className="font-body text-xs text-brand-ink/40 mt-1.5">
                        The seller will call you to confirm the delivery fee, paid to the dispatch rider on arrival.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block font-body text-xs font-bold text-brand-ink/70 mb-1.5">Payment Method</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setPaymentMethod('transfer')}
                        className={`font-body text-xs font-bold px-3 py-3 rounded-lg border transition-colors ${
                          paymentMethod === 'transfer' ? 'bg-brand-primary text-brand-bg border-brand-primary' : 'bg-brand-bg/10 text-brand-ink border-brand-primary/10'
                        }`}
                      >
                        Bank Transfer
                      </button>
                      <button
                        onClick={() => setPaymentMethod('pay_on_pickup')}
                        disabled={deliveryMethod === 'delivery'}
                        className={`font-body text-xs font-bold px-3 py-3 rounded-lg border transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                          paymentMethod === 'pay_on_pickup' ? 'bg-brand-primary text-brand-bg border-brand-primary' : 'bg-brand-bg/10 text-brand-ink border-brand-primary/10'
                        }`}
                      >
                        Pay on Pickup
                      </button>
                    </div>
                  </div>

                  {paymentMethod === 'transfer' && (
                    <div className="bg-brand-bg/30 rounded-xl p-4 space-y-2">
                      <p className="font-body text-xs font-bold text-brand-ink/70">Transfer to:</p>
                      <p className="font-body text-sm text-brand-ink">{business.bankName || 'Bank not set'}</p>
                      <p className="font-headline text-lg font-bold text-brand-primary">{business.accountNumber || '—'}</p>
                      <p className="font-body text-sm text-brand-ink/70">{business.accountName || ''}</p>

                      <div className="pt-2">
                        <label className="block font-body text-xs font-bold text-brand-ink/70 mb-1.5">Upload Proof of Payment</label>
                        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-brand-primary/30 rounded-lg py-4 cursor-pointer hover:bg-white/50 transition">
                          <Upload size={16} className="text-brand-primary" />
                          <span className="font-body text-xs text-brand-ink/60">{proofFileName || 'Choose screenshot'}</span>
                          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'pay_on_pickup' && (
                    <div className="bg-brand-bg/30 rounded-xl p-4 font-body text-xs text-brand-ink/60">
                      You'll pay in cash or transfer when you pick up your order. The seller will call you to arrange a time.
                    </div>
                  )}
                </div>

                {submitError && (
                  <p className="font-body text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{submitError}</p>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setCheckoutStep('cart')} className="font-body text-sm font-bold text-brand-ink/60 px-5 py-3 rounded-lg hover:bg-brand-bg/30 transition">
                    Back
                  </button>
                  <button
                    onClick={handleSubmitOrder}
                    disabled={!canSubmit || submitting}
                    className="flex-1 flex items-center justify-center gap-2 bg-brand-primary text-brand-bg font-body font-bold px-6 py-3 rounded-lg hover:opacity-90 transition disabled:opacity-40"
                  >
                    {submitting ? <><Loader2 size={16} className="animate-spin" /> Placing Order...</> : `Place Order · ${formatNaira(cartTotal)}`}
                  </button>
                </div>
              </div>
            )}

            {checkoutStep === 'confirmed' && (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <Check size={24} className="text-green-600" />
                </div>
                <p className="font-body text-sm text-brand-ink/70 mb-6">
                  Your order has been sent to {business.businessName}. They'll reach out to {customerPhone} shortly.
                </p>
                <button onClick={resetOrder} className="bg-brand-primary text-brand-bg font-body font-bold px-6 py-3 rounded-lg hover:opacity-90 transition">
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}