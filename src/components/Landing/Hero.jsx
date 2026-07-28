import { Link } from "react-router-dom";
import { FiZap } from "react-icons/fi";
import goldBarsImg from "../../assets/goldbar.png";
import "./Hero.css";


function Hero() {
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
            Start investing in gold with just <strong>₹5,000</strong>. Earn <strong>14% & 8% monthly returns</strong> with AurumFX — your trusted gold trading partner with transparent payouts.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="hero-btn-primary">
              Start Investing Now
            </Link>
            <a href="#calculator" className="hero-btn-secondary">
              Calculate Returns
            </a>
          </div>


        </div>

        {/* <div className="hero-terminal"> */}


        <div className="terminal-body">
          {/* Background Golden Glow & Particle Effects */}
          <div className="gold-glow-ring" />
          <div className="gold-glow-ring secondary" />
          <div className="gold-light-rays" />

          {/* Sparkling Glitter Dots */}
          <div className="gold-sparkle sparkle-1" />
          <div className="gold-sparkle sparkle-2" />
          <div className="gold-sparkle sparkle-3" />
          <div className="gold-sparkle sparkle-4" />
          <div className="gold-sparkle sparkle-5" />
          <div className="gold-sparkle sparkle-6" />
          <div className="gold-sparkle sparkle-7" />
          <div className="gold-sparkle sparkle-8" />

          {/* Sparkling 4-Point Stars */}
          <svg className="sparkle-star star-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
          <svg className="sparkle-star star-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
          <svg className="sparkle-star star-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
          <svg className="sparkle-star star-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
          <svg className="sparkle-star star-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>

          <img src={goldBarsImg} alt="Gold Bars" className="terminal-gold-img" />
        </div>
        {/* </div> */}
      </div>
    </section>
  );
}

export default Hero;
