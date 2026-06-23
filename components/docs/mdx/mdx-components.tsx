import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { Callout } from "./Callout";
import { CodeBlock, InlineCode } from "./CodeBlock";
import { InlineOcppDiagram } from "./InlineOcppDiagram";
import { LearnWizard } from "@/components/learn/LearnWizard";
import { SystemArchitectureDiagram } from "@/components/learn/SystemArchitectureDiagram";
import { OcppCommunicationDiagram } from "@/components/learn/OcppCommunicationDiagram";
import { ChargingWorkflowDiagram } from "@/components/learn/ChargingWorkflowDiagram";
import { DataMonitoringDiagram } from "@/components/learn/DataMonitoringDiagram";
import { SequenceDiagram } from "@/components/ocpp/SequenceDiagram";

function createHeading(level: 2 | 3 | 4) {
  const Tag = `h${level}` as "h2" | "h3" | "h4";
  return function Heading({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    const text = typeof children === "string" ? children : String(children);
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    return (
      <Tag id={id} className={`docs-h${level}`} {...props}>
        {children}
      </Tag>
    );
  };
}

export const mdxComponents: MDXComponents = {
  h1: () => null,
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  p: (props) => <p className="docs-p" {...props} />,
  ul: (props) => <ul className="docs-ul" {...props} />,
  ol: (props) => <ol className="docs-ol" {...props} />,
  li: (props) => <li className="docs-li" {...props} />,
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith("http");
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="docs-link" {...props}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href ?? "#"} className="docs-link" {...props}>
        {children}
      </Link>
    );
  },
  strong: (props) => <strong className="font-semibold text-lp-grey-900" {...props} />,
  code: ({ children, className }) => {
    if (className) {
      return <CodeBlock className={className}>{String(children)}</CodeBlock>;
    }
    return <InlineCode>{children}</InlineCode>;
  },
  pre: ({ children }) => <>{children}</>,
  table: (props) => (
    <div className="docs-table-wrap my-8 overflow-x-auto rounded-xl border border-lp-grey-300">
      <table className="docs-table w-full text-sm" {...props} />
    </div>
  ),
  thead: (props) => <thead className="docs-thead" {...props} />,
  tbody: (props) => <tbody {...props} />,
  tr: (props) => <tr className="docs-tr" {...props} />,
  th: (props) => <th className="docs-th" {...props} />,
  td: (props) => <td className="docs-td" {...props} />,
  Callout,
  InlineOcppDiagram,
  LearnWizard,
  SystemArchitectureDiagram,
  OcppCommunicationDiagram,
  ChargingWorkflowDiagram,
  DataMonitoringDiagram,
  SequenceDiagram,
};
