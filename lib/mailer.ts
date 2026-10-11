import nodemailer from "nodemailer";

const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_APP_PASSWORD;

// Reuse one transporter per server instance
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: { user, pass },
});

export type MailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text: string; // plain-text fallback, helps deliverability
  replyTo?: string;
};

export async function sendMail({ to, subject, html, text, replyTo }: MailInput) {
  if (!user || !pass) {
    console.warn("GMAIL_USER or GMAIL_APP_PASSWORD is not set. Emails will not be sent.");
    return;
  }
  return transporter.sendMail({
    from: `"Oviyas Crochet" <${user}>`,
    to,
    subject,
    html,
    text,
    replyTo: replyTo ?? user,
  });
}

// Use in a test route to confirm the credentials work
export async function verifyMailer() {
  return transporter.verify();
}
