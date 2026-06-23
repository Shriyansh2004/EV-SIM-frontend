import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="panel shadow-card p-12 text-center max-w-md">
        <p className="text-5xl font-semibold text-matlab-orange mb-2">404</p>
        <h1 className="text-xl font-semibold text-ink mb-2">Page not found</h1>
        <p className="text-muted text-sm mb-6">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-4 py-2 rounded-matlab bg-matlab-blue text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
