import type { Metadata } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import ClientLayout from "./client-layout";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-inter-tight",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EV-SIM — EV Charging Simulation Platform",
    template: "%s | EV-SIM",
  },
  icons: {
    icon: "/logo.png",
  },
  description:
    "Full-stack EV charging simulation with virtual chargers, real OCPP 2.0.1 protocol, and live CSMS communication.",
  openGraph: {
    title: "EV-SIM — EV Charging Simulation Platform",
    description:
      "Full-stack EV charging simulation with virtual chargers, real OCPP 2.0.1 protocol, and live CSMS communication.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
