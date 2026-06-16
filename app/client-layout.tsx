"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Zap, LayoutDashboard, Plug, Activity, Radio, BookOpen } from "lucide-react";
import { useOcppWebSocket } from "@/hooks/useOcppWebSocket";
import { useInitialData } from "@/hooks/useInitialData";
import { LiveIndicator } from "@/components/ui/LiveIndicator";
import { useAppStore } from "@/store";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chargers", label: "Chargers", icon: Plug },
  { href: "/sessions", label: "Sessions", icon: Activity },
  { href: "/ocpp-explorer", label: "OCPP Explorer", icon: Radio },
  { href: "/learn", label: "Learn", icon: BookOpen },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useOcppWebSocket();
  useInitialData();
  const pathname = usePathname();
  const wsConnected = useAppStore((s) => s.wsConnected);

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-surface border-r border-border flex flex-col shrink-0">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-accent" />
            <div>
              <h1 className="font-semibold text-white text-sm">EV-SIM</h1>
              <p className="text-xs text-muted">OCPP 2.0.1</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                pathname === href
                  ? "bg-accent/10 text-accent"
                  : "text-muted hover:text-white hover:bg-background"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <LiveIndicator connected={wsConnected} />
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
