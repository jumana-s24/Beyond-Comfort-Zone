import { createContext, useContext } from "react";
import { AuthContextType } from "../types";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signedInUserData: null,
  isVerified: false,
  setIsVerified: () => {},
});

export const useAuth = () => useContext(AuthContext);
