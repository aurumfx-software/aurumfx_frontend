import "./CTASection.css";

const CTASection = () => {
  return (
    <section className="cta">
      <div className="cta-container">
        <h2>Ready to Start Growing Your Wealth?</h2>

        <p>
          Join thousands of successful investors who trust AurumFX for secure
          gold investments. Start today with just ₹5,000 and earn up to
          <strong> 14% monthly returns.</strong>
        </p>

        <div className="cta-buttons">
          <button className="cta-primary">
            Get Started
          </button>

          <button className="cta-secondary">
            Contact Us
          </button>
        </div>

        <div className="cta-stats">
          <div className="stat-box">
            <h3>₹5,000</h3>
            <span>Minimum Investment</span>
          </div>

          <div className="stat-box">
            <h3>14%</h3>
            <span>Monthly Return</span>
          </div>

          <div className="stat-box">
            <h3>10 Months</h3>
            <span>Investment Period</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;