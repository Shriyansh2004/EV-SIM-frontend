import Link from "next/link";
import { Plus } from "lucide-react";
import { ChargerCard } from "./ChargerCard";
import type { VirtualCharger } from "@/types";

export function ChargerGrid({ chargers }: { chargers: VirtualCharger[] }) {
  if (chargers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center simulink-canvas">
        <p className="text-sm text-muted max-w-xs leading-relaxed">
          No virtual chargers yet. Add one from the Chargers page to start simulating.
        </p>
        <Link
          href="/chargers"
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-matlab-blue hover:text-[#005a94] transition-colors font-mono"
        >
          <Plus className="w-3.5 h-3.5" />
          Add charger
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {chargers.map((c) => (
        <ChargerCard key={c.id} charger={c} />
      ))}
    </div>
  );
}
