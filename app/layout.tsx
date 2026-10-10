import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display, Montserrat, Nunito } from "next/font/google";
import { Providers } from "@/components/ui/providers";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-primary",
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Oviya's Crochet — Handmade with Love",
    template: "%s | Oviya's Crochet",
  },
  description:
    "Shop handmade crochet bags, amigurumi, home decor and gifts made to order in Kanniyakumari. Soft, dreamy, made just for you.",
  keywords: ["crochet", "handmade", "amigurumi", "bags", "Kanniyakumari", "India"],
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
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={`${dmSans.variable} ${dmSerifDisplay.variable} ${montserrat.variable} ${nunito.variable}`}>
      <head>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
