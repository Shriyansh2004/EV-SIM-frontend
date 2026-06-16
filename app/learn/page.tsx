"use client";

import { useState } from "react";
import { SequenceDiagram } from "@/components/ocpp/SequenceDiagram";
import { apiPost } from "@/hooks/useInitialData";
import { useAppStore } from "@/store";

const SECTIONS = [
  {
    title: "What is OCPP?",
    content:
      "The Open Charge Point Protocol (OCPP) is the global standard for communication between EV charging stations (Charge Points) and central management systems (CSMS). It enables interoperability — any OCPP-compliant charger can connect to any OCPP-compliant backend.",
  },
  {
    title: "CSMS vs Charge Point",
    content:
      "The Charge Point (CP) is the physical or virtual EV charger at the location. The CSMS (Charging Station Management System) is the cloud backend that manages, monitors, and controls chargers remotely. OCPP defines the messages exchanged between them over WebSocket.",
  },
  {
    title: "OCPP 2.0.1 Key Changes",
    content:
      "OCPP 2.0.1 replaces StartTransaction/StopTransaction with unified TransactionEvent messages (Started/Updated/Ended). It adds device model management, improved security, and richer status reporting. EV-SIM simulates the full 2.0.1 message flow.",
  },
  {
    title: "Real-World Infrastructure",
    content:
      "A typical EV charging deployment includes: EV chargers (AC/DC), a CSMS (like CitrineOS), an operator portal, payment systems, and grid management. OCPP is the glue connecting chargers to the CSMS layer.",
  },
];

export default function LearnPage() {
  const chargers = useAppStore((s) => s.chargers);
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardLog, setWizardLog] = useState<string[]>([]);

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
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold text-white">EV Industry Education</h1>
        <p className="text-muted mt-1">Learn OCPP and EV charging infrastructure fundamentals</p>
      </div>

      <div className="space-y-4">
        {SECTIONS.map((s) => (
          <div key={s.title} className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-white font-medium mb-2">{s.title}</h2>
            <p className="text-muted text-sm leading-relaxed">{s.content}</p>
          </div>
        ))}
      </div>

      <SequenceDiagram />

      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-white font-medium mb-4">Interactive: BootNotification Wizard</h2>
        <p className="text-muted text-sm mb-4">
          Walk through the OCPP handshake step by step
        </p>
        <div className="bg-background rounded-lg p-4 mb-4 border border-border">
          <p className="text-accent text-sm font-medium">
            {WIZARD_STEPS[wizardStep].title}
          </p>
          <p className="text-muted text-sm mt-1">{WIZARD_STEPS[wizardStep].action}</p>
        </div>
        <button
          onClick={runWizardAction}
          className="px-4 py-2 bg-accent text-background rounded-lg text-sm font-medium hover:bg-accent/90"
        >
          {wizardStep < WIZARD_STEPS.length - 1 ? "Next Step" : "Complete"}
        </button>
        {wizardLog.length > 0 && (
          <div className="mt-4 font-mono text-xs text-green-400 bg-background rounded-lg p-4 border border-border space-y-1">
            {wizardLog.map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
