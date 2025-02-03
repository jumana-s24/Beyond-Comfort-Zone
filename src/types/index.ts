import { User } from "firebase/auth";

// Base type for shared fields
export interface BaseChallenge {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  difficulty: "easy" | "medium" | "hard";
}

// Extended types for specific cases
export interface Challenge extends BaseChallenge {
  status: "not-started" | "in-progress" | "completed";
  onComplete: () => void;
  onJoin: () => void;
  createdAt: Date;
  assignedAt: Date;
  type: string;
}

export interface ChallengeData extends BaseChallenge {
  status: "not-started" | "in-progress" | "completed";
  type: string;
  joinedAt: Date;
}

export interface CustomChallenge extends BaseChallenge {
  status?: "not-started" | "in-progress" | "completed";
  createdAt?: Date;
}

// Auth types and interfaces
export interface AuthContextType {
  user: User | null;
  signedInUserData: {
    displayName: string;
    email: string;
    photoURL: string;
    [key: string]: string;
  } | null;
  loading: boolean;
  isVerified: boolean;
  setIsVerified: (verified: boolean) => void;
}

export interface UserRegistrationForm {
  name?: string;
  email: string;
  password: string;
}

export interface PasswordUpdateForm {
  newPassword: string;
  confirmPassword: string;
}

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  profilePicture: string;
}
