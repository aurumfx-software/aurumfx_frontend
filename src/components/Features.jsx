import "./Features.css";
import {
  FaChartLine,
  FaShieldAlt,
  FaClock,
  FaCoins,
} from "react-icons/fa";

const features = [
  {
    icon: <FaChartLine />,
    title: "14% Monthly Returns",
    description:
      "Earn consistent monthly returns through our professionally managed gold investment plans.",
  },
  {
    icon: <FaShieldAlt />,
    title: "100% Secure Investment",
    description:
      "Your investments are protected with transparent operations and trusted financial practices.",
  },
  {
    icon: <FaClock />,
    title: "10-Month Investment",
    description:
      "Enjoy predictable returns every month with our structured 10-month investment cycle.",
  },
  {
    icon: <FaCoins />,
    title: "Start from ₹5,000",
    description:
      "Begin your investment journey with a minimum amount of just ₹5,000.",
  },
];

const Features = () => {
  return (
    <section className="features">
      <div className="features-container">
        <h2>Simple, Secure & Profitable Investment</h2>

        <p className="section-description">
          Discover why thousands of investors trust AurumFX for building
          long-term wealth through gold trading.
        </p>

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