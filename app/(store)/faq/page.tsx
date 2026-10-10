import Link from "next/link";

export const metadata = {
  title: "FAQ | Oviya's Crochet",
};

export default function FAQPage() {
  return (
    <main className="page">
      <header className="page-hero">
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> <span>/</span> <span>FAQ</span></nav>
          <h1 className="page-title">FAQ</h1>
          <p className="page-intro">Quick answers to the questions we hear most.</p>
        </div>
      </header>

      <div className="container prose">
        <div className="faq">
          <details className="faq__item">
            <summary>Do you have any discount codes available?</summary>
            <div className="faq__body"><p>Yes, from time to time. Active offers and codes are shown on our website banner and shared on our <a href="https://instagram.com/oviyas_crochet">Instagram</a> and WhatsApp updates. Enter a code at checkout. Codes can't be applied after an order is placed, and only one code can be used per order unless stated otherwise. Sign up to our newsletter to hear about new offers first.</p></div>
          </details>
          <details className="faq__item">
            <summary>How fast is shipping and how much does it cost?</summary>
            <div className="faq__body"><p>Ready-to-ship items are dispatched within 1–3 business days, and made-to-order pieces within 7–14 business days. After dispatch, delivery within India usually takes 3–10 business days. Shipping is free on orders above ₹999; below that, the fee (₹60) is shown at checkout. See our <Link href="/shipping-policy">Shipping policy</Link> for full details.</p></div>
          </details>
          <details className="faq__item">
            <summary>How can I track my order?</summary>
            <div className="faq__body"><p>Once your order is dispatched, we email you (and message you on WhatsApp, if you've given us your number) with a tracking link. You can also check your order status from your account page.</p></div>
          </details>
          <details className="faq__item">
            <summary>I need to cancel or modify my order. What do I do?</summary>
            <div className="faq__body"><p>Message us on WhatsApp at +919363341924 or email contact.oviyascrochet@gmail.com with your order number as soon as possible. We can usually cancel or change an order within 12 hours of ordering, before making starts. Because every piece is handmade, we can't change or cancel once making has started or the order has been dispatched.</p></div>
          </details>
          <details className="faq__item">
            <summary>Why choose Oviya's Crochet?</summary>
            <div className="faq__body"><p>Every piece is handmade with care, so you won't find the same factory-made look everywhere. Our designs are bold, playful and made for people who love to express themselves. We use quality yarns, finish each piece by hand, and you can talk to the people who made it.</p></div>
          </details>
          <details className="faq__item">
            <summary>Where are your products made?</summary>
            <div className="faq__body"><p>All our crochet pieces are handmade in India by us and our small team of makers.</p></div>
          </details>
          <details className="faq__item">
            <summary>Where are you located?</summary>
            <div className="faq__body"><p>We're based in Kanniyakumari, India. We ship to customers across India. Our full address is on the <Link href="/contact">Contact page</Link>.</p></div>
          </details>
          <details className="faq__item">
            <summary>Is your site secure?</summary>
            <div className="faq__body"><p>Yes. Payments are processed through Razorpay, which uses industry-standard encryption. We never see or store your full card details. Read more in our <Link href="/privacy-policy">Privacy policy</Link>.</p></div>
          </details>
          <details className="faq__item">
            <summary>What payment methods do you accept?</summary>
            <div className="faq__body"><p>We accept UPI, credit and debit cards, net banking, wallets. The options available to you are shown at checkout.</p></div>
          </details>
          <details className="faq__item">
            <summary>Do the photos on the site match the product exactly?</summary>
            <div className="faq__body"><p>We photograph our pieces as accurately as we can, but because each item is handmade, small differences in stitch pattern, size and shape are normal and part of the charm. Colors can also look slightly different on different screens. If you want to see more, message us and we'll share extra photos or a short video.</p></div>
          </details>
          <details className="faq__item">
            <summary>Can I order a custom size or a custom color?</summary>
            <div className="faq__body"><p>Often, yes! Tell us what you have in mind through the <Link href="/contact">Contact page</Link> or on WhatsApp. Share the product, the size or colors you want, and when you need it. We'll confirm the price and timeline before you pay. Custom orders usually take 7-14 business days and are non-refundable once making begins.</p></div>
          </details>
          <details className="faq__item">
            <summary>What happens if an item is out of stock?</summary>
            <div className="faq__body"><p>Out-of-stock items show as "Sold out". Use the <strong>Notify me</strong> option on the product to get an alert when it's back, or message us to ask if we can make it to order. If an item sells out while your order is being processed, we'll contact you to offer a substitute, a wait for the new batch, or a full refund.</p></div>
          </details>
          <details className="faq__item">
            <summary>I entered the wrong address. What do I do?</summary>
            <div className="faq__body"><p>Contact us right away on WhatsApp or email with your order number and the correct address. If the parcel hasn't been dispatched, we'll update it. Once it's shipped, we can't guarantee a change; delivery to an incorrect address provided at checkout is the customer's responsibility.</p></div>
          </details>
          <details className="faq__item">
            <summary>How do I return or exchange an order?</summary>
            <div className="faq__body"><p>Please see our <Link href="/returns-refunds">Returns & refunds policy</Link>. In short: report any problem within 7 days from delivery with your order number, photos and an unboxing video. Made-to-order and custom pieces can't be returned unless they arrive damaged or incorrect.</p></div>
          </details>
          <details className="faq__item">
            <summary>How do I care for my crochet pieces?</summary>
            <div className="faq__body"><p>Hand wash gently in cool water with a mild detergent, don't wring or twist, and dry flat in the shade. Store folded, not hung, to keep the shape. Avoid direct heat and harsh chemicals. Check the care label on your product for specific instructions.</p></div>
          </details>
        </div>

        <div className="callout"><strong>Still need help?</strong>
          <p>Message us on <a href="https://wa.me/919363341924">WhatsApp</a> or write to <a href="mailto:contact.oviyascrochet@gmail.com">contact.oviyascrochet@gmail.com</a>. We reply within 1 business day.</p>
          <Link className="btn btn--primary" href="/contact">Contact us</Link>
        </div>
      </div>
    </main>
  );
}
