"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import clsx from "clsx";

export function CodeBlock({
  children,
  className,
  title,
}: {
  children: string;
  className?: string;
  title?: string;
}) {
  const [copied, setCopied] = useState(false);
  const langMatch = className?.match(/language-(\w+)/);
  const label = title ?? (langMatch ? langMatch[1].toUpperCase() : "Code");
  const code = String(children).replace(/\n$/, "");

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="docs-code-block group relative my-6">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
        <span className="text-[11px] font-lp-mono font-medium text-white/50 uppercase tracking-wide">
          {label}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-lp-orange transition-colors rounded-md px-2 py-1"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="docs-inline-code font-lp-mono text-[0.875em] px-1.5 py-0.5 rounded-md bg-lp-grey-100 text-lp-grey-900">
      {children}
    </code>
  );
}
