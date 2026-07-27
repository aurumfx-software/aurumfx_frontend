import { useState } from "react";
import { FiChevronDown, FiHelpCircle } from "react-icons/fi";
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

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? -1 : i);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="faq-container">
        <div className="section-head">
          <div className="section-badge">
            <FiHelpCircle /> Got Questions?
          </div>
          <h2>
            Frequently Asked <span>Questions</span>
          </h2>
          <p>
            Everything you need to know about investing and building wealth with AurumFX.
          </p>
        </div>

        <div className="faq-accordion">
          {faqs.map((faq, index) => (
            <div
              className={`faq-item ${openIndex === index ? "open" : ""}`}
              key={index}
              onClick={() => toggle(index)}
            >
              <div className="faq-question">
                <h3>{faq.question}</h3>
                <FiChevronDown className="faq-icon" />
              </div>
              {openIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
