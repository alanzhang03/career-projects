import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getCompany } from "@/lib/store";

export async function generateMetadata({
  params,
}: PageProps<"/[company]">): Promise<Metadata> {
  const { company } = await params;
  return { title: `${(await getCompany(company))?.name} · Project Log` };
}

export default async function CompanyPage({ params }: PageProps<"/[company]">) {
  const [company, admin] = await Promise.all([
    params.then((p) => getCompany(p.company)),
    isAdmin(),
  ]);
  if (!company) notFound();

  return (
    <>
      <Link href="/" className="back">
        ← All companies
      </Link>
      <h1>{company.name}</h1>
      <p className="muted">
        {company.role} · {company.start} – {company.end ?? "Present"}
        {company.location ? ` · ${company.location}` : ""}
      </p>
      {company.blurb ? <p>{company.blurb}</p> : null}
      {admin ? (
        <p className="admin-links">
          <Link href={`/admin/${company.slug}`} className="edit-link">
            Edit company
          </Link>
          <Link href={`/admin/${company.slug}/new`} className="edit-link">
            + Add project
          </Link>
        </p>
      ) : null}

      {company.projects.length === 0 ? (
        <p className="card muted">Projects coming soon.</p>
      ) : (
        <ul className="project-list">
          {company.projects.map((p) => (
            <li key={p.slug}>
              <Link href={`/${company.slug}/${p.slug}`} className="card project-row">
                <div className="project-row-head">
                  <h2>{p.title}</h2>
                  {p.status ? <span className="badge">{p.status}</span> : null}
                </div>
                <p>{p.summary}</p>
                {p.impact?.[0] ? (
                  <p className="muted small">↳ {p.impact[0]}</p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
