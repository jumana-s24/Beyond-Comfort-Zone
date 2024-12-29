import React from "react";
import { Link } from "react-router-dom";

const JoinCommunity: React.FC = () => {
  return (
    <section className="py-20 px-10 bg-blue-100 text-center">
      <h2 className="text-5xl font-bold mb-8">
        Start Your Journey to Growth Today
      </h2>
      <p className="text-4xl text-gray-700 mb-12">
        Every big change starts with a single step. Take on challenges that
        inspire confidence, build resilience, and help you become the best
        version of yourself!
      </p>
      <Link
        to="/challenges/global-challenges"
        className="text-xl px-6 py-3 bg-primary text-white rounded-lg shadow-md hover:bg-secondary"
      >
        Start Your First Challenge
      </Link>
    </section>
  );
};

export default JoinCommunity;
