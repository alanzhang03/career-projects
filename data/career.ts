// Types for the project log, plus the starting content. Once you save anything
// from /admin, the stored copy (see lib/store.ts) is used instead of this seed.

export const STATUSES = ["Shipped", "In progress", "Maintained", "Paused"] as const;

export type Project = {
  slug: string;
  title: string;
  /** One-line summary shown in the project list. */
  summary: string;
  /** e.g. "Jun 2025 – Sep 2025" */
  period?: string;
  status?: (typeof STATUSES)[number];
  stack?: string[];
  /** Measurable outcomes — the stuff worth saying out loud in a 1:1. */
  impact?: string[];
  problem?: string;
  approach?: string;
  challenges?: string[];
  /** Who you worked with / who it was for. */
  collaborators?: string;
  links?: { label: string; url: string }[];
  /** Private talking points: what you'd do next, open questions, asks. */
  notes?: string[];
};

export type Company = {
  slug: string;
  name: string;
  role: string;
  start: string;
  /** Omit while still there. */
  end?: string;
  location?: string;
  logo?: string;
  /** Set for dark/black logos so they're inverted in dark mode. */
  invertLogoInDark?: boolean;
  url?: string;
  blurb?: string;
  projects: Project[];
};

export const companies: Company[] = [
  {
    slug: "visa",
    name: "Visa",
    role: "Software Engineer",
    start: "Sep 2026",
    logo: "/visa.svg",
    url: "https://www.visa.com/",
    projects: [],
  },
  {
    slug: "toll-brothers",
    name: "Toll Brothers",
    role: "Software Engineer",
    start: "May 2025",
    end: "Sep 2026",
    location: "Fort Washington, PA",
    logo: "/tollBrothers.svg",
    invertLogoInDark: true,
    url: "https://www.tollbrothers.com/",
    projects: [
      {
        slug: "survey-qa-platform",
        title: "LLM-powered land survey QA platform",
        summary:
          "Automated compliance analysis for land survey submissions using LLMs.",
        status: "Shipped",
        stack: ["TypeScript", "Python", "AWS Bedrock", "Lambda", "S3"],
        impact: [
          "Saves ~2 hours per submission",
          "Covers 5–10 nationwide reviews per day",
        ],
      },
      {
        slug: "ai-code-review-pipeline",
        title: "AI code review pipeline",
        summary:
          "CI/CD-integrated reviewer (Claude Sonnet) that reconstructs full file context from unified diffs and posts inline PR comments.",
        status: "Shipped",
        stack: ["Node.js", "Claude Sonnet", "CI/CD"],
        impact: ["Cuts ~30 minutes of review time per PR"],
      },
      {
        slug: "pdf-batch-ingestion",
        title: "PDF batch ingestion CLI",
        summary:
          "Node.js CLI orchestrating uploads across CMS, S3, and Workfront APIs.",
        status: "Shipped",
        stack: ["Node.js", "S3", "Workfront API"],
        impact: [
          "Replaced a week-long manual process",
          "Saves 100+ hours per batch",
        ],
      },
      {
        slug: "print-view",
        title: "Print View document generation",
        summary:
          "Reusable server-side system generating dynamic community brochures with listing data, QR codes, and configurable filtering.",
        status: "Shipped",
        stack: ["Next.js", "TypeScript"],
        impact: ["Used by thousands of users monthly"],
      },
      {
        slug: "competitor-data-pipeline",
        title: "Competitor data pipeline",
        summary:
          "Serverless pipeline aggregating 4 competitors' undocumented APIs into a unified, SQL-queryable warehouse.",
        status: "Shipped",
        stack: ["AWS CDK", "Lambda", "Glue", "Athena", "EventBridge"],
        impact: ["4 data sources unified", "Zero operational maintenance"],
      },
    ],
  },
];
