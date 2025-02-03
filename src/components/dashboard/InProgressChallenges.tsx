import { Challenge } from "../../types";
import ChallengeCard from "../challenges/global/ChallengeCard";

interface InProgressChallengesProps {
  data: Challenge[];
  handleCompleteChallenge: (id: string) => void;
}

const InProgressChallenges: React.FC<InProgressChallengesProps> = ({
  data,
  handleCompleteChallenge,
}) => {
  return (
    <div className="bg-accent shadow-md rounded-md p-6">
      <h2 className="text-2xl mb-6 text-center font-bold">
        In Progress Challenges
      </h2>
      {data.length === 0 ? (
        <p className="text-center text-xl">No in progress challenges found.</p>
      ) : (
        <div className="space-y-4">
          {data.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challengeId={challenge.id}
              title={challenge.title}
              description={challenge.description}
              category={challenge.category}
              difficulty={challenge.difficulty}
              imageUrl={challenge.imageUrl}
              isCustomChallenge={false}
              status={challenge.status}
              onComplete={() => handleCompleteChallenge(challenge.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default InProgressChallenges;
