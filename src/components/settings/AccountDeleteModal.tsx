import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { deleteUserAccountService } from "../../services/userService";
import Modal from "../common/Modal";

interface AccountDeleteModalProps {
  onClose: () => void;
}

export const AccountDeleteModal: React.FC<AccountDeleteModalProps> = ({
  onClose,
}) => {
  const { register, handleSubmit } = useForm<{ password: string }>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: { password: string }) => {
    setIsSubmitting(true);
    try {
      await deleteUserAccountService(data.password);
      onClose();
      navigate("/");
    } catch (error) {
      setErrorMessage("Failed to delete the account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      onClose={onClose}
      title="Are you sure you want to delete your account?"
    >
      <p className="text-gray-600 mb-6">
        To delete your account, please enter your password. This action cannot
        be undone.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="password" className="ext-left text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          {...register("password", { required: "Password is required" })}
          className="w-full p-2 border rounded-md mb-4"
        />
        {errorMessage && <p className="text-red-600 mb-2">{errorMessage}</p>}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="border border-secondary rounded-md py-2 px-4 shadow-md hover:bg-secondary transition mr-4"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary hover:bg-secondary text-white rounded-md px-4 py-2 transition duration-300 tracking-wider shadow"
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
                Deleting...
              </div>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
