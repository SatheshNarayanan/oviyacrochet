import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Oviya's Crochet",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="page">
      <header className="page-hero">
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> <span>/</span> <span>Privacy Policy</span></nav>
          <h1 className="page-title">Privacy Policy</h1>
          <p className="meta" style={{ marginTop: 16 }}>Last updated: October 2026</p>
        </div>
      </header>

      <div className="container prose">
        <p>This policy explains how <strong>Oviya's Crochet</strong> ("Oviya's Crochet", "we", "us") collects, uses and shares your personal information when you visit or buy from our site, and what choices you have.</p>

        <h2>1. Information we collect</h2>
        <p><strong>Information about your device and visit.</strong> When you visit the Site, we automatically collect certain information, including:</p>
        <ul>
          <li>your browser type and version</li>
          <li>your IP address and approximate location</li>
          <li>your time zone and language</li>
          <li>cookies installed on your device</li>
          <li>the pages and products you view, the search terms you use, how you reached the Site and how you interact with it</li>
        </ul>
        <p>We collect this using cookies, log files, and similar tools.</p>

        <p><strong>Order and account information.</strong> When you buy or try to buy, or create an account, we collect:</p>
        <ul>
          <li>your name</li>
          <li>billing and delivery address</li>
          <li>email address and phone number</li>
          <li>order details and payment status (we do <strong>not</strong> receive or store your full card number; payments are handled by our payment provider)</li>
        </ul>

        <h2>2. How we use your information</h2>
        <p>We use order and account information to:</p>
        <ul>
          <li>process payments and fulfil and deliver orders</li>
          <li>send order confirmations, updates and invoices</li>
          <li>answer your questions and provide support</li>
          <li>screen orders for fraud or risk</li>
          <li>send news, offers and updates, <strong>only where you've agreed</strong> (you can unsubscribe at any time)</li>
          <li>meet legal, tax and accounting duties</li>
        </ul>

        <h2>3. Who we share information with</h2>
        <p>We share information only with people who help us run the business, and only what they need:</p>
        <ul>
          <li><strong>Payment provider</strong> (Razorpay): to process your payment</li>
          <li><strong>Delivery partners</strong> (Delhivery, DTDC, India Post): to deliver your order</li>
          <li><strong>Platform and technology providers:</strong> such as our website host, email and messaging tools</li>
          <li><strong>Analytics and advertising tools</strong> (Google Analytics): to understand site use and measure ads.</li>
          <li><strong>Authorities or advisers:</strong> where the law requires, or to protect our rights, customers or business</li>
        </ul>

        <h2>4. Cookies</h2>
        <p>We use cookies to keep the Site working (for example, to remember your cart), to understand how the Site is used, and to show relevant ads. You can control or delete cookies in your browser settings, but parts of the Site may not work properly without essential cookies. To learn more about cookies, visit <a href="https://www.allaboutcookies.org">allaboutcookies.org</a>.</p>

        <h2>5. Your rights</h2>
        <p>Depending on where you live, you may have the right to:</p>
        <ul>
          <li>ask for a copy of the personal information we hold about you</li>
          <li>ask us to correct inaccurate or incomplete information</li>
          <li>ask us to delete your information</li>
          <li>withdraw consent you've given, for example for marketing messages</li>
          <li>opt out of advertising-related sharing</li>
        </ul>
        <p>To use any of these rights, email contact.oviyascrochet@gmail.com.</p>

        <h2>6. Changes, contact and grievance officer</h2>
        <p>We may update this policy to reflect changes in our practices or legal requirements. The latest version is always on this page, with the date at the top.</p>
        <p>Questions or complaints about your privacy:</p>
        <p><strong>Email:</strong> contact.oviyascrochet@gmail.com<br />
          <strong>Address:</strong> Oviya's Crochet, Kanniyakumari, India<br />
          <strong>Grievance officer:</strong> Oviya · contact.oviyascrochet@gmail.com</p>

        <div className="callout"><strong>Need help?</strong> If you have questions about your data or privacy, contact us any time. <Link href="/contact">Contact us</Link>.</div>
      </div>
    </main>
  );
}
