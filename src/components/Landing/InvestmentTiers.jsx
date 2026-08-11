import { useState, useEffect, useRef } from "react";
import { FiCheck, FiStar, FiZap } from "react-icons/fi";
import "./InvestmentTiers.css";

const tiers = [
  {
    name: "Gold Momentum",
    range: "10-Month Plan",
    returnRate: "14% Monthly",
    popular: false,
    features: [
      "14% monthly return payout",
      "Structured 10-month tenure",
      "Monthly payout tracking",
      "Secure investor dashboard access",
      "Email and chat support",
    ],
  },
  {
    name: "Gold Legacy",
    range: "30-Month Plan",
    returnRate: "8% Monthly",
    popular: true,
    features: [
      "8% monthly return payout",
      "Structured 30-month tenure",
      "Long-term wealth planning",
      "Priority account support",
      "Quarterly performance updates",
      "Secure payout tracking",
    ],
  },
];

function InvestmentTiers() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // No disconnect — re-triggers every time the section enters/leaves view,
    // so scrolling up past it and back down replays the animation too.
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
      className={`tiers-section ${isVisible ? "in-view" : ""}`}
      id="plans"
    >
      <div className="gold-line-beam" />

      <div className="tiers-container">
        <div className="section-head">
          <div className="section-badge">
            <FiZap /> Structured Plans
          </div>
          <h2>
            Investment <span>Tiers</span>
          </h2>
          <p>
            Choose a structured gold trading plan that matches your preferred duration and monthly return goals.
          </p>
        </div>

        <div className="tiers-grid">
          {tiers.map((t, index) => (
            <div
              className={`tier-card ${t.popular ? "popular" : ""}`}
              key={t.name}
              style={{ transitionDelay: `${index * 0.15}s`, animationDelay: `${0.2 + index * 0.18}s` }}
            >
              {t.popular && (
                <div className="popular-badge">
                  <FiStar /> Most Popular
                </div>
              )}
              <h3 className="tier-title">{t.name}</h3>
              <div className="tier-price-box">
                <span className="tier-range">{t.range}</span>
                <div className="tier-return">{t.returnRate}</div>
              </div>

              <ul className="tier-features">
                {t.features.map((f, i) => (
                  <li key={i}>
                    <FiCheck className="check-icon" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <a href="/register" className={`tier-btn ${t.popular ? "primary" : "secondary"}`}>
                Start Investing
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default InvestmentTiers;