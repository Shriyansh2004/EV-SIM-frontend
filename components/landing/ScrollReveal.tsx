"use client";

import clsx from "clsx";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const { ref, visible, style } = useScrollReveal<HTMLDivElement>(delay);

  return (
    <div
      ref={ref}
      className={clsx("scroll-reveal", visible && "is-visible", className)}
      style={style}
    >
      {children}
    </div>
  );
}
