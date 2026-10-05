"use client";

import { useState, FormEvent } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch { /* best-effort */ } finally {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", gap: 8, maxWidth: 460, margin: "16px auto 0", flexWrap: "wrap" }}
    >
      <label htmlFor="nl-email" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
        Email address
      </label>
      <input
        id="nl-email"
        type="email"
        placeholder="you@example.com"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={sent}
        className="input-pill"
        style={{ flex: 1, minWidth: 200 }}
      />
      <button type="submit" className="btn" disabled={loading || sent} style={{ whiteSpace: "nowrap" }}>
        {sent ? "Check your inbox ✓" : loading ? "Sending…" : "Send my code"}
      </button>
    </form>
  );
}
