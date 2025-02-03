import React, { useEffect, useState } from "react";
import { auth } from "../../firebase/firebase";
import StreakTracker from "./StreakTracker";
import {
  completeChallengeService,
  fetchChallengesByStatusService,
} from "../../services/globalChallengeService";
import ChallengeBreakdown from "./ChallengeBreakdown";
import { updateUserStatsService } from "../../services/statsService";
import InProgressChallenges from "./InProgressChallenges";
import CompletedChallenges from "./CompletedChallenges";
import TotalChallenges from "./TotalChallenges";
import { fetchUserByIdService } from "../../services/userService";
import { Spinner } from "../common/Spinner";

const Dashboard: React.FC = () => {
  const userId = auth.currentUser?.uid as string;

  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [longestStreak, setLongestStreak] = useState<number>(0);
  const [challengeBreakdown, setChallengeBreakdown] = useState<
    {
      name: string;
      value: number;
    }[]
  >([]);
  const [totalChallenges, setTotalChallenges] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [inProgressChallenges, setInProgressChallenges] = useState<any>([]);
  const [completedChallenges, setCompletedChallenges] = useState<any>([]);

  const fetchChallengeData = async () => {
    const inProgress =
      (await fetchChallengesByStatusService(userId, "in-progress")) || [];
    const completed =
      (await fetchChallengesByStatusService(userId, "completed")) || [];
    setCompletedChallenges(completed);
    setInProgressChallenges(inProgress);

    const breakdown = completed.reduce((acc: any, challenge: any) => {
      acc[challenge.category] = (acc[challenge.category] || 0) + 1;
      return acc;
    }, {});

    const breakdownArray = Object.keys(breakdown).map((key) => ({
      name: key,
      value: breakdown[key],
    }));

    setChallengeBreakdown(breakdownArray);
    setTotalChallenges(completed.length);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userInfo = await fetchUserByIdService(userId);

        setCurrentStreak(userInfo.stats?.streak || 0);
        setLongestStreak(userInfo.stats?.longestStreak || 0);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    fetchChallengeData();
  }, [userId]);

  const handleCompleteChallenge = async (challengeId: string) => {
    await completeChallengeService(userId, challengeId);
    await fetchChallengeData();
    await updateUserStatsService(userId);
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen mt-10 mb-20">
      <h1 className="text-4xl font-newsreader-light text-center font-semibold mb-6 animate-fadeIn">
        Growth Dashboard
      </h1>

      <p className="text-xl text-center text-gray-600 mb-10 animate-fadeIn">
        Your journey of self-growth starts here. Track your progress, break your
        limits, and celebrate every achievement. Remember, every small step
        forward counts toward a stronger, better you.
      </p>

      {/* Streak Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StreakTracker
          currentStreak={currentStreak}
          longestStreak={longestStreak}
        />

        {/* Total Challenges Completed */}
        <TotalChallenges totalChallenges={totalChallenges} />
      </div>

      <ChallengeBreakdown data={challengeBreakdown} />

      {/* Challenges Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-20 mb-40">
        <InProgressChallenges
          data={inProgressChallenges}
          handleCompleteChallenge={handleCompleteChallenge}
        />

        <CompletedChallenges data={completedChallenges} />
      </div>
    </div>
  );
};

export default Dashboard;
