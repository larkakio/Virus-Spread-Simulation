import type { Metadata, Viewport } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import { Web3Provider } from "@/components/Web3Provider";
import { BaseAppMeta } from "@/components/BaseAppMeta";
import "./globals.css";

const orbit = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbit",
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  variable: "--font-rajdhani",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Virus Spread Simulation",
  description:
    "Contain the outbreak — swipe to deploy treatment pulses. Base on-chain check-in.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  formatDetection: { telephone: false },
  icons: { icon: "/app-icon.jpg" },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <BaseAppMeta />
      </head>
      <body
        className={`${orbit.variable} ${rajdhani.variable} scanlines font-sans min-h-dvh antialiased cyber-hud-grid`}
      >
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
