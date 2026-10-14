"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, MessageSquare } from "lucide-react";
import { EventFAQ } from "@/data/eventRoutes";

interface Props {
  faqs: EventFAQ[];
  title?: string;
  categoryName?: string;
  waLink?: string;
}

export default function EventFaqAccordion({ faqs, title, categoryName = "Our Team", waLink }: Props) {
  // First FAQ open by default like reference design
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-8 h-px bg-rose-300" />
            <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
              Aam Taur Par Puche Jane Wale Sawaal
            </span>
            <span className="w-8 h-px bg-rose-300" />
          </div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl md:text-4xl text-gray-900 leading-tight">
            {title || `Planning FAQs — Answered by ${categoryName}`}
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
            Aapke mann me koi bhi sawaal ho, humne sabhi zaroori jankari yahan share ki hai.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`rounded-2xl transition-all duration-300 overflow-hidden border ${
                  isOpen
                    ? "bg-rose-50/70 border-rose-200/90 shadow-sm"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Question Row */}
                <button
                  type="button"
                  onClick={() => toggleIndex(i)}
                  className="w-full py-4.5 px-5 sm:px-6 flex items-center justify-between text-left gap-4 transition-colors select-none"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`font-bold text-sm sm:text-base leading-snug transition-colors ${
                      isOpen ? "text-rose-600" : "text-gray-900"
                    }`}
                  >
                    {faq.q}
                  </span>
                  <span
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? "bg-rose-100 text-rose-600 rotate-180"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                {/* Answer Content */}
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-gray-700 leading-relaxed border-t border-rose-100/80 animate-in fade-in duration-200">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        {waLink && (
          <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-rose-50 via-white to-amber-50 border border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <p className="font-bold text-gray-900 text-sm">Koi doosra sawaal hai jo yahan nahi mila?</p>
              <p className="text-gray-500 text-xs mt-0.5">Humse seedha WhatsApp par baat kijiye, hum turant reply karenge.</p>
            </div>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all hover:scale-105 shrink-0"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Par Puchein</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
