"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin/orders";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Make sure you have admin access.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: "20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo / Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, var(--pri), var(--pink))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 8px 24px color-mix(in srgb, var(--pri) 30%, transparent)",
            }}
          >
            <Lock size={24} color="white" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: "var(--ink)" }}>
            Admin Login
          </h1>
          <p style={{ color: "var(--mute)", fontSize: 14, margin: 0 }}>
            Oviya&apos;s Crochet — Staff only
          </p>
        </div>

        {/* Card */}
        <div
          className="box"
          style={{ padding: 28 }}
        >
          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Email */}
            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
              Email address
              <div style={{ position: "relative" }}>
                <Mail
                  size={16}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--mute)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@oviyas.in"
                  required
                  autoComplete="email"
                  style={{
                    width: "100%",
                    border: "1.5px solid var(--line)",
                    borderRadius: 10,
                    padding: "10px 12px 10px 38px",
                    background: "var(--bg)",
                    fontSize: 14,
                    color: "var(--ink)",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    outline: "none",
                  }}
                />
              </div>
            </label>

            {/* Password */}
            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
              Password
              <div style={{ position: "relative" }}>
                <Lock
                  size={16}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--mute)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  style={{
                    width: "100%",
                    border: "1.5px solid var(--line)",
                    borderRadius: 10,
                    padding: "10px 40px 10px 38px",
                    background: "var(--bg)",
                    fontSize: 14,
                    color: "var(--ink)",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--mute)",
                    padding: 4,
                    display: "flex",
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </label>

            {/* Error */}
            {error && (
              <p
                style={{
                  color: "var(--pink)",
                  fontSize: 13,
                  background: "color-mix(in srgb, var(--pink) 8%, var(--bg))",
                  border: "1px solid color-mix(in srgb, var(--pink) 20%, transparent)",
                  borderRadius: 8,
                  padding: "10px 12px",
                  margin: 0,
                }}
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              id="admin-login-btn"
              type="submit"
              className="btn"
              disabled={loading}
              style={{ width: "100%", fontSize: 15, padding: "12px", marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "var(--mute)", marginTop: 20 }}>
          Only admin accounts can access this area.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
