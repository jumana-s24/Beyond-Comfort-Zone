import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-9xl font-bold text-gray-800 mb-8">404</h1>
      <p className="text-4xl font-semibold text-gray-600 mt-4 mb-6">
        Oops! Page not found
      </p>
      <p className="text-2xl text-gray-500 mt-2 mb-8 text-center">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="text-xl bg-white text-gray-800 border border-gray-300 px-6 py-2 rounded-lg shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
