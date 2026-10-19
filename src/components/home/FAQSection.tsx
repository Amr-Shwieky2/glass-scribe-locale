'use client';
/**
 * FAQSection - Frequently Asked Questions (accordion)
 * Receives already-localized items from the server. Every answer stays in the
 * DOM (collapsed with CSS) so crawlers and the FAQPage JSON-LD see the same text.
 */

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQSectionProps {
  id?: string;
  title: string;
  subtitle: string;
  items: { question: string; answer: string }[];
}

const FAQSection: React.FC<FAQSectionProps> = ({ id, title, subtitle, items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id={id} className="scroll-mt-16 sm:scroll-mt-20 py-16 sm:py-20 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16" data-reveal>
          <div className="inline-flex items-center justify-center gap-2 bg-brand-gold/10 text-brand-gold px-4 py-2 rounded-full text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>FAQ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-navy mb-4">
            {title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
            {subtitle}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {items.map((faq, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;
            return (
              <div key={index} data-reveal style={{ '--reveal-delay': `${Math.min(index, 6) * 60}ms` } as React.CSSProperties}>
                <div
                  className={`bg-white rounded-xl shadow-sm border transition-all duration-300 ${
                    isOpen ? 'border-brand-gold shadow-md' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <h3>
                    <button
                      id={buttonId}
                      onClick={() => toggleFAQ(index)}
                      className="w-full flex items-center justify-between p-5 sm:p-6 text-start"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                    >
                      <span className="text-base sm:text-lg font-medium text-brand-navy pe-4">
                        {faq.question}
                      </span>
                      <span className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronDown className={`w-5 h-5 transition-colors ${
                          isOpen ? 'text-brand-gold' : 'text-gray-400'
                        }`} />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 motion-reduce:transition-none ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                    inert={!isOpen}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                        <div className="border-t border-gray-100 pt-4">
                          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
