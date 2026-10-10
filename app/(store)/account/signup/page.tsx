"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Phone, Eye, EyeOff, MapPin, Loader2, ChevronDown, ChevronUp } from "lucide-react";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Andaman & Nicobar Islands","Chandigarh",
  "Dadra & Nagar Haveli and Daman & Diu","Delhi","Jammu & Kashmir","Ladakh",
  "Lakshadweep","Puducherry",
];

const inp: React.CSSProperties = {
  width: "100%", border: "1.5px solid var(--line)", borderRadius: 10,
  padding: "10px 12px 10px 38px", background: "var(--bg)", fontSize: 14,
  color: "var(--ink)", boxSizing: "border-box", fontFamily: "inherit",
};
const inpPlain: React.CSSProperties = { ...inp, paddingLeft: 12 };
const lbl: React.CSSProperties = {
  display: "flex", flexDirection: "column", gap: 6,
  fontSize: 13, fontWeight: 600, color: "var(--ink)",
};
const err: React.CSSProperties = { color: "var(--pink)", fontSize: 12, fontWeight: 400 };

function IconWrap({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--mute)", pointerEvents: "none", display: "flex" }}>
      {children}
    </span>
  );
}

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
  });
  const [address, setAddress] = useState({
    line1: "", line2: "", city: "", state: "", pincode: "",
  });
  const [showAddress, setShowAddress] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  const setAddr = (k: keyof typeof address) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setAddress((a) => ({ ...a, [k]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email is required.";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Valid 10-digit phone is required.";
    if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
    // Address validation (only if user started filling it)
    if (showAddress || address.line1) {
      if (!address.line1.trim()) e.line1 = "Address line 1 is required.";
      if (!address.city.trim()) e.city = "City is required.";
      if (!address.state.trim()) e.state = "State is required.";
      if (!/^\d{6}$/.test(address.pincode)) e.pincode = "Valid 6-digit PIN code is required.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          address: address.line1 ? {
            fullName: form.name,
            phone: form.phone,
            ...address,
          } : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error ?? "Registration failed.");
        setLoading(false);
        return;
      }

      // Auto sign-in after registration
      const signInResult = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push("/shop");
        router.refresh();
      } else {
        router.push("/account/login");
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "80vh", padding: "32px 16px 60px" }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 6px" }}>Create your account ✨</h1>
          <p style={{ color: "var(--mute)", fontSize: 14, margin: 0 }}>
            Save your addresses and track orders easily
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Personal info */}
          <div className="box" style={{ marginBottom: 16, padding: 24 }}>
            <h2 className="text-box-h2" style={{ marginBottom: 16 }}>Personal info</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Name */}
              <label style={lbl}>
                Full name *
                <div style={{ position: "relative" }}>
                  <IconWrap><User size={15} /></IconWrap>
                  <input id="signup-name" type="text" value={form.name} onChange={set("name")}
                    placeholder="Priya Sharma" autoComplete="name"
                    style={{ ...inp, borderColor: errors.name ? "var(--pink)" : undefined }} />
                </div>
                {errors.name && <span style={err}>{errors.name}</span>}
              </label>

              {/* Email */}
              <label style={lbl}>
                Email address *
                <div style={{ position: "relative" }}>
                  <IconWrap><Mail size={15} /></IconWrap>
                  <input id="signup-email" type="email" value={form.email} onChange={set("email")}
                    placeholder="you@example.com" autoComplete="email"
                    style={{ ...inp, borderColor: errors.email ? "var(--pink)" : undefined }} />
                </div>
                {errors.email && <span style={err}>{errors.email}</span>}
              </label>

              {/* Phone */}
              <label style={lbl}>
                Phone number *
                <div style={{ position: "relative" }}>
                  <IconWrap><Phone size={15} /></IconWrap>
                  <input id="signup-phone" type="tel" inputMode="numeric" value={form.phone} onChange={set("phone")}
                    placeholder="9876543210" autoComplete="tel"
                    style={{ ...inp, borderColor: errors.phone ? "var(--pink)" : undefined }} />
                </div>
                {errors.phone && <span style={err}>{errors.phone}</span>}
              </label>

              {/* Password */}
              <label style={lbl}>
                Password *
                <div style={{ position: "relative" }}>
                  <IconWrap><Lock size={15} /></IconWrap>
                  <input id="signup-password" type={showPw ? "text" : "password"} value={form.password} onChange={set("password")}
                    placeholder="At least 8 characters" autoComplete="new-password"
                    style={{ ...inp, paddingRight: 40, borderColor: errors.password ? "var(--pink)" : undefined }} />
                  <button type="button" onClick={() => setShowPw((v) => !v)}
                    style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--mute)", padding: 4, display: "flex" }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <span style={err}>{errors.password}</span>}
              </label>

              {/* Confirm password */}
              <label style={lbl}>
                Confirm password *
                <div style={{ position: "relative" }}>
                  <IconWrap><Lock size={15} /></IconWrap>
                  <input id="signup-confirm" type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={set("confirmPassword")}
                    placeholder="Repeat your password" autoComplete="new-password"
                    style={{ ...inp, paddingRight: 40, borderColor: errors.confirmPassword ? "var(--pink)" : undefined }} />
                  <button type="button" onClick={() => setShowConfirm((v) => !v)}
                    style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--mute)", padding: 4, display: "flex" }}>
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.confirmPassword && <span style={err}>{errors.confirmPassword}</span>}
              </label>
            </div>
          </div>

          {/* Address section — collapsible */}
          <div className="box" style={{ marginBottom: 20, padding: 0, overflow: "hidden" }}>
            <button
              type="button"
              onClick={() => setShowAddress((v) => !v)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "18px 24px", background: "none", border: "none", cursor: "pointer",
                fontFamily: "inherit", textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <MapPin size={16} style={{ color: "var(--pri)" }} />
                <span style={{ fontWeight: 700, fontSize: 15 }}>Add delivery address</span>
                <span style={{ fontSize: 12, color: "var(--mute)", fontWeight: 400 }}>(optional — saves time at checkout)</span>
              </div>
              {showAddress ? <ChevronUp size={16} style={{ color: "var(--mute)" }} /> : <ChevronDown size={16} style={{ color: "var(--mute)" }} />}
            </button>

            {showAddress && (
              <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 14, borderTop: "1px solid var(--line)" }}>
                <div style={{ height: 12 }} />

                <label style={lbl}>
                  Address line 1 *
                  <input id="addr-line1" type="text" value={address.line1} onChange={setAddr("line1")}
                    placeholder="Flat / House no., Street name"
                    style={{ ...inpPlain, borderColor: errors.line1 ? "var(--pink)" : undefined }} />
                  {errors.line1 && <span style={err}>{errors.line1}</span>}
                </label>

                <label style={lbl}>
                  Address line 2
                  <input id="addr-line2" type="text" value={address.line2} onChange={setAddr("line2")}
                    placeholder="Area, Landmark (optional)"
                    style={inpPlain} />
                </label>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <label style={lbl}>
                    City *
                    <input id="addr-city" type="text" value={address.city} onChange={setAddr("city")}
                      placeholder="Chennai"
                      style={{ ...inpPlain, borderColor: errors.city ? "var(--pink)" : undefined }} />
                    {errors.city && <span style={err}>{errors.city}</span>}
                  </label>

                  <label style={lbl}>
                    PIN code *
                    <input id="addr-pincode" type="text" inputMode="numeric" value={address.pincode} onChange={setAddr("pincode")}
                      placeholder="600001"
                      style={{ ...inpPlain, borderColor: errors.pincode ? "var(--pink)" : undefined }} />
                    {errors.pincode && <span style={err}>{errors.pincode}</span>}
                  </label>
                </div>

                <label style={lbl}>
                  State *
                  <select id="addr-state" value={address.state} onChange={setAddr("state")}
                    style={{ ...inpPlain, borderColor: errors.state ? "var(--pink)" : undefined }}>
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <span style={err}>{errors.state}</span>}
                </label>
              </div>
            )}
          </div>

          {serverError && (
            <p style={{ color: "var(--pink)", fontSize: 13, background: "color-mix(in srgb, var(--pink) 8%, var(--bg))", border: "1px solid color-mix(in srgb, var(--pink) 20%, transparent)", borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
              {serverError}
            </p>
          )}

          <button id="signup-btn" type="submit" className="btn" disabled={loading}
            style={{ width: "100%", fontSize: 15, padding: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {loading
              ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Creating account…</>
              : "Create account"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 14, color: "var(--mute)", marginTop: 20 }}>
          Already have an account?{" "}
          <Link href="/account/login" style={{ color: "var(--pri)", fontWeight: 600, textDecoration: "none" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
