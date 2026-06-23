import { notFound, redirect } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPrevNext } from "@/components/docs/DocsPrevNext";
import { mdxComponents } from "@/components/docs/mdx/mdx-components";
import {
  getAdjacentDocs,
  getAllDocSlugs,
  getBreadcrumb,
  getDefaultDocSlug,
  getDocBySlug,
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

  const { prev, next } = getAdjacentDocs(slug);
  const crumbs = getBreadcrumb(slug);

  return (
    <article
      key={slug}
      className="docs-article flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-8 lg:py-10 max-w-5xl mx-auto w-full docs-fade-in"
    >
      <DocsBreadcrumb crumbs={crumbs} />
      <header className="docs-article-header mb-10">
        <h1 className="docs-h1 font-lp-display text-3xl sm:text-4xl font-bold text-lp-grey-900 tracking-tight">
          {doc.frontmatter.title}
        </h1>
        <p className="mt-4 text-lg text-lp-grey-600 leading-relaxed max-w-3xl">
          {doc.frontmatter.description}
        </p>
      </header>

      <div className="docs-prose">
        <MDXRemote source={doc.content} components={mdxComponents} />
      </div>

      <DocsPrevNext prev={prev} next={next} />
    </article>
  );
}
