import Navbar from "../components/Landing/Navbar";
import TickerBar from "../components/Landing/TickerBar";
import Hero from "../components/Landing/Hero";
import MarketOverview from "../components/Landing/MarketOverview";
import Features from "../components/Landing/Features";
import InvestmentJourney from "../components/Landing/InvestmentJourney";
import CTASection from "../components/Landing/CTASection";
import Footer from "../components/Landing/Footer";

import "./Home.css";

const Home = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <TickerBar />
      <Hero />
      <MarketOverview />
      <Features />
      <InvestmentJourney />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Home;
