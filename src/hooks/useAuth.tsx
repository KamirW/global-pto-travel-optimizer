import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type AuthContextType = {
  user: any;
  loading: boolean;
  signOut: () => Promise<void>;
};

// Create a context that will hold the authentication state and functions 
const AuthContext = createContext<AuthContextType | null>(null);

// Provider component that populates the AuthContext with the current user and authentication functions
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load session on mount
  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    loadSession();

    // Listen for login/logout events
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Provide the user and authentication functions to the rest of the app
  return <AuthContext.Provider value={{ user, loading, signOut }}>{children}</AuthContext.Provider>;
};

// Custom hook to access the AuthContext and ensure it's used within the AuthProvider
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used inside AuthProvider");

  return context;
};
