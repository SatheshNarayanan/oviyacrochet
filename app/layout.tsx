import type { Metadata } from "next";
import { Baloo_2, DM_Sans } from "next/font/google";
import { Providers } from "@/components/ui/providers";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-baloo",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Oviya's Crochet — Handmade with Love",
    template: "%s | Oviya's Crochet",
  },
  description:
    "Shop handmade crochet bags, amigurumi, home decor and gifts made to order in Tamil Nadu. Soft, dreamy, made just for you.",
  keywords: ["crochet", "handmade", "amigurumi", "bags", "Tamil Nadu", "India"],
  openGraph: {
    type: "website",
    siteName: "Oviya's Crochet",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/brand/logo.png", apple: "/brand/logo.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {/* Initialize theme before render to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${baloo.variable} ${dmSans.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
