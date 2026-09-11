import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export default function StatCard({ label, value, icon: Icon, trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-brand-primary/10">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-brand-bg flex items-center justify-center">
          <Icon size={18} className="text-brand-primary" />
        </div>
        {trend && (
          <span
            className={`font-body text-xs font-bold px-2 py-1 rounded-full ${
              trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      <p className="font-body text-xs text-brand-ink/60 mb-1">{label}</p>
      <p className="font-headline text-2xl font-extrabold text-brand-ink">{value}</p>
    </div>
  );
}