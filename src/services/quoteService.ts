import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export const fetchGlobalQuotesService = async () => {
  const ref = collection(db, "quotes");
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const fetchUserQuotesService = async (userId: string) => {
  const userQuotesRef = collection(db, `users/${userId}/quotes`);
  const snapshot = await getDocs(userQuotesRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addQuoteService = async (
  text: string,
  bgColor: string,
  fontColor: string,
  userId: string
) => {
  const quotesRef = collection(db, `users/${userId}/quotes`);
  await addDoc(quotesRef, {
    text,
    bgColor,
    fontColor,
    createdAt: Timestamp.now(),
  });
};

export const updateQuoteService = async (
  userId: string,
  quoteId: string,
  data: { text: string; bgColor: string; fontColor: string }
) => {
  const quoteRef = doc(db, `users/${userId}/quotes/${quoteId}`);
  await updateDoc(quoteRef, data);
};

export const deleteQuoteService = async (userId: string, quoteId: string) => {
  const quoteRef = doc(db, `users/${userId}/quotes/${quoteId}`);
  await deleteDoc(quoteRef);
};
