import type { LucideIcon } from "lucide-react";
import {
  Rocket,
  Zap,
  Radio,
  Network,
  Wrench,
  BookMarked,
} from "lucide-react";
import { content } from "@/lib/content";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Rocket,
  Zap,
  Radio,
  Network,
  Wrench,
  BookMarked,
};

export interface DocCategory {
  id: string;
  label: string;
  icon: LucideIcon;
  order: number;
}

export const DOC_CATEGORIES: DocCategory[] = content.learn.categories.map((category) => ({
  id: category.id,
  label: category.label,
  icon: CATEGORY_ICONS[category.icon] ?? BookMarked,
  order: category.order,
}));

export function getCategoryLabel(id: string): string {
  return DOC_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
