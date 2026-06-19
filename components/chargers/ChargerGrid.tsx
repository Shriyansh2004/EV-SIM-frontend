import Link from "next/link";
import { Plus, Plug } from "lucide-react";
import { ChargerCard } from "./ChargerCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { VirtualCharger } from "@/types";

export function ChargerGrid({ chargers }: { chargers: VirtualCharger[] }) {
  if (chargers.length === 0) {
    return (
      <EmptyState
        icon={Plug}
        title="No virtual chargers yet"
        description="Add one from the Chargers page to start simulating."
        className="simulink-canvas py-14"
      >
        <Link
          href="/chargers"
          className="matlab-btn-primary inline-flex items-center gap-1.5 text-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Add charger
        </Link>
      </EmptyState>
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
