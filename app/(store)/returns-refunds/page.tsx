import Link from "next/link";

export const metadata = {
  title: "Returns & Refunds | Oviyas Crochet",
};

export default function RefundPolicyPage() {
  return (
    <main className="page">
      <header className="page-hero">
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> <span>/</span> <span>Returns & Refunds</span></nav>
          <h1 className="page-title">Returns & Refunds</h1>
          <p className="meta" style={{ marginTop: 16 }}>Last updated: October 2026</p>
        </div>
      </header>

      <div className="container prose">
        <p>We love our handmade pieces and hope you do too. Because each item is made by hand, please read this policy before ordering.</p>

        <h2>1. Eligibility</h2>
        <p>You can request a return or replacement within <strong>7 days from delivery</strong> if:</p>
        <ul>
          <li>the item arrived <strong>damaged</strong>, or</li>
          <li>you received the <strong>wrong item</strong>, or</li>
          <li>the item has a <strong>significant defect</strong> that was not described.</li>
        </ul>

        <h2>2. What we can't take back</h2>
        <ul>
          <li><strong>Made-to-order and custom pieces</strong>, unless they arrive damaged or incorrect</li>
          <li><strong>Items marked "non-returnable"</strong> on the product page</li>
          <li>Items that have been <strong>worn, washed, altered or damaged</strong> after delivery</li>
          <li>Small differences in shade, size or stitching that are normal for handmade work</li>
        </ul>

        <h2>3. How to request a return or replacement</h2>
        <ol>
          <li>Message us within 7 days from delivery on WhatsApp (+919363341924) or email contact.oviyascrochet@gmail.com.</li>
          <li>Include your <strong>order number</strong>, clear <strong>photos</strong> and, for damage or missing items, the <strong>unboxing video</strong> (see our <Link href="/shipping-policy">Shipping policy</Link>).</li>
          <li>We'll review and reply within 1 business day. If approved, we'll arrange a pickup or tell you how to send the item back.</li>
        </ol>

        <h2>4. Refunds</h2>
        <p>Approved refunds are sent to your <strong>original payment method</strong> within <strong>5-7</strong> business days of us receiving and checking the item (your bank may take a few more days to show it). Shipping charges are non-refundable unless the error was ours. Where you prefer, we can offer a <strong>replacement</strong> or <strong>store credit</strong> instead.</p>

        <h2>5. Cancellations</h2>
        <p>You can cancel an order within 12 hours of ordering, before making starts. After making has started or the order has been dispatched, it can't be cancelled.</p>

        <div className="callout">
          <strong>Need help?</strong> <Link href="/contact">Contact us</Link> for any issues with your order.
        </div>
      </div>
    </main>
  );
}
