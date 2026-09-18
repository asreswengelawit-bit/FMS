"use server";

import { revalidatePath } from "next/cache";
import { createAccount, toggleAccountStatus } from "../api/coa";
import {
  createJournal,
  submitJournal,
  approveJournal,
  postJournal,
  openPeriod,
  softClosePeriod,
  closePeriod,
  reopenPeriod,
} from "../api/journals";
import { createInvoice, submitInvoice, approveInvoice, postInvoice } from "../api/invoices";
import { processPayment } from "../api/payments";
import {
  createBankAccount,
  updateBankAccountStatus,
  importStatementLines,
  manualMatch,
  flagException,
} from "../api/bank";
import {
  createBudget,
  submitBudget,
  approveBudget,
} from "../api/budgets";
import {
  createVendor,
  updateVendor,
} from "../api/vendors";
import {
  createCustomer,
  updateCustomer,
} from "../api/customers";
import type {
  CreateAccountInput,
  CreatePeriodInput,
  CreateJournalEntryInput,
  CreateInvoiceInput,
  ProcessPaymentInput,
  CreateBankAccountInput,
  CreateBudgetInput,
  CreateVendorInput,
  UpdateVendorInput,
  CreateCustomerInput,
  UpdateCustomerInput,
  BankAccount,
} from "../types/fms";

export type ActionState = {
  ok: boolean;
  message?: string;
};

// --- Accounts ---
export async function createAccountAction(
  _prev: ActionState,
  input: CreateAccountInput,
): Promise<ActionState> {
  try {
    await createAccount(input);
    revalidatePath("/fms/chart-of-accounts");
    return { ok: true, message: "Account created successfully." };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to create account." };
  }
}

export async function toggleAccountStatusAction(
  id: string,
): Promise<ActionState> {
  try {
    await toggleAccountStatus(id);
    revalidatePath("/fms/chart-of-accounts");
    return { ok: true, message: "Account status updated." };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to update account status." };
  }
}

// --- Periods ---
export async function openPeriodAction(
  _prev: ActionState,
  input: CreatePeriodInput,
): Promise<ActionState> {
  try {
    await openPeriod(input);
    revalidatePath("/fms/journals");
    return { ok: true, message: "Accounting period opened successfully." };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to open period." };
  }
}

export async function softClosePeriodAction(
  id: string,
  closeNotes?: string,
): Promise<ActionState> {
  try {
    await softClosePeriod(id, closeNotes);
    revalidatePath("/fms/journals");
    return { ok: true, message: "Accounting period soft-closed." };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to soft-close period." };
  }
}

export async function closePeriodAction(id: string): Promise<ActionState> {
  try {
    await closePeriod(id);
    revalidatePath("/fms/journals");
    return { ok: true, message: "Accounting period closed permanently." };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to close period." };
  }
}

export async function reopenPeriodAction(
  id: string,
  request?: { reason: string },
): Promise<ActionState> {
  try {
    await reopenPeriod(id, request);
    revalidatePath("/fms/journals");
    return { ok: true, message: "Accounting period reopened." };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to reopen period." };
  }
}

// --- Journals ---
export async function createJournalAction(
  _prev: ActionState,
  input: CreateJournalEntryInput,
): Promise<ActionState> {
  try {
    await createJournal(input);
    revalidatePath("/fms/journals");
    return { ok: true, message: "Journal voucher created as DRAFT." };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to create journal." };
  }
}

export async function submitJournalAction(id: string): Promise<ActionState> {
  try {
    await submitJournal(id);
    revalidatePath("/fms/journals");
    return { ok: true, message: "Journal entry submitted for review." };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to submit journal." };
  }
}

export async function approveJournalAction(id: string): Promise<ActionState> {
  try {
    await approveJournal(id);
    revalidatePath("/fms/journals");
    return { ok: true, message: "Journal entry approved." };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to approve journal." };
  }
}

export async function postJournalAction(id: string): Promise<ActionState> {
  try {
    await postJournal(id);
    revalidatePath("/fms/journals");
    return { ok: true, message: "Journal entry posted to General Ledger." };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to post journal." };
  }
}

// --- Invoices ---
export async function createInvoiceAction(
  _prev: ActionState,
  input: CreateInvoiceInput,
): Promise<ActionState> {
  try {
    await createInvoice(input);
    revalidatePath("/fms/invoices");
    return { ok: true, message: "Invoice created successfully." };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to create invoice." };
  }
}

export async function submitInvoiceAction(id: string): Promise<ActionState> {
  try {
    await submitInvoice(id);
    revalidatePath("/fms/invoices");
    return { ok: true, message: "Invoice submitted for review." };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to submit invoice." };
  }
}

export async function approveInvoiceAction(id: string): Promise<ActionState> {
  try {
    await approveInvoice(id);
    revalidatePath("/fms/invoices");
    return { ok: true, message: "Invoice approved." };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to approve invoice." };
  }
}

export async function postInvoiceAction(id: string): Promise<ActionState> {
  try {
    await postInvoice(id);
    revalidatePath("/fms/invoices");
    revalidatePath("/fms/journals");
    return { ok: true, message: "Invoice posted, double-entry generated." };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to post invoice." };
  }
}

// --- Payments ---
export async function processPaymentAction(
  _prev: ActionState,
  input: ProcessPaymentInput,
): Promise<ActionState> {
  try {
    await processPayment(input);
    revalidatePath("/fms/payments");
    revalidatePath("/fms/invoices");
    return { ok: true, message: "Payment processed and settlement posted." };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to process payment." };
  }
}

// --- Bank Accounts ---
export async function createBankAccountAction(
  _prev: ActionState,
  input: CreateBankAccountInput,
): Promise<ActionState & { data?: BankAccount }> {
  try {
    const data = await createBankAccount(input);
    revalidatePath("/fms/bank-accounts");
    return { ok: true, message: "Bank account created successfully.", data };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to create bank account." };
  }
}

export async function updateBankAccountStatusAction(
  id: string,
  status: "ACTIVE" | "INACTIVE",
): Promise<ActionState> {
  try {
    await updateBankAccountStatus(id, status);
    revalidatePath("/fms/bank-accounts");
    return { ok: true, message: "Bank account status updated." };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to update bank account status." };
  }
}

export async function importStatementLinesAction(
  id: string,
  lines: any[],
): Promise<ActionState> {
  try {
    await importStatementLines(id, lines);
    revalidatePath("/fms/bank-accounts");
    return { ok: true, message: "Statement lines imported." };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to import statement lines." };
  }
}

export async function manualMatchAction(
  lineId: string,
  paymentId: string,
): Promise<ActionState> {
  try {
    await manualMatch(lineId, paymentId);
    revalidatePath("/fms/bank-accounts");
    return { ok: true, message: "Statement line matched." };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to match statement line." };
  }
}

export async function flagExceptionAction(
  lineId: string,
): Promise<ActionState> {
  try {
    await flagException(lineId);
    revalidatePath("/fms/bank-accounts");
    return { ok: true, message: "Statement line flagged as exception." };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to flag exception." };
  }
}

// --- Budgets ---
export async function createBudgetAction(
  _prev: ActionState,
  input: CreateBudgetInput,
): Promise<ActionState> {
  try {
    await createBudget(input);
    revalidatePath("/fms/budgets");
    return { ok: true, message: "Budget created successfully." };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to create budget." };
  }
}

export async function submitBudgetAction(id: string): Promise<ActionState> {
  try {
    await submitBudget(id);
    revalidatePath("/fms/budgets");
    return { ok: true, message: "Budget submitted for approval." };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to submit budget." };
  }
}

export async function approveBudgetAction(id: string): Promise<ActionState> {
  try {
    await approveBudget(id);
    revalidatePath("/fms/budgets");
    return { ok: true, message: "Budget approved successfully." };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to approve budget." };
  }
}

// --- Vendors ---
export async function createVendorAction(
  _prev: ActionState,
  input: CreateVendorInput,
): Promise<ActionState> {
  try {
    await createVendor(input);
    revalidatePath("/fms/vendors");
    return { ok: true, message: "Vendor created successfully." };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to create vendor." };
  }
}

export async function updateVendorAction(
  id: string,
  input: UpdateVendorInput,
): Promise<ActionState> {
  try {
    await updateVendor(id, input);
    revalidatePath("/fms/vendors");
    return { ok: true, message: "Vendor updated successfully." };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to update vendor." };
  }
}

// --- Customers ---
export async function createCustomerAction(
  _prev: ActionState,
  input: CreateCustomerInput,
): Promise<ActionState> {
  try {
    await createCustomer(input);
    revalidatePath("/fms/customers");
    return { ok: true, message: "Customer created successfully." };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to create customer." };
  }
}

export async function updateCustomerAction(
  id: string,
  input: UpdateCustomerInput,
): Promise<ActionState> {
  try {
    await updateCustomer(id, input);
    revalidatePath("/fms/customers");
    return { ok: true, message: "Customer updated successfully." };
  } catch (err: any) {
    return { ok: false, message: err.message || "Failed to update customer." };
  }
}
