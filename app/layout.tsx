import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://2daysventures.vercel.app";

export const metadata: Metadata = {
  title: "2days Ventures Limited",
  description: "Premium real estate properties, land, and houses for sale in Nigeria.",
  openGraph: {
    title: "2days Ventures Limited",
    description: "Premium real estate properties, land, and houses for sale in Nigeria.",
    url: siteUrl,
    siteName: "2days Ventures Limited",
    images: [
      {
        url: `${siteUrl}/logo.png`,
        width: 360,
        height: 92,
        alt: "2days Ventures Logo",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "2days Ventures Limited",
    description: "Premium real estate properties, land, and houses for sale in Nigeria.",
    images: [`${siteUrl}/logo.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}