export interface DocFrontmatter {
  title: string;
  description: string;
  category: string;
  order: number;
}

export interface DocPage {
  slug: string;
  href: string;
  frontmatter: DocFrontmatter;
  content: string;
}

export interface DocNavItem {
  slug: string;
  href: string;
  title: string;
  order: number;
}

export interface DocNavCategory {
  id: string;
  label: string;
  order: number;
  items: DocNavItem[];
}

export interface DocSearchEntry {
  slug: string;
  href: string;
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  headings: string[];
  body: string;
}

export interface DocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}
