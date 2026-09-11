import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left: brand panel */}
      <div className="hidden md:flex flex-col justify-between bg-brand-primary p-12 relative overflow-hidden">
        {/* Glow shapes */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-brand-accent/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-brand-bg/10 rounded-full blur-3xl" />

        <Link to="/" className="relative z-10">
          <img src={logo} alt="Husslewise" className="h-8 brightness-0 invert" />
        </Link>

        <div className="relative z-10">
          <h2 className="font-headline text-3xl font-extrabold text-brand-bg mb-4">
            Empower Your Business Growth
          </h2>
          <p className="font-body text-brand-bg/70 max-w-sm">
            Track sales, manage customers, send receipts, and register your business —
            all in one simple platform built for your hustle.
          </p>
        </div>

        <p className="relative z-10 font-body text-xs text-brand-bg/50">
          © {new Date().getFullYear()} Husslewise. All rights reserved.
        </p>
      </div>

      {/* Right: form panel */}
      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 bg-brand-bg">
        {/* Mobile-only logo */}
        <Link to="/" className="md:hidden mb-8">
          <img src={logo} alt="Husslewise" className="h-7" />
        </Link>

        <div className="w-full max-w-sm mx-auto md:mx-0">
          <h1 className="font-headline text-2xl md:text-3xl font-extrabold text-brand-ink mb-2">
            {title}
          </h1>
          <p className="font-body text-sm text-brand-ink/60 mb-8">
            {subtitle}
          </p>

          {children}
        </div>
      </div>
    </div>
  );
}