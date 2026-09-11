import MissionVision from '../components/public/MissionVision';
import Values from '../components/public/Values';
import NameStory from '../components/public/NameStory';

export default function About() {
  return (
    <div>
      {/* Intro */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-8 text-center">
        <span className="inline-block font-body text-xs uppercase tracking-widest text-brand-primary font-bold mb-3">
          About Husslewise
        </span>
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-brand-ink mb-6">
          Your Go-To Platform for Empowering Small Businesses
        </h1>
        <p className="font-body text-brand-ink/70 max-w-2xl mx-auto">
          At Husslewise, we understand the unique challenges faced by entrepreneurs,
          which is why we've built a user-friendly platform that enables you to
          seamlessly register your business and monitor its growth. Our comprehensive
          tools and insights help you track progress and make informed decisions —
          so you can focus on what you do best: growing your business.
        </p>
      </section>

      <MissionVision />
      <Values />
      <NameStory />
    </div>
  );
}