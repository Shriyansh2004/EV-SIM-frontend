"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useAppStore } from "@/store";
import { EvStatusBadge } from "@/components/evs/EvStatusBadge";
import { EvBatteryPanel } from "@/components/evs/EvBatteryPanel";
import { EvSocChart } from "@/components/evs/EvSocChart";
import { EvPlugPanel } from "@/components/evs/EvPlugPanel";
import { EvChargeControls } from "@/components/evs/EvChargeControls";
import { ArrowLeft } from "lucide-react";

export default function EvDetailPage() {
  const params = useParams();
  const evId = params.id as string;
  const ev = useAppStore((s) => s.evs.find((e) => e.id === evId));
  const chargers = useAppStore((s) => s.chargers);

  if (!ev) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">EV not found</p>
        <Link href="/evs" className="text-matlab-blue text-sm mt-2 inline-block font-mono">
          ← Back to EVs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/evs" className="text-muted hover:text-ink matlab-btn p-1.5">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="page-title font-mono">{ev.id}</h1>
          <div className="flex items-center gap-3 mt-1">
            <EvStatusBadge status={ev.status} />
            <span className="text-muted text-sm">
              {ev.vendor} {ev.model}
            </span>
            <span className="text-muted text-xs font-mono">{ev.evType}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <EvSocChart ev={ev} />
          <EvChargeControls ev={ev} />
          <EvPlugPanel ev={ev} chargers={chargers} />
        </div>
        <div>
          <EvBatteryPanel ev={ev} />
        </div>
      </div>
    </div>
  );
}
