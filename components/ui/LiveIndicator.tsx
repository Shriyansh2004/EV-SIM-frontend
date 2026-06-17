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
      title={compact ? (connected ? "Simulation running" : "Disconnected") : undefined}
    >
      <span
        className={clsx(
          "rounded-matlab shrink-0 border",
          compact ? "w-2.5 h-2.5" : "w-2 h-2",
          connected
            ? "bg-matlab-green border-matlab-green/60"
            : "bg-matlab-red border-matlab-red/60"
        )}
      />
      {!compact && (
        <span className="text-[11px] text-muted font-mono">
          {connected ? "sim: running" : "sim: stopped"}
        </span>
      )}
    </div>
  );
}
