import { Link } from "react-router-dom";
import { FiZap, FiArrowRight, FiActivity } from "react-icons/fi";
import heroImageDesktop from "../../assets/image.png";
import heroImageMobile from "../../assets/mobile.png";
import "./Hero.css";

function Hero() {
  return (
    <section id="hero" className="landing-hero">
      <div
        className="hero-bg-image"
        style={{
          
          "--bg-desktop": `url(${heroImageDesktop})`,
          "--bg-mobile": `url(${heroImageMobile})`,
        }}
      ></div>

      <div className="hero-inner">
        <div className="hero-layout">
          <div className="hero-copy">
            <div className="hero-badge anim-item delay-1">
              <FiZap /> Trusted Gold Investment Platform
            </div>

            <h1 className="anim-item delay-2">
              Grow Your Wealth with
              <span> Gold Trading</span>
            </h1>

            <p className="anim-item delay-3">
              Start investing with just <strong>₹5,000</strong>. Earn{" "}
              <strong>8% / 14% monthly returns</strong> with AurumFX — your
              trusted gold trading partner with transparent payouts.
            </p>

            <div className="hero-actions anim-item delay-4">
              <Link to="/register" className="hero-btn-primary">
                Start Investing Now
                <FiArrowRight />
              </Link>
              <a href="#plans" className="hero-btn-secondary">
                <FiActivity />
                View Plans
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;