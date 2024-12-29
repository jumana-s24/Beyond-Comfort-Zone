import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateEmail,
  sendEmailVerification,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { UserRegistrationForm } from "../types";

export const updateUserPasswordService = async (
  currentPassword: string,
  newPassword: string
) => {
  if (!auth.currentUser) throw new Error("No authenticated user found.");

  try {
    // Step 1: Reauthenticate the user
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email!,
      currentPassword
    );
    await reauthenticateWithCredential(auth.currentUser, credential);

    // Step 2: Update the user's password
    await updatePassword(auth.currentUser, newPassword);
  } catch (error) {
    console.error("Error updating password: ", error);
  }
};

export const reauthenticateUserService = async (
  oldEmail: string,
  password: string
) => {
  if (!auth.currentUser) throw new Error("No authenticated user found.");

  try {
    const credential = EmailAuthProvider.credential(oldEmail, password);
    await reauthenticateWithCredential(auth.currentUser, credential);
  } catch (error) {
    console.error("Error reauthenticating user:", error);
  }
};

export const updateUserEmailService = async (newEmail: string) => {
  if (!auth.currentUser) throw new Error("No authenticated user found.");

  try {
    // Step 1: Update email in Firebase Auth
    await updateEmail(auth.currentUser, newEmail);

    // Step 2: Send email verification
    await sendEmailVerification(auth.currentUser);

    // Step 3: Update user email in Firestore
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userDocRef, { email: newEmail });

    // Step 4: Sign out the user
    await signOut(auth);
  } catch (error) {
    console.error("Error updating email:", error);
  }
};

export const signUpUserService = async (data: UserRegistrationForm) => {
  // Step 1: Create the user
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    data.email,
    data.password
  );
  const user = userCredential.user;

  // Step 2: Authenticate the user and perform Firestore operations
  if (user) {
    await setDoc(doc(db, "users", user.uid), {
      name: data.name,
      email: data.email,
    });

    await sendEmailVerification(user);
    return user;
  }
};

export const signInUserService = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

export const getUserDataService = async (userId: string) => {
  const userDoc = await getDoc(doc(db, "users", userId));
  return userDoc.data();
};
