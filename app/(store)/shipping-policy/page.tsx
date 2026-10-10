import Link from "next/link";

export const metadata = {
  title: "Shipping Policy | Oviya's Crochet",
};

export default function ShippingPolicyPage() {
  return (
    <main className="page">
      <header className="page-hero">
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> <span>/</span> <span>Shipping Policy</span></nav>
          <h1 className="page-title">Shipping Policy</h1>
          <p className="meta" style={{ marginTop: 16 }}>Last updated: October 2026</p>
        </div>
      </header>

      <div className="container prose">
        <p>At <strong>Oviya's Crochet</strong>, we want your handmade pieces to reach you safely and on time. Please read this policy before ordering.</p>

        <h2>1. Processing time</h2>
        <p>Orders are processed on business days, Monday to Saturday, excluding holidays. Orders placed on Sundays, public holidays or during sale and festive periods may take longer.</p>

        <table>
          <thead>
            <tr><th>Order type</th><th>Time before dispatch</th></tr>
          </thead>
          <tbody>
            <tr><td>Ready-to-ship items</td><td>1–3 business days</td></tr>
            <tr><td>Made-to-order items</td><td>7–14 business days (shown on the product page)</td></tr>
            <tr><td>Custom orders</td><td>Confirmed with you before you pay</td></tr>
          </tbody>
        </table>

        <h2>2. Delivery within India</h2>
        <h3>Delivery timeframe</h3>
        <p>After dispatch, delivery usually takes <strong>3–10 business days</strong>, depending on your location. We ship through courier partners including Delhivery, DTDC, India Post.</p>

        <h3>Shipping charges</h3>
        <ul>
          <li><strong>Free shipping</strong> on orders above <strong>₹999</strong> within India.</li>
          <li>Below that amount, shipping is <strong>₹60</strong>, shown at checkout before you pay.</li>
        </ul>

        <h2>3. Reporting delivery problems</h2>
        <p><strong>Delivery concerns</strong> must be reported within <strong>7 days from delivery</strong> of the delivery date shown in tracking. After this, we may not be able to investigate.</p>

        <h2>4. Damaged or tampered packages</h2>
        <p>If your parcel looks damaged or opened when it arrives, <strong>please don't accept it</strong>, or note the damage with the delivery person, and message us immediately on WhatsApp at +919363341924with photos.</p>
        <p><strong>Unboxing video:</strong> to process damage, missing-item or wrong-item claims (including courier insurance claims), we need <strong>one continuous video</strong> that shows the parcel sealed, the opening, and the problem. Please record it before opening the parcel. Without this video we may not be able to approve a claim.</p>

        <div className="callout">
          <strong>Need help?</strong> For any shipping question, contact us at <a href="mailto:contact.oviyascrochet@gmail.com">contact.oviyascrochet@gmail.com</a> or on <a href="https://wa.me/919999999999">WhatsApp</a> before you order.
        </div>
      </div>
    </main>
  );
}
