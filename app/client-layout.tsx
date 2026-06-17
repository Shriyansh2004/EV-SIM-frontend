"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  Plug,
  Activity,
  Radio,
  BookOpen,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
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
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <div className="relative shrink-0">
        <aside
          className={clsx(
            "h-full bg-title-bar border-r border-border flex flex-col transition-[width] duration-sidebar ease-out shadow-card",
            collapsed ? "w-[68px]" : "w-60"
          )}
        >
          <div
            className={clsx(
              "border-b border-border bg-surface flex items-center",
              collapsed ? "px-3 py-3 justify-center" : "px-4 py-3"
            )}
          >
            <div
              className={clsx(
                "flex items-center min-w-0",
                collapsed ? "justify-center" : "gap-2.5"
              )}
            >
              <Image
                src="/logo.png"
                alt="EV-SIM"
                width={32}
                height={32}
                className="w-8 h-8 shrink-0 object-contain"
                priority
              />
              {!collapsed && (
                <div className="min-w-0">
                  <h1 className="font-semibold text-ink text-sm leading-tight">EV-SIM</h1>
                  <p className="text-[10px] text-muted leading-tight mt-0.5 font-mono">
                    OCPP 2.0.1 
                  </p>
                </div>
              )}
            </div>
          </div>

          <nav className={clsx("flex-1 py-2", collapsed ? "px-2 space-y-0.5" : "px-2 space-y-0.5")}>
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  title={collapsed ? label : undefined}
                  className={clsx(
                    "flex items-center rounded-matlab text-sm transition-colors border",
                    collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2",
                    active
                      ? "bg-white text-ink border-border shadow-matlab-btn border-l-[3px] border-l-matlab-blue"
                      : "text-muted hover:text-ink hover:bg-white/70 border-transparent"
                  )}
                >
                  <Icon
                    className={clsx(
                      "shrink-0",
                      collapsed ? "w-[18px] h-[18px]" : "w-4 h-4",
                      active && "text-matlab-blue"
                    )}
                  />
                  {!collapsed && <span className="text-[13px]">{label}</span>}
                </Link>
              );
            })}
          </nav>

          <div
            className={clsx(
              "border-t border-border bg-surface",
              collapsed ? "p-3 flex justify-center" : "p-3"
            )}
          >
            <LiveIndicator connected={wsConnected} compact={collapsed} />
          </div>
        </aside>

        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute top-[18px] left-full -translate-x-1/2 z-20 flex items-center justify-center w-7 h-7 rounded-matlab bg-white border border-border text-muted hover:text-ink hover:border-matlab-blue shadow-matlab-btn transition-colors"
        >
          {collapsed ? (
            <PanelLeft className="w-3.5 h-3.5" />
          ) : (
            <PanelLeftClose className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      <main className="flex-1 overflow-auto bg-background">
        <div className="p-6 lg:p-8 max-w-[1400px]">{children}</div>
      </main>
    </div>
  );
}
