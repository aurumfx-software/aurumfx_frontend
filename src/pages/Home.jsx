import Navbar from "../components/Landing/Navbar";
import Hero from "../components/Landing/Hero";
import MT5RealChart from "../components/Landing/MT5RealChart";
import ReturnsCalculator from "../components/Landing/ReturnsCalculator";
import InvestmentTiers from "../components/Landing/InvestmentTiers";
import Features from "../components/Landing/Features";
import InvestmentJourney from "../components/Landing/InvestmentJourney";
import FAQ from "../components/Landing/FAQ";
import CTASection from "../components/Landing/CTASection";
import Footer from "../components/Landing/Footer";

import "./Home.css";

const Home = () => {
  return (
    <div className="landing-page">
      <Navbar />
      {/* <TickerBar /> */}
      <Hero />
      <MT5RealChart />
      <ReturnsCalculator />
      <InvestmentTiers />
      <Features />
      {/* <MarketOverview /> */}
      <InvestmentJourney />
      <FAQ />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Home;
