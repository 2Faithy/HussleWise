import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, Sparkles, Compass, ShieldCheck, PhoneCall } from 'lucide-react';
import logo from '../../assets/images/logo.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Handle subtle scroll-based glass blur adjustments
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: Compass },
    { name: 'About', path: '/about', icon: ShieldCheck },
    { name: 'Contact', path: '/contact', icon: PhoneCall },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full px-3 sm:px-6 pt-3 sm:pt-5 transition-all duration-300">
        <nav
          className={`
            max-w-7xl mx-auto
            flex items-center justify-between
            px-4 sm:px-6 py-2.5 sm:py-3
            rounded-full
            relative overflow-hidden
            transition-all duration-300
            ${
              scrolled
                ? 'bg-brand-bg/95 backdrop-blur-2xl border border-brand-primary/20 shadow-[0_20px_50px_rgba(14,27,26,0.15)]'
                : 'bg-brand-bg/80 backdrop-blur-md border border-brand-primary/15 shadow-[0_10px_30px_rgba(14,27,26,0.08)]'
            }
          `}
        >
          {/* Ambient Subtle Glow Accent */}
          <div className="absolute right-1/4 -bottom-10 w-32 h-32 bg-brand-primary/15 rounded-full blur-2xl pointer-events-none" />

          {/* Left: Clean Green Logo & Readable Dark Text */}
          <Link to="/" className="flex items-center gap-2.5 group z-10">
            <img
              src={logo}
              alt="HustleWise"
              className="h-8 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105 mix-blend-multiply"
            />
          </Link>

          {/* Middle: Dynamic Navigation (Desktop) */}
          <div className="hidden md:flex items-center gap-1 bg-brand-primary/10 border border-brand-primary/15 p-1 rounded-full z-10 backdrop-blur-lg">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) => `
                  relative px-5 py-2 rounded-full font-body text-xs font-bold tracking-wide transition-all duration-300 flex items-center gap-2
                  ${
                    isActive
                      ? 'text-white'
                      : 'text-brand-ink/80 hover:text-brand-ink hover:bg-brand-primary/10'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-brand-primary rounded-full -z-10 shadow-[0_4px_15px_rgba(28,91,86,0.3)]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <link.icon size={13} className={isActive ? 'text-white' : 'text-brand-primary'} />
                    {link.name}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 z-10">
            {/* Log in Button */}
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-1.5 font-body text-xs font-bold tracking-wider uppercase text-brand-ink hover:text-brand-primary transition-colors duration-200 px-3 py-2"
            >
              Log in
              <ArrowUpRight size={14} className="text-brand-primary" />
            </Link>

            {/* Main CTA */}
            <Link
              to="/signup"
              className="
                relative group overflow-hidden inline-flex items-center gap-2
                bg-brand-primary text-white font-body text-xs font-bold uppercase tracking-wider
                px-5 py-2.5 sm:py-3 rounded-full
                border border-brand-primary/20
                shadow-[0_4px_20px_rgba(28,91,86,0.35)]
                hover:shadow-[0_6px_25px_rgba(28,91,86,0.5)]
                hover:-translate-y-0.5
                active:translate-y-0
                transition-all duration-300
              "
            >
              <span className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              
              <Sparkles size={13} className="text-brand-accent" />
              <span>Get Started</span>

              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/15 group-hover:bg-brand-accent group-hover:text-brand-ink transition-all duration-300">
                <ArrowUpRight size={12} className="group-hover:rotate-45 transition-transform duration-300" />
              </span>
            </Link>

            {/* Mobile Toggle Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="
                md:hidden relative z-50
                w-10 h-10 rounded-full
                bg-brand-primary/10 border border-brand-primary/20
                flex items-center justify-center
                text-brand-ink hover:text-brand-primary
                transition-colors focus:outline-none
              "
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={20} /> : (
                <div className="flex flex-col gap-1 items-end w-4">
                  <span className="w-full h-0.5 bg-brand-ink rounded-full" />
                  <span className="w-3/4 h-0.5 bg-brand-primary rounded-full" />
                  <span className="w-1/2 h-0.5 bg-brand-ink rounded-full" />
                </div>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed inset-x-4 top-20 z-40 md:hidden"
          >
            <div className="bg-brand-bg/95 backdrop-blur-3xl border border-brand-primary/20 rounded-3xl p-6 shadow-[0_20px_50px_rgba(14,27,26,0.3)] overflow-hidden relative">
              <div className="flex flex-col gap-3 relative z-10">
                <p className="font-body text-[10px] uppercase font-bold tracking-widest text-brand-primary mb-1 px-3">
                  Navigation
                </p>

                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    end={link.path === '/'}
                    className={({ isActive }) => `
                      flex items-center justify-between px-4 py-3.5 rounded-2xl font-body text-sm font-bold tracking-wide transition-all duration-200
                      ${
                        isActive
                          ? 'bg-brand-primary text-white shadow-lg'
                          : 'text-brand-ink hover:bg-brand-primary/10'
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <link.icon size={18} className={isActive ? 'text-white' : 'text-brand-primary'} />
                          <span>{link.name}</span>
                        </div>
                        <ArrowUpRight size={16} className="opacity-60" />
                      </>
                    )}
                  </NavLink>
                ))}

                <hr className="border-brand-primary/20 my-2" />

                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    to="/login"
                    className="w-full text-center py-3 rounded-2xl font-body text-xs font-bold uppercase tracking-wider text-brand-ink border border-brand-primary/20 hover:bg-brand-primary/10 transition"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="w-full text-center py-3.5 rounded-2xl font-body text-xs font-bold uppercase tracking-wider text-white bg-brand-primary shadow-[0_4px_20px_rgba(28,91,86,0.4)] transition"
                  >
                    Start Your Free Account
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}