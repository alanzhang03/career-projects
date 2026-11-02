"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, requireAdmin, signIn, signOut } from "@/lib/auth";
import { readCompanies, saveCompanies } from "@/lib/store";
import { STATUSES, type Company, type Project } from "@/data/career";

export type FormState = { error?: string };

// "new" is used in /admin URLs for create forms; "admin" would shadow /admin.
const RESERVED = ["new", "admin"];

function text(fd: FormData, key: string) {
  return String(fd.get(key) ?? "").trim() || undefined;
}

function list(fd: FormData, key: string, separator: string | RegExp = "\n") {
  const items = String(fd.get(key) ?? "")
    .split(separator)
    .map((s) => s.trim())
    .filter(Boolean);
  return items.length ? items : undefined;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function uniqueSlug(name: string, taken: string[]) {
  const base = slugify(name) || "untitled";
  let slug = base;
  for (let i = 2; taken.includes(slug) || RESERVED.includes(slug); i++) {
    slug = `${base}-${i}`;
  }
  return slug;
}

function done(path: string): never {
  revalidatePath("/", "layout");
  redirect(path);
}

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  if (!process.env.ADMIN_PASSWORD) {
    return { error: "ADMIN_PASSWORD isn't set on the server." };
  }
  if (!checkPassword(String(fd.get("password") ?? ""))) {
    return { error: "Wrong password." };
  }
  await signIn();
  redirect("/");
}

export async function logout() {
  await signOut();
  redirect("/login");
}

export async function saveCompany(
  _: FormState,
  fd: FormData,
): Promise<FormState> {
  await requireAdmin();
  const name = text(fd, "name");
  const role = text(fd, "role");
  const start = text(fd, "start");
  if (!name || !role || !start) {
    return { error: "Name, role and start date are required." };
  }

  const fields = {
    name,
    role,
    start,
    end: text(fd, "end"),
    location: text(fd, "location"),
    logo: text(fd, "logo"),
    invertLogoInDark: fd.get("invertLogoInDark") === "on" || undefined,
    url: text(fd, "url"),
    blurb: text(fd, "blurb"),
  };

  const companies = await readCompanies();
  const original = text(fd, "originalSlug");
  let slug: string;
  if (original) {
    const i = companies.findIndex((c) => c.slug === original);
    if (i === -1) return { error: "That company no longer exists." };
    companies[i] = { ...fields, slug: original, projects: companies[i].projects };
    slug = original;
  } else {
    slug = uniqueSlug(name, companies.map((c) => c.slug));
    // Newest role first, matching the home page order.
    companies.unshift({ ...fields, slug, projects: [] } satisfies Company);
  }

  try {
    await saveCompanies(companies);
  } catch (e) {
    return { error: (e as Error).message };
  }
  done(`/${slug}`);
}

export async function deleteCompany(slug: string) {
  await requireAdmin();
  const companies = await readCompanies();
  await saveCompanies(companies.filter((c) => c.slug !== slug));
  done("/admin");
}

export async function saveProject(
  _: FormState,
  fd: FormData,
): Promise<FormState> {
  await requireAdmin();
  const title = text(fd, "title");
  const summary = text(fd, "summary");
  if (!title || !summary) return { error: "Title and summary are required." };

  const status = text(fd, "status");
  const fields = {
    title,
    summary,
    period: text(fd, "period"),
    status: STATUSES.find((s) => s === status),
    stack: list(fd, "stack", ","),
    impact: list(fd, "impact"),
    problem: text(fd, "problem"),
    approach: text(fd, "approach"),
    challenges: list(fd, "challenges"),
    collaborators: text(fd, "collaborators"),
    links: list(fd, "links")?.map((line) => {
      const [label, url] = line.includes("|")
        ? line.split("|").map((s) => s.trim())
        : [line, line];
      return { label, url };
    }),
    notes: list(fd, "notes"),
  };

  const companies = await readCompanies();
  const company = companies.find((c) => c.slug === text(fd, "companySlug"));
  if (!company) return { error: "That company no longer exists." };

  const original = text(fd, "originalSlug");
  let slug: string;
  if (original) {
    const i = company.projects.findIndex((p) => p.slug === original);
    if (i === -1) return { error: "That project no longer exists." };
    company.projects[i] = { ...fields, slug: original };
    slug = original;
  } else {
    slug = uniqueSlug(title, company.projects.map((p) => p.slug));
    company.projects.push({ ...fields, slug } satisfies Project);
  }

  try {
    await saveCompanies(companies);
  } catch (e) {
    return { error: (e as Error).message };
  }
  done(`/${company.slug}/${slug}`);
}

export async function deleteProject(companySlug: string, projectSlug: string) {
  await requireAdmin();
  const companies = await readCompanies();
  const company = companies.find((c) => c.slug === companySlug);
  if (company) {
    company.projects = company.projects.filter((p) => p.slug !== projectSlug);
    await saveCompanies(companies);
  }
  done(`/${companySlug}`);
}
