"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setStatus("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#07182d",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "32px",
          boxShadow: "0 20px 60px rgba(0,0,0,.25)",
        }}
      >
        <h1 style={{ marginTop: 0 }}>ExpatEase Admin</h1>

        <p style={{ color: "#667085" }}>
          Sign in to manage service requests.
        </p>

        <form onSubmit={handleLogin}>
          <div style={{ marginTop: "24px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 700,
              }}
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px",
                border: "1px solid #d0d5dd",
                borderRadius: "10px",
              }}
            />
          </div>

          <div style={{ marginTop: "18px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 700,
              }}
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px",
                border: "1px solid #d0d5dd",
                borderRadius: "10px",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "24px",
              padding: "14px",
              border: "none",
              borderRadius: "999px",
              background: "#e4b43f",
              color: "#07182d",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {status && (
            <p
              style={{
                marginTop: "16px",
                color: "#b42318",
                fontWeight: 600,
              }}
            >
              {status}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}