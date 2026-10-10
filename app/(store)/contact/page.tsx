import Link from "next/link";
import { ContactForm } from "@/components/store/contact-form";

export const metadata = {
  title: "Contact Us | Oviya's Crochet",
};

export default function ContactPage() {
  return (
    <main className="page">
      <header className="page-hero">
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> <span>/</span> <span>Contact</span></nav>
          <h1 className="page-title">Contact Us</h1>
          <p className="page-intro">Questions about an order, a custom piece or something else? We're happy to help.</p>
        </div>
      </header>

      <div className="container contact">
        <section className="contact__info">
          <h2>Reach us</h2>

          <h3>WhatsApp (fastest)</h3>
          <p><a className="btn btn--primary" href="https://wa.me/919363341924">Chat on WhatsApp</a></p>
          <p className="small">+919363341924 · Messages only, voice calls not supported.</p>

          <h3>Email</h3>
          <p><a href="mailto:contact.oviyascrochet@gmail.com">contact.oviyascrochet@gmail.com</a></p>

          <h3>Address</h3>
          <p>Oviya's Crochet<br />Kanniyakumari, India</p>

          <h3>Hours</h3>
          <p>Mon–Sat, 10 AM – 6 PM IST. We usually reply within 1 business day.</p>
        </section>

        <section className="contact__form">
          <h2>Send us a message</h2>
          <ContactForm />
        </section>
      </div>

      <section className="band band--ice">
        <div className="container" style={{ maxWidth: 780, textAlign: "center", padding: "48px 0" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", marginBottom: "16px" }}>Custom orders &amp; bulk gifting</h2>
          <p style={{ marginBottom: "24px" }}>Planning a wedding favour, corporate gift or something one-of-a-kind? Tell us your idea and we'll make it happen.</p>
          <a className="btn btn--primary" href="https://wa.me/919363341924">Start a custom order</a>
        </div>
      </section>
    </main >
  );
}
