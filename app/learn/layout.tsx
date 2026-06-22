import { DocsShell } from "@/components/docs/DocsShell";
import { buildNavTree, buildSearchIndex } from "@/lib/docs/content";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  const nav = buildNavTree();
  const searchIndex = buildSearchIndex();

  return (
    <DocsShell nav={nav} searchIndex={searchIndex}>
      {children}
    </DocsShell>
  );
}
