'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export default function SimpleFooter() {
  const WA_PHONE = '917304607954';

  return (
    <footer style={{ backgroundColor: '#0B1E3F', color: '#fff', marginTop: '80px' }}>
      <style>{`
        .footer-wrap {
          max-width: 1220px;
          margin: 0 auto;
          padding: 60px 24px;
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer-section h3 {
          font-size: 14px;
          font-weight: 700;
          color: #C9A227;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          margin-bottom: 16px;
        }

        .footer-section ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-section a {
          font-size: 14px;
          color: #C7D0DE;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-section a:hover {
          color: #C9A227;
        }

        .footer-divider {
          height: 1px;
          background: rgba(201, 162, 39, 0.2);
          margin: 40px 0;
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
          font-size: 13px;
          color: #5C6270;
        }

        .footer-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #1FA855;
          color: white;
          padding: 10px 16px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .footer-cta:hover {
          background: #168545;
          transform: translateX(2px);
        }

        @media (max-width: 768px) {
          .footer-wrap {
            padding: 40px 16px;
          }

          .footer-content {
            grid-template-columns: 1fr 1fr;
            gap: 30px;
          }

          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>

      <div className="footer-wrap">
        <div className="footer-content">
          {/* Company */}
          <div className="footer-section">
            <h3>Company</h3>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/?welcomeIndia=true">Welcome India</Link></li>
              <li><Link href="/expo">Expo Arrival</Link></li>
              <li><Link href="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h3>Services</h3>
            <ul>
              <li><a href="/#plans">Membership Plans</a></li>
              <li><a href="/#how-it-works">How It Works</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="https://wa.me/917304607954" target="_blank" rel="noopener noreferrer">Support</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h3>Contact</h3>
            <ul>
              <li><a href={`https://wa.me/${WA_PHONE}`} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              <li><a href="tel:+917304607954">+91 7304 607954</a></li>
              <li><a href="mailto:concierge@wensforce.com">concierge@wensforce.com</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <div>© 2026 WENS Force. All rights reserved.</div>
          <a href={`https://wa.me/${WA_PHONE}?text=Hi%20WENS%20Force%2C%20I%27d%20like%20to%20know%20more%20about%20your%20services`} target="_blank" rel="noopener noreferrer" className="footer-cta">
          <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="28"
          height="28"
          fill="white"
        >
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.543 11.543 0 01-5.88-1.604l-.42-.248-4.39 1.074 1.106-4.274-.272-.44A11.556 11.556 0 014.4 16C4.4 9.592 9.592 4.4 16 4.4S27.6 9.592 27.6 16 22.408 27.6 16 27.6zm6.327-8.627c-.348-.174-2.055-1.014-2.374-1.13-.318-.115-.55-.174-.78.174-.23.348-.894 1.13-1.097 1.362-.201.231-.404.26-.752.086-.348-.174-1.47-.542-2.799-1.727-1.034-.922-1.732-2.062-1.934-2.41-.202-.348-.022-.536.152-.71.156-.155.348-.405.522-.607.174-.202.23-.348.348-.58.115-.231.058-.434-.03-.607-.086-.174-.78-1.882-1.07-2.578-.282-.677-.568-.585-.78-.596-.201-.01-.434-.012-.665-.012-.23 0-.607.086-.926.434-.318.348-1.214 1.186-1.214 2.892 0 1.707 1.243 3.356 1.417 3.588.174.231 2.447 3.734 5.928 5.234.83.358 1.478.572 1.982.732.833.265 1.59.227 2.19.138.668-.1 2.055-.84 2.346-1.652.29-.81.29-1.505.202-1.652-.086-.145-.318-.231-.665-.405z" />
        </svg>
            Connect with us
          </a>
        </div>
      </div>
    </footer>
  );
}