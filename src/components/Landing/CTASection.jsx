import { Link } from "react-router-dom";
import "./CTASection.css";

const CTASection = () => {
  return (
    <section className="cta">
      <div className="cta-container">
        <h2>Ready to trade gold &amp; forex?</h2>
        <p>
          Join AurumFX today. Open a free account, fund your wallet, and start
          trading with professional tools built for serious investors.
        </p>

        <div className="cta-buttons">
          <Link to="/register" className="cta-primary">
            Get Started Free
          </Link>
          <Link to="/login" className="cta-secondary">
            Sign In
          </Link>
        </div>

        <div className="cta-stats">
          <div className="stat-box">
            <h3>₹5,000</h3>
            <span>Minimum Deposit</span>
          </div>
          <div className="stat-box">
            <h3>14%</h3>
            <span>Monthly Returns</span>
          </div>
          <div className="stat-box">
            <h3>24/7</h3>
            <span>Live Markets</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
