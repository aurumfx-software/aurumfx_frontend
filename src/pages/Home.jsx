import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import InvestmentJourney from "../components/InvestmentJourney";
import WhyChoose from "../components/WhyChoose";



import "./Home.css";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <InvestmentJourney/>
      <WhyChoose/>
      {/*
      <Calculator />

      <Testimonials />

      <Contact />

      <Footer /> */}
    </>
  );
};

export default Home;
