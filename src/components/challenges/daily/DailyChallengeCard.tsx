import React from "react";
import { motion } from "framer-motion";

export interface DailyChallengeCardProps {
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  difficulty: "easy" | "medium" | "hard";
  status: "not-started" | "in-progress" | "completed";
  onComplete?: () => void;
  onJoin?: () => void;
}

const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({
  title,
  description,
  category,
  imageUrl,
  difficulty,
  status,
  onComplete,
  onJoin,
}) => {
  return (
    <motion.div
      animate={{
        scale: [1, 1.01, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="p-10 mb-4 bg-white rounded-md shadow border border-gray-100 hover:shadow-xl transition-shadow duration-300"
    >
      <img src={imageUrl} alt="daily challenge" className="w-30 h-25" />
      <h2 className="text-2xl font-bold mb-2 animate-fadeIn">{title}</h2>
      <p className="text-gray-700 mb-10 animate-fadeIn">{description}</p>
      <span className="capitalize rounded-md bg-[#f7d8d4] py-2 px-4 text-sm text-gray-600 mr-2 mt-2 shadow-md ">
        {category}
      </span>
      <span className="uppercase rounded-md bg-accent py-2 px-4 text-sm text-gray-600 mr-2 mt-2 shadow-md ">
        {difficulty}
      </span>
      <div className="flex justify-end items-center col-span-3 row-start-2">
        {status === "completed" ? (
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
        ) : (
          <button
            onClick={onJoin}
            className="bg-primary hover:bg-secondary text-white py-2 px-4 rounded-md shadow-lg transition-all border border-transparent"
          >
            Join Challenge
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default DailyChallengeCard;
