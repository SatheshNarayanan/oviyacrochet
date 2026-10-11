import Link from "next/link";

export const metadata = {
  title: "Data sharing opt-out | Oviyas Crochet",
};

export default function DataSharingOptOutPage() {
  return (
    <main className="page">
      <header className="page-hero">
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> <span>/</span> <span>Data sharing opt-out</span></nav>
          <h1 className="page-title">Do Not Sell or Share My Personal Information</h1>
          <p className="page-intro">This page lets you opt out of sharing your personal information for advertising or similar purposes.</p>
        </div>
      </header>

      <div className="container prose">
        <p>At <strong>Oviyas Crochet</strong>, we respect your privacy and want you to be in control of how your data is used.</p>

        <h2>1. How we use your data</h2>
        <p>As described in our <Link href="/privacy-policy">Privacy policy</Link>, we collect information through your visits to our site, including through cookies and similar technologies. Some of this information may be shared with analytics and advertising partners (Google Analytics) to improve your experience and to show you relevant ads.</p>

        <h2>2. Your right to opt out</h2>
        <p>Depending on where you live, you may have the right to opt out of data sharing that is treated as a "sale", "sharing" or "targeted advertising". You can use the options below.</p>

        <h2>3. Opt out now</h2>
        <p><strong>Option A: opt out on this device (instant).</strong> Select the button below. We'll store your choice in a cookie on this browser and stop advertising and analytics tools from loading.</p>
        <p><button className="btn btn--primary" id="optout-btn" type="button">Opt out on this device</button></p>

        <p style={{ marginTop: 24 }}><strong>Option B: send us a request (covers your account and email).</strong> Use this if you want us to apply your choice to your customer record.</p>
        <form id="optout-form" method="post" action="#" noValidate style={{ display: 'grid', gap: '16px', maxWidth: '400px' }}>
          <label style={{ display: 'grid', gap: '6px', fontWeight: 600 }}>Full name <input name="name" type="text" required autoComplete="name" style={{ padding: '.8em 1em', border: '1px solid var(--line)', borderRadius: '10px' }} /></label>
          <label style={{ display: 'grid', gap: '6px', fontWeight: 600 }}>Email address used for orders <input name="email" type="email" required autoComplete="email" style={{ padding: '.8em 1em', border: '1px solid var(--line)', borderRadius: '10px' }} /></label>
          <label className="check" style={{ display: 'flex', gap: '8px' }}><input type="checkbox" name="confirm" required />
            <span>I want to opt out of the sale or sharing of my personal information for advertising and analytics.</span></label>
          <button className="btn btn--primary" type="submit">Submit request</button>
        </form>

        <h2>4. Important notes</h2>
        <ul>
          <li>This opt-out applies to advertising and analytics-related data sharing.</li>
          <li>It does <strong>not</strong> affect information needed to process and deliver your orders or to keep the site working.</li>
          <li>You may still see ads, but they won't be personalized using this data.</li>
          <li>If your browser sends a <strong>Global Privacy Control (GPC)</strong> signal, we treat it as an opt-out request, where applicable.</li>
          <li>You can change your mind at any time by clearing cookies or contacting us.</li>
        </ul>
      </div>
    </main>
  );
}
