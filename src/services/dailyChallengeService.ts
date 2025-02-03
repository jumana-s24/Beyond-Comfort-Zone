import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getGlobalChallengesService } from "./globalChallengeService";

export const getOrAssignDailyChallengeService = async (
  userId: string,
  date: string
) => {
  const docRef = doc(db, `users/${userId}/dailyChallenges/${date}`);
  const snapshot = await getDoc(docRef);

  if (snapshot.exists()) {
    return snapshot.data();
  }

  const globalChallenges = await getGlobalChallengesService();
  const randomChallenge =
    globalChallenges[Math.floor(Math.random() * globalChallenges.length)];

  const dailyChallenge = {
    ...randomChallenge,
    type: "daily",
    status: "not-started",
    assignedAt: new Date(),
  };

  await setDoc(docRef, dailyChallenge);
  return dailyChallenge;
};

export const updateDailyChallengeStatusService = async (
  userId: string,
  date: string,
  status: "not-started" | "in-progress" | "completed"
) => {
  const docRef = doc(db, `users/${userId}/dailyChallenges/${date}`);
  await updateDoc(docRef, { status });
};
