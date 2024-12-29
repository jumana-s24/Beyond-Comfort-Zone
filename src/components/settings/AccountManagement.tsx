import { useState } from "react";
import { AccountDeleteModal } from "./AccountDeleteModal";

const AccountManagement: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <div className="min-h-screen max-w-lg mx-auto">
      <div className="p-8 bg-white shadow-md rounded mb-20 border border-gray-100">
        <h1 className="text-3xl font-bold mb-4 text-center">
          <span className="colored-heading">Account Management</span>
        </h1>

        <p className="text-gray-600 mb-6 text-left">
          If you delete your account, all your personal data and account
          information will be permanently removed. Please ensure you have saved
          any important information before proceeding
        </p>

        <div className="flex flex-col items-end mt-6">
          <button
            className="bg-primary hover:bg-secondary text-white rounded-md px-4 py-2 transition duration-300 tracking-wider shadow"
            onClick={() => setShowModal(true)}
          >
            Delete Account
          </button>
        </div>

        {showModal && (
          <AccountDeleteModal onClose={() => setShowModal(false)} />
        )}
      </div>
    </div>
  );
};

export default AccountManagement;
