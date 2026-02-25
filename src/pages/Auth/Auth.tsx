import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    setErrorMsg("");

    // Implement sign-up logic with Supabase
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      navigate("/ptoplans");
    }
  };

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    setErrorMsg("");

    // Implement login logic with Supabase
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      setErrorMsg(error.message || "Login failed. Please try again.");
    } else if (data?.session) {
      navigate("/ptoplans");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
      <div className="bg-white p-12 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-5xl font-bold mb-8 text-center text-gray-800">Login</h1>

        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {errorMsg}
          </div>
        )}

        <form className="space-y-6">
          <input
            type="email"
            className="w-full border border-gray-300 p-3 rounded text-gray-800"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full border border-gray-300 p-3 rounded text-gray-800"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex gap-3">
            <button
              type="button"
              className="w-full bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 font-medium"
              onClick={handleSignUp}
            >
              SignUp
            </button>
            <button
              type="button"
              className="w-full bg-green-500 text-white px-4 py-3 rounded hover:bg-green-600 font-medium"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
