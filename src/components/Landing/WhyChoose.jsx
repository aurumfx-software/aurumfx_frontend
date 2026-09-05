import "./WhyChoose.css";
import {
  FaShieldAlt,
  FaChartLine,
  FaUsers,
  FaHeadset,
} from "react-icons/fa";
import { FiShield } from "react-icons/fi";

const reasons = [
  {
    icon: <FaShieldAlt />,
    title: "Secure Investment",
    description:
      "Your investments are protected with transparent processes and reliable management.",
  },
  {
    icon: <FaChartLine />,
    title: "High Monthly Returns",
    description:
      "Earn up to 14% monthly returns through our professionally managed gold trading strategy.",
  },
  {
    icon: <FaUsers />,
    title: "Trusted by Investors",
    description:
      "Thousands of investors trust AurumFX for safe, consistent, and long-term wealth creation.",
  },
  {
    icon: <FaHeadset />,
    title: "Dedicated Support",
    description:
      "Our expert support team is always available to guide you throughout your investment journey.",
  },
];

const WhyChoose = () => {
  return (
    <section className="why-choose">
      <div className="why-container">
        <div className="section-head">
          <div className="section-badge">
            <FiShield /> Premium Features
          </div>
          <h2>Why Choose AurumFX?</h2>

          <p className="why-subtitle">
            We combine experience, transparency, and innovation to provide a
            secure and profitable investment platform.
          </p>
        </div>

        <div className="why-grid">
          {reasons.map((item, index) => (
            <div className="why-card" key={index}>
              <div className="why-icon">
                {item.icon}
              </div>

              <h3>{item.title}</h3>

              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;