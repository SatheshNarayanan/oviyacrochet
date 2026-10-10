"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to send message. Please try again.");
      }

      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  if (status === "success") {
    return (
      <div style={{ padding: "32px", background: "var(--ice)", borderRadius: "8px", textAlign: "center" }}>
        <h3 style={{ marginBottom: "16px", color: "var(--ink)" }}>Message Sent!</h3>
        <p style={{ color: "var(--ink)" }}>Thank you for reaching out. We will get back to you shortly.</p>
        <button 
          onClick={() => setStatus("idle")} 
          className="btn btn--primary" 
          style={{ marginTop: "24px" }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form id="contact-form" onSubmit={handleSubmit} noValidate>
      <label>Name <input name="name" type="text" required autoComplete="name" /></label>
      <label>Email <input name="email" type="email" required autoComplete="email" /></label>
      <label>Phone (optional) <input name="phone" type="tel" autoComplete="tel" /></label>
      <label>Topic
        <select name="topic" required>
          <option value="">Choose a topic</option>
          <option>Order status or tracking</option>
          <option>Change or cancel an order</option>
          <option>Custom order</option>
          <option>Bulk / gifting enquiry</option>
          <option>Return or damaged item</option>
          <option>Something else</option>
        </select>
      </label>
      <label>Order number (if any) <input name="order" type="text" /></label>
      <label>Message <textarea name="message" rows={6} required></textarea></label>
      
      {status === "error" && (
        <div style={{ color: "red", marginBottom: "16px", fontSize: "0.9rem" }}>{errorMsg}</div>
      )}
      
      <button 
        className="btn btn--primary" 
        type="submit" 
        disabled={status === "loading"}
      >
        {status === "loading" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
