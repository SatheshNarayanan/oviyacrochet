"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function CustomRequestForm() {
  const searchParams = useSearchParams();
  const initialCharacter = searchParams.get("character") || "";
  const initialItem = searchParams.get("item") || "";
  const initialTitle = searchParams.get("title") || "";

  const [characterVal, setCharacterVal] = useState(initialCharacter);
  const [itemVal, setItemVal] = useState(
    initialItem === "outfit" ? "Outfit or dress" : initialItem === "hat" ? "Hat" : initialItem === "keychain" ? "Keychain" : initialItem === "accessories" ? "Accessories" : ""
  );
  const [referenceVal, setReferenceVal] = useState(initialTitle);
  const [detailsVal, setDetailsVal] = useState(initialTitle ? `I would like to order the ${initialTitle}.` : "");

  useEffect(() => {
    if (searchParams.get("character")) setCharacterVal(searchParams.get("character") || "");
    const it = searchParams.get("item");
    if (it) {
      setItemVal(it === "outfit" ? "Outfit or dress" : it === "hat" ? "Hat" : it === "keychain" ? "Keychain" : it === "accessories" ? "Accessories" : "");
    }
    const title = searchParams.get("title");
    if (title) {
      setReferenceVal(title);
      setDetailsVal(`I would like to order the ${title}.`);
    }
  }, [searchParams]);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);

    if (!formData.get("consent")) {
      setStatus("error");
      setErrorMsg("Please agree to let us email you so we can reply to your request.");
      return;
    }

    const data = Object.fromEntries(formData.entries());
    data.consent = formData.get("consent") === "on" ? "true" : "";

    try {
      const res = await fetch("/api/custom-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again, or email us at oviyascrochet@gmail.com.");
      }
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  if (status === "success") {
    return (
      <div style={{ padding: "48px 32px", background: "var(--ice)", borderRadius: "16px", textAlign: "center" }} role="status" aria-live="polite">
        <h3 style={{ fontSize: "1.5rem", color: "var(--ink)", marginBottom: "16px" }}>Thank you, we've got your request!</h3>
        <p style={{ color: "var(--ink)" }}>We've sent a confirmation to your email. We'll reach back to you soon to confirm the design and price. If you don't see our email, please check your spam folder.</p>
        <button className="btn btn--primary" style={{ marginTop: "24px" }} onClick={() => setStatus("idle")}>Submit another request</button>
      </div>
    );
  }

  return (
    <form id="request-form" onSubmit={handleSubmit} noValidate className="box" style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "800px", margin: "0 auto", padding: "clamp(16px, 5vw, 32px)", borderRadius: "16px", background: "var(--surface)", boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)", border: "1px solid var(--line)" }}>
      {/* Honeypot */}
      <div style={{ display: "none" }} aria-hidden="true">
        <label>Leave this empty <input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "24px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--ink)" }}>Your name *</label>
          <input name="name" type="text" required autoComplete="name" className="input" />
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--ink)" }}>Email *</label>
          <input name="email" type="email" required autoComplete="email" className="input" />
        </div>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "24px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--ink)" }}>Phone / WhatsApp (optional)</label>
          <input name="phone" type="tel" autoComplete="tel" className="input" />
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--ink)" }}>What would you like? *</label>
          <select name="itemType" value={itemVal} onChange={e => setItemVal(e.target.value)} required className="input" style={{ appearance: "none", backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231F3347%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", backgroundSize: "16px" }}>
            <option value="">Choose an item</option>
            <option value="Outfit or dress">Outfit or dress</option>
            <option value="Hat">Hat</option>
            <option value="Keychain">Keychain</option>
            <option value="Accessories">Accessories</option>
            <option value="Full themed set">Full themed set</option>
            <option value="Something else">Something else</option>
          </select>
        </div>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "24px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--ink)" }}>Character or idea (optional)</label>
          <input name="character" type="text" value={characterVal} onChange={e => setCharacterVal(e.target.value)} placeholder="e.g. Naruto, Batman, a cute bunny..." className="input" />
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--ink)" }}>Size or baby's age *</label>
          <input name="size" type="text" required placeholder="e.g. 6-9 months, newborn, adult..." className="input" />
        </div>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "24px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--ink)" }}>Preferred colours (optional)</label>
          <input name="colours" type="text" className="input" />
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--ink)" }}>Needed by (date - optional)</label>
          <input name="neededBy" type="date" className="input" />
        </div>
      </div>
      
      <div>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--ink)" }}>Reference links (optional)</label>
        <input name="referenceLinks" type="text" value={referenceVal} onChange={e => setReferenceVal(e.target.value)} placeholder="Link to a photo or post..." className="input" />
      </div>
      
      <div>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--ink)" }}>Details *</label>
        <textarea name="details" rows={5} required value={detailsVal} onChange={e => setDetailsVal(e.target.value)} placeholder="Tell us more about your request..." className="input" style={{ resize: "vertical" }}></textarea>
      </div>
      
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "16px", background: "var(--ice)", borderRadius: "12px" }}>
        <input name="consent" id="consent" type="checkbox" required style={{ marginTop: "4px", width: "20px", height: "20px", accentColor: "var(--mint)" }} />
        <label htmlFor="consent" style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: "1.5", fontWeight: "600" }}>
          I agree that Oviya's Crochet may email me about this request. *
        </label>
      </div>
      
      {status === "error" && (
        <div style={{ color: "var(--danger)", padding: "12px", background: "rgba(214, 51, 108, 0.1)", borderRadius: "8px", marginTop: "8px" }} role="alert" aria-live="polite">
          {errorMsg}
        </div>
      )}
      
      <div style={{ marginTop: "8px", textAlign: "center" }}>
        <button type="submit" disabled={status === "loading"} className="btn btn--primary" style={{ width: "100%", maxWidth: "320px", padding: "16px", fontSize: "1.1rem", borderRadius: "999px" }}>
          {status === "loading" ? "Sending..." : "Request a custom piece"}
        </button>
        <p style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "16px" }}>We'll reach back to you by email.</p>
      </div>
    </form>
  );
}
