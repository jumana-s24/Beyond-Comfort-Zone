import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { auth } from "../../firebase/firebase";
import { useUserProfile } from "../../hooks/useUserProfile";

interface FormData {
  name: string;
  email: string;
  bio: string;
  profilePicture: FileList;
}

const UserProfile: React.FC = () => {
  const userId = auth.currentUser?.uid as string;
  const [previewImage, setPreviewImage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const { profile, updateUserProfile, uploadProfilePicture } =
    useUserProfile(userId);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    if (profile) {
      setValue("name", profile.name as string);
      setValue("email", profile.email as string);
      setValue("bio", profile.bio as string);
      setPreviewImage(
        typeof profile.profilePicture === "string"
          ? profile.profilePicture
          : "/assets/defaultProfileImage.jpg"
      );
    }
  }, [profile, setValue]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    try {
      await updateUserProfile({
        name: data.name,
        bio: data.bio,
      });
      if (data.profilePicture?.[0]) {
        await uploadProfilePicture(data.profilePicture[0]);
      }
      setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      setUpdateError("Error updating profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-md">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Update Your Profile
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Profile Picture */}
        <div className="mb-6">
          <img
            src={previewImage}
            alt="Profile"
            className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
          />
          <input
            type="file"
            {...register("profilePicture")}
            className="block w-full p-2 border border-gray-300 rounded-md"
            onChange={(e) => handleFileChange(e)}
          />
        </div>

        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          {...register("name", { required: "Name is required" })}
          className="w-full p-2 border border-gray-300 rounded-md mb-6 mt-2"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          {...register("email", { required: "Email is required" })}
          className="w-full p-2 border border-gray-300 rounded-md mb-6 mt-2"
          disabled
        />

        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          {...register("bio")}
          className="w-full p-2 border border-gray-300 rounded-md mt-2"
        ></textarea>

        {successMessage && (
          <p className="text-green-700 text-left">{successMessage}</p>
        )}
        {updateError && (
          <p className="text-red-600 text-left mb-4">{updateError}</p>
        )}

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-primary hover:bg-secondary text-white rounded-md px-4 py-2 transition duration-300 tracking-wider shadow "
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white mr-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating...
              </div>
            ) : (
              "Update Profile"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
