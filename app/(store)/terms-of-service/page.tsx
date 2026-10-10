import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Oviya's Crochet",
};

export default function TermsOfServicePage() {
  return (
    <main className="page">
      <header className="page-hero">
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> <span>/</span> <span>Terms of Service</span></nav>
          <h1 className="page-title">Terms of Service</h1>
          <p className="meta" style={{ marginTop: 16 }}>Last updated: October 2026</p>
        </div>
      </header>

      <div className="container prose">
        <p>This website is operated by <strong>Oviya's Crochet</strong>, trading as <strong>Oviya's Crochet</strong>. In these terms, "we", "us" and "our" mean Oviya's Crochet, and "you" means anyone who visits the site or buys from us.</p>
        <p>By visiting this site or placing an order, you agree to these Terms of Service and to the policies linked below. If you don't agree, please don't use the site.</p>
        <ul>
          <li><Link href="/privacy-policy">Privacy policy</Link></li>
          <li><Link href="/shipping-policy">Shipping policy</Link></li>
          <li><Link href="/returns-refunds">Returns & refunds policy</Link></li>
          <li>Any other policy or guideline we publish on the site</li>
        </ul>

        <h2>1. Using the site</h2>
        <p>You confirm that you are at least 18 years old, or that you are using the site with the permission of a parent or guardian. You agree to use the site only for lawful purposes. You must not send us viruses or any harmful code. We may suspend access if these terms are broken.</p>

        <h2>2. General conditions</h2>
        <p>We may refuse service to anyone, at any time, for reasons permitted by law. You agree not to copy, reproduce, sell, resell or exploit any part of the site or our content without our written permission. Information you send to the site, other than payment details, may pass through networks without encryption; payment details are handled securely by our payment provider.</p>

        <h2>3. Accuracy of information</h2>
        <p>We work hard to keep the site accurate, but we don't promise that all content is complete, current or error-free. Please don't rely on the site alone for important decisions. We may update content at any time and aren't obliged to do so.</p>

        <h2>4. Changes to the site and prices</h2>
        <p>Prices and availability can change without notice. We may change or stop any part of the site or our services, and we aren't liable to you or anyone else for doing so.</p>

        <h2>5. Our products</h2>
        <ul>
          <li>Every piece is <strong>handmade</strong>, so small variations in size, shape, stitching and shade are normal and are not defects.</li>
          <li>Colors in photos may look different on different screens.</li>
          <li>Some products are made in limited quantities or <strong>made to order</strong>. Production times are shown on the product page or confirmed by us before we begin.</li>
          <li><strong>Custom orders</strong> are made to your specifications after we confirm details and price with you.</li>
          <li>We may limit quantities, discontinue products or change what we sell without notice.</li>
          <li>Product sizes and descriptions are approximate.</li>
        </ul>

        <h2>6. Orders, billing and payment</h2>
        <p>We may accept, refuse or cancel any order at our discretion, for example if an item is unavailable, there is a pricing error, or we suspect misuse. We may limit the quantity bought per person, household or order.</p>
        <p>Prices are in Indian rupees and include applicable GST unless stated otherwise. You agree to give accurate and complete billing and contact details and to keep them up to date. Payments are processed by our payment provider (Razorpay). Please see our <Link href="/returns-refunds">Returns & refunds policy</Link> for cancellations, returns and refunds.</p>

        <h2>7. Contact and grievance officer</h2>
        <p>Questions about these terms? Contact us:</p>
        <p><strong>Email:</strong> contact.oviyascrochet@gmail.com<br />
          <strong>Address:</strong> Oviya's Crochet, Kanniyakumari, India</p>
        <p><strong>Grievance officer:</strong> Oviya · contact.oviyascrochet@gmail.com. We acknowledge complaints within 48 hours.</p>

        <div className="callout"><strong>Need help?</strong> If you have questions about these terms, reach out before placing your order. <Link href="/contact">Contact us</Link>.</div>
      </div>
    </main>
  );
}
