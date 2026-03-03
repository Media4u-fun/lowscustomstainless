"use client";
import { useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const router = useRouter();
  const ensureAdmin = useMutation(api.auth.ensureAdminRole);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let result;
      if (isSignUp) {
        result = await signUp.email({ email, password, name: name || email.split("@")[0] });
      } else {
        result = await signIn.email({ email, password });
      }
      if (result.error) {
        setError(result.error.message ?? (isSignUp ? "Sign up failed" : "Invalid credentials"));
        setLoading(false);
        return;
      }
      // Auto-promote admin emails
      try { await ensureAdmin(); } catch { /* not an admin email, that's fine */ }
      router.push("/admin");
    } catch {
      setError(isSignUp ? "Sign up failed. Try again." : "Sign in failed. Check your credentials.");
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#111",
    border: "1px solid #2a2a2a",
    borderRadius: "4px",
    padding: "14px 16px",
    color: "#f5f5f5",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <Image
            src="/logo.jpg"
            alt="Low's Custom Stainless"
            width={64}
            height={64}
            style={{ borderRadius: "6px", marginBottom: "20px" }}
          />
          <div style={{ fontSize: "14px", fontWeight: 900, letterSpacing: "2px", color: "#fff", textTransform: "uppercase" }}>
            Low&apos;s Custom Stainless
          </div>
          <div style={{ fontSize: "11px", color: "#C8A951", letterSpacing: "3px", textTransform: "uppercase", marginTop: "4px" }}>
            Admin Panel
          </div>
        </div>

        {/* Form */}
        <div
          style={{
            background: "#111",
            border: "1px solid #1a1a1a",
            borderRadius: "8px",
            padding: "40px",
          }}
        >
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
            {isSignUp ? "Create Account" : "Sign In"}
          </h1>
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "32px" }}>
            {isSignUp ? "Create your admin account." : "Enter your credentials to access the admin panel."}
          </p>

          {error && (
            <div
              style={{
                background: "rgba(200,169,81,0.1)",
                border: "1px solid rgba(200,169,81,0.3)",
                borderRadius: "4px",
                padding: "12px 16px",
                marginBottom: "24px",
                color: "#C8A951",
                fontSize: "13px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", color: "#888", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                  placeholder="Scott Low"
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#C8A951"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#2a2a2a"; }}
                />
              </div>
            )}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", color: "#888", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                placeholder="admin@lowscustomstainless.com"
                onFocus={(e) => { e.currentTarget.style.borderColor = "#C8A951"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#2a2a2a"; }}
              />
            </div>

            <div style={{ marginBottom: "32px" }}>
              <label style={{ display: "block", color: "#888", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                placeholder="••••••••"
                onFocus={(e) => { e.currentTarget.style.borderColor = "#C8A951"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#2a2a2a"; }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: loading ? "#8a7a3d" : "#C8A951",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "14px",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
            >
              {loading ? (isSignUp ? "Creating Account..." : "Signing In...") : (isSignUp ? "Create Account" : "Sign In")}
            </button>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
                style={{ background: "transparent", border: "none", color: "#C8A951", fontSize: "13px", cursor: "pointer" }}
              >
                {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
              </button>
            </div>
          </form>
        </div>

        <div style={{ textAlign: "center", marginTop: "32px", color: "#333", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" }}>
          Low&apos;s Custom Stainless — Admin Access Only
        </div>
      </div>
    </div>
  );
}
