import { Sparkles, Lightbulb, Unlock } from 'lucide-react';

const values = [
  { icon: Sparkles, title: 'Empowerment', desc: 'Giving every entrepreneur the tools and confidence to take charge of their business growth.' },
  { icon: Lightbulb, title: 'Innovation', desc: 'Constantly building smarter, simpler ways to solve real problems small businesses face.' },
  { icon: Unlock, title: 'Accessibility', desc: 'Making powerful business tools available to everyone, regardless of size or budget.' },
];

export default function Values() {
  return (
    <section className="bg-brand-primary">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="inline-block font-body text-xs uppercase tracking-widest text-brand-accent font-bold mb-3">
            What We Stand For
          </span>
          <h2 className="font-headline text-3xl md:text-4xl font-extrabold text-brand-bg">
            Our Values
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-brand-accent flex items-center justify-center mb-5">
                <Icon size={24} className="text-brand-ink" />
              </div>
              <h3 className="font-headline text-lg font-bold text-brand-bg mb-2">{title}</h3>
              <p className="font-body text-sm text-brand-bg/70 max-w-xs">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}