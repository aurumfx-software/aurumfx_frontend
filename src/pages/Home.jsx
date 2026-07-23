import Navbar from "../components/Landing/Navbar";
import Hero from "../components/Landing/Hero";
import Features from "../components/Landing/Features";
import InvestmentJourney from "../components/Landing/InvestmentJourney";
import WhyChoose from "../components/Landing/WhyChoose";
import CTASection from "../components/Landing/CTASection";
import Footer from "../components/Landing/Footer";

import "./Home.css";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <InvestmentJourney />
      <WhyChoose />
      <CTASection />
      <Footer />
    </>
  );
};

export default Home;
