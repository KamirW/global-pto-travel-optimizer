import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()

    // Show a loading state while checking authentication
    if (loading) return <div className="text-center mt-10"> Loading...</div>

    if (!user) return <Navigate to='/auth' replace />

    // If the user is authenticated, render the children components
    return children
}