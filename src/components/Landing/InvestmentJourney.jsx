import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaUserPlus, FaChartBar, FaWallet } from "react-icons/fa";
import "./InvestmentJourney.css";

const steps = [
  {
    icon: <FaUserPlus />,
    step: "01",
    title: "Create Account",
    description: "Sign up in minutes with your email and verify your identity securely.",
  },
  {
    icon: <FaWallet />,
    step: "02",
    title: "Fund Your Wallet",
    description: "Deposit from ₹5,000 via UPI, bank transfer, or supported payment methods.",
  },
  {
    icon: <FaChartBar />,
    step: "03",
    title: "Start Trading",
    description: "Buy gold, trade forex pairs, and track portfolio performance in real time.",
  },
];

const InvestmentJourney = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`journey ${isVisible ? "in-view" : ""}`}
      id="how-it-works"
    >
      <div className="gold-line-beam" />

      <div className="journey-container">
        <div className="section-head">
          <h2>
            Start Trading in <span>3 Steps</span>
          </h2>
          <p>From signup to your first trade — fast, simple, and secure.</p>
        </div>

        <div className="journey-grid">
          {steps.map((item, index) => (
            <div
              className="journey-card"
              key={item.step}
              style={{ animationDelay: `${0.15 + index * 0.15}s` }}
            >
              <span className="journey-step">{item.step}</span>
              <div className="journey-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

        <div className="journey-summary">
          <div className="summary-box" style={{ animationDelay: "0.55s" }}>
            <h3>₹5,000</h3>
            <span>Min. Deposit</span>
          </div>

          <div className="summary-box summary-box--dual" style={{ animationDelay: "0.7s" }}>
            <div className="dual-pills">
              <div className="rate-pill">
                <strong>8%</strong>
                <span>30-Month Plan</span>
              </div>
              <div className="rate-pill">
                <strong>14%</strong>
                <span>10-Month Plan</span>
              </div>
            </div>
            <span>Monthly Returns</span>
          </div>

          <div className="summary-box" style={{ animationDelay: "0.85s" }}>
            <h3>24/7</h3>
            <span>Market Access</span>
          </div>
        </div>

        <Link to="/register" className="journey-btn">
          Create Free Account
        </Link>
      </div>
    </section>
  );
};

export default InvestmentJourney;