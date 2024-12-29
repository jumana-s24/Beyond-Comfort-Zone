import React from "react";

interface StreakTrackerProps {
  currentStreak: number;
  longestStreak: number;
}

const StreakTracker: React.FC<StreakTrackerProps> = ({
  currentStreak,
  longestStreak,
}) => {
  return (
    <div className="bg-white flex flex-col items-center shadow-md rounded-md p-4 border border-gray-100">
      <h3 className="text-2xl font-bold mb-2 animate-fadeIn">Streak Tracker</h3>
      <p className="text-lg">
        Current Streak:{" "}
        <span className="text-primary font-semibold">{currentStreak} days</span>
      </p>
      <p className="text-lg">
        Longest Streak:{" "}
        <span className="text-[#eb9e93] font-semibold">
          {longestStreak} days
        </span>
      </p>
    </div>
  );
};

export default StreakTracker;
