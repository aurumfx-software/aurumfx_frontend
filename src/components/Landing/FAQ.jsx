import { useState, useEffect, useRef } from "react";
import { FiPlus } from "react-icons/fi";
import "./FAQ.css";

const faqs = [
  {
    question: "Is my investment safe with AurumFX?",
    answer:
      "Your investment is backed by actual gold trading activities. We maintain complete transparency in all our operations and provide regular updates on your investment performance.",
  },
  {
    question: "Can I withdraw my investment before 10 months?",
    answer:
      "While we recommend completing the full 10-month cycle for maximum returns, early withdrawal options are available. Please contact our support team to discuss your specific situation.",
  },
  {
    question: "What are the risks involved?",
    answer:
      "As with any investment, there are inherent market risks. However, our gold trading strategy is designed to minimize volatility. We provide detailed risk disclosures and maintain transparent communication about market conditions.",
  },
  {
    question: "How do I receive my monthly returns?",
    answer:
      "Monthly bonuses (14%) are credited directly to your registered account every month. You can choose to withdraw them directly or reinvest as per your preference.",
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