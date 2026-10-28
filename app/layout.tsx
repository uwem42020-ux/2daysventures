import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://2daysventures.com.ng";

export const metadata: Metadata = {
  title: "2days Ventures Limited",
  description:
    "Premium real estate properties, land, and houses for sale in Nigeria.",
  openGraph: {
    title: "2days Ventures Limited",
    description:
      "Premium real estate properties, land, and houses for sale in Nigeria.",
    url: siteUrl,
    siteName: "2days Ventures Limited",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "2days Ventures Limited",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "2days Ventures Limited",
    description:
      "Premium real estate properties, land, and houses for sale in Nigeria.",
    images: [`${siteUrl}/og-image.png`],
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