import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { sendEmailVerification, signOut } from "firebase/auth";
import { UserRegistrationForm } from "../../types";
import {
  signInUserService,
  signUpUserService,
} from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";
import { auth } from "../../firebase/firebase";

const AuthForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserRegistrationForm>();

  const [authError, setAuthError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState<boolean | null>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { setIsVerified } = useAuth();
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
    setAuthError(null);
    reset();
  };

  const handleSignUp = async (data: UserRegistrationForm) => {
    const user = await signUpUserService(data);
    if (user) {
      navigate("/verify-email");
    }
  };

  const handleSignIn = async (data: UserRegistrationForm) => {
    const user = await signInUserService(data.email, data.password);
    setIsVerified(user.emailVerified);

    if (!user.emailVerified) {
      await signOut(auth);
      setAuthError(
        "Your email is not verified. Please check your inbox and verify your email."
      );
      await sendEmailVerification(user);
      return;
    }

    navigate("/");
  };

  const handleAuthError = (error: unknown) => {
    console.error("Error during authentication:", error);
    const errorMessages: Record<string, string> = {
      "auth/email-already-in-use": "This email is already in use.",
      "auth/invalid-email": "The email address is not valid.",
      "auth/operation-not-allowed": "Email/password accounts are not enabled.",
      "auth/weak-password": "The password is too weak.",
      "auth/user-not-found": "No user found with this email.",
      "auth/wrong-password": "Incorrect password.",
    };
    if (error instanceof Error && "code" in error) {
      const errorCode = (error as { code: string }).code;
      setAuthError(
        errorMessages[errorCode] ||
          "An unknown error occurred. Please try again."
      );
    } else {
      setAuthError("An unknown error occurred. Please try again.");
    }
  };

  const onSubmit: SubmitHandler<UserRegistrationForm> = async (data) => {
    setIsSubmitting(true);
    try {
      if (isSignUp) {
        await handleSignUp(data);
      } else {
        await handleSignIn(data);
      }
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen mt-40">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-100">
        <h1 className="text-3xl font-bold mb-4 text-center">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {isSignUp && (
            <div className="mb-4">
              <label htmlFor="name" className="block text-left text-gray-700">
                Name
              </label>
              <input
                id="name"
                {...register("name", {
                  required: isSignUp && "nameIsRequired",
                })}
                className="w-full p-2 border border-gray-200 rounded mt-1"
              />
              {errors.name && (
                <p className="text-red-600 text-left text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-left text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", { required: "emailIsRequired" })}
              className="w-full p-2 border border-gray-200 rounded mt-1"
            />
            {errors.email && (
              <p className="text-red-600 text-left text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-left text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "passwordIsRequired",
              })}
              {...register("password", {
                required: "passwordIsRequired",
                ...(isSignUp && {
                  minLength: {
                    value: 8,
                    message: "passwordMinLength",
                  },
                  validate: (value) =>
                    [/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/].every(
                      (pattern) => pattern.test(value)
                    ) || "passwordComplexity",
                }),
              })}
              className="w-full p-2 border border-gray-200 rounded mt-1"
            />
            {errors.password && (
              <p className="text-red-600 text-left text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          {authError && (
            <p className="text-red-600 text-left text-sm mb-4">{authError}</p>
          )}

          <button
            type="submit"
            className="text-xl w-full p-2 bg-primary hover:bg-secondary text-white rounded mt-2 shadow-lg"
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
                {isSignUp ? "Sign Up" : "Sign In"}
              </div>
            ) : (
              <> {isSignUp ? "Sign Up" : "Sign In"}</>
            )}
          </button>

          {!isSignUp && (
            <p className="mt-4 text-center">
              <Link
                to="/reset-password-request"
                className="text-lg text-primary underline hover:text-accent"
              >
                Forgot Password
              </Link>
            </p>
          )}

          <p className="mt-4 text-center text-lg">
            {isSignUp ? "Already have account?" : "Don't have an account?"}
            <button
              type="button"
              onClick={toggleForm}
              className="text-lg text-primary underline hover:text-accent ml-2"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
