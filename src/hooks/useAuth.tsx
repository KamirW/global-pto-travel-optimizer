import React from "react";
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type AuthContextType = {
  user: any;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

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

  return <AuthContext.Provider value={{ user, loading, signOut }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used inside AuthProvider");

  return context;
};
