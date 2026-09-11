import {
  Wallet, PieChart, Zap,
  Users, MessageCircle, Bell,
  Brain, TrendingUp, Gauge,
  Building2, FileText, FileSpreadsheet,
} from 'lucide-react';

const featureGroups = [
  {
    title: 'Financial Tracking',
    description: 'Know exactly where your money is going, every single day.',
    items: [
      { icon: Wallet, title: 'Money In/Out', desc: 'Track all income and expenses with intuitive categorization' },
      { icon: Zap, title: 'Daily Sales', desc: 'Record transactions in seconds with quick-entry mode' },
      { icon: PieChart, title: 'Visual Reports', desc: 'Understand your finances with pie charts and trend graphs' },
    ],
  },
  {
    title: 'Customer Management',
    description: 'Turn one-time buyers into loyal, repeat customers.',
    items: [
      { icon: Users, title: 'Customer Database', desc: 'Store contact details and purchase history' },
      { icon: MessageCircle, title: 'WhatsApp Integration', desc: 'Send receipts and promotions directly via WhatsApp' },
      { icon: Bell, title: 'Follow-up Reminders', desc: 'Get alerts for customer follow-ups and restocks' },
    ],
  },
  {
    title: 'Business Growth',
    description: 'Let data guide your next move, not guesswork.',
    items: [
      { icon: Brain, title: 'Performance Insights', desc: 'AI-powered analysis of your sales trends' },
      { icon: TrendingUp, title: 'Growth Tips', desc: 'Personalized recommendations to increase profits' },
      { icon: Gauge, title: 'Business Health Score', desc: '0–100 rating of your business fundamentals' },
    ],
  },
  {
    title: 'Official Documentation',
    description: 'Look professional and stay compliant, with zero hassle.',
    items: [
      { icon: Building2, title: 'CAC Registration', desc: 'Step-by-step business registration assistance' },
      { icon: FileText, title: 'Digital Receipts', desc: 'Professional receipt templates with your branding' },
      { icon: FileSpreadsheet, title: 'Tax Preparation', desc: 'Export financial data for accountant-ready reports' },
    ],
  },
];

export default function Features() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="inline-block font-body text-xs uppercase tracking-widest text-brand-primary font-bold mb-3">
          Everything In One Place
        </span>
        <h2 className="font-headline text-3xl md:text-4xl font-extrabold text-brand-ink mb-4">
          Powerful Features for Your Business
        </h2>
        <p className="font-body text-brand-ink/70">
          Everything you need to manage, grow, and officialize your business — from your first sale to your business registration.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {featureGroups.map((group) => (
          <div
            key={group.title}
            className="bg-white rounded-2xl p-8 border border-brand-primary/10 hover:border-brand-primary/30 transition-colors"
          >
            <h3 className="font-headline text-xl font-bold text-brand-primary mb-2">
              {group.title}
            </h3>
            <p className="font-body text-sm text-brand-ink/60 mb-6">
              {group.description}
            </p>

            <div className="space-y-5">
              {group.items.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-brand-bg flex items-center justify-center">
                    <Icon size={18} className="text-brand-primary" />
                  </div>
                  <div>
                    <p className="font-body font-bold text-sm text-brand-ink">{title}</p>
                    <p className="font-body text-sm text-brand-ink/60">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}