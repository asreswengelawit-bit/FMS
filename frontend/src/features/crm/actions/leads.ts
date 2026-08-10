"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CrmApiError } from "@/features/crm/api/crm-client";
import {
  convertLead,
  createLead,
  updateLeadStatus,
} from "@/features/crm/api/leads";
import type { LeadSource, LeadStatus } from "@/features/crm/types/lead";

export type LeadActionState = {
  ok: boolean;
  message?: string;
};

const SOURCES: LeadSource[] = [
  "WEBSITE",
  "REFERRAL",
  "COLD_CALL",
  "SOCIAL_MEDIA",
  "EVENT",
  "PARTNER",
];

function required(formData: FormData, key: string): string {
  const value = String(formData.get(key) ?? "").trim();
  if (!value) throw new Error(`${key} is required`);
  return value;
}

function optional(formData: FormData, key: string): string | undefined {
  const value = String(formData.get(key) ?? "").trim();
  return value || undefined;
}

export async function createLeadAction(
  _prev: LeadActionState,
  formData: FormData,
): Promise<LeadActionState> {
  let createdId: number;

  try {
    const sourceRaw = optional(formData, "source");
    const source =
      sourceRaw && SOURCES.includes(sourceRaw as LeadSource)
        ? (sourceRaw as LeadSource)
        : undefined;

    const created = await createLead({
      firstName: required(formData, "firstName"),
      lastName: required(formData, "lastName"),
      email: optional(formData, "email"),
      phone: optional(formData, "phone"),
      company: optional(formData, "company"),
      industry: optional(formData, "industry"),
      jobTitle: optional(formData, "jobTitle"),
      source,
      sourceDetails: optional(formData, "sourceDetails"),
      assignedTo: optional(formData, "assignedTo"),
      notes: optional(formData, "notes"),
    });
    createdId = created.id;
  } catch (err) {
    if (err instanceof CrmApiError) {
      return { ok: false, message: err.message };
    }
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Could not create lead.",
    };
  }

  revalidatePath("/crm/leads");
  revalidatePath("/crm/customers");
  redirect(`/crm/leads/${createdId}`);
}

export async function qualifyLeadAction(id: number): Promise<LeadActionState> {
  try {
    await updateLeadStatus(id, "QUALIFIED" satisfies LeadStatus);
    revalidatePath("/crm/leads");
    revalidatePath(`/crm/leads/${id}`);
    return { ok: true };
  } catch (err) {
    if (err instanceof CrmApiError) {
      return { ok: false, message: err.message };
    }
    return { ok: false, message: "Could not update lead status." };
  }
}

export async function convertLeadAction(id: number): Promise<LeadActionState> {
  let customerId: number | null = null;

  try {
    const converted = await convertLead(id, {
      createOpportunity: true,
      opportunityTitle: "Opportunity from lead conversion",
    });
    customerId = converted.convertedCustomerId;
  } catch (err) {
    if (err instanceof CrmApiError) {
      return { ok: false, message: err.message };
    }
    return { ok: false, message: "Could not convert lead." };
  }

  revalidatePath("/crm/leads");
  revalidatePath("/crm/customers");
  revalidatePath(`/crm/leads/${id}`);

  if (customerId) {
    redirect(`/crm/customers/${customerId}`);
  }
  return { ok: true };
}
