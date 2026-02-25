import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Layout({ children }: { children: React.ReactNode }) {
  // Importing functions from context
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth' || (location.pathname === '/' && !user);

  return (
    <div>
      {/* NAVBAR - Hidden on auth page */}
      {!isAuthPage && (
        <nav className="bg-blue-700 text-white px-6 py-6 flex justify-between items-center">
          <Link to="/ptoplans" className="text-xl font-bold">
            PTO Optimizer
          </Link>

          <div className="flex items-center gap-4">
            {user && (
              <>
                <Link to="/ptoplans" className="hover:underline">
                  PTO Plans
                </Link>
                <Link to="/trips" className="hover:underline">
                  Trips
                </Link>

                <button onClick={signOut} className="bg-white text-blue-700 px-3 py-1 rounded hover:bg-gray-100">
                  Logout
                </button>
              </>
            )}

            {!user && (
              <Link to="/auth" className="bg-white text-blue-700 px-3 py-1 rounded hover:bg-gray-100">
                Login
              </Link>
            )}
          </div>
        </nav>
      )}

      {/* Page Content */}
      <main className={isAuthPage ? '' : 'px-6 py-8'}>{children}</main>
    </div>
  );
}
