import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import logo from '../assets/images/logo.png';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center px-6 text-center">
      <img src={logo} alt="Husslewise" className="h-8 mb-8" />
      <h1 className="font-headline text-6xl font-extrabold text-brand-primary mb-3">404</h1>
      <p className="font-headline text-xl font-bold text-brand-ink mb-2">Page not found</p>
      <p className="font-body text-sm text-brand-ink/60 mb-8 max-w-sm">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 bg-brand-primary text-brand-bg font-body font-bold px-6 py-3 rounded-lg hover:opacity-90 transition"
      >
        <Home size={16} /> Back to Home
      </Link>
    </div>
  );
}