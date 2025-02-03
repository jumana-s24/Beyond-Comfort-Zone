import { sendEmailVerification } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../firebase/firebase";

const VerifyEmailPage = () => {
  const [verificationSent, setVerificationSent] = useState(false);
  const [lastSentTime, setLastSentTime] = useState<number | null>(null);

  const handleResendVerification = async () => {
    const currentTime = Date.now();

    if (lastSentTime && currentTime - lastSentTime < 60000) {
      alert("Please wait at least a minute before resending.");
      return;
    }

    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        setVerificationSent(true);
        setLastSentTime(currentTime);
      } catch (error) {
        if ((error as { code: string }).code === "auth/too-many-requests") {
          alert("Too many requests. Please wait and try again later.");
        } else {
          console.error("Error sending verification email:", error);
        }
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Verify Your Email</h1>
        <p className="mb-4 text-gray-600">
          A verification email has been sent to your inbox. Please check your
          email and verify your account to continue.
        </p>
        <p className="mb-4 text-gray-600">
          Be sure to also check your spam folder.
        </p>
        <button
          onClick={handleResendVerification}
          className="bg-accent hover:bg-buttonHover text-white rounded-md tracking-wider shadow py-2 px-4 shadow-md"
          disabled={verificationSent}
        >
          {verificationSent
            ? "Verification Email Sent"
            : "Resend Verification Email"}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
