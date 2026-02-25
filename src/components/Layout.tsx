import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Layout({ children }: { children: React.ReactNode }) {
  // Importing functions from context
  const { user, signOut } = useAuth();

  return (
    <div>
      {/* NAVBAR */}
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
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

              <button onClick={signOut} className="bg-white text-blue-700 px-3 py-1 rounded">
                Logout
              </button>
            </>
          )}

          {!user && (
            <Link to="/auth" className="bg-white text-blue-700 px-3 py-1 rounded">
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Page Content */}
      <main className="px-6 py-8">{children}</main>
    </div>
  );
}
