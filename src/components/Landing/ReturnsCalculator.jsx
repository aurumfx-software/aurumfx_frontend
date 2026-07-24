import { useState } from "react";
import {  FiTrendingUp, FiDollarSign, FiCalendar, FiArrowRight } from "react-icons/fi";
import "./ReturnsCalculator.css";

function ReturnsCalculator() {
  const [amount, setAmount] = useState(5000);

  const parsedAmount = Math.max(0, Number(amount) || 0);
  const monthlyBonus = Math.round(parsedAmount * 0.14);
  const totalReturns = Math.round(monthlyBonus * 10);
  const finalPayout = parsedAmount + totalReturns;

  const quickAmounts = [5000, 10000, 25000, 50000, 100000];

  return (
    <section className="calculator-section" id="calculator">
      <div className="calculator-container">
        <div className="section-head">
          <div className="section-badge">
            {/* <FiCalculator /> */}
             Profit Estimation
          </div>
          <h2>
            Calculate Your <span>Gold Returns</span>
          </h2>
          <p>
            Enter your investment amount to calculate your projected 14% monthly payouts over the 10-month tenure.
          </p>
        </div>

        <div className="calculator-card">
          <div className="calculator-left">
            <div className="form-group">
              <label htmlFor="inv-amount">Investment Amount (₹)</label>
              <div className="input-wrap">
                <span className="currency-symbol">₹</span>
                <input
                  id="inv-amount"
                  type="number"
                  min="5000"
                  step="1000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter investment amount (Min ₹5,000)"
                />
              </div>
              <span className="input-hint">Minimum investment: ₹5,000</span>
            </div>

            <div className="quick-select">
              <span className="select-label">Quick Select:</span>
              <div className="quick-btns">
                {quickAmounts.map((val) => (
                  <button
                    type="button"
                    key={val}
                    className={`quick-btn ${parsedAmount === val ? "active" : ""}`}
                    onClick={() => setAmount(val)}
                  >
                    ₹{val.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div className="calc-note">
              <FiTrendingUp className="note-icon" />
              <p>
                That's <strong>₹{monthlyBonus.toLocaleString()}</strong> per month for 10 months on your <strong>₹{parsedAmount.toLocaleString()}</strong> investment!
              </p>
            </div>
          </div>

          <div className="calculator-right">
            <div className="result-card">
              <div className="result-header">
                <FiDollarSign />
                <h3>Projected Returns</h3>
              </div>

              <div className="result-row">
                <div className="res-item">
                  <span className="res-title">Monthly Return (14%)</span>
                  <strong className="res-value gold">₹{monthlyBonus.toLocaleString()} / mo</strong>
                </div>
                <div className="res-item">
                  <span className="res-title">Tenure Duration</span>
                  <strong className="res-value">10 Months</strong>
                </div>
              </div>

              <div className="result-divider" />

              <div className="total-box">
                <div>
                  <span className="tot-label">Total Profits (10 Months)</span>
                  <h3 className="tot-value">₹{totalReturns.toLocaleString()}</h3>
                </div>
                <span className="roi-badge">+140% ROI</span>
              </div>

              <div className="payout-box">
                <span>Total Final Payout (Principal + Profit)</span>
                <strong>₹{finalPayout.toLocaleString()}</strong>
              </div>

              <a href="/register" className="calc-cta-btn">
                Start Investing Now <FiArrowRight />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReturnsCalculator;
