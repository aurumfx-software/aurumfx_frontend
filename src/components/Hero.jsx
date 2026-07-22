import "./Hero.css";
import goldImage from "../assets/goldbar.png";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <div className="hero-container">

          <div className="hero-content">
            <h1>
              Grow Your Wealth
              <br />
              with the Power of
              <span> Gold</span>
            </h1>

            <p>
              Start investing with just ₹5,000 and earn up to
              <strong> 14% monthly returns </strong>
              through our secure and transparent gold investment plans.
            </p>

            <div className="hero-buttons">
              <button className="primary-btn">Start Investing</button>
              <button className="secondary-btn">Learn More</button>
            </div>

            
          </div>

          <div className="hero-image">
            <img src={goldImage} alt="Gold Investment" />
          </div> 

        </div>
      </div>
    </section>
  );
};

export default Hero;