import { describe, expect, it } from "vitest";
import { validateItem, validateMovement, validateRequisition, validateWarehouse } from "./validation";

describe("MMS validation", () => {
  it("accepts a valid material item", () => {
    expect(validateItem({ id: "ITM-100", name: "Keyboard", category: "IT Equipment", uom: "Pcs", unitCost: 900, reorderLevel: 5 })).toEqual({});
  });

  it("rejects invalid item values", () => {
    const errors = validateItem({ id: "", name: "", unitCost: -1, reorderLevel: -2 });
    expect(errors.id).toBeDefined();
    expect(errors.name).toBeDefined();
    expect(errors.unitCost).toBeDefined();
  });

  it("requires positive warehouse capacity", () => {
    expect(validateWarehouse({ id: "WH-X", name: "Test", location: "HQ", manager: "Owner", capacity: 0 }).capacity).toBeDefined();
  });

  it("requires movement material, warehouse and quantity", () => {
    const errors = validateMovement({ qty: 0 });
    expect(Object.keys(errors)).toEqual(expect.arrayContaining(["item", "qty", "warehouse", "ref"]));
  });

  it("accepts a complete requisition", () => {
    expect(validateRequisition({ requestedBy: "User", department: "IT", item: "Keyboard", qty: 2 })).toEqual({});
  });
});
