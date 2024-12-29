import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

export const fetchUserByIdService = async (
  userId: string
): Promise<any | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const updateUserProfileService = async (
  userId: string,
  updatedProfile: Partial<any>
) => {
  try {
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, updatedProfile);
  } catch (error) {
    throw new Error("Failed to update profile information.");
  }
};

export const uploadProfilePictureToStorage = async (
  userId: string,
  file: File
): Promise<string> => {
  try {
    const storageRef = ref(storage, `profilePictures/${userId}.jpg`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    throw new Error("Failed to upload profile picture.");
  }
};

export const deleteUserAccountService = async (password: string) => {
  if (!auth.currentUser) {
    throw new Error("No authenticated user found.");
  }

  try {
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email!,
      password
    );
    await reauthenticateWithCredential(auth.currentUser, credential);

    const userDocRef = doc(db, "users", auth.currentUser.uid);
    await deleteDoc(userDocRef);

    await deleteUser(auth.currentUser);
  } catch (error) {
    throw new Error("Failed to delete user account. Please try again.");
  }
};
