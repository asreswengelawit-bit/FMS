"use client";

import { useActionState } from "react";
import Link from "next/link";
import styled from "styled-components";
import {
  createLeadAction,
  type LeadActionState,
} from "@/features/crm/actions/leads";
import { theme } from "@/styles/theme";

const initial: LeadActionState = { ok: true };

const SOURCES = [
  "WEBSITE",
  "REFERRAL",
  "COLD_CALL",
  "SOCIAL_MEDIA",
  "EVENT",
  "PARTNER",
] as const;

export default function LeadCreateForm() {
  const [state, formAction, pending] = useActionState(createLeadAction, initial);

  return (
    <Form action={formAction}>
      {!state.ok && state.message ? <ErrorBox>{state.message}</ErrorBox> : null}
      <Grid>
        <Field>
          <label htmlFor="firstName">First name *</label>
          <input id="firstName" name="firstName" required />
        </Field>
        <Field>
          <label htmlFor="lastName">Last name *</label>
          <input id="lastName" name="lastName" required />
        </Field>
        <Field>
          <label htmlFor="company">Organization</label>
          <input id="company" name="company" />
        </Field>
        <Field>
          <label htmlFor="jobTitle">Job title</label>
          <input id="jobTitle" name="jobTitle" />
        </Field>
        <Field>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" />
        </Field>
        <Field>
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" />
        </Field>
        <Field>
          <label htmlFor="source">Source</label>
          <select id="source" name="source" defaultValue="WEBSITE">
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field>
          <label htmlFor="industry">Industry</label>
          <input id="industry" name="industry" />
        </Field>
        <Field>
          <label htmlFor="assignedTo">Assigned to</label>
          <input id="assignedTo" name="assignedTo" placeholder="username" />
        </Field>
        <Field>
          <label htmlFor="sourceDetails">Source details</label>
          <input id="sourceDetails" name="sourceDetails" />
        </Field>
        <Field $span2>
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" rows={3} />
        </Field>
      </Grid>
      <Actions>
        <Cancel href="/crm/leads">Cancel</Cancel>
        <Submit type="submit" disabled={pending}>
          {pending ? "Saving…" : "Create lead"}
        </Submit>
      </Actions>
    </Form>
  );
}

const Form = styled.form`
  background: #fff;
  border: 1px solid #e8ebf1;
  border-radius: 12px;
  padding: 1.25rem 1.4rem 1.4rem;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div<{ $span2?: boolean }>`
  grid-column: ${(p) => (p.$span2 ? "1 / -1" : "auto")};

  label {
    display: block;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #64748b;
    margin-bottom: 0.35rem;
  }

  input,
  select,
  textarea {
    width: 100%;
    border: 1px solid #e2e6ee;
    background: #f3f4f6;
    border-radius: 10px;
    padding: 0.65rem 0.8rem;
    font-size: 0.92rem;
    outline: none;
  }

  input:focus,
  select:focus,
  textarea:focus {
    border-color: ${theme.red2};
    background: #fff;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.25rem;
`;

const Cancel = styled(Link)`
  border: 1px solid #e2e6ee;
  background: #fff;
  color: ${theme.navy};
  padding: 0.55rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
`;

const Submit = styled.button`
  border: none;
  background: linear-gradient(180deg, ${theme.red2}, ${theme.red});
  color: #fff;
  padding: 0.55rem 1.1rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: wait;
  }
`;

const ErrorBox = styled.div`
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 0.7rem 0.9rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;
