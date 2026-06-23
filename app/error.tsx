"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="panel shadow-card p-12 text-center max-w-md">
        <p className="text-5xl font-semibold text-error mb-2">Error</p>
        <h1 className="text-xl font-semibold text-ink mb-2">Something went wrong</h1>
        <p className="text-muted text-sm mb-6">
          An unexpected error occurred. You can try again or return to the dashboard.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center px-4 py-2 rounded-matlab bg-matlab-blue text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center px-4 py-2 rounded-matlab border border-border text-sm font-medium hover:bg-surface-raised transition-colors"
          >
            Go to dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
