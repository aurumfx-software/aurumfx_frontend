import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiLogIn } from "react-icons/fi";
import "./CTASection.css";

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
          <div className="stat-box" style={{ animationDelay: "0.3s" }}>
            <h3>₹5,000</h3>
            <span>Minimum Deposit</span>
          </div>

          <div className="stat-box stat-box--dual" style={{ animationDelay: "0.45s" }}>
            <div className="dual-pills">
              <div className="rate-pill">
                <strong>8%</strong>
                <span>30-Month Plan</span>
              </div>
              <div className="rate-pill">
                <strong>14%</strong>
                <span>10-Month Plan</span>
              </div>
            </div>
            <span>Monthly Return</span>
          </div>

          <div className="stat-box" style={{ animationDelay: "0.6s" }}>
            <h3>24/7</h3>
            <span>Live Markets</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;