import { notFound, redirect } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPrevNext } from "@/components/docs/DocsPrevNext";
import { DocsTableOfContents } from "@/components/docs/DocsTableOfContents";
import { mdxComponents } from "@/components/docs/mdx/mdx-components";
import {
  getAdjacentDocs,
  getAllDocSlugs,
  getBreadcrumb,
  getDefaultDocSlug,
  getDocBySlug,
  extractHeadings,
} from "@/lib/docs/content";

interface PageProps {
  params: { slug?: string[] };
}

export function generateStaticParams() {
  return getAllDocSlugs().map((slug) => ({ slug: slug.split("/") }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const slug = params.slug?.join("/") ?? getDefaultDocSlug();
  const doc = getDocBySlug(slug);
  if (!doc) return { title: "Learn" };
  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
  };
}

export default function LearnDocPage({ params }: PageProps) {
  if (!params.slug || params.slug.length === 0) {
    redirect(`/learn/${getDefaultDocSlug()}`);
  }

  const slug = params.slug.join("/");
  const doc = getDocBySlug(slug);
  if (!doc) notFound();

  const headings = extractHeadings(doc.content);
  const { prev, next } = getAdjacentDocs(slug);
  const crumbs = getBreadcrumb(slug);

  return (
    <div className="docs-main flex flex-1 min-w-0">
      <article key={slug} className="docs-article flex-1 min-w-0 px-4 sm:px-8 lg:px-10 py-8 max-w-[720px] mx-auto w-full docs-fade-in">
        <DocsBreadcrumb crumbs={crumbs} />
        <header className="docs-article-header mb-8">
          <h1 className="docs-h1 font-lp-display text-3xl font-bold text-lp-grey-900 tracking-tight">
            {doc.frontmatter.title}
          </h1>
          <p className="mt-3 text-base text-lp-grey-600 leading-relaxed">
            {doc.frontmatter.description}
          </p>
        </header>

        <DocsTableOfContents headings={headings} variant="mobile" />

        <div className="docs-prose">
          <MDXRemote source={doc.content} components={mdxComponents} />
        </div>

        <DocsPrevNext prev={prev} next={next} />
      </article>

      <div className="hidden xl:block w-60 shrink-0 pr-6 py-8">
        <DocsTableOfContents headings={headings} variant="desktop" />
      </div>
    </div>
  );
}
