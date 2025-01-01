import { useCallback, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoIosMenu } from "react-icons/io";
import { useAuth } from "../../contexts/AuthContext";
import { auth } from "../../firebase/firebase";

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState<boolean>(false);
  const { user, signedInUserData, isVerified } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setIsDropdownOpen(false);
    }
  }, [user]);

  const handleOptionClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(false);
    setIsUserDropdownOpen(false);
  }, []);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const getLinkClassName = useCallback(
    ({ isActive }: { isActive: boolean }) =>
      `tracking-wider text-lg text-primary ${
        isActive ? "underline" : "hover:text-secondary"
      }`,
    []
  );

  return (
    <nav className="w-full py-4 px-2 border-b border-gray-200 shadow-sm">
      <div className="flex justify-between items-center px-6 md:px-10">
        <div className="text-2xl md:text-4xl">
          <NavLink
            to="/"
            className="text-primary hover:text-secondary font-newsreader-light"
          >
            Beyond Comfort Zone
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex space-x-4 font-karla items-center">
          {user && isVerified ? (
            <>
              <NavLink to="/motivational-wall" className={getLinkClassName}>
                Motivational Wall
              </NavLink>

              <NavLink to="/dashboard" className={getLinkClassName}>
                Growth Dashboard
              </NavLink>
              <NavLink
                to="/challenges/global-challenges"
                className={getLinkClassName}
              >
                Challenges
              </NavLink>
              <div className="relative">
                <img
                  src={
                    signedInUserData?.profilePicture ||
                    "/assets/defaultProfileImage.jpg"
                  }
                  alt="User"
                  className="w-9 h-9 rounded-full object-cover cursor-pointer shadow border"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  loading="lazy"
                />

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                    <NavLink
                      to="/settings/user-profile"
                      onClick={handleOptionClick}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                    >
                      Settings
                    </NavLink>

                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <NavLink to="/motivational-wall" className={getLinkClassName}>
                Motivational Wall
              </NavLink>

              <NavLink to="/dashboard" className={getLinkClassName}>
                Growth Dashboard
              </NavLink>
              <NavLink
                to="/challenges/global-challenges"
                className={getLinkClassName}
              >
                Challenges
              </NavLink>
              <NavLink to="/auth" className={getLinkClassName}>
                Sign In / Sign Up
              </NavLink>
            </>
          )}
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden">
          <div className="flex items-center">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2 focus:outline-none"
              aria-label="Toggle Menu"
            >
              <IoIosMenu size={35} />
            </button>
          </div>

          {isDropdownOpen && (
            <div
              role="menu"
              className="absolute right-0 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200"
            >
              {user && isVerified ? (
                <>
                  <NavLink
                    to="/motivational-wall"
                    onClick={handleOptionClick}
                    className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Motivational Wall
                  </NavLink>
                  <NavLink
                    to="/dashboard"
                    onClick={handleOptionClick}
                    className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Growth Dashboard
                  </NavLink>
                  <NavLink
                    to="/challenges/global-challenges"
                    onClick={handleOptionClick}
                    className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Challenges
                  </NavLink>
                  <NavLink
                    to="/settings/user-profile"
                    onClick={handleOptionClick}
                    className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Settings
                  </NavLink>
                  <button
                    onClick={handleSignOut}
                    className="text-left block w-full px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/auth"
                    onClick={handleOptionClick}
                    className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Sign In / Sign Up
                  </NavLink>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
