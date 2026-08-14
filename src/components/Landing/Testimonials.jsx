import { useState, useEffect, useRef, useCallback } from "react";
import { FiChevronLeft, FiChevronRight, FiCheckCircle, FiMessageCircle } from "react-icons/fi";
import "./Testimonials.css";

const TESTIMONIALS = [
  {
    name: "Akshaya Anil",
    location: "Thiruvananthapuram",
    quote:
      "What stood out for me was how clearly the payouts are tracked. I always know exactly where my money stands, month to month, without having to chase anyone for updates.",
  },
  {
    name: "Sanoop E S",
    location: "Abu Dhabi",
    quote:
      "Started with the minimum deposit just to see how it works. The onboarding was straightforward, and the wallet dashboard made it easy to keep an eye on things from abroad.",
  },
  {
    name: "Ajayakumar O K",
    location: "Payyanur",
    quote:
      "I've tried a few gold investment platforms before, but the transparency here is different. Every return is documented and nothing feels like a black box.",
  },
  {
    name: "Neeraj",
    location: "Thrissur",
    quote:
      "The 30-month plan suited my timeline perfectly. Support was quick to respond whenever I had questions about withdrawals, which mattered a lot to me early on.",
  },
  {
    name: "Aneesh",
    location: "Calicut",
    quote:
      "Simple to get started, and the platform feels genuinely built for people who want steady, well-documented growth rather than hype. That's what kept me investing more.",
  },
];

const AUTO_ADVANCE_MS = 5000;

function initials(name) {
  return name.trim().charAt(0).toUpperCase();
}

function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef(null);
  const sectionRef = useRef(null);
  const count = TESTIMONIALS.length;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // No disconnect — re-triggers every time the section enters/leaves
    // view, so scrolling up past it and back down replays the animation.
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback(
    (idx) => {
      setActive(((idx % count) + count) % count);
    },
    [count]
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (paused) return undefined;
    timerRef.current = setInterval(() => {
      setActive((a) => (a + 1) % count);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timerRef.current);
  }, [paused, count]);

  const offsetFor = (idx) => {
    let diff = idx - active;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    return diff;
  };

  return (
    <section ref={sectionRef} className={`testimonials-section ${isVisible ? "in-view" : ""}`}>
      <div className="section-head">
        <div className="section-badge">
          <FiMessageCircle /> Client Voices
        </div>
        <h2>
          What our <span>investors</span> say
        </h2>
        <p>
          Real accounts from AurumFX members on how they track, grow, and
          withdraw their gold &amp; forex returns.
        </p>
      </div>

      <div
        className="testimonial-carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <button
          className="carousel-nav carousel-nav--prev"
          onClick={prev}
          aria-label="Previous testimonial"
        >
          <FiChevronLeft />
        </button>

        <div className="carousel-track">
          {TESTIMONIALS.map((t, idx) => {
            const offset = offsetFor(idx);
            const isActive = offset === 0;
            const visible = Math.abs(offset) <= 1;

            return (
              <article
                key={t.name}
                className={`testimonial-card ${
                  isActive ? "is-active" : "is-side"
                }`}
                style={{
                  transform: `translateX(${offset * 88}%) scale(${
                    isActive ? 1 : 0.84
                  })`,
                  opacity: visible ? (isActive ? 1 : 0.38) : 0,
                  pointerEvents: isActive ? "auto" : "none",
                  zIndex: isActive ? 3 : 2 - Math.abs(offset),
                }}
                aria-hidden={!isActive}
              >
                <div className="card-shine" />
                <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="testimonial-person">
                  <span className="person-avatar">{initials(t.name)}</span>
                  <div className="person-info">
                    <span className="person-name">
                      {t.name}
                      <FiCheckCircle className="verified-icon" title="Verified investor" />
                    </span>
                    <span className="person-location">{t.location}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <button
          className="carousel-nav carousel-nav--next"
          onClick={next}
          aria-label="Next testimonial"
        >
          <FiChevronRight />
        </button>
      </div>

      <div className="testimonial-dots">
        {TESTIMONIALS.map((t, idx) => (
          <button
            key={t.name}
            className={`dot ${idx === active ? "dot--active" : ""}`}
            onClick={() => goTo(idx)}
            aria-label={`Go to testimonial ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default Testimonials;