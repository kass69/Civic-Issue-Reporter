import Hero from "../components/Hero.tsx";
import Header from "../components/Header.tsx";
import Features from "../components/Features.tsx";
import IssueTypes from "../components/IssueTypes.tsx";
import HowItWorks from "../components/HowItWorks.tsx";
import CTA from "../components/CTA.tsx";
import Footer from "../components/Footer.tsx";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <IssueTypes />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  )
}

export default Index;
