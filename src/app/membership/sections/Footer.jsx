import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#060606' }} className="border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <div className="text-[#C9A24B] font-bold tracking-widest text-sm uppercase mb-3">
            WENS Force
          </div>
          <p className="text-white/35 text-xs font-light leading-relaxed max-w-xs">
            Curated premium travel and concierge memberships for those who expect
            more from every journey.
          </p>
        </div>

        <div>
          <p className="text-white/50 text-[11px] font-bold tracking-[0.3em] uppercase mb-4">
            Quick Links
          </p>
          <ul className="space-y-2.5 text-xs text-white/35 font-light">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                All Memberships
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="hover:text-white transition-colors">
                FAQs
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms &amp; Conditions
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-white/50 text-[11px] font-bold tracking-[0.3em] uppercase mb-4">
            Contact
          </p>
          <ul className="space-y-2.5 text-xs text-white/35 font-light">
            <li>+91-73046 07954</li>
            <li>concierge@wensforce.com</li>
            <li>Mumbai, India</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 py-5 px-6 text-center">
        <p className="text-white/20 text-[11px]">
          © {new Date().getFullYear()} WENS Force. All rights reserved.
        </p>
      </div>
    </footer>
  );
}