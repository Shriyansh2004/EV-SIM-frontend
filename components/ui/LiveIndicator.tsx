import clsx from "clsx";

export function LiveIndicator({ connected }: { connected: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className={clsx(
          "w-2 h-2 rounded-full",
          connected ? "bg-accent animate-pulse" : "bg-error"
        )}
      />
      <span className="text-muted">{connected ? "Live" : "Disconnected"}</span>
    </div>
  );
}
