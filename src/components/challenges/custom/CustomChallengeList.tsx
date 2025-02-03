import { useEffect, useMemo, useState } from "react";
import { auth } from "../../../firebase/firebase";
import {
  deleteCustomChallengeService,
  getCustomChallengesService,
  updateCustomChallengeService,
} from "../../../services/customChallengesService";
import { Spinner } from "../../common/Spinner";
import ChallengeCard from "../global/ChallengeCard";
import {
  completeChallengeService,
  joinChallengeService,
} from "../../../services/globalChallengeService";
import { updateUserStatsService } from "../../../services/statsService";
import CustomChallengeModal from "./CustomChallengeModal";
import { CustomChallenge } from "../../../types";
import { useDebounce } from "../../../hooks/useDebounce";

const CustomChallengeList = () => {
  const [challenges, setChallenges] = useState<CustomChallenge[]>([]);
  const [editChallengeData, setEditChallengeData] =
    useState<CustomChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const userId = auth.currentUser?.uid as string;
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const data = await getCustomChallengesService(userId);
        setChallenges(data);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [userId]);

  const filteredChallenges = useMemo(() => {
    if (debouncedSearchQuery) {
      return challenges.filter(
        (challenge) =>
          challenge.title.toLowerCase().includes(debouncedSearchQuery) ||
          challenge.description.toLowerCase().includes(debouncedSearchQuery)
      );
    }
    return challenges;
  }, [challenges, debouncedSearchQuery]);

  const handleAddChallenge = (newChallenge: CustomChallenge) => {
    setChallenges((prevChallenges) => [...prevChallenges, newChallenge]);
  };

  const handleDelete = async (challengeId: string) => {
    try {
      await deleteCustomChallengeService(userId, challengeId);
      setChallenges(
        challenges.filter((challenge) => challenge.id !== challengeId)
      );
    } catch (error) {
      console.error("Error deleting challenge:", error);
    }
  };

  const handleEdit = async (challengeData: CustomChallenge) => {
    setEditChallengeData(challengeData);
    setIsModalOpen(true);
  };

  const handleUpdateChallenge = async (updatedData: CustomChallenge) => {
    try {
      await updateCustomChallengeService(
        userId,
        editChallengeData!.id,
        updatedData
      );
      setChallenges(
        challenges?.map((challenge) =>
          challenge.id === editChallengeData?.id
            ? { ...challenge, ...updatedData }
            : challenge
        )
      );
    } catch (error) {
      console.error("Error Editing challenge:", error);
    } finally {
      setIsModalOpen(false);
      setEditChallengeData(null);
    }
  };

  const handleJoinChallenge = async (
    challengeId: string,
    challengeData: CustomChallenge
  ) => {
    try {
      await updateCustomChallengeService(userId, challengeId, {
        status: "in-progress",
      });

      await joinChallengeService(userId, challengeId, "custom", challengeData);

      setChallenges((prevChallenges) =>
        prevChallenges.map((challenge) =>
          challenge.id === challengeId
            ? { ...challenge, status: "in-progress" }
            : challenge
        )
      );
    } catch (error) {
      console.error("Error joining challenge:", error);
    }
  };

  const handleCompleteChallenge = async (challengeId: string) => {
    try {
      await updateCustomChallengeService(userId, challengeId, {
        status: "completed",
      });

      await completeChallengeService(userId, challengeId);
      await updateUserStatsService(userId);

      setChallenges((prevChallenges) =>
        prevChallenges.map((challenge) =>
          challenge.id === challengeId
            ? { ...challenge, status: "completed" }
            : challenge
        )
      );
    } catch (error) {
      console.error("Error completing challenge:", error);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="flex justify-center min-h-screen px-4 md:px-10">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl mb-4 font-newsreader-light text-center font-semibold animate-fadeIn">
          Custom Challenges
        </h1>

        <p className="text-gray-600 text-xl text-center mb-10 animate-fadeIn">
          Step into growth, not comfort. Create your own custom challenges and
          become the author of your personal breakthrough journey.
        </p>

        <div className="flex flex-col sm:flex-row justify-between mb-10">
          <input
            type="text"
            placeholder="Search challenges..."
            className="sm:w-[50%] mb-8 sm:mb-0 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-secondary text-white py-2 px-4 rounded-md shadow-lg transition-all border border-transparent animate-fadeIn"
          >
            + Add Custom Challenge
          </button>
        </div>
        {filteredChallenges.length === 0 ? (
          <p className="text-center text-xl animate-fadeIn">
            No custom challenges found.
          </p>
        ) : (
          <>
            {filteredChallenges.map((challenge, index: number) => (
              <ChallengeCard
                key={index}
                challengeId={challenge.id}
                title={challenge.title}
                description={challenge.description}
                category={challenge.category}
                difficulty={challenge.difficulty}
                imageUrl={challenge.imageUrl}
                isCustomChallenge={true}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
                status={challenge.status}
                onJoin={() => handleJoinChallenge(challenge.id, challenge)}
                onComplete={() => handleCompleteChallenge(challenge.id)}
              />
            ))}
          </>
        )}
        {isModalOpen && (
          <CustomChallengeModal
            onClose={() => {
              setIsModalOpen(false);
              setEditChallengeData(null);
            }}
            handleOnSubmit={
              editChallengeData ? handleUpdateChallenge : handleAddChallenge
            }
            initialData={editChallengeData ?? undefined}
            isCustomChallenge={!!editChallengeData}
          />
        )}
      </div>
    </div>
  );
};

export default CustomChallengeList;
