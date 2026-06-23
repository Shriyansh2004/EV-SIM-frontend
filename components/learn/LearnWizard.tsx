"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";
import { useInitialData } from "@/hooks/useInitialData";
import { useAppStore } from "@/store";

const WIZARD_STEPS = [
  {
    title: "Step 1: Create a Virtual Charger",
    action: "Create a charger from the Chargers page with any ID (e.g. CP-DEMO)",
  },
  {
    title: "Step 2: Connect to CSMS",
    action: "Click Connect — the charger sends BootNotification to register",
  },
  {
    title: "Step 3: Observe BootNotification",
    action: "Check OCPP Explorer — you'll see BootNotification request and Accepted response",
  },
  {
    title: "Step 4: Remote Start",
    action: "Use Remote Start on the charger detail page to begin a session",
  },
  {
    title: "Step 5: Watch TransactionEvent",
    action: "See TransactionEvent (Started) → MeterValues (Updated) → TransactionEvent (Ended)",
  },
];

export function LearnWizard() {
  useInitialData();
  const chargers = useAppStore((s) => s.chargers);
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardLog, setWizardLog] = useState<string[]>([]);

  async function runWizardAction() {
    const step = WIZARD_STEPS[wizardStep];
    setWizardLog((l) => [...l, `▶ ${step.title}`]);

    if (wizardStep === 0 && chargers.length === 0) {
      try {
        await apiPost("/api/chargers", {
          id: "CP-DEMO",
          max_power_kw: 22,
          connector_count: 1,
        });
        setWizardLog((l) => [...l, "✓ Created charger CP-DEMO"]);
      } catch {
        setWizardLog((l) => [...l, "ℹ Charger may already exist"]);
      }
    } else if (wizardStep === 1) {
      const id = chargers[0]?.id || "CP-DEMO";
      try {
        await apiPost(`/api/chargers/${id}/connect`);
        setWizardLog((l) => [...l, `✓ Connected ${id} — BootNotification sent`]);
      } catch (e) {
        setWizardLog((l) => [...l, `✗ ${e instanceof Error ? e.message : "Failed"}`]);
      }
    } else {
      setWizardLog((l) => [...l, `ℹ ${step.action}`]);
    }

    if (wizardStep < WIZARD_STEPS.length - 1) {
      setWizardStep((s) => s + 1);
    }
  }

  return (
    <div className="docs-wizard my-8 rounded-xl border border-lp-grey-300 bg-lp-surface overflow-hidden">
      <div className="px-5 py-3 border-b border-lp-grey-300 bg-lp-grey-100/60">
        <h4 className="font-lp-display font-semibold text-sm text-lp-grey-900">
          Interactive: BootNotification Wizard
        </h4>
        <p className="text-xs text-lp-grey-600 mt-0.5">
          Walk through the OCPP handshake step by step
        </p>
      </div>
      <div className="p-5">
        <div className="rounded-lg border border-lp-grey-300 bg-lp-primary p-4 mb-4">
          <p className="text-sm font-lp-mono font-semibold text-lp-orange">
            {WIZARD_STEPS[wizardStep].title}
          </p>
          <p className="text-sm text-lp-grey-600 mt-1">{WIZARD_STEPS[wizardStep].action}</p>
        </div>
        <button
          type="button"
          onClick={runWizardAction}
          className="docs-btn-primary"
        >
          {wizardStep < WIZARD_STEPS.length - 1 ? "Next Step" : "Complete"}
        </button>
        {wizardLog.length > 0 && (
          <div className="mt-4 rounded-lg bg-lp-dark p-4 font-lp-mono text-xs text-emerald-400 space-y-1">
            {wizardLog.map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
