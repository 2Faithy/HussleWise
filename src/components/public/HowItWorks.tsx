import {
  PenLine,
  LineChart,
  Sparkles,
  ArrowUpRight,
  Wallet,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';

interface Step {
  number: string;
  icon: React.ElementType;
  eyebrow: string;
  title: string;
  desc: string;
}

const steps: Step[] = [
  {
    number: '01',
    icon: PenLine,
    eyebrow: 'START HERE',
    title: 'Track Your Money',
    desc: "Replace scattered notebooks and mental calculations with a record that's always at your fingertips.",
  },
  {
    number: '02',
    icon: LineChart,
    eyebrow: 'SEE CLEARLY',
    title: 'Understand Patterns',
    desc: 'Turn your everyday transactions into insights about what sells, when you earn, and where money goes.',
  },
  {
    number: '03',
    icon: Sparkles,
    eyebrow: 'MOVE SMARTER',
    title: 'Make Better Decisions',
    desc: 'Use what your numbers tell you to improve pricing, stock, customers, and your next big move.',
  },
];

export default function HowItWorks() {
  return (
    <section 
      aria-label="How Hussle Wise Works" 
      className="relative overflow-hidden bg-brand-primary text-brand-bg"
    >
      {/* Decorative background numbers */}
      <div 
        aria-hidden="true" 
        className="absolute -top-16 -right-10 font-headline text-[180px] md:text-[260px] font-black leading-none text-brand-bg/[0.035] select-none pointer-events-none"
      >
        03
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 relative">
        {/* HEADER */}
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-end mb-20">
          <div>
            <span className="inline-flex items-center gap-2 font-body text-[10px] tracking-[0.2em] font-bold text-brand-accent uppercase">
              <span className="w-6 h-px bg-brand-accent" aria-hidden="true" />
              Simple by design
            </span>

            <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl font-black leading-[0.95] mt-5">
              Your hustle.
              <br />
              <span className="text-brand-accent">Made clearer.</span>
            </h2>
          </div>

          <div className="lg:max-w-md lg:ml-auto">
            <p className="font-body text-sm md:text-base leading-7 text-brand-bg/65">
              Hussle Wise turns the everyday things you already do into
              information you can actually use — from your first sale to your next growth decision.
            </p>
          </div>
        </div>

        {/* JOURNEY */}
        <div className="relative">
          {/* Desktop connecting line */}
          <div className="hidden lg:block absolute top-[58px] left-[8%] right-[8%] h-px bg-brand-bg/15" aria-hidden="true" />

          <div className="grid lg:grid-cols-3 gap-6">
            {/* STEP 1 */}
            <div className="relative group">
              <div className="relative min-h-[430px] bg-brand-bg text-brand-ink rounded-[2rem] p-7 md:p-8 overflow-hidden">
                <div className="flex items-center justify-between relative z-10">
                  <span className="font-body text-[10px] font-bold tracking-[0.2em] text-brand-primary">
                    {steps[0].number} / {steps[0].eyebrow}
                  </span>

                  <div className="w-11 h-11 rounded-full bg-brand-primary text-brand-bg flex items-center justify-center">
                    <PenLine size={18} aria-hidden="true" />
                  </div>
                </div>

                {/* Notebook infographic */}
                <div className="mt-10 relative h-40">
                  <div className="absolute left-5 top-3 w-[82%] bg-[#f4d2b8] rounded-xl p-5 rotate-[-4deg] shadow-[8px_8px_0px_rgba(14,27,26,0.1)]">
                    <div className="flex justify-between items-center mb-5">
                      <span className="font-body text-[9px] font-bold uppercase tracking-wider">
                        Today's sales
                      </span>
                      <span className="font-body text-[9px] text-brand-primary">
                        12 Aug
                      </span>
                    </div>

                    <div className="font-headline text-3xl font-black">
                      ₦24,500
                    </div>

                    <div className="flex gap-2 mt-4">
                      <span className="px-2 py-1 bg-brand-primary text-brand-bg rounded text-[8px] font-body">
                        CASH
                      </span>
                      <span className="px-2 py-1 bg-brand-bg text-brand-primary rounded text-[8px] font-body">
                        4 SALES
                      </span>
                    </div>
                  </div>

                  <div className="absolute right-0 bottom-1 bg-brand-primary text-brand-bg rounded-xl px-4 py-3 rotate-[5deg] shadow-lg">
                    <Wallet size={15} className="mb-2" aria-hidden="true" />
                    <p className="font-body text-[8px] uppercase tracking-wider opacity-60">
                      Money in
                    </p>
                    <p className="font-headline text-sm font-bold">
                      +₦24,500
                    </p>
                  </div>
                </div>

                <div className="mt-8 relative z-10">
                  <h3 className="font-headline text-2xl font-black mb-3">
                    {steps[0].title}
                  </h3>
                  <p className="font-body text-xs md:text-sm leading-6 text-brand-ink/60">
                    {steps[0].desc}
                  </p>
                </div>
              </div>
            </div>

            {/* STEP 2 */}
            <div className="relative group lg:mt-12">
              <div className="relative min-h-[430px] bg-[#f4d2b8] text-brand-ink rounded-[2rem] p-7 md:p-8 overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="font-body text-[10px] font-bold tracking-[0.2em] text-brand-primary">
                    {steps[1].number} / {steps[1].eyebrow}
                  </span>

                  <div className="w-11 h-11 rounded-full bg-brand-primary text-brand-bg flex items-center justify-center">
                    <LineChart size={18} aria-hidden="true" />
                  </div>
                </div>

                {/* Chart infographic */}
                <div className="mt-10 h-40 relative">
                  <div className="absolute inset-x-0 top-4 space-y-7" aria-hidden="true">
                    <div className="border-t border-brand-ink/10" />
                    <div className="border-t border-brand-ink/10" />
                    <div className="border-t border-brand-ink/10" />
                    <div className="border-t border-brand-ink/10" />
                  </div>

                  <svg
                    viewBox="0 0 400 150"
                    className="absolute inset-0 w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M0 125 C45 120 45 90 85 100 S135 70 170 82 S220 45 250 62 S300 30 335 42 S375 15 400 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-brand-primary"
                    />
                  </svg>

                  <div className="absolute right-0 top-0 bg-brand-primary text-brand-bg rounded-xl px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp size={12} aria-hidden="true" />
                      <span className="font-body text-[9px] font-bold">
                        +24.8%
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 flex justify-between font-body text-[8px] text-brand-ink/40 uppercase">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>

                {/* Insight */}
                <div className="mt-8 bg-brand-bg/60 rounded-xl p-4 flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-brand-primary text-brand-bg flex items-center justify-center shrink-0">
                    <Sparkles size={12} aria-hidden="true" />
                  </div>

                  <div>
                    <p className="font-body text-[8px] uppercase tracking-wider text-brand-ink/40 mb-1">
                      Hussle insight
                    </p>
                    <p className="font-body text-[10px] font-bold leading-4">
                      Saturdays are your strongest sales days.
                    </p>
                  </div>
                </div>

                <div className="mt-7">
                  <h3 className="font-headline text-2xl font-black mb-3">
                    {steps[1].title}
                  </h3>
                  <p className="font-body text-xs md:text-sm leading-6 text-brand-ink/60">
                    {steps[1].desc}
                  </p>
                </div>
              </div>
            </div>

            {/* STEP 3 */}
            <div className="relative group">
              <div className="relative min-h-[430px] bg-brand-bg text-brand-ink rounded-[2rem] p-7 md:p-8 overflow-hidden">
                <div className="flex items-center justify-between relative z-10">
                  <span className="font-body text-[10px] font-bold tracking-[0.2em] text-brand-primary">
                    {steps[2].number} / {steps[2].eyebrow}
                  </span>

                  <div className="w-11 h-11 rounded-full bg-brand-accent text-brand-ink flex items-center justify-center">
                    <Sparkles size={18} aria-hidden="true" />
                  </div>
                </div>

                {/* Decision infographic */}
                <div className="mt-10 h-40 relative">
                  <div className="absolute left-0 top-3 w-[72%] bg-brand-primary text-brand-bg rounded-2xl p-5 rotate-[-3deg] shadow-[8px_8px_0px_rgba(14,27,26,0.12)]">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-6 h-6 rounded-full bg-brand-accent flex items-center justify-center">
                        <Sparkles size={11} className="text-brand-ink" aria-hidden="true" />
                      </div>

                      <span className="font-body text-[8px] uppercase tracking-wider text-brand-bg/50">
                        Smart recommendation
                      </span>
                    </div>

                    <p className="font-headline text-sm font-bold leading-5">
                      Restock your
                      <br />
                      top-selling product.
                    </p>
                  </div>

                  <div className="absolute right-0 bottom-1 w-28 bg-brand-accent rounded-xl p-3 rotate-[6deg]">
                    <ShoppingBag size={15} className="text-brand-ink mb-2" aria-hidden="true" />

                    <p className="font-body text-[8px] uppercase tracking-wider text-brand-ink/50">
                      Action
                    </p>

                    <p className="font-headline text-xs font-black">
                      + Stock
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-headline text-2xl font-black mb-3">
                    {steps[2].title}
                  </h3>
                  <p className="font-body text-xs md:text-sm leading-6 text-brand-ink/60">
                    {steps[2].desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM STATEMENT */}
        <div className="mt-16 pt-8 border-t border-brand-bg/15 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2" aria-hidden="true">
              <div className="w-8 h-8 rounded-full bg-brand-accent border-2 border-brand-primary" />
              <div className="w-8 h-8 rounded-full bg-brand-bg border-2 border-brand-primary" />
              <div className="w-8 h-8 rounded-full bg-[#f4d2b8] border-2 border-brand-primary" />
            </div>

            <p className="font-body text-[10px] text-brand-bg/50">
              Built around how real businesses work.
            </p>
          </div>

          <a 
            href="#get-started" 
            className="flex items-center gap-2 font-body text-[10px] uppercase tracking-wider font-bold text-brand-accent hover:underline focus:outline-none focus:ring-2 focus:ring-brand-accent rounded"
          >
            Start with your first sale
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}