import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { CustomChallenge } from "../types";

export const addCustomChallengeService = async (
  userId: string,
  challengeData: CustomChallenge
) => {
  const ref = collection(db, `users/${userId}/customChallenges`);
  const docRef = await addDoc(ref, challengeData);
  const { id, ...restOfData } = challengeData;
  return { id: docRef.id, ...restOfData };
};

export const getCustomChallengesService = async (userId: string) => {
  const ref = collection(db, `users/${userId}/customChallenges`);
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as CustomChallenge[];
};

export const updateCustomChallengeService = async (
  userId: string,
  challengeId: string,
  updatedData: { [key: string]: any }
) => {
  const ref = doc(db, `users/${userId}/customChallenges/${challengeId}`);
  await updateDoc(ref, updatedData);
};

export const deleteCustomChallengeService = async (
  userId: string,
  challengeId: string
) => {
  const ref = doc(db, `users/${userId}/customChallenges/${challengeId}`);
  await deleteDoc(ref);
};

export const uploadImageToStorage = async (
  userId: string,
  file: File
): Promise<string> => {
  try {
    const imageRef = ref(
      storage,
      `users/${userId}/customChallenges/${Date.now()}_${file.name}`
    );
    await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Image upload failed.");
  }
};
