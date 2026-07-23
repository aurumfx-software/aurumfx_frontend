import { Link } from "react-router-dom";
import { FiTrendingUp, FiShield, FiZap } from "react-icons/fi";
import "./Hero.css";

const chartPoints = "20,120 60,90 100,100 140,40 180,55 220,20 260,35 300,10";

function Hero() {
  return (
    <section className="landing-hero">
      <div className="hero-glow" />

      <div className="hero-inner">
        <div className="hero-copy">
          <div className="hero-badge">
            <FiZap /> Live Gold &amp; FX Trading
          </div>

          <h1>
            Trade smarter with
            <span> AurumFX</span>
          </h1>

          <p>
            Professional-grade gold and forex trading with real-time charts,
            instant execution, and secure portfolio management — all in one platform.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="hero-btn-primary">
              Open Free Account
            </Link>
            <Link to="/login" className="hero-btn-secondary">
              Sign In
            </Link>
          </div>

          <div className="hero-trust">
            <div className="trust-item">
              <FiTrendingUp />
              <span>14% avg. monthly returns</span>
            </div>
            <div className="trust-item">
              <FiShield />
              <span>Bank-grade security</span>
            </div>
          </div>
        </div>

        <div className="hero-terminal">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span /><span /><span />
            </div>
            <span className="terminal-title">XAU/USD · Live</span>
            <span className="terminal-live">LIVE</span>
          </div>

          <div className="terminal-body">
            <div className="terminal-price-row">
              <div>
                <span className="terminal-label">Gold Spot</span>
                <h2 className="terminal-price">$2,341.80</h2>
              </div>
              <span className="terminal-change up">+1.24%</span>
            </div>

            <svg viewBox="0 0 320 140" className="terminal-chart" preserveAspectRatio="none">
              <defs>
                <linearGradient id="heroChartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffc52d" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#ffc52d" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polyline
                points={`${chartPoints} 300,140 20,140`}
                fill="url(#heroChartGrad)"
                stroke="none"
              />
              <polyline
                points={chartPoints}
                fill="none"
                stroke="#ffc52d"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </svg>

            <div className="terminal-stats">
              <div>
                <span>24h High</span>
                <strong>$2,358.20</strong>
              </div>
              <div>
                <span>24h Low</span>
                <strong>$2,312.45</strong>
              </div>
              <div>
                <span>Volume</span>
                <strong>₹48.2M</strong>
              </div>
            </div>

            <div className="terminal-order">
              <button type="button" className="order-buy">Buy Gold</button>
              <button type="button" className="order-sell">Sell Gold</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
