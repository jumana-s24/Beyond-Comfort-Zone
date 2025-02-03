import React from "react";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import CustomChallengeList from "./custom/CustomChallengeList";
import GlobalChallenges from "./global/GlobalChallengesList";
import { PrivateRoute } from "../routing/PrivateRoute";

const Challenges: React.FC = () => {
  return (
    <div className="md:flex md:min-h-screen md:justify-center md:items-start px-4 py-20 md:px-10">
      {/* Sidebar for bigger screen */}
      <aside className="hidden md:block w-1/3 w-64 bg-white mr-10">
        <nav className="text-lg shadow border border-gray-200 rounded">
          <NavLink
            to="/challenges/global-challenges"
            className={({ isActive }) =>
              isActive
                ? "block py-5 px-6 border-l-4 border-primary text-black"
                : "block py-5 px-6 text-gray-600 hover:bg-hoverBg hover:text-black"
            }
          >
            Global Challenges
          </NavLink>

          <NavLink
            to="/challenges/custom-challenges"
            className={({ isActive }) =>
              isActive
                ? "block py-5 px-6 border-l-4 border-primary text-black"
                : "block py-5 px-6 text-gray-600 hover:bg-hoverBg hover:text-black"
            }
          >
            Custom Challenges
          </NavLink>
        </nav>
      </aside>

      {/* Tabs for Medium Screens and Above */}
      <nav className="text-lg flex md:hidden justify-around mb-12 border-b border-gray-200">
        <NavLink
          to="/challenges/global-challenges"
          className={({ isActive }) =>
            isActive
              ? "py-2 border-b-4 border-primary text-black"
              : "py-2 text-gray-600 hover:text-black"
          }
        >
          Global Challenges
        </NavLink>

        <NavLink
          to="/challenges/custom-challenges"
          className={({ isActive }) =>
            isActive
              ? "py-2 border-b-4 border-primary text-black"
              : "py-2 text-gray-600 hover:text-black"
          }
        >
          Custom Challenges
        </NavLink>
      </nav>

      {/* Main content */}
      <div className="w-full md:w-2/3">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="global-challenges" replace />}
          />
          <Route path="global-challenges" element={<GlobalChallenges />} />
          <Route
            path="custom-challenges"
            element={<PrivateRoute component={CustomChallengeList} />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default Challenges;
