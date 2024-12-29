import { Challenge } from "../../types";
import ChallengeCard from "../challenges/global/ChallengeCard";

interface CompletedChallengesProps {
  data: Challenge[];
}

const CompletedChallenges: React.FC<CompletedChallengesProps> = ({ data }) => {
  return (
    <div className="shadow-md rounded-md p-6 bg-[#fbece9]">
      <h2 className="text-2xl mb-6 text-center font-bold">
        Completed Challenges
      </h2>
      {data.length === 0 ? (
        <p className="text-center text-xl">No completed challenges found.</p>
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
              isDashboard={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default CompletedChallenges;
