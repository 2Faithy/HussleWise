import ContactForm from '../components/public/ContactForm';
import ContactInfo from '../components/public/ContactInfo';

export default function Contact() {
  return (
    <div>
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-4 text-center">
        <span className="inline-block font-body text-xs uppercase tracking-widest text-brand-primary font-bold mb-3">
          Get In Touch
        </span>
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-brand-ink mb-4">
          We'd Love to Hear From You
        </h1>
        <p className="font-body text-brand-ink/70">
          Questions, feedback, or partnership ideas — reach out and our team will respond as soon as possible.
        </p>
      </section>

      <ContactForm />
      <ContactInfo />
    </div>
  );
}