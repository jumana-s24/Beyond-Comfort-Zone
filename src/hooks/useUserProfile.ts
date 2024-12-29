import { UserProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  fetchUserByIdService,
  updateUserProfileService,
  uploadProfilePictureToStorage,
} from "../services/userService";

export const useUserProfile = (userId: string) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<String | null>();

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const userProfileData = await fetchUserByIdService(userId);
      setProfile(userProfileData);
    } catch (error) {
      setError("Failed to load profile information.");
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updatedProfile: Partial<UserProfile>) => {
    try {
      await updateUserProfileService(userId, updatedProfile);
      setProfile((prevProfile) => ({ ...prevProfile, ...updatedProfile }));
    } catch (error) {
      throw new Error("Failed to update profile information.");
    }
  };

  const uploadProfilePicture = async (file: File) => {
    try {
      const downloadURL = await uploadProfilePictureToStorage(userId, file);

      await updateUserProfile({ profilePicture: downloadURL });

      setProfile((prevProfile) => ({
        ...prevProfile,
        profilePicture: downloadURL,
      }));

      return downloadURL;
    } catch (error) {
      throw new Error("Failed to upload profile picture.");
    }
  };

  useEffect(() => {
    if (userId) fetchUserProfile();
  }, [userId, fetchUserProfile]);

  return {
    profile,
    loading,
    error,
    updateUserProfile,
    uploadProfilePicture,
    refetchProfile: fetchUserProfile,
  };
};
