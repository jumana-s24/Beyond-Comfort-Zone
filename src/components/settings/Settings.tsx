import React from "react";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import UserProfile from "./UserProfile";
import AccountManagement from "./AccountManagement";

const Settings: React.FC = () => {
  return (
    <div className="md:flex md:min-h-screen md:justify-center md:items-start px-4 py-20 md:px-10 lg:px-20 xl:px-60">
      {/* Sidebar for bigger screen */}
      <aside className="hidden md:block w-1/3 w-64 bg-white mr-10 lg:mr-0">
        <nav className="text-lg shadow border border-gray-200 rounded">
          <NavLink
            to="/settings/user-profile"
            className={({ isActive }) =>
              isActive
                ? "block py-5 px-6 border-l-4 border-primary text-black"
                : "block py-5 px-6 text-gray-600 hover:bg-hoverBg hover:text-black"
            }
          >
            User Profile
          </NavLink>

          <NavLink
            to="/settings/account-management"
            className={({ isActive }) =>
              isActive
                ? "block py-5 px-6 border-l-4 border-primary text-black"
                : "block py-5 px-6 text-gray-600 hover:bg-hoverBg hover:text-black"
            }
          >
            Account Management
          </NavLink>
        </nav>
      </aside>

      {/* Tabs for Medium Screens and Above */}
      <nav className="text-lg flex md:hidden text-md justify-around mb-12 border-b border-gray-200">
        <NavLink
          to="/settings/user-profile"
          className={({ isActive }) =>
            isActive
              ? "py-2 border-b-4 border-primary text-black"
              : "py-2 text-gray-600 hover:text-black"
          }
        >
          User Profile
        </NavLink>

        <NavLink
          to="/settings/account-management"
          className={({ isActive }) =>
            isActive
              ? "py-2 border-b-4 border-primary text-black"
              : "py-2 text-gray-600 hover:text-black"
          }
        >
          Account Management
        </NavLink>
      </nav>

      {/* Main content */}
      <div className="w-full md:w-2/3">
        <Routes>
          <Route path="/" element={<Navigate to="user-profile" replace />} />
          <Route path="user-profile" element={<UserProfile />} />
          <Route path="account-management" element={<AccountManagement />} />
        </Routes>
      </div>
    </div>
  );
};

export default Settings;
