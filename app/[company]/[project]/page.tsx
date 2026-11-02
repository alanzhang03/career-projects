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

      {project.stack?.length ? (
        <div className="tags">
          {project.stack.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      ) : null}

      {project.impact?.length ? (
        <section>
          <h2>Impact</h2>
          <ul>
            {project.impact.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {project.problem ? (
        <section>
          <h2>Problem</h2>
          <p>{project.problem}</p>
        </section>
      ) : null}

      {project.approach ? (
        <section>
          <h2>Approach</h2>
          <p>{project.approach}</p>
        </section>
      ) : null}

      {project.challenges?.length ? (
        <section>
          <h2>Challenges</h2>
          <ul>
            {project.challenges.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {project.collaborators ? (
        <section>
          <h2>Worked with</h2>
          <p>{project.collaborators}</p>
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
    </>
  );
}
