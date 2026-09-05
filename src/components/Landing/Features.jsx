import { useState, useEffect, useRef } from "react";
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
    image:
      "https://images.unsplash.com/photo-1610375461369-d613b564f4c4?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: <FiShield />,
    title: "Complete Transparency",
    description:
      "We believe in complete transparency. Track your investment growth monthly and understand exactly how your money is working for you.",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: <FiTrendingUp />,
    title: "Consistent Returns",
    description:
      "Our proven investment model delivers reliable 8% / 14% monthly returns, making wealth building predictable and accessible.",
    image:
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",
  },
  {
  icon: <FiHeadphones />,
  title: "Dedicated Support",
  description:
    "Our investment advisors are always available to answer your questions and guide you through your wealth-building journey.",
  image:
    "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=800&q=80",
},
];

const Features = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`features ${isVisible ? "in-view" : ""}`}
      id="why-choose"
    >
      <div className="gold-line-beam" />

      <div className="features-container">
        <div className="section-head">
          <h2>
            Why Choose <span>AurumFX</span>?
          </h2>
          <p>
            The trusted gold investment platform engineered for reliable
            returns and peace of mind.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              className="feature-card"
              key={index}
              style={{ animationDelay: `${0.15 + index * 0.15}s` }}
            >
              <div className="feature-img-wrap">
                <img src={feature.image} alt={feature.title} loading="lazy" />
                <div className="feature-img-overlay" />
              </div>

              <div className="feature-icon">{feature.icon}</div>

              <div className="feature-card-body">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;