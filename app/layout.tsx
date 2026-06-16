import type { Metadata } from "next";
import ClientLayout from "./client-layout";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "EV-SIM",
    template: "%s | EV-SIM",
  },
  description: "Interactive EV charging simulation with OCPP 2.0.1 protocol monitoring",
  openGraph: {
    title: "EV-SIM",
    description: "Interactive EV charging simulation with OCPP 2.0.1 protocol monitoring",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
