import { ChargerCard } from "./ChargerCard";
import type { VirtualCharger } from "@/types";

export function ChargerGrid({ chargers }: { chargers: VirtualCharger[] }) {
  if (chargers.length === 0) {
    return (
      <div className="text-center py-12 text-muted border border-dashed border-border rounded-xl">
        No virtual chargers yet. Create one from the Chargers page.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {chargers.map((c) => (
        <ChargerCard key={c.id} charger={c} />
      ))}
    </div>
  );
}
