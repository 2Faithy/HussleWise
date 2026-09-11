export type PaymentMethod = 'card' | 'transfer' | 'ussd';

export interface PaymentResult {
  success: boolean;
  reference: string;
  method: PaymentMethod;
}

/**
 * ⚠️ INTEGRATION POINT
 * This function simulates a payment processor charge (Paystack/Flutterwave style).
 * To go live, replace the body of this function with a real call, e.g.:
 *
 *   const res = await fetch('/api/payments/initialize', {
 *     method: 'POST',
 *     body: JSON.stringify({ amount, email, method }),
 *   });
 *   return await res.json();
 *
 * IMPORTANT: real payment processor secret keys must live on a server —
 * never call Paystack/Flutterwave's secret-key endpoints directly from
 * frontend code. The frontend should only ever talk to your own backend,
 * which then talks to the payment processor.
 */
export function processPayment(
  amount: number,
  method: PaymentMethod
): Promise<PaymentResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true, // simulate a 100% success rate for demo purposes
        reference: `HW-${Date.now()}`,
        method,
      });
    }, 2200); // simulate real network/processing delay
  });
}