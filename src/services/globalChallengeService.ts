import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export interface GlobalChallengeFromDB {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  difficulty: "easy" | "medium" | "hard";
}

export const getChallengesService = async (
  selectedDifficulty: string | null,
  cursor = null
) => {
  try {
    const collectionRef = collection(db, "challenges");

    let q = selectedDifficulty
      ? query(
          collectionRef,
          where("difficulty", "==", selectedDifficulty.toLowerCase()),
          limit(10)
        )
      : query(collectionRef, limit(10));

    if (cursor) {
      q = query(q, startAfter(cursor));
    }

    const snapshot = await getDocs(q);

    const challenges = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const lastVisible = snapshot.docs[snapshot.docs.length - 1];

    return {
      challenges,
      nextPageCursor: lastVisible,
    };
  } catch (error) {
    console.error("Error fetching challenges:", error);
    throw new Error("Could not fetch challenges.");
  }
};

export const getGlobalChallengesService = async () => {
  const q = query(collection(db, "challenges"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const joinChallengeService = async (
  userId: string,
  challengeId: string,
  challengeType: string,
  challengeData: GlobalChallengeFromDB
) => {
  const challengeRef = doc(
    db,
    `users/${userId}/joinedChallenges/${challengeId}`
  );

  const snapshot = await getDoc(challengeRef);

  if (!snapshot.exists()) {
    await setDoc(challengeRef, {
      ...challengeData,
      status: "in-progress",
      joinedAt: new Date(),
      type: challengeType,
    });
  } else {
    await updateDoc(challengeRef, {
      status: "in-progress",
      joinedAt: new Date(),
    });
  }
};

export const completeChallengeService = async (
  userId: string,
  challengeId: string
) => {
  const challengeRef = doc(
    db,
    `users/${userId}/joinedChallenges/${challengeId}`
  );

  const snapshot = await getDoc(challengeRef);

  if (!snapshot.exists()) {
    throw new Error("Challenge not found in joinedChallenges.");
  }

  await updateDoc(challengeRef, {
    status: "completed",
    completedAt: new Date(),
  });
};

export const fetchChallengesByStatusService = async (
  userId: string,
  status: string
) => {
  const challengesRef = collection(db, `users/${userId}/joinedChallenges`);
  const q = query(challengesRef, where("status", "==", status));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
