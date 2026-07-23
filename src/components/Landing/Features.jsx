import {
  FaChartLine,
  FaShieldAlt,
  FaBolt,
  FaGlobe,
} from "react-icons/fa";
import "./Features.css";

const features = [
  {
    icon: <FaChartLine />,
    title: "Real-Time Charts",
    description:
      "Professional candlestick and area charts with live price feeds for gold and forex pairs.",
  },
  {
    icon: <FaBolt />,
    title: "Instant Execution",
    description:
      "Execute trades in milliseconds with our low-latency order engine and smart routing.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Secure Wallets",
    description:
      "Multi-layer encryption, 2FA, and segregated accounts keep your funds protected 24/7.",
  },
  {
    icon: <FaGlobe />,
    title: "Global Markets",
    description:
      "Access gold, silver, and major currency pairs from a single unified trading desk.",
  },
];

const Features = () => {
  return (
    <section className="features" id="features">
      <div className="features-container">
        <div className="section-head">
          <h2>Built for Modern Traders</h2>
          <p>Everything you need to trade gold and forex with confidence.</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
