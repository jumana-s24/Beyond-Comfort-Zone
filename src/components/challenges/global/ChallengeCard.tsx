import React from "react";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { CustomChallenge } from "../../../types";

export interface ChallengeCardProps {
  challengeId?: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  isCustomChallenge?: boolean;
  isDashboard?: boolean;
  handleDelete?: (challengeId: string) => void;
  handleEdit?: (challengeData: CustomChallenge) => void;
  difficulty: "easy" | "medium" | "hard";
  status?: "not-started" | "in-progress" | "completed";
  onComplete?: () => void;
  onJoin?: () => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challengeId,
  title,
  description,
  imageUrl,
  difficulty,
  category,
  isCustomChallenge,
  status,
  handleDelete,
  handleEdit,
  onComplete,
  onJoin,
  isDashboard = false,
}) => {
  return (
    <div className="relative p-4 mb-8 bg-white rounded-md shadow border border-gray-100 hover:shadow-xl transition-shadow duration-300 animate-fadeIn">
      <div className="grid grid-cols-[150px_auto] gap-4 items-start">
        {isCustomChallenge && (
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              onClick={() =>
                handleEdit &&
                handleEdit({
                  id: challengeId || "",
                  title,
                  description,
                  difficulty,
                  category,
                  imageUrl: imageUrl || "",
                })
              }
              className="text-blue-500 hover:text-blue-700"
              aria-label="Edit Challenge"
            >
              <FaEdit size={20} />
            </button>
            <button
              onClick={() =>
                challengeId && handleDelete && handleDelete(challengeId)
              }
              className="text-red-500 hover:text-red-700"
              aria-label="Delete Challenge"
            >
              <FaTrashAlt size={20} />
            </button>
          </div>
        )}

        {/* Profile Image (Column 1) */}
        <img
          src={imageUrl || "/assets/defaultImage.png"}
          alt="profile"
          className="w-30 h-25"
        />

        {/* Content (Column 2) */}
        <div className="text-left ml-4 mt-[32px] mb-8">
          <h2 className="text-xl font-bold mb-2 ">{title}</h2>
          <p className="text-gray-700 mb-4 ">{description}</p>
          <span className="capitalize rounded-md bg-[#f7d8d4] py-2 px-4 text-sm text-gray-600 mr-2 mt-2 shadow-md">
            {category}
          </span>
          <span className="uppercase rounded-md bg-accent py-2 px-4 text-sm text-gray-600 mr-2 mt-2 shadow-md">
            {difficulty}
          </span>
        </div>

        {/* "View Profile" Button (Column 3) */}
        <div className="flex justify-end items-center col-span-3 row-start-2">
          {status === "completed" && !isDashboard ? (
            <button
              className="bg-primary text-white py-2 px-4 rounded-md cursor-not-allowed shadow-lg transition-all border border-transparent"
              disabled
            >
              Completed
            </button>
          ) : status === "in-progress" ? (
            <button
              onClick={onComplete}
              className="bg-primary hover:bg-secondary text-white py-2 px-4 rounded-md shadow-lg transition-all border border-transparent"
            >
              Mark as Complete
            </button>
          ) : status === "not-started" ? (
            <button
              onClick={onJoin}
              className="bg-primary hover:bg-secondary text-white py-2 px-4 rounded-md shadow-lg transition-all border border-transparent"
            >
              Join Challenge
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
