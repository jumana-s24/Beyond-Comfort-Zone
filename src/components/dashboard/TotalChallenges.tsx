import React from "react";
import CountUp from "react-countup";

interface TotalChallengesProps {
  totalChallenges: number;
}

const TotalChallenges: React.FC<TotalChallengesProps> = ({
  totalChallenges,
}) => {
  return (
    <div className="bg-white shadow-md rounded-md p-6 flex flex-col items-center border border-gray-100">
      <h3 className="text-2xl font-bold mb-4 text-center animate-fadeIn">
        Total Challenges Completed
      </h3>
      <p className="text-primary font-semibold text-4xl">
        <CountUp end={totalChallenges} duration={2} />
      </p>
    </div>
  );
};

export default TotalChallenges;
