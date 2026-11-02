import { promises as fs } from "node:fs";
import path from "node:path";
import { Redis } from "@upstash/redis";
import { requireSignedIn } from "@/lib/auth";
import { companies as seed, type Company, type Project } from "@/data/career";

const KEY = "career:companies";
const LOCAL_FILE = path.join(process.cwd(), ".data", "career.json");

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token =
  process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

export const storageLabel = redis ? "Upstash Redis" : ".data/career.json";

type LegacyProject = Project & {
  approach?: string;
  challenges?: string[];
  collaborators?: string;
  stack?: string[];
};

function bullets(text?: string) {
  if (!text) return [];
  const parts = text.trim().startsWith("-")
    ? text.split(/(?:^|\s)-\s+/)
    : text.split("\n");
  return parts.map((s) => s.trim()).filter(Boolean);
}

function migrate(p: LegacyProject): Project {
  const decisions = [
    ...(p.decisions ?? []),
    ...bullets(p.approach),
    ...(p.challenges ?? []),
  ];
  const project: LegacyProject = {
    ...p,
    decisions: decisions.length ? decisions : undefined,
  };
  delete project.approach;
  delete project.challenges;
  delete project.collaborators;
  delete project.stack;
  return project;
}

async function load(): Promise<Company[]> {
  if (redis) return (await redis.get<Company[]>(KEY)) ?? seed;
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, "utf8"));
  } catch {
    return seed;
  }
}

export async function readCompanies(): Promise<Company[]> {
  return (await load()).map((c) => ({ ...c, projects: c.projects.map(migrate) }));
}

export async function getCompanies() {
  await requireSignedIn();
  return readCompanies();
}

export async function getCompany(slug: string) {
  return (await getCompanies()).find((c) => c.slug === slug);
}

export async function getProject(companySlug: string, projectSlug: string) {
  return (await getCompany(companySlug))?.projects.find(
    (p) => p.slug === projectSlug,
  );
}

export async function saveCompanies(companies: Company[]) {
  if (redis) {
    await redis.set(KEY, companies);
    return;
  }
  try {
    await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
    await fs.writeFile(LOCAL_FILE, JSON.stringify(companies, null, 2));
  } catch {
    throw new Error(
      "Couldn't save: no database is configured. Connect Upstash Redis (see README).",
    );
  }
}
