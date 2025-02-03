import React, { useEffect, useState } from "react";
import { useFetchChallenges } from "../../../hooks/useFetchChallenges";
import { Spinner } from "../../common/Spinner";
import ChallengeCard from "./ChallengeCard";
import DropdownFilter from "../../common/DropdownFilter";
import { auth } from "../../../firebase/firebase";
import {
  completeChallengeService,
  fetchChallengesByStatusService,
  joinChallengeService,
} from "../../../services/globalChallengeService";
import { updateUserStatsService } from "../../../services/statsService";
import { ChallengeData } from "../../../types";

const GlobalChallengesList: React.FC = () => {
  const userId = auth.currentUser?.uid as string;
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  );

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useFetchChallenges(selectedDifficulty);

  const challenges = data?.pages.flatMap((page) => page.challenges) || [];

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const [joinedChallenges, setJoinedChallenges] = useState<ChallengeData[]>([]);

  const fetchJoinedChallenges = async () => {
    const inProgress =
      (await fetchChallengesByStatusService(userId, "in-progress")) || [];
    const completed =
      (await fetchChallengesByStatusService(userId, "completed")) || [];
    setJoinedChallenges([...inProgress, ...completed] as ChallengeData[]);
  };

  const handleJoinChallenge = async (
    challengeId: string,
    challengeData: ChallengeData
  ) => {
    await joinChallengeService(userId, challengeId, "global", challengeData);
    await fetchJoinedChallenges();
  };

  const handleCompleteChallenge = async (challengeId: string) => {
    await completeChallengeService(userId, challengeId);
    await fetchJoinedChallenges();
    await updateUserStatsService(userId);
  };

  useEffect(() => {
    fetchJoinedChallenges();
  }, []);

  if (isLoading) return <Spinner />;

  return (
    <div className="flex justify-center min-h-screen px-4 md:px-10">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl mb-6 font-newsreader-light text-center font-semibold animate-fadeIn">
          Challenges
        </h1>
        <p className="text-xl text-gray-600 text-center mb-10 animate-fadeIn">
          Take a step out of your comfort zone. Explore challenges designed to
          inspire growth, build confidence, and make small daily progress.
          <span className="block mt-2 font-semibold text-primary animate-fadeIn">
            Every small action leads to a bigger change!
          </span>
        </p>
        <div className="flex justify-end">
          <DropdownFilter
            selectedDifficulty={selectedDifficulty}
            onFilterChange={setSelectedDifficulty}
          />
        </div>

        {/*  Challenges list*/}
        {challenges.map((challenge: any) => {
          const userChallenge = joinedChallenges.find(
            (c) => c.id === challenge.id
          );
          const status = userChallenge?.status || "not-started";
          return (
            <ChallengeCard
              key={challenge.id}
              challengeId={challenge.id}
              title={challenge.title}
              description={challenge.description}
              imageUrl={challenge.imageUrl}
              status={status}
              onJoin={() => handleJoinChallenge(challenge.id, challenge)}
              onComplete={() => handleCompleteChallenge(challenge.id)}
              category={challenge.category}
              difficulty={challenge.difficulty}
            />
          );
        })}
        {/* Load More button */}
        {hasNextPage && (
          <div className="text-center mt-6">
            <button
              className="px-4 py-2 bg-primary text-white rounded"
              onClick={handleLoadMore}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalChallengesList;
