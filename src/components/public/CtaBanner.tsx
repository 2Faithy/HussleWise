import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CtaBanner() {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-20 md:pb-28">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0E1B1A] border-3 border-[#0E1B1A] p-8 md:p-16 shadow-[12px_12px_0px_#E2F163]">
        {/* Subtle background grid pattern */}
        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        {/* Floating background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E2F163]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
          {/* Left Column: Direct Copy & Action */}
          <div className="text-left">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-[#E2F163] text-[#0E1B1A] font-mono text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-md border border-[#0E1B1A] shadow-[2px_2px_0px_#ffffff] mb-6">
              <Sparkles size={14} /> Start in under 2 minutes
            </div>

            {/* Localized, Punchy Headline */}
            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.05] tracking-tight mb-6">
              Turn your daily sales into{' '}
              <span className="text-[#E2F163] underline decoration-wavy decoration-1 underline-offset-8">
                real profit.
              </span>
            </h2>

            <p className="font-body text-white/70 text-base md:text-lg max-w-xl mb-8 leading-relaxed">
              Ditch lost notebooks and calculated guesses. Start logging transactions, printing WhatsApp receipts, and tracking cash flow on Hussle Wise today.
            </p>

            {/* Quick Feature Checklist */}
            <div className="grid sm:grid-cols-2 gap-3 mb-8 font-body text-xs font-bold text-white/90">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#E2F163] shrink-0" />
                <span>Instant Setup (No CAC required)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#E2F163] shrink-0" />
                <span>Works 100% on Mobile</span>
              </div>
            </div>

            {/* Action Area */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#E2F163] text-[#0E1B1A] font-headline font-black uppercase tracking-wider text-xs px-8 py-4 rounded-xl border-2 border-[#0E1B1A] shadow-[4px_4px_0px_#ffffff] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                Create Free Account
                <ArrowRight size={16} />
              </Link>

              <div className="flex items-center gap-2 text-white/50 text-xs font-mono">
                <ShieldCheck size={16} className="text-[#E2F163]" />
                <span>Free forever option · Zero card needed</span>
              </div>
            </div>
          </div>

          {/* Right Column: Tactile App Snapshot replacing generic GIF */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="w-full max-w-sm bg-[#FAF7F2] border-3 border-[#0E1B1A] rounded-2xl p-6 text-[#0E1B1A] shadow-[8px_8px_0px_#E2F163] relative rotate-1 hover:rotate-0 transition-transform duration-300">
              
              {/* Card Header / Badge */}
              <div className="flex justify-between items-center pb-4 border-b-2 border-dashed border-[#0E1B1A]/20 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#E2F163] border border-[#0E1B1A]" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#0E1B1A]/60">
                    Live Record Preview
                  </span>
                </div>
                <span className="bg-[#0E1B1A] text-[#E2F163] font-mono text-[9px] font-bold px-2 py-0.5 rounded">
                  TODAY
                </span>
              </div>

              {/* Sample Financial Widget */}
              <div className="space-y-4">
                <div className="bg-white border-2 border-[#0E1B1A] p-4 rounded-xl shadow-[3px_3px_0px_#0E1B1A]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-body text-[10px] uppercase tracking-wider font-bold text-[#0E1B1A]/60">
                      Total Revenue Logged
                    </span>
                    <TrendingUp size={14} className="text-[#0E1B1A]" />
                  </div>
                  <p className="font-headline text-3xl font-black text-[#0E1B1A]">
                    ₦148,500
                  </p>
                  <p className="font-mono text-[10px] text-[#0E1B1A]/70 mt-1">
                    +18 sales completed today
                  </p>
                </div>

                {/* Sample WhatsApp Receipt Badge */}
                <div className="bg-[#F4D2B8] border-2 border-[#0E1B1A] p-3 rounded-xl flex items-center justify-between shadow-[3px_3px_0px_#0E1B1A]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#0E1B1A] text-white flex items-center justify-center font-black text-xs">
                      💬
                    </div>
                    <div>
                      <p className="font-headline font-bold text-xs">WhatsApp Receipt Sent</p>
                      <p className="font-body text-[10px] text-[#0E1B1A]/70">Customer: Tolu (Lagos)</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-black text-[#0E1B1A]">₦12,000</span>
                </div>
              </div>

              {/* Social Proof Footer inside Card */}
              <div className="mt-5 pt-4 border-t-2 border-dashed border-[#0E1B1A]/20 flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-[#E2F163] border-2 border-[#0E1B1A] flex items-center justify-center font-mono text-[9px] font-bold">
                    KA
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#F4D2B8] border-2 border-[#0E1B1A] flex items-center justify-center font-mono text-[9px] font-bold">
                    CE
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white border-2 border-[#0E1B1A] flex items-center justify-center font-mono text-[9px] font-bold">
                    +1k
                  </div>
                </div>
                <p className="font-body text-[10px] font-bold text-[#0E1B1A]/80 leading-tight">
                  Joined by 1,000+ Nigerian business owners
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}