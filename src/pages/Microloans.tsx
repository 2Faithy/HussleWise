import { ExternalLink, HandCoins, Gift, Handshake, Landmark, TrendingUp } from 'lucide-react';
import { useBusinessData } from '../context/BusinessDataContext';
import { calculateHealthScore } from '../utils/growthInsights';

interface FundingOption {
  key: string;
  title: string;
  description: string;
  icon: typeof HandCoins;
  formUrl: string;
  minScore: number;
}

const fundingOptions: FundingOption[] = [
  {
    key: 'loan',
    title: 'Microloan',
    description: 'Short-term financing to cover inventory, restocking, or cashflow gaps. Repaid in fixed monthly installments.',
    icon: HandCoins,
    formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc123iCkSyVDjXKZ54Y4CKX6ZDmZfRhrPw9IaD0bcwhNj71JA/viewform?usp=publish-editor', 
    minScore: 40,
  },
  {
    key: 'grant',
    title: 'Business Grant',
    description: 'Non-repayable funding for businesses showing strong, consistent growth — no interest, no repayment.',
    icon: Gift,
    formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSffladwf6XZEIeEn2wLyPSrfKuP2Fdf8zV2MqPWrtSJs-Vb9Q/viewform?usp=publish-editor', 
    minScore: 60,
  },
  {
    key: 'partnership',
    title: 'Growth Partnership',
    description: 'Strategic support — supplier connections, mentorship, or co-investment — for businesses ready to scale.',
    icon: Handshake,
    formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScZcTMht0GnBxdFEdMLfVPizF1AziHZMDK_3B4MhwEgzbkCPg/viewform?usp=publish-editor', // placeholder — replace with real form link
    minScore: 50,
  },
];

export default function Microloans() {
  const { sales, expenses, debts, inventory, receiptsSentIds } = useBusinessData();
  const healthScore = calculateHealthScore(sales, expenses, debts, inventory, receiptsSentIds.length);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline text-2xl md:text-3xl font-bold text-brand-ink mb-1">
          Funding
        </h1>
        <p className="font-body text-sm text-brand-ink/60">
          Explore loans, grants, and partnerships to help your business grow.
        </p>
      </div>

      {/* Health score context banner */}
      <div className="bg-brand-primary rounded-2xl p-6 mb-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-brand-accent/20 flex items-center justify-center shrink-0">
          <TrendingUp size={22} className="text-brand-accent" />
        </div>
        <div>
          <p className="font-headline font-bold text-brand-bg">
            Your Business Health Score: {healthScore}/100
          </p>
          <p className="font-body text-xs text-brand-bg/70">
            A higher score improves your chances across every funding type below. Keep tracking sales, paying down debts, and sending receipts to raise it.
          </p>
        </div>
      </div>

      {/* Funding type cards */}
      <p className="font-body text-sm font-bold text-brand-ink/70 mb-4">
        Choose the type of funding you're looking for:
      </p>

      <div className="grid md:grid-cols-3 gap-5">
        {fundingOptions.map(({ key, title, description, icon: Icon, formUrl, minScore }) => {
          const meetsMinimum = healthScore >= minScore;
          return (
            <div
              key={key}
              className="bg-white rounded-2xl p-6 border border-brand-primary/10 flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-bg flex items-center justify-center mb-4">
                <Icon size={22} className="text-brand-primary" />
              </div>
              <h3 className="font-headline text-lg font-bold text-brand-ink mb-2">{title}</h3>
              <p className="font-body text-sm text-brand-ink/60 mb-4 flex-1">{description}</p>

              {!meetsMinimum && (
                <p className="font-body text-xs text-yellow-700 bg-yellow-50 rounded-lg px-3 py-2 mb-4">
                  Recommended score: {minScore}+ (yours: {healthScore}). You can still apply.
                </p>
              )}

              <a
                href={formUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-brand-primary text-brand-bg font-body text-sm font-bold px-5 py-3 rounded-lg hover:opacity-90 transition"
              >
                Apply Now
                <ExternalLink size={15} />
              </a>
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-3 bg-white rounded-2xl border border-brand-primary/10 p-5 mt-8">
        <Landmark size={18} className="text-brand-primary shrink-0 mt-0.5" />
        <p className="font-body text-xs text-brand-ink/60">
          Applications are reviewed by the Husslewise team and our funding partners. Each option opens a
          short application form — approval and funding are handled outside the app once your application
          is submitted.
        </p>
      </div>
    </div>
  );
}