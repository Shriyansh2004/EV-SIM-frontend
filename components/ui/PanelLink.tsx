import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface PanelLinkProps {
  href: string;
  label: string;
}

export function PanelLink({ href, label }: PanelLinkProps) {
  return (
    <Link href={href} className="panel-link group">
      {label}
      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
