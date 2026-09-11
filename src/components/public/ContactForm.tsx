import { useState } from 'react';
import { Send } from 'lucide-react';
import contactIllustration from '../../assets/images/contact-illustration.svg';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No backend yet — just log for now
    console.log('Contact form submitted:', form);
    alert('Thanks for reaching out! We\'ll get back to you soon.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-20 grid md:grid-cols-2 gap-12 items-center">
      {/* Left: illustration */}
      <div className="order-2 md:order-1 flex items-center justify-center">
        <img
          src={contactIllustration}
          alt="Contact Husslewise"
          className="w-full max-w-md"
        />
      </div>

      {/* Right: form */}
      <div className="order-1 md:order-2 bg-white rounded-2xl p-8 border border-brand-primary/10 shadow-sm">
        <h2 className="font-headline text-2xl font-bold text-brand-primary mb-2">
          Send Us a Message
        </h2>
        <p className="font-body text-sm text-brand-ink/60 mb-6">
          Have a question or need help? Fill out the form and we'll get back to you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-body text-xs font-bold text-brand-ink/70 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. Nkechi Okafor"
              className="w-full font-body text-sm px-4 py-3 rounded-lg border border-brand-primary/20 bg-brand-bg/10 focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
            />
          </div>

          <div>
            <label className="block font-body text-xs font-bold text-brand-ink/70 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full font-body text-sm px-4 py-3 rounded-lg border border-brand-primary/20 bg-brand-bg/10 focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
            />
          </div>

          <div>
            <label className="block font-body text-xs font-bold text-brand-ink/70 mb-1.5">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              placeholder="What's this about?"
              className="w-full font-body text-sm px-4 py-3 rounded-lg border border-brand-primary/20 bg-brand-bg/10 focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
            />
          </div>

          <div>
            <label className="block font-body text-xs font-bold text-brand-ink/70 mb-1.5">
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Tell us how we can help..."
              className="w-full font-body text-sm px-4 py-3 rounded-lg border border-brand-primary/20 bg-brand-bg/10 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-brand-primary text-brand-bg font-body font-bold px-6 py-3.5 rounded-lg hover:opacity-90 transition"
          >
            Send Message
            <Send size={16} />
          </button>
        </form>
      </div>
    </section>
  );
}