import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Receipt,
  Wallet,
  TrendingUp,
  MessageCircle,
  Store,
  Sparkles,
} from 'lucide-react';

export default function Hero() {
  const bars = [42, 65, 48, 75, 58, 88, 72];

  return (
    <section className="relative min-h-205 overflow-hidden bg-brand-bg text-brand-ink">
      
      {/* Background typography */}
      <div
        className="
          pointer-events-none absolute
          -right-24 top-16
          font-headline font-black
          text-[180px] md:text-[240px]
          leading-none
          tracking-[-0.08em]
          text-brand-primary/[0.035]
          select-none
        "
      >
        HUSSLE
      </div>

      <div className="max-w-375 mx-auto px-5 sm:px-8 lg:px-12">

        <div className="relative grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-0 items-center min-h-205">

          {/* LEFT */}
          <div className="relative z-20 pt-20 lg:pt-0">

            {/* tiny brand marker */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-brand-primary" />
                <span className="w-2 h-2 rounded-full bg-brand-primary/40" />
                <span className="w-2 h-2 rounded-full bg-brand-primary/20" />
              </div>

              <span className="font-body text-[10px] font-bold uppercase tracking-[0.2em]">
                Business, simplified.
              </span>
            </div>

            {/* MASSIVE HEADLINE */}
            <h1
              className="
                font-headline
                font-black
                text-[4rem]
                sm:text-[5rem]
                lg:text-[6.3rem]
                xl:text-[7rem]
                leading-[0.84]
                tracking-[-0.065em]
              "
            >
              Your hustle.
              <br />

              <span className="relative inline-block text-brand-primary">
                Your rules.
                
                {/* hand-drawn-ish underline */}
                <svg
                  className="absolute -bottom-4 left-0 w-[90%] h-5"
                  viewBox="0 0 400 20"
                  fill="none"
                >
                  <path
                    d="M3 13C80 4 190 18 397 5"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Copy */}
            <p className="font-body text-sm sm:text-base leading-7 max-w-127.5 mt-10 text-brand-ink/70">
              Sales. Expenses. Customers. Receipts. Growth.
              <br className="hidden sm:block" />
              <span className="text-brand-ink font-bold">
                {' '}HussleWise puts the whole business in your hands.
              </span>
            </p>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-5 mt-9">

              <Link
                to="/signup"
                className="
                  group
                  inline-flex items-center gap-4
                  bg-brand-primary
                  text-brand-bg
                  px-7 py-4
                  rounded-full
                  font-body text-xs font-bold
                  shadow-[8px_8px_0px_#0e1b1a]
                  hover:translate-x-1
                  hover:translate-y-1
                  hover:shadow-[4px_4px_0px_#0e1b1a]
                  transition-all
                "
              >
                Start your hustle journey

                <span className="
                  flex items-center justify-center
                  w-7 h-7 rounded-full
                  bg-brand-bg text-brand-primary
                ">
                  <ArrowRight size={14} />
                </span>
              </Link>

              <Link
                to="/about"
                className="
                  flex items-center gap-2
                  font-body text-xs font-bold
                  border-b border-brand-ink
                  pb-1
                  hover:text-brand-primary
                  hover:border-brand-primary
                  transition
                "
              >
                Explore HussleWise
                <ArrowUpRight size={14} />
              </Link>

            </div>

            {/* Micro trust */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-7 font-body text-[9px] uppercase tracking-wider text-brand-ink/45">
              <span className="flex items-center gap-1.5">
                <Check size={11} /> Free to start
              </span>

              <span className="flex items-center gap-1.5">
                <Check size={11} /> Made for Nigeria
              </span>

              <span className="flex items-center gap-1.5">
                <Check size={11} /> No accounting degree
              </span>
            </div>

          </div>


          {/* RIGHT — PRODUCT COMPOSITION */}
          <div className="relative h-150 lg:h-190">

            {/* Large rotated green slab */}
            <div
              className="
                absolute
                right-[-15%]
                top-[12%]
                w-[95%]
                h-[68%]
                bg-brand-primary
                rounded-[3rem]
                rotate-[7deg]
                opacity-95
              "
            />

            {/* Decorative giant ₦ */}
            <div
              className="
                absolute
                right-[8%]
                top-[2%]
                font-headline font-black
                text-[170px]
                leading-none
                text-brand-bg/10
                rotate-[7deg]
              "
            >
              ₦
            </div>


            {/* MAIN DASHBOARD */}
            <div
              className="
                absolute
                z-10
                right-[5%]
                top-[10%]
                w-[82%]
                max-w-147.5
                bg-[#FAEBDD]
                rounded-3xl
                border-[1.5px]
                border-brand-ink/15
                shadow-[20px_25px_0px_rgba(14,27,26,0.16)]
                rotate-3
                overflow-hidden
              "
            >

              {/* Header */}
              <div className="
                flex items-center justify-between
                px-5 py-4
                border-b border-brand-ink/10
              ">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-brand-primary flex items-center justify-center">
                    <span className="text-brand-bg font-headline font-black text-[9px]">
                      HW
                    </span>
                  </div>

                  <span className="font-headline font-bold text-xs">
                    HussleWise
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                  <span className="font-body text-[8px] uppercase tracking-widest">
                    Live
                  </span>
                </div>
              </div>


              <div className="p-5">

                {/* Greeting */}
                <div className="flex justify-between items-end mb-5">
                  <div>
                    <p className="font-body text-[8px] uppercase tracking-widest text-brand-ink/45">
                      Wednesday, September 2
                    </p>

                    <h2 className="font-headline font-black text-xl mt-1">
                      Good morning, Nkechi.
                    </h2>
                  </div>

                  <div className="
                    px-3 py-1.5
                    rounded-full
                    bg-brand-accent
                    font-body text-[8px] font-bold
                  ">
                    ● Business healthy
                  </div>
                </div>


                {/* Balance */}
                <div className="
                  bg-brand-primary
                  rounded-2xl
                  p-5
                  text-brand-bg
                  relative
                  overflow-hidden
                ">

                  <div className="absolute -right-5 -top-10 text-[130px] font-headline font-black opacity-[0.06]">
                    ₦
                  </div>

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span className="font-body text-[8px] uppercase tracking-[0.18em] opacity-60">
                        Today's balance
                      </span>

                      <Wallet size={15} className="opacity-60" />
                    </div>

                    <div className="font-headline font-black text-4xl mt-2 tracking-tight">
                      ₦15,000
                    </div>

                    <div className="flex items-center gap-1.5 mt-2">
                      <TrendingUp size={12} />
                      <span className="font-body text-[9px]">
                        12.4% from yesterday
                      </span>
                    </div>
                  </div>
                </div>


                {/* Money in / money out */}
                <div className="grid grid-cols-2 gap-3 mt-3">

                  <div className="
                    bg-brand-bg
                    rounded-xl
                    p-4
                    border border-brand-ink/10
                  ">
                    <div className="flex justify-between">
                      <span className="font-body text-[8px] uppercase tracking-widest text-brand-ink/45">
                        Money In
                      </span>

                      <span className="
                        w-6 h-6 rounded-full
                        bg-brand-primary/10
                        flex items-center justify-center
                        text-brand-primary
                      ">
                        ↑
                      </span>
                    </div>

                    <p className="font-headline font-black text-xl mt-3">
                      ₦21,000
                    </p>

                    <p className="font-body text-[8px] text-brand-ink/40 mt-1">
                      8 sales today
                    </p>
                  </div>


                  <div className="
                    bg-brand-bg
                    rounded-xl
                    p-4
                    border border-brand-ink/10
                  ">
                    <div className="flex justify-between">
                      <span className="font-body text-[8px] uppercase tracking-widest text-brand-ink/45">
                        Money Out
                      </span>

                      <span className="
                        w-6 h-6 rounded-full
                        bg-brand-accent
                        flex items-center justify-center
                        text-brand-primary
                      ">
                        ↓
                      </span>
                    </div>

                    <p className="font-headline font-black text-xl mt-3">
                      ₦6,000
                    </p>

                    <p className="font-body text-[8px] text-brand-ink/40 mt-1">
                      3 expenses today
                    </p>
                  </div>

                </div>


                {/* Graph */}
                <div className="
                  mt-3
                  bg-brand-bg
                  rounded-xl
                  border border-brand-ink/10
                  p-4
                ">

                  <div className="flex justify-between items-center">
                    <span className="font-body text-[8px] uppercase tracking-widest text-brand-ink/45">
                      Sales this week
                    </span>

                    <span className="
                      font-body text-[8px] font-bold
                      text-brand-primary
                    ">
                      +18.6%
                    </span>
                  </div>

                  <div className="h-22.5 flex items-end gap-2 mt-4">
                    {bars.map((height, index) => (
                      <div
                        key={index}
                        className="flex-1 relative"
                        style={{ height: `${height}%` }}
                      >
                        <div
                          className={`
                            absolute inset-0 rounded-t-md
                            ${
                              index === 5
                                ? 'bg-brand-primary'
                                : 'bg-brand-primary/15'
                            }
                          `}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="
                    flex justify-between
                    font-body text-[7px]
                    text-brand-ink/35
                    mt-2
                  ">
                    <span>M</span>
                    <span>T</span>
                    <span>W</span>
                    <span>T</span>
                    <span>F</span>
                    <span>S</span>
                    <span>S</span>
                  </div>

                </div>

              </div>
            </div>


            {/* RECEIPT */}
            <div
              className="
                absolute
                z-30
                left-[0%]
                bottom-[18%]
                w-55
                bg-white
                rounded-xl
                p-4
                shadow-[10px_14px_0px_rgba(14,27,26,0.15)]
                rotate-[-9deg]
                border border-brand-ink/10
              "
            >

              <div className="flex items-center justify-between mb-4">
                <div className="
                  w-8 h-8 rounded-lg
                  bg-brand-primary
                  flex items-center justify-center
                  text-brand-bg
                ">
                  <Receipt size={15} />
                </div>

                <span className="
                  font-body text-[7px]
                  uppercase tracking-widest
                  text-brand-primary
                  font-bold
                ">
                  WhatsApp receipt
                </span>
              </div>

              <div className="border-t border-dashed border-brand-ink/15 pt-3">
                <p className="font-headline text-[11px] font-bold">
                  Nkechi Tomatoes
                </p>

                <div className="flex justify-between mt-3 font-body text-[8px]">
                  <span>Fresh tomatoes × 2</span>
                  <span>₦5,000</span>
                </div>

                <div className="
                  flex justify-between
                  mt-4 pt-3
                  border-t border-brand-ink/10
                  font-headline font-black text-sm
                ">
                  <span>Total</span>
                  <span>₦5,000</span>
                </div>
              </div>

              <div className="
                mt-3
                flex items-center gap-1.5
                font-body text-[7px]
                text-brand-primary
                font-bold
              ">
                <MessageCircle size={10} />
                Sent to Tolu
              </div>

            </div>


            {/* AI INSIGHT */}
            <div
              className="
                absolute
                z-40
                right-[-2%]
                bottom-[14%]
                w-47.5
                bg-brand-accent
                rounded-2xl
                p-4
                rotate-[7deg]
                shadow-[8px_10px_0px_rgba(14,27,26,0.14)]
              "
            >

              <div className="flex items-center gap-2">
                <div className="
                  w-7 h-7 rounded-full
                  bg-brand-primary
                  text-brand-bg
                  flex items-center justify-center
                ">
                  <Sparkles size={12} />
                </div>

                <span className="font-body text-[8px] font-bold uppercase tracking-widest">
                  Hussle Wise Insight
                </span>
              </div>

              <p className="
                font-headline
                font-bold
                text-[13px]
                leading-5
                mt-3
              ">
                Saturdays are your best sales days.
              </p>

              <p className="font-body text-[8px] leading-4 text-brand-ink/60 mt-2">
                Consider stocking more before the weekend.
              </p>

            </div>


            {/* QUICK ADD */}
            <div
              className="
                absolute
                z-40
                left-[10%]
                top-[5%]
                flex items-center gap-2
                bg-brand-bg
                border border-brand-ink/15
                rounded-full
                px-3 py-2
                shadow-lg
                rotate-[-5deg]
              "
            >
              <div className="
                w-7 h-7 rounded-full
                bg-brand-primary
                text-brand-bg
                flex items-center justify-center
                text-lg
              ">
                +
              </div>

              <span className="font-body text-[8px] font-bold uppercase tracking-wider">
                Add Sale
              </span>
            </div>


            {/* MARKETPLACE TAG */}
            <div
              className="
                absolute
                z-30
                right-[3%]
                top-[55%]
                flex items-center gap-2
                bg-brand-bg
                border border-brand-ink/10
                rounded-lg
                px-3 py-2
                shadow-lg
                rotate-[5deg]
              "
            >
              <Store size={14} className="text-brand-primary" />

              <div>
                <p className="font-body text-[7px] uppercase tracking-widest text-brand-ink/40">
                  Marketplace
                </p>

                <p className="font-headline font-bold text-[10px]">
                  Get discovered
                </p>
              </div>
            </div>


            {/* Decorative crosses */}
            <div className="absolute left-[5%] top-[28%] text-brand-primary text-3xl font-light">
              +
            </div>

            <div className="absolute right-[15%] top-[8%] text-brand-bg text-2xl opacity-60">
              ×
            </div>

          </div>

        </div>
      </div>


      {/* Bottom ticker */}
      <div className="
        absolute bottom-0 left-0 right-0
        border-y border-brand-ink/10
        bg-brand-primary
        text-brand-bg
        overflow-hidden
      ">
        <div className="
          flex items-center
          gap-10
          whitespace-nowrap
          py-3
          font-body text-[9px]
          uppercase tracking-[0.2em]
        ">
          <span>Money In ↑</span>
          <span>Money Out ↓</span>
          <span>Receipts</span>
          <span>Customers</span>
          <span>Business Growth</span>
          <span>CAC Registration</span>
          <span>AI Insights</span>
          <span>Marketplace</span>
        </div>
      </div>

    </section>
  );
}