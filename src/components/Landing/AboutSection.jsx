import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiShield, FiTrendingUp, FiUsers, FiArrowRight } from "react-icons/fi";
import icon from "../../assets/icon.png";
import "./AboutSection.css";

const highlights = [
  {
    icon: <FiShield />,
    title: "Secure & Transparent",
    text: "Every trade backed by real gold liquidity and full payout transparency.",
  },
  {
    icon: <FiTrendingUp />,
    title: "Consistent Returns",
    text: "Structured monthly returns of 14% & 8%, credited directly to your wallet.",
  },
  {
    icon: <FiUsers />,
    title: "Built for Investors",
    text: "From first-time traders to seasoned investors, tools for every level.",
  },
];

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`about-section ${isVisible ? "in-view" : ""}`}
      id="about"
    >
      <div className="about-glow about-glow-left" />
      <div className="about-glow about-glow-right" />

      <div className="about-container">
        {/* Left: Image */}
        <div className="about-media">
          <img src={icon} alt="AurumFX" className="about-media-img" />
          <div className="about-media-ring" />
        </div>

        {/* Right: Content */}
        <div className="about-content">
          <div className="about-badge">
            <FiShield /> About AurumFX
          </div>

          <h2>
            Your Trusted Partner in <span>Gold & Forex Trading</span>
          </h2>

          <p className="about-lead">
            AurumFX is a professional gold and forex trading platform built for
            serious investors. We combine real-time market access, secure
            wallet infrastructure, and transparent payout structures to help
            you grow your wealth with confidence.
          </p>

          <p className="about-sub">
            Headquartered in Dubai, UAE, our platform gives you direct access
            to live XAU/USD pricing, professional MT5 charting tools, and a
            trading experience built on trust — starting with as little as
            ₹5,000.
          </p>

          <div className="about-highlights">
            {highlights.map((item, index) => (
              <div
                className="about-highlight-item"
                key={item.title}
                style={{ animationDelay: `${0.2 + index * 0.12}s` }}
              >
                <span className="highlight-icon">{item.icon}</span>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <Link to="/register" className="about-cta">
            Start Your Journey
            <FiArrowRight className="about-cta-icon" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;