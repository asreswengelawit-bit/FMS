"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createCustomer } from "@/features/crm/api/customers";
import { CrmApiError } from "@/features/crm/api/crm-client";
import type {
  CustomerCreateInput,
  CustomerType,
} from "@/features/crm/types/customer";

export type CreateCustomerState = {
  ok: boolean;
  message?: string;
};

const CUSTOMER_TYPES: CustomerType[] = [
  "GOVERNMENT",
  "INDIVIDUAL",
  "PRIVATE",
  "ORGANIZATION",
  "NGO",
  "INTERNATIONAL",
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

export async function createCustomerAction(
  _prev: CreateCustomerState,
  formData: FormData,
): Promise<CreateCustomerState> {
  let createdId: number;

  try {
    const customerType = required(formData, "customerType") as CustomerType;
    if (!CUSTOMER_TYPES.includes(customerType)) {
      return { ok: false, message: "Invalid customer type." };
    }

    const input: CustomerCreateInput = {
      customerName: required(formData, "customerName"),
      customerType,
      organizationName: required(formData, "organizationName"),
      email: required(formData, "email"),
      phone: required(formData, "phone"),
      address: optional(formData, "address"),
      city: optional(formData, "city"),
      country: optional(formData, "country"),
      postalCode: optional(formData, "postalCode"),
      industry: optional(formData, "industry"),
      website: optional(formData, "website"),
      description: optional(formData, "description"),
    };

    const created = await createCustomer(input);
    createdId = created.id;
  } catch (err) {
    if (err instanceof CrmApiError) {
      return { ok: false, message: err.message };
    }
    const message =
      err instanceof Error ? err.message : "Could not create customer.";
    return { ok: false, message };
  }

  revalidatePath("/crm/customers");
  redirect(`/crm/customers/${createdId}`);
}
