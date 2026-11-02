import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getCompany, getProject } from "@/lib/store";

export async function generateMetadata({
  params,
}: PageProps<"/[company]/[project]">): Promise<Metadata> {
  const { company, project } = await params;
  return { title: `${(await getProject(company, project))?.title} · Project Log` };
}

export default async function ProjectPage({
  params,
}: PageProps<"/[company]/[project]">) {
  const { company: companySlug, project: projectSlug } = await params;
  const [company, admin] = await Promise.all([
    getCompany(companySlug),
    isAdmin(),
  ]);
  const project = company?.projects.find((p) => p.slug === projectSlug);
  if (!company || !project) notFound();

  return (
    <>
      <Link href={`/${company.slug}`} className="back">
        ← {company.name}
      </Link>
      <h1>{project.title}</h1>
      {admin ? (
        <Link
          href={`/admin/${company.slug}/${project.slug}`}
          className="edit-link"
        >
          Edit project
        </Link>
      ) : null}
      <p className="muted">
        {[project.status, project.period].filter(Boolean).join(" · ")}
      </p>
      <p className="lead">{project.summary}</p>

      {project.problem ? (
        <section>
          <h2>Problem</h2>
          <p className="pre-line">{project.problem}</p>
        </section>
      ) : null}

      {project.contributions?.length ? (
        <section>
          <h2>Contributions</h2>
          <ul>
            {project.contributions.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {project.impact?.length ? (
        <section>
          <h2>Impact</h2>
          <ul>
            {project.impact.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {project.decisions?.length ? (
        <section>
          <h2>Technical decisions</h2>
          <ul>
            {project.decisions.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {project.initiative?.length ? (
        <section>
          <h2>Initiative</h2>
          <ul>
            {project.initiative.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {project.links?.length ? (
        <section>
          <h2>Links</h2>
          <ul>
            {project.links.map((l) => (
              <li key={l.url}>
                <a href={l.url} target="_blank" rel="noopener noreferrer">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {admin && project.notes?.length ? (
        <section className="notes">
          <h2>1:1 notes</h2>
          <ul>
            {project.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
