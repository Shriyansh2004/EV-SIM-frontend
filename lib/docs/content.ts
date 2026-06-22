import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { DOC_CATEGORIES, getCategoryLabel } from "./categories";
import type {
  DocFrontmatter,
  DocHeading,
  DocNavCategory,
  DocPage,
  DocSearchEntry,
} from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content", "learn");

function slugFromPath(relativePath: string): string {
  return relativePath.replace(/\.mdx$/, "").replace(/\\/g, "/");
}

function hrefFromSlug(slug: string): string {
  return `/learn/${slug}`;
}

function walkMdxFiles(dir: string, base = ""): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMdxFiles(full, rel));
    } else if (entry.name.endsWith(".mdx")) {
      files.push(rel);
    }
  }

  return files;
}

function parseDoc(relativePath: string): DocPage {
  const fullPath = path.join(CONTENT_DIR, relativePath);
  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(raw);
  const slug = slugFromPath(relativePath);

  return {
    slug,
    href: hrefFromSlug(slug),
    frontmatter: data as DocFrontmatter,
    content,
  };
}

export function getAllDocs(): DocPage[] {
  return walkMdxFiles(CONTENT_DIR)
    .map(parseDoc)
    .sort((a, b) => {
      const catOrder =
        (DOC_CATEGORIES.find((c) => c.id === a.frontmatter.category)?.order ?? 99) -
        (DOC_CATEGORIES.find((c) => c.id === b.frontmatter.category)?.order ?? 99);
      if (catOrder !== 0) return catOrder;
      return a.frontmatter.order - b.frontmatter.order;
    });
}

export function getDocBySlug(slug: string): DocPage | null {
  const relativePath = `${slug}.mdx`;
  const fullPath = path.join(CONTENT_DIR, relativePath);
  if (!fs.existsSync(fullPath)) return null;
  return parseDoc(relativePath);
}

export function getAllDocSlugs(): string[] {
  return getAllDocs().map((d) => d.slug);
}

export function buildNavTree(): DocNavCategory[] {
  const docs = getAllDocs();
  const byCategory = new Map<string, DocNavCategory>();

  for (const cat of DOC_CATEGORIES) {
    byCategory.set(cat.id, {
      id: cat.id,
      label: cat.label,
      order: cat.order,
      items: [],
    });
  }

  for (const doc of docs) {
    const cat = byCategory.get(doc.frontmatter.category);
    if (!cat) continue;
    cat.items.push({
      slug: doc.slug,
      href: doc.href,
      title: doc.frontmatter.title,
      order: doc.frontmatter.order,
    });
  }

  return Array.from(byCategory.values())
    .map((cat) => ({
      ...cat,
      items: cat.items.sort((a, b) => a.order - b.order),
    }))
    .filter((cat) => cat.items.length > 0)
    .sort((a, b) => a.order - b.order);
}

export function getAdjacentDocs(slug: string): {
  prev: DocPage | null;
  next: DocPage | null;
} {
  const docs = getAllDocs();
  const idx = docs.findIndex((d) => d.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? docs[idx - 1] : null,
    next: idx < docs.length - 1 ? docs[idx + 1] : null,
  };
}

export function getDefaultDocSlug(): string {
  const docs = getAllDocs();
  return docs[0]?.slug ?? "getting-started/what-is-ev-sim";
}

export function extractHeadings(content: string): DocHeading[] {
  const headings: DocHeading[] = [];
  const lines = content.split("\n");

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (!match) continue;
    const level = match[1].length as 2 | 3;
    const text = match[2].replace(/[*_`]/g, "").trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    headings.push({ id, text, level });
  }

  return headings;
}

export function buildSearchIndex(): DocSearchEntry[] {
  return getAllDocs().map((doc) => {
    const headings = extractHeadings(doc.content).map((h) => h.text);
    const body = doc.content
      .replace(/^---[\s\S]*?---/, "")
      .replace(/[#*`_~\[\]()]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return {
      slug: doc.slug,
      href: doc.href,
      title: doc.frontmatter.title,
      description: doc.frontmatter.description,
      category: doc.frontmatter.category,
      categoryLabel: getCategoryLabel(doc.frontmatter.category),
      headings,
      body,
    };
  });
}

export function getBreadcrumb(slug: string): { label: string; href?: string }[] {
  const doc = getDocBySlug(slug);
  if (!doc) return [{ label: "Learn" }];

  return [
    { label: "Learn", href: getDefaultDocHref() },
    { label: getCategoryLabel(doc.frontmatter.category) },
    { label: doc.frontmatter.title },
  ];
}

export function getDefaultDocHref(): string {
  return hrefFromSlug(getDefaultDocSlug());
}
