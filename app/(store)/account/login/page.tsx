"use client";

import { useState, FormEvent, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/shop";

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
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setError("Invalid email or password.");
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

  const inp: React.CSSProperties = {
    width: "100%", border: "2px solid var(--color-jet-black)", borderRadius: 10,
    padding: "10px 12px 10px 38px", background: "var(--surface)", fontSize: 14,
    color: "var(--color-jet-black)", boxSizing: "border-box", fontFamily: "var(--font-primary)",
  };
  const lbl: React.CSSProperties = {
    display: "flex", flexDirection: "column", gap: 6,
    fontSize: 13, fontWeight: 600, color: "var(--color-jet-black)",
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 28, margin: "0 0 6px", color: "var(--color-jet-black)" }}>Welcome back 👋</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0 }}>Sign in to your account</p>
        </div>

        <div className="box" style={{ padding: 28 }}>
          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            <label style={lbl}>
              Email address
              <div style={{ position: "relative" }}>
                <Mail size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--mute)", pointerEvents: "none" }} />
                <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" required autoComplete="email" style={inp} />
              </div>
            </label>

            <label style={lbl}>
              Password
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--mute)", pointerEvents: "none" }} />
                <input id="login-password" type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                  autoComplete="current-password" style={{ ...inp, paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--mute)", padding: 4, display: "flex" }}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </label>

            {error && (
              <p style={{ color: "#dc2626", fontSize: 13, background: "color-mix(in srgb, #dc2626 8%, var(--bg))", border: "1px solid color-mix(in srgb, #dc2626 20%, transparent)", borderRadius: 8, padding: "10px 12px", margin: 0 }}>
                {error}
              </p>
            )}

            <button id="login-btn" type="submit" className="btn" disabled={loading}
              style={{ width: "100%", fontSize: 15, padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {loading ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Signing in…</> : "Sign in"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-muted)", marginTop: 20 }}>
          Don&apos;t have an account?{" "}
          <Link href="/account/signup" style={{ color: "var(--color-jet-black)", fontWeight: 600, textDecoration: "underline", textDecorationColor: "var(--color-cotton-candy)" }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function AccountLoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
