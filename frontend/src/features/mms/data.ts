import type { MaterialItem, Requisition, StockMovement, Warehouse } from "./types";

export const items: MaterialItem[] = [
  { id:"ITM-001", name:"A4 Paper Box 500s", category:"Office Supplies", uom:"Box", onHand:145, reserved:20, reorderLevel:50, unitCost:3200, warehouse:"WH-Main", status:"Normal" },
  { id:"ITM-002", name:"Network Switch 24-Port", category:"IT Equipment", uom:"Pcs", onHand:8, reserved:2, reorderLevel:5, unitCost:42000, warehouse:"WH-Main", status:"Normal" },
  { id:"ITM-003", name:"UPS Battery Module", category:"IT Equipment", uom:"Pcs", onHand:16, reserved:4, reorderLevel:10, unitCost:28500, warehouse:"WH-Main", status:"Normal" },
  { id:"ITM-004", name:"Diesel Fuel", category:"Fuel & Lubricants", uom:"Liters", onHand:850, reserved:100, reorderLevel:1000, unitCost:120, warehouse:"WH-Main", status:"Low Stock" },
  { id:"ITM-005", name:"Server Rack Unit", category:"IT Infrastructure", uom:"Pcs", onHand:3, reserved:1, reorderLevel:2, unitCost:185000, warehouse:"WH-Main", status:"Normal" },
  { id:"ITM-006", name:"Spare HDD 2TB", category:"IT Equipment", uom:"Pcs", onHand:2, reserved:0, reorderLevel:5, unitCost:8500, warehouse:"WH-Main", status:"Low Stock" },
  { id:"ITM-007", name:"Fire Extinguisher", category:"Safety Equipment", uom:"Pcs", onHand:18, reserved:0, reorderLevel:10, unitCost:1800, warehouse:"WH-Main", status:"Normal" },
  { id:"ITM-008", name:"Cold Pack Insulator", category:"Cold Chain", uom:"Pcs", onHand:0, reserved:0, reorderLevel:50, unitCost:450, warehouse:"WH-Cold", status:"Out of Stock" },
  { id:"ITM-009", name:"Lab Test Kit Set", category:"Laboratory", uom:"Set", onHand:12, reserved:5, reorderLevel:8, unitCost:45000, warehouse:"WH-Main", status:"Normal" },
  { id:"ITM-010", name:"Generator Spare Parts", category:"Maintenance", uom:"Set", onHand:4, reserved:0, reorderLevel:3, unitCost:28000, warehouse:"WH-Main", status:"Normal" },
];

export const warehouses: Warehouse[] = [
  { id:"WH-Main", name:"Main Warehouse", location:"Addis Ababa HQ", capacity:5000, used:3840, items:248, manager:"Dawit Alemu", type:"General" },
  { id:"WH-Cold", name:"Cold Storage Unit", location:"Addis Ababa HQ", capacity:800, used:620, items:35, manager:"Meron Kebede", type:"Cold Chain" },
  { id:"WH-Field", name:"Field Office Store", location:"Hawassa Branch", capacity:500, used:180, items:42, manager:"Solomon Tesfaye", type:"General" },
];

export const movements: StockMovement[] = [
  { id:"MOV-2025-101", type:"GR", item:"UPS Battery Module", qty:10, warehouse:"WH-Main", ref:"PO-2025-031", date:"2025-07-18", by:"Dawit Alemu", note:"From Ethio Tech" },
  { id:"MOV-2025-102", type:"GI", item:"A4 Paper Box 500s", qty:-5, warehouse:"WH-Main", ref:"REQ-2025-055", date:"2025-07-17", by:"Hirut Mekonen", note:"Admin office" },
  { id:"MOV-2025-103", type:"TR", item:"Fire Extinguisher", qty:3, warehouse:"WH-Main → WH-Field", ref:"TR-2025-022", date:"2025-07-16", by:"Dawit Alemu", note:"Hawassa branch" },
  { id:"MOV-2025-104", type:"GR", item:"Diesel Fuel", qty:500, warehouse:"WH-Main", ref:"PO-2025-035", date:"2025-07-15", by:"Dawit Alemu", note:"From Meseret Fuel" },
  { id:"MOV-2025-105", type:"GI", item:"Spare HDD 2TB", qty:-3, warehouse:"WH-Main", ref:"REQ-2025-056", date:"2025-07-14", by:"Meron Kebede", note:"Server replacement" },
  { id:"MOV-2025-106", type:"ADJ", item:"Lab Test Kit Set", qty:-1, warehouse:"WH-Main", ref:"ADJ-2025-008", date:"2025-07-12", by:"Dawit Alemu", note:"Damaged — write off" },
];

export const requisitions: Requisition[] = [
  { id:"REQ-2025-051", requestedBy:"Hirut Mekonen", department:"HR", item:"A4 Paper Box 500s", qty:10, date:"2025-07-10", status:"Issued", priority:"Normal" },
  { id:"REQ-2025-052", requestedBy:"Yonas Tadesse", department:"IT", item:"Network Switch 24-Port", qty:2, date:"2025-07-11", status:"Pending", priority:"High" },
  { id:"REQ-2025-053", requestedBy:"Selam Haile", department:"Sales", item:"Generator Spare Parts", qty:1, date:"2025-07-12", status:"Pending", priority:"Urgent" },
  { id:"REQ-2025-054", requestedBy:"Abebe Girma", department:"Finance", item:"A4 Paper Box 500s", qty:5, date:"2025-07-14", status:"Issued", priority:"Normal" },
  { id:"REQ-2025-055", requestedBy:"Tigist Bekele", department:"Procurement", item:"Lab Test Kit Set", qty:3, date:"2025-07-15", status:"Pending", priority:"High" },
  { id:"REQ-2025-056", requestedBy:"Meron Kebede", department:"IT", item:"Spare HDD 2TB", qty:2, date:"2025-07-16", status:"Rejected", priority:"Normal" },
];

export const formatEtb = (value: number) => `ETB ${value.toLocaleString("en-US")}`;
