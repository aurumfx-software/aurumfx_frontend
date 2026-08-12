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
          // exposed as CSS custom properties so Hero.css can pick
          // the right one per breakpoint via a media query —
          // this is what lets desktop and mobile use different files.
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
              Start investing in gold with just <strong>₹5,000</strong>. Earn{" "}
              <strong>14% & 8% monthly returns</strong> with AurumFX — your
              trusted gold trading partner with transparent payouts.
            </p>

            <div className="hero-actions anim-item delay-4">
              <Link to="/register" className="hero-btn-primary">
                Start Investing Now
                <FiArrowRight />
              </Link>
              <a href="#calculator" className="hero-btn-secondary">
                <FiActivity />
                Calculate Returns
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;