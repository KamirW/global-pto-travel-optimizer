import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function Auth() {
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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      navigate("/ptoplans");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-4xl font-bold">Auth Page</h1>

      {errorMsg && <p className="text-red-500 mt-4">{errorMsg}</p>}

      <form>
        <input
          type="email"
          className="border p-2 mb-4"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="border p-2 mb-4"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSignUp}>
          SignUp
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
}
