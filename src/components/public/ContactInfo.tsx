import { Mail, Phone, MapPin } from 'lucide-react';

const info = [
  { icon: Mail, label: 'Email', value: 'hello@husslewise.com' },
  { icon: Phone, label: 'Phone', value: '+234 800 000 0000' },
  { icon: MapPin, label: 'Location', value: 'Lagos, Nigeria' },
];

export default function ContactInfo() {
  return (
    <section className="bg-brand-primary">
      <div className="max-w-7xl mx-auto px-6 py-16 grid sm:grid-cols-3 gap-8">
        {info.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-accent flex items-center justify-center shrink-0">
              <Icon size={20} className="text-brand-ink" />
            </div>
            <div>
              <p className="font-body text-xs text-brand-bg/60 mb-0.5">{label}</p>
              <p className="font-body font-bold text-brand-bg">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}