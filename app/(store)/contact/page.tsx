import Link from "next/link";

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
          <p><a className="btn btn--primary" href="https://wa.me/919999999999">Chat on WhatsApp</a></p>
          <p className="small">+919999999999 · Messages only, voice calls not supported.</p>

          <h3>Email</h3>
          <p><a href="mailto:oviyas.crochet@gmail.com">oviyas.crochet@gmail.com</a></p>

          <h3>Address</h3>
          <p>Oviya's Crochet<br/>Kanniyakumari, India</p>

          <h3>Hours</h3>
          <p>Mon–Sat, 10 AM – 6 PM IST. We usually reply within 1 business day.</p>
        </section>

        <section className="contact__form">
          <h2>Send us a message</h2>
          <form id="contact-form" method="post" action="#" noValidate>
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
            <button className="btn btn--primary" type="submit">Send message</button>
          </form>
        </section>
      </div>

      <section className="band band--ice">
        <div className="container" style={{maxWidth:780, textAlign:"center", padding: "48px 0"}}>
          <h2 style={{fontFamily: "var(--font-heading)", fontSize: "1.5rem", marginBottom: "16px"}}>Custom orders &amp; bulk gifting</h2>
          <p style={{marginBottom: "24px"}}>Planning a wedding favour, corporate gift or something one-of-a-kind? Tell us your idea and we'll make it happen.</p>
          <a className="btn btn--primary" href="https://wa.me/919999999999">Start a custom order</a>
        </div>
      </section>
    </main>
  );
}
