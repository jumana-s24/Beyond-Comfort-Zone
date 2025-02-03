import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  addCustomChallengeService,
  uploadImageToStorage,
} from "../../../services/customChallengesService";
import { auth } from "../../../firebase/firebase";
import Modal from "../../common/Modal";
import { CustomChallenge } from "../../../types";

export interface CustomChallengeModalProps {
  onClose: () => void;
  initialData?: {
    title?: string;
    description?: string;
    category?: string;
    difficulty?: "easy" | "medium" | "hard";
    imageUrl?: string;
  };
  handleOnSubmit: (data: any) => void;
  isCustomChallenge: boolean;
}

const CustomChallengeModal: React.FC<CustomChallengeModalProps> = ({
  onClose,
  isCustomChallenge,
  initialData,
  handleOnSubmit,
}) => {
  const {
    register,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm();
  const [previewImage, setPreviewImage] = useState<string>();
  const userId = auth.currentUser?.uid as string;

  useEffect(() => {
    if (initialData) {
      setValue("title", initialData.title || "");
      setValue("description", initialData.description || "");
      setValue("difficulty", initialData.difficulty || "medium");
      setValue("category", initialData.category || "");
      setPreviewImage(initialData.imageUrl || "/assets/defaultImage.png");
    }
  }, [initialData, setValue]);

  const onSubmit = async (data: any) => {
    try {
      let imageUrl = initialData?.imageUrl || null;

      if (data.imageUrl && data.imageUrl[0]) {
        const file = data.imageUrl[0] as File;
        imageUrl = await uploadImageToStorage(userId, file);
      }

      const challengeData = {
        title: data.title,
        description: data.description,
        category: data.category,
        difficulty: data.difficulty,
        createdAt: new Date(),
        status: "not-started",
        imageUrl: imageUrl || "",
      } as CustomChallenge;

      if (isCustomChallenge && handleOnSubmit) {
        handleOnSubmit(challengeData);
      } else {
        const newChallenge = await addCustomChallengeService(
          userId,
          challengeData
        );
        handleOnSubmit({ ...challengeData, id: newChallenge.id });
        reset();
      }

      onClose();
    } catch (error) {
      console.error("Error saving challenge:", error);
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
    <Modal
      onClose={onClose}
      title="Add Custom Challenge"
      maxWidth="max-w-xl"
      maxHeight="max-h-[80vh]"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4 text-center">
          <img
            src={previewImage || "/assets/defaultImage.png"}
            alt="challenge preview"
            className="w-20 h-20 mx-auto mb-4 object-cover"
          />
          <input
            type="file"
            {...register("imageUrl")}
            onChange={handleFileChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="title" className="text-gray-500">
            Title
          </label>
          <input
            type="text"
            id="title"
            {...register("title", { required: true })}
            className="w-full p-2 border rounded-md mt-1"
          />
          {errors.title && (
            <p className="text-red-600 text-sm">The title is required.</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="text-gray-500">
            Description
          </label>
          <textarea
            id="description"
            {...register("description", { required: true })}
            className="w-full p-2 border rounded-md mt-1"
          ></textarea>
          {errors.description && (
            <p className="text-red-600 text-sm">The description is required.</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="difficulty" className="text-gray-500">
            Difficulty
          </label>
          <select
            id="difficulty"
            {...register("difficulty", { required: true })}
            className="w-full p-2 border rounded-md mt-1"
          >
            <option value="">Select difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          {errors.difficulty && (
            <p className="text-red-600 text-sm">The difficulty is required.</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="text-gray-500">
            Category
          </label>
          <select
            id="category"
            {...register("category", { required: true })}
            className="w-full p-2 border rounded-md mt-1"
          >
            <option value="">Select category</option>
            <option value="physical">Physical</option>
            <option value="mental">Mental</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="social">Social</option>
            <option value="creativity">Creativity</option>
            <option value="health">Health</option>
            <option value="productivity">Productivity</option>
            <option value="environment">Environment</option>
            <option value="financial">Financial</option>
            <option value="spiritual">Spiritual</option>
            <option value="adventure">Adventure</option>
          </select>
          {errors.category && (
            <p className="text-red-600 text-sm">The category is required.</p>
          )}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Challenge"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CustomChallengeModal;
