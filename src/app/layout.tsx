import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import AppGate from "@/components/AppGate";

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Fetch — Dog Park Network",
  description:
    "Find dog parks and connect with other dog owners nearby. Your proximity-based dog social network.",
  manifest: "/manifest.json",
  icons: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  openGraph: {
    title: "Fetch — Dog Park Network",
    description:
      "See which dogs are at which parks. Find your dog's friends. Go.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0D2137",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#0D2137" />
      </head>
      <body
        className="bg-offwhite antialiased min-h-safe-screen flex flex-col items-center ios-safari-body"
        style={{
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <div className="w-full flex justify-center min-h-safe-screen md:bg-navy md:py-8">
          <Providers>
            <AppGate>{children}</AppGate>
          </Providers>
        </div>
      </body>
    </html>
  );
}
