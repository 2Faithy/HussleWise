import { useState } from 'react';
import { Check, Sparkles, ArrowRight, ShieldCheck, MessageCircle, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PricingNeoBrutalist() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <section className="bg-[#FAF7F2] py-24 px-6 relative overflow-hidden">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#0E1B1A_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F4D2B8] text-[#0E1B1A] font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border-2 border-[#0E1B1A] shadow-[2px_2px_0px_#0E1B1A] mb-4">
            <Sparkles size={14} /> Straightforward Pricing
          </div>
          <h2 className="font-headline text-4xl md:text-5xl font-black text-[#0E1B1A] tracking-tight mb-4">
            No long talk. Just transparent plans.
          </h2>
          <p className="font-body text-[#0E1B1A]/80 text-base md:text-lg">
            Start logging sales for free today. Upgrade only when your business needs bigger tools.
          </p>

          {/* Billing Switcher Toggle */}
          <div className="inline-flex items-center bg-white border-2 border-[#0E1B1A] p-1 rounded-xl shadow-[4px_4px_0px_#0E1B1A] mt-8">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 font-body text-xs font-bold rounded-lg transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-[#0E1B1A] text-white'
                  : 'text-[#0E1B1A] hover:bg-black/5'
              }`}
            >
              Pay Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-5 py-2 font-body text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-[#0E1B1A] text-white'
                  : 'text-[#0E1B1A] hover:bg-black/5'
              }`}
            >
              Pay Yearly
              <span className="bg-[#E2F163] text-[#0E1B1A] text-[10px] px-2 py-0.5 rounded-full font-black border border-[#0E1B1A]">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {/* FREE PLAN */}
          <div className="bg-white border-3 border-[#0E1B1A] rounded-2xl p-8 flex flex-col justify-between shadow-[8px_8px_0px_#0E1B1A] relative hover:-translate-y-1 transition-transform duration-200">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0E1B1A]/60">
                    STARTER
                  </span>
                  <h3 className="font-headline text-3xl font-black text-[#0E1B1A]">Free Plan</h3>
                </div>
                <span className="bg-[#FAF7F2] border border-[#0E1B1A] font-mono text-[10px] font-bold px-3 py-1 rounded-md text-[#0E1B1A]">
                  NO CARD NEEDED
                </span>
              </div>

              <p className="font-body text-xs text-[#0E1B1A]/70 mb-6">
                Perfect for solo hustlers building the daily habit of record keeping.
              </p>

              <div className="mb-8 pb-6 border-b-2 border-dashed border-[#0E1B1A]/20">
                <div className="flex items-baseline gap-1">
                  <span className="font-headline text-5xl font-black text-[#0E1B1A]">₦0</span>
                  <span className="font-mono text-xs text-[#0E1B1A]/60 uppercase font-bold">/ Forever</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0E1B1A]">
                  What's Included:
                </p>
                {[
                  'Sales & expense digital ledger',
                  '5 downloadable PDF receipts / mo',
                  'Customer contact book',
                  'Weekly profit & loss summary email',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 font-body text-sm text-[#0E1B1A]">
                    <div className="w-5 h-5 rounded bg-[#FAF7F2] border border-[#0E1B1A] flex items-center justify-center shrink-0">
                      <Check size={12} strokeWidth={3} className="text-[#0E1B1A]" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/signup"
              className="w-full py-4 text-center font-headline font-black uppercase tracking-wider text-xs bg-white text-[#0E1B1A] border-2 border-[#0E1B1A] rounded-xl shadow-[4px_4px_0px_#0E1B1A] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              Get Started Free
            </Link>
          </div>

          {/* PREMIUM PLAN */}
          <div className="bg-[#0E1B1A] text-white border-3 border-[#0E1B1A] rounded-2xl p-8 flex flex-col justify-between shadow-[8px_8px_0px_#E2F163] relative hover:-translate-y-1 transition-transform duration-200">
            {/* Pop-out Sticker Badge */}
            <div className="absolute -top-4 right-6 bg-[#E2F163] text-[#0E1B1A] border-2 border-[#0E1B1A] font-mono text-xs font-black uppercase tracking-wider px-3 py-1 rounded-md shadow-[3px_3px_0px_#0E1B1A] rotate-2 flex items-center gap-1">
              <Sparkles size={12} /> Recommended
            </div>

            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#E2F163]">
                    FULL POWER
                  </span>
                  <h3 className="font-headline text-3xl font-black">Premium Hustler</h3>
                </div>
              </div>

              <p className="font-body text-xs text-white/70 mb-6">
                Everything you need to project trust, automate operations, and scale profit.
              </p>

              <div className="mb-8 pb-6 border-b-2 border-dashed border-white/20">
                <div className="flex items-baseline gap-1">
                  <span className="font-headline text-5xl font-black text-[#E2F163]">
                    {billingCycle === 'monthly' ? '₦1,000' : '₦9,600'}
                  </span>
                  <span className="font-mono text-xs text-white/60 uppercase font-bold">
                    {billingCycle === 'monthly' ? '/ Month' : '/ Year (₦800/mo)'}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#E2F163]">
                  Everything in Free, plus:
                </p>

                <div className="flex items-start gap-3 font-body text-sm">
                  <div className="w-5 h-5 rounded bg-[#E2F163] text-[#0E1B1A] flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <div>
                    <span className="font-bold text-white">Unlimited Receipts</span>
                    <p className="text-xs text-white/60">Generate branded receipts with your logo</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 font-body text-sm">
                  <div className="w-5 h-5 rounded bg-[#E2F163] text-[#0E1B1A] flex items-center justify-center shrink-0 mt-0.5">
                    <MessageCircle size={12} strokeWidth={3} />
                  </div>
                  <div>
                    <span className="font-bold text-white">1-Click WhatsApp Receipts</span>
                    <p className="text-xs text-white/60">Send receipts & promo offers straight to chats</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 font-body text-sm">
                  <div className="w-5 h-5 rounded bg-[#E2F163] text-[#0E1B1A] flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={12} strokeWidth={3} />
                  </div>
                  <div>
                    <span className="font-bold text-white">AI Business Assistant</span>
                    <p className="text-xs text-white/60">Automated restock alerts & pricing recommendations</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 font-body text-sm">
                  <div className="w-5 h-5 rounded bg-[#E2F163] text-[#0E1B1A] flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 size={12} strokeWidth={3} />
                  </div>
                  <div>
                    <span className="font-bold text-white">CAC Registration Discount</span>
                    <p className="text-xs text-white/60">Priority legal setup at member-only rates</p>
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/signup"
              className="w-full py-4 text-center font-headline font-black uppercase tracking-wider text-xs bg-[#E2F163] text-[#0E1B1A] border-2 border-[#0E1B1A] rounded-xl shadow-[4px_4px_0px_#ffffff] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              Start 14-Day Free Trial <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Bottom Trust Banner */}
        <div className="mt-16 bg-white border-2 border-[#0E1B1A] rounded-2xl p-6 max-w-4xl mx-auto shadow-[4px_4px_0px_#0E1B1A] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F4D2B8] border border-[#0E1B1A] flex items-center justify-center text-[#0E1B1A] shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="font-headline font-bold text-sm text-[#0E1B1A]">
                Need CAC Registration or Marketplace Badges separately?
              </p>
              <p className="font-body text-xs text-[#0E1B1A]/70">
                You can purchase standalone business services without subscribing to monthly plans.
              </p>
            </div>
          </div>
          <Link
            to="/services"
            className="font-mono text-xs font-bold text-[#0E1B1A] underline underline-offset-4 hover:opacity-80 shrink-0"
          >
            Explore Add-ons →
          </Link>
        </div>
      </div>
    </section>
  );
}