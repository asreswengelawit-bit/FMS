"use client";

import { useActionState } from "react";
import Link from "next/link";
import styled from "styled-components";
import {
  createCustomerAction,
  type CreateCustomerState,
} from "@/features/crm/actions/customers";
import { theme } from "@/styles/theme";

const initial: CreateCustomerState = { ok: true };

const CUSTOMER_TYPES = [
  "GOVERNMENT",
  "INDIVIDUAL",
  "PRIVATE",
  "ORGANIZATION",
  "NGO",
  "INTERNATIONAL",
] as const;

export default function CustomerCreateForm() {
  const [state, formAction, pending] = useActionState(
    createCustomerAction,
    initial,
  );

  return (
    <Form action={formAction}>
      {!state.ok && state.message ? <ErrorBox>{state.message}</ErrorBox> : null}

      <Grid>
        <Field>
          <label htmlFor="customerName">Contact name *</label>
          <input id="customerName" name="customerName" required />
        </Field>
        <Field>
          <label htmlFor="organizationName">Organization *</label>
          <input id="organizationName" name="organizationName" required />
        </Field>
        <Field>
          <label htmlFor="customerType">Customer type *</label>
          <select id="customerType" name="customerType" required defaultValue="ORGANIZATION">
            {CUSTOMER_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field>
          <label htmlFor="email">Email *</label>
          <input id="email" name="email" type="email" required />
        </Field>
        <Field>
          <label htmlFor="phone">Phone *</label>
          <input id="phone" name="phone" required />
        </Field>
        <Field>
          <label htmlFor="industry">Industry</label>
          <input id="industry" name="industry" />
        </Field>
        <Field $span2>
          <label htmlFor="address">Address</label>
          <input id="address" name="address" />
        </Field>
        <Field>
          <label htmlFor="city">City</label>
          <input id="city" name="city" />
        </Field>
        <Field>
          <label htmlFor="country">Country</label>
          <input id="country" name="country" />
        </Field>
        <Field>
          <label htmlFor="postalCode">Postal code</label>
          <input id="postalCode" name="postalCode" />
        </Field>
        <Field>
          <label htmlFor="website">Website</label>
          <input id="website" name="website" />
        </Field>
        <Field $span2>
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={3} />
        </Field>
      </Grid>

      <Actions>
        <Cancel href="/crm/customers">Cancel</Cancel>
        <Submit type="submit" disabled={pending}>
          {pending ? "Saving…" : "Create customer"}
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
    font-size: 0.82rem;
    font-weight: 600;
    color: #475569;
    margin-bottom: 0.35rem;
  }

  input,
  select,
  textarea {
    width: 100%;
    border: 1px solid #e2e6ee;
    background: #f8f9fc;
    border-radius: 8px;
    padding: 0.6rem 0.75rem;
    font-size: 0.92rem;
    outline: none;
  }

  input:focus,
  select:focus,
  textarea:focus {
    border-color: ${theme.blue};
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
  background: ${theme.navy};
  color: #fff;
  padding: 0.55rem 1.1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: wait;
  }

  &:hover:not(:disabled) {
    background: ${theme.navy2};
  }
`;

const ErrorBox = styled.div`
  background: #fdeaea;
  color: #b91c1c;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 0.7rem 0.9rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;
