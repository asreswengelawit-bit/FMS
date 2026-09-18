import type { Account, AccountingPeriod, CreateAccountInput, CreatePeriodInput, CreateJournalEntryInput, CreateInvoiceInput, ProcessPaymentInput } from "../types";

export type ValidationErrors = Record<string, string>;

const required = (value: unknown) => String(value ?? "").trim().length > 0;
const positive = (value: unknown) => Number.isFinite(Number(value)) && Number(value) > 0;
const nonNegative = (value: unknown) => Number.isFinite(Number(value)) && Number(value) >= 0;

export function validateAccount(input: Partial<CreateAccountInput>): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!required(input.code)) errors.code = "Account code is required";
  if (!required(input.name)) errors.name = "Account name is required";
  if (!input.type) errors.type = "Account type is required";
  if (!required(input.parentAccountId)) errors.parentAccountId = "Parent account is required";
  return errors;
}

export function validatePeriod(input: Partial<CreatePeriodInput>): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!required(input.periodName)) errors.periodName = "Period name is required";
  if (!required(input.startDate)) errors.startDate = "Start date is required";
  if (!required(input.endDate)) errors.endDate = "End date is required";
  return errors;
}

export function validateJournalEntry(input: Partial<CreateJournalEntryInput>): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!required(input.periodId)) errors.periodId = "Period is required";
  if (!required(input.description)) errors.description = "Description is required";
  if (!input.lines || input.lines.length < 2) errors.lines = "At least two journal lines are required";
  const totalDebit = input.lines?.reduce((sum, l) => sum + Number(l.debitAmount || 0), 0) ?? 0;
  const totalCredit = input.lines?.reduce((sum, l) => sum + Number(l.creditAmount || 0), 0) ?? 0;
  if (Math.abs(totalDebit - totalCredit) > 0.01 || totalDebit <= 0) errors.balance = "Journal must be balanced (debits = credits > 0)";
  return errors;
}

export function validateInvoice(input: Partial<CreateInvoiceInput>): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!required(input.invoiceNumber)) errors.invoiceNumber = "Invoice number is required";
  if (!input.invoiceType) errors.invoiceType = "Invoice type is required";
  if (!required(input.partyName)) errors.partyName = "Party name is required";
  if (!required(input.periodId)) errors.periodId = "Period is required";
  if (!required(input.issueDate)) errors.issueDate = "Issue date is required";
  if (!required(input.dueDate)) errors.dueDate = "Due date is required";
  if (!input.lines || input.lines.length === 0) errors.lines = "At least one invoice line is required";
  return errors;
}

export function validatePayment(input: Partial<ProcessPaymentInput>): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!required(input.paymentNumber)) errors.paymentNumber = "Payment number is required";
  if (!required(input.invoiceId)) errors.invoiceId = "Invoice is required";
  if (!required(input.bankAccountId)) errors.bankAccountId = "Bank account is required";
  if (!input.paymentType) errors.paymentType = "Payment type is required";
  if (!required(input.paymentDate)) errors.paymentDate = "Payment date is required";
  if (!positive(input.amount)) errors.amount = "Amount must be greater than zero";
  return errors;
}
