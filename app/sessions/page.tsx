"use client";

import { useState } from "react";
import { useAppStore } from "@/store";
import { PageHeader } from "@/components/ui/PageHeader";
import { SessionTable } from "@/components/sessions/SessionTable";
import { SessionDetailModal } from "@/components/sessions/SessionDetailModal";
import { EnergyBarChart } from "@/components/charts/EnergyBarChart";
import type { Session } from "@/types";

export default function SessionsPage() {
  const sessions = useAppStore((s) => s.sessions);
  const [selected, setSelected] = useState<Session | null>(null);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Session Monitor"
        description="Track all charging sessions and meter value history"
      />

      <EnergyBarChart sessions={sessions} />
      <SessionTable sessions={sessions} onSelect={setSelected} />

      {selected && (
        <SessionDetailModal session={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
