'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function ExpoFAQ({ faqs = [], expoName = '' }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleFaq = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (!faqs || faqs.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 40px' }}>
        <h3 style={{ color: '#0B1F3A', marginBottom: '16px' }}>
          No FAQs available
        </h3>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .faq-container {
          max-width: 760px;
          margin: 0 auto;
        }

        .faq-item {
          border: 1px solid #E4E1D8;
          border-radius: 10px;
          margin-bottom: 16px;
          overflow: hidden;
          background: #fff;
          transition: all 0.2s ease;
        }

        .faq-item:hover {
          border-color: #C9A227;
          box-shadow: 0 4px 12px rgba(201, 162, 39, 0.12);
        }

        .faq-header {
          padding: 20px 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          user-select: none;
          transition: all 0.2s ease;
        }

        .faq-header:hover {
          background: #fafaf9;
        }

        .faq-question {
          font-weight: 600;
          color: #0B1F3A;
          font-size: 14px;
          line-height: 1.4;
          flex: 1;
          text-align: left;
        }

        .faq-toggle {
          flex-shrink: 0;
          color: #C9A227;
          transition: transform 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .faq-item.expanded .faq-toggle {
          transform: rotate(180deg);
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
          background: #fafaf9;
        }

        .faq-item.expanded .faq-answer {
          max-height: 500px;
        }

        .faq-answer-content {
          padding: 0 24px 20px 24px;
          font-size: 13px;
          color: #5C6270;
          line-height: 1.6;
        }

        @media (max-width: 640px) {
          .faq-question {
            font-size: 13px;
          }

          .faq-answer-content {
            font-size: 12px;
          }
        }
      `}</style>

      <h2 style={{ marginBottom: '40px', marginTop: '0' }}>
        Frequently Asked Questions
      </h2>

      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${expandedIndex === index ? 'expanded' : ''}`}
          >
            <div
              className="faq-header"
              onClick={() => toggleFaq(index)}
            >
              <div className="faq-question">{faq.q}</div>
              <div className="faq-toggle">
                <ChevronDown size={18} />
              </div>
            </div>
            <div className="faq-answer">
              <div className="faq-answer-content">{faq.a}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
