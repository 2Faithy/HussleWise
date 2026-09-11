import Hero from '../components/public/Hero';
import Features from '../components/public/Features';
import HowItWorks from '../components/public/HowItWorks';
import Pricing from '../components/public/Pricing';
import CtaBanner from '../components/public/CtaBanner';

export default function Landing() {
  return (
    <div>
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <CtaBanner />
    </div>
  );
}