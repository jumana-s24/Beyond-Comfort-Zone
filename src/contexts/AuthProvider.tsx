import React, { useState, ReactNode, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { AuthContext } from "./AuthContext";
import { Spinner } from "../components/common/Spinner";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { fetchUserByIdService } from "../services/userService";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [signedInUserData, setSignedInUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("currentUser", currentUser);
      setUser(currentUser);
      setLoading(false);
      setIsVerified(currentUser ? currentUser.emailVerified : false);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        console.log("userDoc", userDoc);
        if (userDoc.exists()) {
          console.log("userDoc", userDoc.data());
          setSignedInUserData(userDoc.data());
        }
      } else {
        setSignedInUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signedInUserData,
        loading,
        isVerified,
        setIsVerified,
      }}
    >
      {loading ? <Spinner /> : children}
    </AuthContext.Provider>
  );
};
