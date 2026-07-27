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
  return (
    <section className="journey" id="how-it-works">
      <div className="journey-container">
        <div className="section-head">
          <h2>Start Trading in 3 Steps</h2>
          <p>From signup to your first trade — fast, simple, and secure.</p>
        </div>

        <div className="journey-grid">
          {steps.map((item) => (
            <div className="journey-card" key={item.step}>
              <span className="journey-step">{item.step}</span>
              <div className="journey-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

        <div className="journey-summary">
          <div className="summary-box">
            <h3>₹5,000</h3>
            <span>Min. Deposit</span>
          </div>
          <div className="summary-box">
            <h3>14%</h3>
            <span>Monthly Returns</span>
          </div>
          <div className="summary-box">
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
