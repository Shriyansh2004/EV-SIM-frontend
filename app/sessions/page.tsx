"use client";

import { useState } from "react";
import { useAppStore } from "@/store";
import { PageHeader } from "@/components/ui/PageHeader";
import { SessionTable } from "@/components/sessions/SessionTable";
import { SessionDetailModal } from "@/components/sessions/SessionDetailModal";
import { EnergyBarChart } from "@/components/charts/EnergyBarChart";
import type { Session } from "@/types";
import { content } from "@/lib/content";

export default function SessionsPage() {
  const page = content.appPages.sessions;
  const sessions = useAppStore((s) => s.sessions);
  const [selected, setSelected] = useState<Session | null>(null);

  return (
    <div className="space-y-8">
      <PageHeader
        title={page.title}
        description={page.description}
      />

      <EnergyBarChart sessions={sessions} />
      <SessionTable sessions={sessions} onSelect={setSelected} />

      {selected && (
        <SessionDetailModal session={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
