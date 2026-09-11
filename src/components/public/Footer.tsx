import logo from '../../assets/images/logo.png';

export default function Footer() {
  return (
    <footer className="bg-brand-primary text-brand-bg">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <img src={logo} alt="Husslewise" className="h-8 mb-3 brightness-0 invert" />
          <p className="font-body text-sm opacity-80">Empower Your Business Growth</p>
        </div>

        <div>
          <h4 className="font-headline font-bold mb-3">Product</h4>
          <ul className="font-body text-sm space-y-2 opacity-80">
            <li>Financial Tracking</li>
            <li>Customer Management</li>
            <li>Business Registration</li>
            <li>Growth Tools</li>
          </ul>
        </div>

        <div>
          <h4 className="font-headline font-bold mb-3">Company</h4>
          <ul className="font-body text-sm space-y-2 opacity-80">
            <li>About</li>
            <li>Contact</li>
            <li>Pricing</li>
          </ul>
        </div>

        <div>
          <h4 className="font-headline font-bold mb-3">Get in touch</h4>
          <p className="font-body text-sm opacity-80">hello@husslewise.com</p>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center font-body text-xs opacity-60">
        © {new Date().getFullYear()} Husslewise. All rights reserved.
      </div>
    </footer>
  );
}