"use client";

import { useActionState } from "react";
import { STATUSES, type Company, type Project } from "@/data/career";
import {
  deleteCompany,
  deleteProject,
  login,
  saveCompany,
  saveProject,
  type FormState,
} from "./actions";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="field">
      <span>
        {label}
        {hint ? <span className="muted small"> · {hint}</span> : null}
      </span>
      {children}
    </label>
  );
}

function FormFooter({
  state,
  pending,
  label,
}: {
  state: FormState;
  pending: boolean;
  label: string;
}) {
  return (
    <div className="form-footer">
      <button type="submit" className="btn primary" disabled={pending}>
        {pending ? "Saving…" : label}
      </button>
      {state.error ? (
        <p className="error" aria-live="polite">
          {state.error}
        </p>
      ) : null}
    </div>
  );
}

function DeleteButton({
  action,
  what,
}: {
  action: () => Promise<void>;
  what: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Delete ${what}? This can't be undone.`)) e.preventDefault();
      }}
    >
      <button type="submit" className="btn danger">
        Delete
      </button>
    </form>
  );
}

export function LoginForm() {
  const [state, action, pending] = useActionState(login, {});
  return (
    <form action={action} className="form">
      <Field label="Password">
        <input type="password" name="password" required autoFocus />
      </Field>
      <FormFooter state={state} pending={pending} label="Sign in" />
    </form>
  );
}

export function CompanyForm({ company }: { company?: Company }) {
  const [state, action, pending] = useActionState(saveCompany, {});
  return (
    <>
      <form action={action} className="form">
        <input type="hidden" name="originalSlug" value={company?.slug ?? ""} />
        <Field label="Company name">
          <input name="name" defaultValue={company?.name} required />
        </Field>
        <Field label="Role">
          <input name="role" defaultValue={company?.role} required />
        </Field>
        <div className="field-row">
          <Field label="Start" hint="e.g. May 2025">
            <input name="start" defaultValue={company?.start} required />
          </Field>
          <Field label="End" hint="blank if current">
            <input name="end" defaultValue={company?.end} />
          </Field>
        </div>
        <Field label="Location">
          <input name="location" defaultValue={company?.location} />
        </Field>
        <Field label="Website">
          <input name="url" type="url" defaultValue={company?.url} />
        </Field>
        <Field label="Logo" hint="image URL, or a path in /public like /visa.svg">
          <input name="logo" defaultValue={company?.logo} />
        </Field>
        <label className="checkbox">
          <input
            type="checkbox"
            name="invertLogoInDark"
            defaultChecked={company?.invertLogoInDark}
          />
          Logo is dark — invert it in dark mode
        </label>
        <Field label="Blurb" hint="team / org, one or two lines">
          <textarea name="blurb" rows={2} defaultValue={company?.blurb} />
        </Field>
        <FormFooter
          state={state}
          pending={pending}
          label={company ? "Save company" : "Add company"}
        />
      </form>
      {company ? (
        <DeleteButton
          action={deleteCompany.bind(null, company.slug)}
          what={`${company.name} and all its projects`}
        />
      ) : null}
    </>
  );
}

export function ProjectForm({
  companySlug,
  project,
}: {
  companySlug: string;
  project?: Project;
}) {
  const [state, action, pending] = useActionState(saveProject, {});
  return (
    <>
      <form action={action} className="form">
        <input type="hidden" name="companySlug" value={companySlug} />
        <input type="hidden" name="originalSlug" value={project?.slug ?? ""} />
        <Field label="Title">
          <input name="title" defaultValue={project?.title} required />
        </Field>
        <Field label="Summary" hint="one line, shown in the list">
          <input name="summary" defaultValue={project?.summary} required />
        </Field>
        <div className="field-row">
          <Field label="Period" hint="e.g. Jun 2025 – Sep 2025">
            <input name="period" defaultValue={project?.period} />
          </Field>
          <Field label="Status">
            <select name="status" defaultValue={project?.status ?? ""}>
              <option value="">—</option>
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Problem" hint="why it was needed, and the baseline">
          <textarea name="problem" rows={3} defaultValue={project?.problem} />
        </Field>
        <Field label="Contributions" hint="one per line — what you personally did">
          <textarea
            name="contributions"
            rows={4}
            defaultValue={project?.contributions?.join("\n")}
          />
        </Field>
        <Field label="Impact" hint="one per line — numbers where possible">
          <textarea
            name="impact"
            rows={3}
            defaultValue={project?.impact?.join("\n")}
          />
        </Field>
        <Field label="Technical decisions" hint="one per line — the choice and why">
          <textarea
            name="decisions"
            rows={4}
            defaultValue={project?.decisions?.join("\n")}
          />
        </Field>
        <Field label="Initiative" hint="optional — beyond the ticket">
          <textarea
            name="initiative"
            rows={2}
            defaultValue={project?.initiative?.join("\n")}
          />
        </Field>
        <Field label="Links" hint="one per line: Label | https://…">
          <textarea
            name="links"
            rows={2}
            defaultValue={project?.links
              ?.map((l) => `${l.label} | ${l.url}`)
              .join("\n")}
          />
        </Field>
        <Field label="1:1 notes" hint="private — only visible when signed in">
          <textarea
            name="notes"
            rows={3}
            defaultValue={project?.notes?.join("\n")}
          />
        </Field>
        <FormFooter
          state={state}
          pending={pending}
          label={project ? "Save project" : "Add project"}
        />
      </form>
      {project ? (
        <DeleteButton
          action={deleteProject.bind(null, companySlug, project.slug)}
          what={`"${project.title}"`}
        />
      ) : null}
    </>
  );
}
