import {
  FiTrendingUp,
  FiShield,
  FiAward,
  FiHeadphones,
} from "react-icons/fi";
import "./Features.css";

const features = [
  {
    icon: <FiAward />,
    title: "Expert Gold Trading",
    description:
      "Our team of seasoned professionals has years of experience in gold market trading, ensuring optimal returns on your investments.",
  },
  {
    icon: <FiShield />,
    title: "Complete Transparency",
    description:
      "We believe in complete transparency. Track your investment growth monthly and understand exactly how your money is working for you.",
  },
  {
    icon: <FiTrendingUp />,
    title: "Consistent Returns",
    description:
      "Our proven investment model delivers reliable 14% monthly returns, making wealth building predictable and accessible.",
  },
  {
    icon: <FiHeadphones />,
    title: "Dedicated Support",
    description:
      "Our investment advisors are always available to answer your questions and guide you through your wealth-building journey.",
  },
];

const Features = () => {
  return (
    <section className="features" id="why-choose">
      <div className="features-container">
        <div className="section-head">
          <h2>Why Choose AurumFX?</h2>
          <p>The trusted gold investment platform engineered for reliable returns and peace of mind.</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
