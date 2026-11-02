export const STATUSES = ["Shipped", "In progress", "Maintained", "Paused"] as const;

export type Project = {
  slug: string;
  title: string;
  summary: string;
  period?: string;
  status?: (typeof STATUSES)[number];
  problem?: string;
  contributions?: string[];
  impact?: string[];
  decisions?: string[];
  initiative?: string[];
  links?: { label: string; url: string }[];
  notes?: string[];
};

export type Company = {
  slug: string;
  name: string;
  role: string;
  start: string;
  end?: string;
  location?: string;
  logo?: string;
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
        impact: ["Cuts ~30 minutes of review time per PR"],
      },
      {
        slug: "pdf-batch-ingestion",
        title: "PDF batch ingestion CLI",
        summary:
          "Node.js CLI orchestrating uploads across CMS, S3, and Workfront APIs.",
        status: "Shipped",
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
        impact: ["Used by thousands of users monthly"],
      },
      {
        slug: "competitor-data-pipeline",
        title: "Competitor data pipeline",
        summary:
          "Serverless pipeline aggregating 4 competitors' undocumented APIs into a unified, SQL-queryable warehouse.",
        status: "Shipped",
        impact: ["4 data sources unified", "Zero operational maintenance"],
      },
    ],
  },
];
