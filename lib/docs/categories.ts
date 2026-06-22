import type { LucideIcon } from "lucide-react";
import {
  Rocket,
  Zap,
  Radio,
  Network,
  Wrench,
  BookMarked,
} from "lucide-react";

export interface DocCategory {
  id: string;
  label: string;
  icon: LucideIcon;
  order: number;
}

export const DOC_CATEGORIES: DocCategory[] = [
  { id: "getting-started", label: "Getting Started", icon: Rocket, order: 1 },
  {
    id: "ev-charging-fundamentals",
    label: "EV Charging Fundamentals",
    icon: Zap,
    order: 2,
  },
  { id: "the-ocpp-protocol", label: "The OCPP Protocol", icon: Radio, order: 3 },
  {
    id: "csms-system-architecture",
    label: "CSMS & System Architecture",
    icon: Network,
    order: 4,
  },
  { id: "using-ev-sim", label: "Using EV-SIM", icon: Wrench, order: 5 },
  { id: "reference", label: "Reference", icon: BookMarked, order: 6 },
];

export function getCategoryLabel(id: string): string {
  return DOC_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
