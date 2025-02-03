import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export const calculateStreak = async (userId: string) => {
  try {
    const joinedChallengesRef = collection(
      db,
      `users/${userId}/joinedChallenges`
    );

    const q = query(joinedChallengesRef, where("status", "==", "completed"));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return 0;
    }

    const completedDates = snapshot.docs
      .map((doc) => doc.data().completedAt.toDate())
      .sort((a, b) => b.getTime() - a.getTime());

    let streak = 1;
    const currentDate = new Date();
    let previousDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    ); // Today's date at midnight

    // Iterate through the sorted dates
    for (const date of completedDates) {
      const completedDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ); // Normalize to midnight

      // Check if the completed date is exactly one day before the previous date
      const differenceInTime = previousDate.getTime() - completedDate.getTime();
      const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);

      if (differenceInDays === 1) {
        streak++; // Increment streak if consecutive day
      } else if (differenceInDays > 1) {
        break; // Break the loop if there's a gap of more than 1 day
      }

      previousDate = completedDate; // Update previousDate to the current completedDate
    }

    return streak;
  } catch (error) {
    console.error("Failed to calculate streak:", error);
    throw new Error("Could not calculate streak.");
  }
};

export const calculateLongestStreak = async (
  userId: string
): Promise<number> => {
  const joinedChallengesRef = collection(
    db,
    `users/${userId}/joinedChallenges`
  );
  const snapshot = await getDocs(joinedChallengesRef);

  if (snapshot.empty) return 0;

  const completedDates: string[] = snapshot.docs
    .filter((doc) => doc.data().status === "completed")
    .map((doc) => doc.data().completedAt.toDate().toISOString().split("T")[0])
    .sort();

  let longestStreak = 0;
  let currentStreak = 0;
  let lastDate: string | null = null;

  for (const date of completedDates) {
    if (!lastDate) {
      currentStreak = 1;
    } else {
      const previousDate = new Date(lastDate);
      const currentDate = new Date(date);

      const dayDifference =
        (currentDate.getTime() - previousDate.getTime()) /
        (1000 * 60 * 60 * 24);

      if (dayDifference === 1) {
        currentStreak++;
      } else if (dayDifference > 1) {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }
    lastDate = date;
  }

  // Update longestStreak for the last streak
  longestStreak = Math.max(longestStreak, currentStreak);

  return longestStreak;
};

export const updateUserStatsService = async (userId: string) => {
  const streak = await calculateStreak(userId);
  const longestStreak = await calculateLongestStreak(userId);

  const userRef = doc(db, `users/${userId}`);
  await updateDoc(userRef, {
    "stats.streak": streak,
    "stats.longestStreak": longestStreak,
  });
};
