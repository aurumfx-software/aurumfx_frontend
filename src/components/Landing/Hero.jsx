import { useState } from "react";
import { Link } from "react-router-dom";
import { FiTrendingUp, FiShield, FiZap, FiMaximize2, FiDollarSign } from "react-icons/fi";
import "./Hero.css";

const pairsData = {
  "XAU/USD": {
    label: "Gold Spot",
    price: "$2,341.80",
    change: "+1.24%",
    up: true,
    high: "$2,358.20",
    low: "$2,312.45",
    vol: "$48.2M",
    points: "20,110 60,85 100,95 140,40 180,55 220,20 260,35 300,10",
  },
  "EUR/USD": {
    label: "Euro / US Dollar",
    price: "$1.0842",
    change: "-0.18%",
    up: false,
    high: "$1.0890",
    low: "$1.0820",
    vol: "$124.5M",
    points: "20,30 60,45 100,25 140,80 180,65 220,110 260,95 300,120",
  },
  "GBP/USD": {
    label: "Pound Sterling",
    price: "$1.2715",
    change: "+0.32%",
    up: true,
    high: "$1.2760",
    low: "$1.2680",
    vol: "$89.1M",
    points: "20,95 60,110 100,80 140,65 180,45 220,30 260,40 300,15",
  },
};

function Hero() {
  const [activePair, setActivePair] = useState("XAU/USD");
  const [orderToast, setOrderToast] = useState(null);

  const current = pairsData[activePair];

  const handleQuickOrder = (type) => {
    const action = type.toUpperCase();
    setOrderToast(`${action} order simulated for 0.10 Lot ${activePair} @ ${current.price}`);
    setTimeout(() => setOrderToast(null), 3000);
  };

  return (
    <section className="landing-hero">
      <div className="hero-glow" />

      <div className="hero-inner">
        <div className="hero-copy">
          <div className="hero-badge">
            <FiZap /> Trusted Gold Investment Platform
          </div>

          <h1>
            Grow Your Wealth with
            <span> Gold Trading</span>
          </h1>

          <p>
            Start investing in gold with just <strong>₹5,000</strong>. Earn <strong>14% monthly returns</strong> with AurumFX — your trusted gold trading partner with transparent payouts.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="hero-btn-primary">
              Start Investing Now
            </Link>
            <a href="#calculator" className="hero-btn-secondary">
              Calculate Returns
            </a>
          </div>

          <div className="hero-trust">
            <div className="trust-item">
              <FiTrendingUp />
              <span>14% Monthly Return</span>
            </div>
            <div className="trust-item">
              <FiDollarSign />
              <span>₹5,000 Min Deposit</span>
            </div>
            <div className="trust-item">
              <FiShield />
              <span>10-Month Tenure</span>
            </div>
          </div>
        </div>

        <div className="hero-terminal">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span />
              <span />
              <span />
            </div>

            <div className="terminal-pair-tabs">
              {Object.keys(pairsData).map((pair) => (
                <button
                  type="button"
                  key={pair}
                  className={`terminal-tab-btn ${activePair === pair ? "active" : ""}`}
                  onClick={() => setActivePair(pair)}
                >
                  {pair}
                </button>
              ))}
            </div>

            <a href="#mt5-chart" className="terminal-fullscreen-link" title="Open Full MT5 Chart">
              <FiMaximize2 />
            </a>
          </div>

          <div className="terminal-body">
            <div className="terminal-price-row">
              <div>
                <span className="terminal-label">{current.label}</span>
                <h2 className="terminal-price">{current.price}</h2>
              </div>
              <span className={`terminal-change ${current.up ? "up" : "down"}`}>
                {current.change}
              </span>
            </div>

            <svg viewBox="0 0 320 140" className="terminal-chart" preserveAspectRatio="none">
              <defs>
                <linearGradient id="heroChartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polyline
                points={`${current.points} 300,140 20,140`}
                fill="url(#heroChartGrad)"
                stroke="none"
              />
              <polyline
                points={current.points}
                fill="none"
                stroke="#d4af37"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </svg>

            <div className="terminal-stats">
              <div>
                <span>Monthly Return</span>
                <strong>14% Payout</strong>
              </div>
              <div>
                <span>Min Deposit</span>
                <strong>₹5,000</strong>
              </div>
              <div>
                <span>Tenure</span>
                <strong>10 Months</strong>
              </div>
            </div>

            {orderToast && <div className="terminal-order-toast">{orderToast}</div>}

            <div className="terminal-order">
              <button
                type="button"
                className="order-buy"
                onClick={() => handleQuickOrder("buy")}
              >
                Buy {activePair.split("/")[0]}
              </button>
              <button
                type="button"
                className="order-sell"
                onClick={() => handleQuickOrder("sell")}
              >
                Sell {activePair.split("/")[0]}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
