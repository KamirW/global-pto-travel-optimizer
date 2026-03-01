import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  // Importing functions from context
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth" || (location.pathname === "/" && !user);

  // Toggle scroll on body element
  useEffect(() => {
    if (isAuthPage) {
      document.body.classList.remove("scroll-enabled");
    } else {
      document.body.classList.add("scroll-enabled");
    }
  }, [isAuthPage]);

  return (
    <div>
      {/* NAVBAR - Hidden on auth page */}
      {!isAuthPage && (
        <nav className="bg-blue-700 text-white px-4 sm:px-6 py-4 sm:py-6">
          {/* Desktop Layout */}
          <div className="hidden sm:flex justify-between items-center gap-4">
            <Link to="/ptoplans" className="text-lg sm:text-xl font-bold">
              🌍 PTO Optimizer
            </Link>

            {user && (
              <div className="flex gap-6 items-center">
                <Link
                  to="/ptoplans"
                  className="hover:underline transition duration-200 text-sm sm:text-base active:underline"
                >
                  PTO Plans
                </Link>
                <Link
                  to="/trips"
                  className="hover:underline transition duration-200 text-sm sm:text-base active:underline"
                >
                  Trips
                </Link>
                <button
                  onClick={signOut}
                  className="bg-white hover:bg-gray-100 active:bg-gray-200 text-blue-700 px-3 py-1 rounded text-sm sm:text-base transition duration-200"
                >
                  Logout
                </button>
              </div>
            )}

            {!user && (
              <Link
                to="/auth"
                className="bg-white hover:bg-gray-100 active:bg-gray-200 text-blue-700 px-3 py-1 rounded text-sm sm:text-base transition duration-200"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Layout */}
          <div className="sm:hidden">
            <div className="flex justify-between items-center mb-3">
              <Link to="/ptoplans" className="text-lg font-bold">
                🌍 PTO Optimizer
              </Link>

              {user && (
                <button
                  onClick={signOut}
                  className="bg-white hover:bg-gray-100 active:bg-gray-200 text-blue-700 px-2 py-1 rounded text-sm transition duration-200"
                >
                  Logout
                </button>
              )}

              {!user && (
                <Link
                  to="/auth"
                  className="bg-white hover:bg-gray-100 active:bg-gray-200 text-blue-700 px-2 py-1 rounded text-sm transition duration-200"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Navigation Links - Mobile Only */}
            {user && (
              <div className="flex gap-4 text-sm">
                <Link to="/ptoplans" className="hover:underline transition duration-200">
                  PTO Plans
                </Link>
                <Link
                  to="/trips"
                  className="hover:underline transition duration-200 active:underline"
                >
                  Trips
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}

      {/* *************** AUTH SCREEN NAVIGATION BAR *************** */}
      {isAuthPage && (
        <nav className="bg-blue-700 text-white px-4 sm:px-6 py-4 sm:py-6">
          {/* Desktop Layout */}
          <div className="hidden sm:flex justify-between items-center gap-4">
            <Link to="/auth" className="text-lg sm:text-xl font-bold">
              🌍 PTO Optimizer
            </Link>
          </div>

          {/* Mobile Layout */}
          <div className="sm:hidden">
            <div className="flex justify-between items-center mb-2">
              <Link to="/auth" className="text-lg font-bold">
                🌍 PTO Optimizer
              </Link>
            </div>
          </div>
        </nav>
      )}

      {/* Page Content */}
      <main className={isAuthPage ? "" : "px-4 sm:px-6 py-6 sm:py-8"}>{children}</main>
    </div>
  );
}
