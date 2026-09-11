import { TrendingUp, AlertTriangle, Info, Gauge } from 'lucide-react';
import { useBusinessData } from '../context/BusinessDataContext';
import { calculateHealthScore, generateInsights } from '../utils/growthInsights';

export default function GrowthTools() {
  const { sales, expenses, debts, inventory, receiptsSentIds } = useBusinessData();

  const healthScore = calculateHealthScore(sales, expenses, debts, inventory, receiptsSentIds.length);
  const insights = generateInsights(sales, expenses, debts, inventory);

  const getScoreLabel = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-green-600' };
    if (score >= 60) return { label: 'Good', color: 'text-brand-primary' };
    if (score >= 40) return { label: 'Fair', color: 'text-yellow-600' };
    return { label: 'Needs Attention', color: 'text-red-500' };
  };

  const scoreInfo = getScoreLabel(healthScore);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (healthScore / 100) * circumference;

  const insightStyles: Record<string, { bg: string; icon: typeof TrendingUp; iconColor: string }> = {
    positive: { bg: 'bg-green-50 border-green-100', icon: TrendingUp, iconColor: 'text-green-600' },
    warning: { bg: 'bg-red-50 border-red-100', icon: AlertTriangle, iconColor: 'text-red-500' },
    neutral: { bg: 'bg-brand-bg/30 border-brand-primary/10', icon: Info, iconColor: 'text-brand-primary' },
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline text-2xl md:text-3xl font-bold text-brand-ink mb-1">
          Growth Tools
        </h1>
        <p className="font-body text-sm text-brand-ink/60">
          Data-driven insights to help your business grow smarter.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Business Health Score */}
        <div className="bg-white rounded-2xl p-8 border border-brand-primary/10 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 mb-4">
            <Gauge size={16} className="text-brand-primary" />
            <p className="font-body text-xs font-bold text-brand-ink/60 uppercase tracking-wide">
              Business Health Score
            </p>
          </div>

          <div className="relative w-36 h-36 mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#ecba9130" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="54" fill="none"
                stroke="#1c5b56" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-headline text-3xl font-extrabold text-brand-ink">{healthScore}</span>
              <span className="font-body text-xs text-brand-ink/50">/ 100</span>
            </div>
          </div>

          <span className={`font-body text-sm font-bold ${scoreInfo.color}`}>{scoreInfo.label}</span>
          <p className="font-body text-xs text-brand-ink/50 mt-2 max-w-xs">
            Based on tracking consistency, profit margin, debt management, and receipts sent.
          </p>
        </div>

        {/* Insights */}
        <div className="md:col-span-2 space-y-3">
          {insights.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-brand-primary/10 text-center h-full flex items-center justify-center">
              <p className="font-body text-sm text-brand-ink/50">
                Log more sales and expenses to unlock personalized insights.
              </p>
            </div>
          ) : (
            insights.map((insight, i) => {
              const style = insightStyles[insight.type];
              const Icon = style.icon;
              return (
                <div key={i} className={`flex items-start gap-3 rounded-xl border p-4 ${style.bg}`}>
                  <Icon size={18} className={`shrink-0 mt-0.5 ${style.iconColor}`} />
                  <p className="font-body text-sm text-brand-ink">{insight.message}</p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* What improves your score */}
      <div className="bg-brand-primary rounded-2xl p-8">
        <h3 className="font-headline text-lg font-bold text-brand-bg mb-4">
          How to Improve Your Score
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            'Log sales and expenses consistently, every day',
            'Keep your profit margin healthy by reviewing costs',
            'Follow up on overdue debts before they pile up',
            'Send receipts to customers for every sale',
            'Restock low inventory before it runs out',
          ].map((tip) => (
            <div key={tip} className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2 shrink-0" />
              <p className="font-body text-sm text-brand-bg/80">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}