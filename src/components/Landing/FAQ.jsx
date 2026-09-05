import { useState, useEffect, useRef } from "react";
import { FiPlus } from "react-icons/fi";
import "./FAQ.css";

const faqs = [
  {
    question: "What investment plans are available with AurumFX?",
    answer:
      "AurumFX offers two flexible plans: the 30-month plan with 8% monthly returns, and the 10-month plan with 14% monthly returns. Both are designed to support long-term wealth growth with transparent payout tracking.",
  },
  {
    question: "Is my investment safe with AurumFX?",
    answer:
      "Your investment is backed by actual gold trading activities. We maintain complete transparency in all our operations and provide regular updates on your investment performance.",
  },
  {
    question: "Can I withdraw my investment before 30 months?",
    answer:
      "The 30-month plan is the long-term option with 8% monthly returns. The 10-month plan is shorter and offers 14% monthly returns. Early withdrawal terms depend on your selected plan, so please review your agreement and speak with our support team for the exact terms.",
  },
  {
    question: "What are the risks involved?",
    answer:
      "As with any investment, there are inherent market risks. However, our gold trading strategy is designed to minimize volatility. We provide detailed risk disclosures and maintain transparent communication about market conditions.",
  },
  {
    question: "How do I receive my monthly returns?",
    answer:
      "Monthly returns are credited directly to your registered account based on your chosen plan: 14% for the 10-month plan and 8% for the 30-month plan. You can choose to withdraw them directly or reinvest as per your preference.",
  },
  {
    question: "Is there a maximum investment limit?",
    answer:
      "There is no upper limit on investments. However, we recommend starting with smaller amounts (minimum ₹5,000) and scaling up as you become comfortable with our platform.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? -1 : i);
  };

  return (
    <section
      ref={sectionRef}
      className={`faq-section ${isVisible ? "in-view" : ""}`}
      id="faq"
    >
      <div className="faq-container">
        {/* Left: Image */}
        <div className="faq-media">
          <img
            src="https://images.unsplash.com/photo-1762463176417-2c5e63767bd2?fm=jpg&q=80&w=1200&auto=format&fit=crop"
            alt="Gold bars on a dark surface"
            className="faq-media-img"
          />
          <div className="faq-media-glow" />
        </div>

        {/* Right: Heading + Accordion */}
        <div className="faq-content">
          <div className="section-head">
            <h2>
              Frequently Asked <span>Questions</span>
            </h2>
            <p>
              Everything you need to know about investing and building wealth with AurumFX.
            </p>
          </div>

          <div className="faq-accordion">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  className={`faq-item ${isOpen ? "open" : ""}`}
                  key={index}
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                >
                  <button
                    className="faq-question"
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-index">{String(index + 1).padStart(2, "0")}</span>
                    <h3>{faq.question}</h3>
                    <span className="faq-icon-wrap">
                      <FiPlus className="faq-icon" />
                    </span>
                  </button>

                  <div className="faq-answer-wrap">
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQ;