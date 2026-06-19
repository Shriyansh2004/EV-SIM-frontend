"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  Plug,
  Car,
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
  { href: "/evs", label: "Electric Vehicles", icon: Car },
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
    <div className="app-shell">
      <div className="relative shrink-0 sticky top-3 h-[calc(100dvh-1.5rem)] self-start">
        <aside
          className={clsx(
            "app-sidebar h-full flex flex-col transition-[width] duration-sidebar ease-out",
            collapsed ? "w-[68px]" : "w-60"
          )}
        >
          <div
            className={clsx(
              "app-sidebar-header flex items-center shrink-0",
              collapsed ? "px-2.5 py-3.5 justify-center" : "px-4 py-3.5"
            )}
          >
            <div
              className={clsx(
                "flex items-center min-w-0",
                collapsed ? "justify-center" : "gap-3"
              )}
            >
              <div className="w-9 h-9 shrink-0 rounded-matlab bg-white border border-border shadow-matlab-btn flex items-center justify-center transition-transform duration-200 hover:scale-[1.03]">
                <Image
                  src="/logo.png"
                  alt="EV-SIM"
                  width={28}
                  height={28}
                  className="w-7 h-7 object-contain"
                  priority
                />
              </div>
              {!collapsed && (
                <div className="min-w-0 animate-fade-in">
                  <h1 className="app-sidebar-brand">EV-SIM</h1>
                  <p className="app-sidebar-version">OCPP 2.0.1</p>
                </div>
              )}
            </div>
          </div>

          <nav
            className={clsx(
              "flex-1 overflow-y-auto py-3",
              collapsed ? "px-2 space-y-0.5" : "px-2.5 space-y-0.5"
            )}
          >
            {!collapsed && (
              <p className="app-sidebar-section-label">Navigation</p>
            )}
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  title={collapsed ? label : undefined}
                  className={clsx(
                    "app-sidebar-nav-link group",
                    collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2",
                    active
                      ? "app-sidebar-nav-link-active"
                      : "app-sidebar-nav-link-inactive"
                  )}
                >
                  <Icon
                    className={clsx(
                      "shrink-0 transition-colors",
                      collapsed ? "w-[18px] h-[18px]" : "w-4 h-4",
                      active ? "text-matlab-blue" : "text-white group-hover:text-white"
                    )}
                  />
                  {!collapsed && <span>{label}</span>}
                </Link>
              );
            })}
          </nav>

          <div
            className={clsx(
              "app-sidebar-footer shrink-0",
              collapsed ? "p-3 flex justify-center" : "px-3 py-3"
            )}
          >
            <LiveIndicator connected={wsConnected} compact={collapsed} variant="sidebar" />
          </div>
        </aside>

        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute top-[20px] left-full -translate-x-1/2 z-20 flex items-center justify-center w-7 h-7 rounded-matlab bg-white border border-border text-matlab-orange shadow-matlab-btn hover:bg-surface-raised hover:shadow-card-hover active:shadow-inset transition-all duration-150"
        >
          {collapsed ? (
            <PanelLeft className="w-3.5 h-3.5" />
          ) : (
            <PanelLeftClose className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      <main className="flex-1 min-w-0 overflow-auto app-main">
        <div className="p-6 lg:p-8 max-w-[1400px] mx-auto animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
