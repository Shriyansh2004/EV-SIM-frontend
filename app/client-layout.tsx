"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  Zap,
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
            "h-full bg-surface border-r border-border flex flex-col transition-[width] duration-sidebar ease-out",
            collapsed ? "w-[68px]" : "w-60"
          )}
        >
          <div
            className={clsx(
              "border-b border-border-subtle flex items-center",
              collapsed ? "px-3 py-4 justify-center" : "px-4 py-4"
            )}
          >
            <div
              className={clsx(
                "flex items-center min-w-0",
                collapsed ? "justify-center" : "gap-2.5"
              )}
            >
              <div className="w-8 h-8 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-accent" />
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <h1 className="font-semibold text-white text-sm leading-tight">EV-SIM</h1>
                  <p className="text-[11px] text-muted leading-tight mt-0.5">OCPP 2.0.1</p>
                </div>
              )}
            </div>
          </div>

          <nav className={clsx("flex-1 py-3", collapsed ? "px-2 space-y-1" : "px-3 space-y-0.5")}>
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  title={collapsed ? label : undefined}
                  className={clsx(
                    "flex items-center rounded-md text-sm transition-colors",
                    collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2",
                    active
                      ? "bg-surface-raised text-white border border-border"
                      : "text-muted hover:text-white hover:bg-surface-raised/60 border border-transparent"
                  )}
                >
                  <Icon
                    className={clsx(
                      "shrink-0",
                      collapsed ? "w-[18px] h-[18px]" : "w-4 h-4",
                      active && "text-accent"
                    )}
                  />
                  {!collapsed && <span>{label}</span>}
                </Link>
              );
            })}
          </nav>

          <div
            className={clsx(
              "border-t border-border-subtle",
              collapsed ? "p-3 flex justify-center" : "p-4"
            )}
          >
            <LiveIndicator connected={wsConnected} compact={collapsed} />
          </div>
        </aside>

        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute top-[18px] left-full -translate-x-1/2 z-20 flex items-center justify-center w-7 h-7 rounded-full bg-background border border-border text-muted hover:text-white hover:border-accent/40 shadow-card transition-colors"
        >
          {collapsed ? (
            <PanelLeft className="w-3.5 h-3.5" />
          ) : (
            <PanelLeftClose className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 max-w-[1400px]">{children}</div>
      </main>
    </div>
  );
}
