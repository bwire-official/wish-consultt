import React, { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const faqs = [
  {
    question: 'How do I enroll in a course?',
    answer: 'Register an account, choose a course, and complete payment via Flutterwave to get instant access.',
  },
  {
    question: 'Can I track my progress?',
    answer: 'Yes! Our platform unlocks new segments as you complete previous ones and tracks your learning journey.',
  },
  {
    question: 'What is Claude AI?',
    answer: 'Claude AI helps you understand and apply course content by answering questions in real time.',
  },
  {
    question: 'How does the affiliate program work?',
    answer: 'You get a unique referral link with 30-day cookie tracking and earn commissions for every signup.',
  },
];

const Faqs = () => {
  // Set openIndex to 0 to have the first FAQ open by default
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faqs-section" id='faq'>
      <h2 className="faqs-heading">Frequently Asked Questions</h2>
      <div className="faqs-container">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-card">
            <button
              onClick={() => toggleFAQ(index)}
              className="faq-question"
            >
              <span>{faq.question}</span>
              {openIndex === index ? (
                <ChevronUpIcon className="faq-icon rotate-180" />
              ) : (
                <ChevronDownIcon className="faq-icon" />
              )}
            </button>
            <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faqs;
