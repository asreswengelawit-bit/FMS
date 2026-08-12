import type { MaterialItem, Requisition, StockMovement, Warehouse } from "../types";

export type ValidationErrors = Record<string, string>;

const required = (value: unknown) => String(value ?? "").trim().length > 0;
const positive = (value: unknown) => Number.isFinite(Number(value)) && Number(value) > 0;
const nonNegative = (value: unknown) => Number.isFinite(Number(value)) && Number(value) >= 0;

export function validateItem(item: Partial<MaterialItem>): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!required(item.id)) errors.id = "Item code is required";
  if (!required(item.name)) errors.name = "Item name is required";
  if (!required(item.category)) errors.category = "Category is required";
  if (!required(item.uom)) errors.uom = "Unit of measure is required";
  if (!nonNegative(item.unitCost)) errors.unitCost = "Unit cost cannot be negative";
  if (!nonNegative(item.reorderLevel)) errors.reorderLevel = "Reorder level cannot be negative";
  return errors;
}

export function validateWarehouse(warehouse: Partial<Warehouse>): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!required(warehouse.id)) errors.id = "Warehouse code is required";
  if (!required(warehouse.name)) errors.name = "Warehouse name is required";
  if (!required(warehouse.location)) errors.location = "Location is required";
  if (!positive(warehouse.capacity)) errors.capacity = "Capacity must be greater than zero";
  if (!required(warehouse.manager)) errors.manager = "Manager is required";
  return errors;
}

export function validateMovement(movement: Partial<StockMovement>): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!required(movement.item)) errors.item = "Material is required";
  if (!positive(Math.abs(Number(movement.qty)))) errors.qty = "Quantity must be greater than zero";
  if (!required(movement.warehouse)) errors.warehouse = "Warehouse is required";
  if (!required(movement.ref)) errors.ref = "Reference is required";
  return errors;
}

export function validateRequisition(requisition: Partial<Requisition>): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!required(requisition.requestedBy)) errors.requestedBy = "Requester is required";
  if (!required(requisition.department)) errors.department = "Department is required";
  if (!required(requisition.item)) errors.item = "Material is required";
  if (!positive(requisition.qty)) errors.qty = "Quantity must be greater than zero";
  return errors;
}
