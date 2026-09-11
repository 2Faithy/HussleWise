import { Target, Eye } from 'lucide-react';

export default function MissionVision() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-8 border border-brand-primary/10">
          <div className="w-12 h-12 rounded-xl bg-brand-bg flex items-center justify-center mb-5">
            <Target size={22} className="text-brand-primary" />
          </div>
          <h3 className="font-headline text-xl font-bold text-brand-primary mb-3">Our Mission</h3>
          <p className="font-body text-sm text-brand-ink/70">
            To empower small-scale businesses by providing an intuitive platform for
            easy registration and effective progress tracking.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-brand-primary/10">
          <div className="w-12 h-12 rounded-xl bg-brand-bg flex items-center justify-center mb-5">
            <Eye size={22} className="text-brand-primary" />
          </div>
          <h3 className="font-headline text-xl font-bold text-brand-primary mb-3">Our Vision</h3>
          <p className="font-body text-sm text-brand-ink/70">
            To become the leading digital ally for small businesses, driving growth
            and innovation through insightful and accessible solutions.
          </p>
        </div>
      </div>
    </section>
  );
}