import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiLogIn } from "react-icons/fi";
import "./CTASection.css";

const stats = [
  { value: "₹5,000", label: "Minimum Deposit" },
  { value: "8% / 14%", label: "Monthly Return" },
  { value: "24/7", label: "Live Markets" },
];

const CTASection = () => {
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
      className={`cta ${isVisible ? "in-view" : ""}`}
    >
      <div className="cta-glow cta-glow-left" />
      <div className="cta-glow cta-glow-right" />
      <div className="cta-line-beam" />

      <div className="cta-container">
        <div className="cta-head">
          <h2>
            Ready to trade <span>gold &amp; forex?</span>
          </h2>
          <p>
            Join AurumFX today. Open a free account, fund your wallet, and start
            trading with professional tools built for serious investors.
          </p>
        </div>

        <div className="cta-buttons">
          <Link to="/user/register" className="cta-primary">
            Get Started Free
            <FiArrowRight className="cta-primary-icon" />
          </Link>
          <Link to="/user/login" className="cta-secondary">
            <FiLogIn className="cta-secondary-icon" />
            Sign In
          </Link>
        </div>

        <div className="cta-stats">
          {stats.map((stat, index) => (
            <div
              className="stat-box"
              key={stat.label}
              style={{ animationDelay: `${0.3 + index * 0.15}s` }}
            >
              <h3>{stat.value}</h3>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTASection;