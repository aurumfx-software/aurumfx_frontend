import { FiCheck, FiStar, FiZap } from "react-icons/fi";
import "./InvestmentTiers.css";

const tiers = [
  {
    name: "Starter Tier",
    range: "₹5,000 – ₹195,000",
    returnRate: "14% Monthly",
    popular: false,
    features: [
      "14% monthly return payout",
      "10-Month structured tenure",
      "Monthly bonus payout to wallet",
      "24/7 Investor dashboard access",
      "Standard email & chat support",
    ],
  },
  {
    name: "Growth Tier",
    range: "₹20,0000 – ₹49,5000",
    returnRate: "14% Monthly",
    popular: true,
    features: [
      "14% monthly return payout",
      "10-Month structured tenure",
      "Priority monthly bonus credits",
      "Dedicated account manager",
      "Quarterly performance report",
      "Instant withdrawal processing",
    ],
  },
  {
    name: "Premium Tier",
    range: "₹500,000+",
    returnRate: "14% Monthly",
    popular: false,
    features: [
      "14% monthly return payout",
      "10-Month structured tenure",
      "VIP dedicated advisor support",
      "Custom gold hedging strategies",
      "Direct bank settlement options",
      "Comprehensive risk management",
    ],
  },
];

function InvestmentTiers() {
  return (
    <section className="tiers-section" id="plans">
      <div className="tiers-container">
        <div className="section-head">
          <div className="section-badge">
            <FiZap /> Structured Plans
          </div>
          <h2>
            Investment <span>Tiers</span>
          </h2>
          <p>
            All tiers offer the same consistent 14% monthly returns backed by actual gold trading activities.
          </p>
        </div>

        <div className="tiers-grid">
          {tiers.map((t) => (
            <div className={`tier-card ${t.popular ? "popular" : ""}`} key={t.name}>
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
