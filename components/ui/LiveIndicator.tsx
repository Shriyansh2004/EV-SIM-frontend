import clsx from "clsx";

export function LiveIndicator({
  connected,
  compact = false,
}: {
  connected: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={clsx("flex items-center", compact ? "justify-center" : "gap-2")}
      title={compact ? (connected ? "Live" : "Disconnected") : undefined}
    >
      <span
        className={clsx(
          "rounded-full shrink-0",
          compact ? "w-2.5 h-2.5" : "w-2 h-2",
          connected ? "bg-accent" : "bg-error"
        )}
      />
      {!compact && (
        <span className="text-xs text-muted">
          {connected ? "Live connection" : "Disconnected"}
        </span>
      )}
    </div>
  );
}
