import React, { useEffect, useState } from "react";
import DailyChallengeCard from "./DailyChallengeCard";
import { auth } from "../../../firebase/firebase";
import { Spinner } from "../../common/Spinner";
import {
  completeChallengeService,
  joinChallengeService,
} from "../../../services/globalChallengeService";
import {
  getOrAssignDailyChallengeService,
  updateDailyChallengeStatusService,
} from "../../../services/dailyChallengeService";
import { updateUserStatsService } from "../../../services/statsService";
import { Link, useNavigate } from "react-router-dom";
import { Challenge } from "../../../types";
import { useAuth } from "../../../contexts/AuthContext";

const DailyChallenge: React.FC = () => {
  const userId = auth.currentUser?.uid as string;
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const currentDate = new Date().toISOString().split("T")[0];
  const { user, isVerified } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDailyChallenge = async () => {
      try {
        setLoading(true);
        let dailyChallenge = (await getOrAssignDailyChallengeService(
          userId,
          currentDate
        )) as Challenge;
        setChallenge(dailyChallenge);
      } catch (error) {
        console.error("Failed to load daily challenge.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyChallenge();
  }, [userId, currentDate]);

  const handleJoinChallenge = async () => {
    if (!challenge) return;
    if (!user && !isVerified) {
      navigate("/auth");
      return;
    }

    try {
      await updateDailyChallengeStatusService(
        userId,
        currentDate,
        "in-progress"
      );

      await joinChallengeService(userId, currentDate, "daily", challenge);
      setChallenge((prev) =>
        prev ? { ...prev, status: "in-progress" } : prev
      );
    } catch (error) {
      console.error("Failed to join daily challenge:", error);
    }
  };

  const handleCompleteChallenge = async () => {
    if (!challenge) return;

    try {
      await updateDailyChallengeStatusService(userId, currentDate, "completed");
      await completeChallengeService(userId, currentDate);
      await updateUserStatsService(userId);
      setChallenge((prev) => (prev ? { ...prev, status: "completed" } : prev));
    } catch (error) {
      console.error("Failed to complete daily challenge:", error);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="flex justify-center min-h-screen px-4 md:px-10 mt-20 mb-40">
      <div className="w-full max-w-lg">
        <h1 className="text-4xl font-semibold mb-6 text-center animate-fadeIn">
          Today's Challenge
        </h1>
        {challenge !== null ? (
          <DailyChallengeCard
            title={challenge.title}
            description={challenge.description}
            category={challenge.category}
            difficulty={challenge.difficulty}
            imageUrl={challenge.imageUrl}
            status={challenge.status}
            onComplete={handleCompleteChallenge}
            onJoin={handleJoinChallenge}
          />
        ) : (
          <p>No challenge available for today.</p>
        )}
        <div className="mt-10 text-center mt-20 flex justify-center">
          <p className="text-2xl text-gray-700 mb-4">
            Want to explore more challenges?
          </p>
          <Link
            to="/challenges/global-challenges"
            className="text-2xl inline-block text-primary pl-2 underline hover:text-secondary transition duration-300"
          >
            Check Challenges
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DailyChallenge;
