import React from "react";
import DailyChallenge from "../challenges/daily/DailyChallenge";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";
import Features from "./Features";
import WhyChallenges from "./WhyChallenges";
import JoinCommunity from "./JoinCommunity";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorks />
      <WhyChallenges />
      <Features />
      <JoinCommunity />
      <DailyChallenge />
    </div>
  );
};

export default Home;
