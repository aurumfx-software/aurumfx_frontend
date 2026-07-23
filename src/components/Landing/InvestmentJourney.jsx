import "./InvestmentJourney.css";
import {
  FaCoins,
  FaChartLine,
  FaWallet,
} from "react-icons/fa";

const InvestmentJourney = () => {
  return (
    <section className="journey">
      <div className="journey-container">
        <h2>Your Investment Journey</h2>

        <p className="journey-subtitle">
          Start small and watch your investment grow with our transparent
          10-month gold investment plan.
        </p>

        <div className="journey-grid">
          <div className="journey-card">
            <div className="journey-icon">
              <FaCoins />
            </div>

            <h3>Step 1</h3>

            <h4>Invest ₹5,000</h4>

            <p>
              Begin your investment journey with a minimum investment of ₹5,000.
            </p>
          </div>

          <div className="journey-card">
            <div className="journey-icon">
              <FaChartLine />
            </div>

            <h3>Step 2</h3>

            <h4>Earn 14% Monthly</h4>

            <p>
              Receive consistent monthly returns throughout the investment
              period.
            </p>
          </div>

          <div className="journey-card">
            <div className="journey-icon">
              <FaWallet />
            </div>

            <h3>Step 3</h3>

            <h4>Complete in 10 Months</h4>

            <p>
              Withdraw your investment and accumulated returns after the plan
              ends.
            </p>
          </div>
        </div>

        <div className="journey-summary">
          <div className="summary-box">
            <h3>₹5,000</h3>
            <span>Minimum Investment</span>
          </div>

          <div className="summary-box">
            <h3>14%</h3>
            <span>Monthly Return</span>
          </div>

          <div className="summary-box">
            <h3>10</h3>
            <span>Months Duration</span>
          </div>
        </div>

        <button className="journey-btn">
          Start Your Investment
        </button>
      </div>
    </section>
  );
};

export default InvestmentJourney;