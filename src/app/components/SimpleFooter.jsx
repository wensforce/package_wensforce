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
            <MessageCircle size={16} />
            Connect with us
          </a>
        </div>
      </div>
    </footer>
  );
}
