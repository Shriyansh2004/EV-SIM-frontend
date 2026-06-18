import clsx from "clsx";

export function LiveIndicator({
  connected,
  compact = false,
  variant = "default",
}: {
  connected: boolean;
  compact?: boolean;
  variant?: "default" | "sidebar";
}) {
  const isSidebar = variant === "sidebar";

  return (
    <div
      className={clsx("flex items-center", compact ? "justify-center" : "gap-2")}
      title={compact ? (connected ? "Simulation running" : "Disconnected") : undefined}
    >
      <span
        className={clsx(
          "rounded-full shrink-0 border",
          compact ? "w-2.5 h-2.5" : "w-2 h-2",
          connected
            ? "bg-matlab-green border-matlab-green/60"
            : "bg-matlab-red border-matlab-red/60",
          isSidebar && "ring-2 ring-white/20"
        )}
      />
      {!compact && (
        <span
          className={clsx(
            isSidebar ? "app-sidebar-status" : "text-[11px] font-mono text-muted"
          )}
        >
          {connected ? "sim: running" : "sim: stopped"}
        </span>
      )}
    </div>
  );
}
