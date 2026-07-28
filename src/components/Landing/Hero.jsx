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
            Start investing in gold with just <strong>₹5,000</strong>. Earn <strong>14% monthly returns</strong> with AurumFX — your trusted gold trading partner with transparent payouts.
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
          <img src={goldBarsImg} alt="Gold Bars" className="terminal-gold-img" />
        </div>
        {/* </div> */}
      </div>
    </section>
  );
}

export default Hero;
