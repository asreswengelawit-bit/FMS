"use client";

import { useEffect, useMemo, useState } from "react";
import { formatEtb } from "../data";
import { useMms } from "../hooks/mms-store";
import { validateItem, validateMovement, validateRequisition, validateWarehouse, type ValidationErrors } from "../schemas/validation";
import type { MaterialItem, Requisition, StockMovement, Warehouse } from "../types";
import { downloadCsv } from "../utils/csv";
import { Icon, type IconName } from "./icons";

type ModalKind = "item" | "warehouse" | "movement" | "receipt" | "requisition";
type FieldSpec = { name: string; label: string; type?: string; placeholder?: string; options?: string[]; defaultValue?: string | number };
const PAGE_SIZE = 5;
const today = () => new Date().toISOString().slice(0, 10);

function PageHead({ title, description, button, onAdd }: { title: string; description: string; button: string; onAdd: () => void }) {
  const { canWrite } = useMms();
  return <div className="page-head"><div><h1>{title}</h1><p>{description}</p></div><button className="primary-button" disabled={!canWrite} onClick={onAdd}><Icon name="plus" className="button-icon" />{button}</button></div>;
}

function Metrics() {
  const { items, warehouses, movements } = useMms();
  const metrics: Array<{ label: string; value: string; color: string; background: string; icon: IconName; sub: string }> = [
    { label: "Total Items", value: String(items.length), color: "#0B1E3D", background: "#F0F4FF", icon: "box", sub: "Material master records" },
    { label: "Stock Value", value: formatEtb(items.reduce((sum, item) => sum + item.onHand * item.unitCost, 0)), color: "#2563EB", background: "#EEF2FF", icon: "money", sub: "Current valuation" },
    { label: "Low Stock Items", value: String(items.filter(item => item.status === "Low Stock").length), color: "#D97706", background: "#FFFBEB", icon: "alert", sub: "Reorder required" },
    { label: "Out of Stock", value: String(items.filter(item => item.status === "Out of Stock").length), color: "#C8102E", background: "#FFF1F3", icon: "alert", sub: "Immediate action" },
    { label: "Warehouses", value: String(warehouses.length), color: "#16A34A", background: "#F0FDF4", icon: "warehouse", sub: "Active locations" },
    { label: "Movements Today", value: String(movements.filter(movement => movement.date === today()).length), color: "#7C3AED", background: "#F5F3FF", icon: "movement", sub: "GR / GI / Transfer" },
  ];
  return <div className="metrics-grid">{metrics.map(metric => <div className="metric-card" key={metric.label}><div className="metric-icon" style={{ background: metric.background, color: metric.color }}><Icon name={metric.icon} /></div><div className="metric-value">{metric.value}</div><div className="metric-label">{metric.label}</div><div className="metric-sub" style={{ color: metric.color }}>{metric.sub}</div></div>)}</div>;
}

function StockAlert() {
  const { items } = useMms();
  const alerts = items.filter(item => item.status !== "Normal");
  if (!alerts.length) return null;
  return <div className="alert-strip"><Icon name="alert" /><div><div className="alert-title">Stock alert — {alerts.length} item{alerts.length === 1 ? "" : "s"} require attention</div><div className="alert-items">{alerts.map(item => <span key={item.id} style={{ color: item.status === "Out of Stock" ? "#C8102E" : "#D97706" }}>{item.name}: {item.onHand} / {item.reorderLevel} {item.uom}</span>)}</div></div></div>;
}

function SearchToolbar({ query, setQuery, filter, setFilter, options, label = "All categories", onExport }: { query: string; setQuery: (value: string) => void; filter: string; setFilter: (value: string) => void; options: string[]; label?: string; onExport: () => void }) {
  return <div className="toolbar"><div className="filters"><div className="search-box"><Icon name="search" /><input aria-label="Search records" className="control" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search records..." /></div><select aria-label={label} className="control" value={filter} onChange={event => setFilter(event.target.value)}><option value="all">{label}</option>{options.map(option => <option key={option} value={option}>{option}</option>)}</select></div><button className="secondary-button" onClick={onExport}><Icon name="download" className="button-icon" />Export CSV</button></div>;
}

function Status({ value }: { value: string }) {
  const cls = ["Normal", "Active", "Issued", "Received"].includes(value) ? "status-normal" : ["Low Stock", "Pending", "TR"].includes(value) ? "status-low" : ["Out of Stock", "Rejected", "GI"].includes(value) ? "status-out" : value === "Cold Chain" ? "status-cold" : "status-general";
  const labels: Record<string, string> = { GR: "Goods Receipt", GI: "Goods Issue", TR: "Transfer", ADJ: "Adjustment" };
  return <span className={`status-badge ${cls}`}>{labels[value] ?? value}</span>;
}

function Panel({ title, sub, children, toolbar }: { title: string; sub?: string; children: React.ReactNode; toolbar?: React.ReactNode }) {
  return <section className="panel"><div className="panel-head"><div><h2 className="panel-title">{title}</h2>{sub && <div className="panel-subtitle">{sub}</div>}</div>{toolbar}</div>{children}</section>;
}

function Pagination({ count, page, setPage }: { count: number; page: number; setPage: (page: number) => void }) {
  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const start = count ? (page - 1) * PAGE_SIZE + 1 : 0;
  return <div className="pagination"><span>Showing {start}–{Math.min(page * PAGE_SIZE, count)} of {count} records</span><div className="filters"><button aria-label="Previous page" disabled={page === 1} className="icon-button" onClick={() => setPage(page - 1)}>‹</button><button className="icon-button" style={{ background: "#0B1E3D", color: "white" }}>{page}</button><button aria-label="Next page" disabled={page === pages} className="icon-button" onClick={() => setPage(page + 1)}>›</button></div></div>;
}

function RecordModal({ kind, onClose, editItem }: { kind: ModalKind; onClose: () => void; editItem?: MaterialItem }) {
  const store = useMms();
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [saving, setSaving] = useState(false);
  const titles: Record<ModalKind, [string, string]> = { item: [editItem ? "Edit Item" : "Add New Item", editItem ? "Save Changes" : "Add Item"], warehouse: ["Create Warehouse", "Create Warehouse"], movement: ["Record Stock Movement", "Record Movement"], receipt: ["Create Goods Receipt", "Receive Goods"], requisition: ["New Material Requisition", "Submit Requisition"] };
  const commonItems = store.items.map(item => item.name);
  const commonWarehouses = store.warehouses.map(warehouse => warehouse.id);
  const fields: Record<ModalKind, FieldSpec[]> = {
    item: [
      { name: "id", label: "Item Code", placeholder: "ITM-XXX", defaultValue: editItem?.id }, { name: "name", label: "Item Name", placeholder: "Item name", defaultValue: editItem?.name },
      { name: "category", label: "Category", options: ["Office Supplies", "IT Equipment", "Safety Equipment", "Cold Chain", "Maintenance", "Laboratory"], defaultValue: editItem?.category }, { name: "uom", label: "Unit of Measure", options: ["Pcs", "Box", "Set", "Liters"], defaultValue: editItem?.uom },
      { name: "unitCost", label: "Unit Cost (ETB)", type: "number", defaultValue: editItem?.unitCost ?? 0 }, { name: "reorderLevel", label: "Reorder Level", type: "number", defaultValue: editItem?.reorderLevel ?? 0 }, { name: "warehouse", label: "Warehouse", options: commonWarehouses, defaultValue: editItem?.warehouse },
    ],
    warehouse: [{ name: "id", label: "Warehouse Code", placeholder: "WH-XXX" }, { name: "name", label: "Warehouse Name" }, { name: "location", label: "Location" }, { name: "type", label: "Warehouse Type", options: ["General", "Cold Chain"] }, { name: "capacity", label: "Capacity", type: "number" }, { name: "manager", label: "Manager" }],
    movement: [{ name: "type", label: "Movement Type", options: ["GR", "GI", "TR", "ADJ"] }, { name: "item", label: "Material Item", options: commonItems }, { name: "qty", label: "Quantity", type: "number" }, { name: "warehouse", label: "Warehouse", options: commonWarehouses }, { name: "ref", label: "Reference" }, { name: "date", label: "Movement Date", type: "date", defaultValue: today() }],
    receipt: [{ name: "ref", label: "Purchase Order", placeholder: "PO-2025-XXX" }, { name: "item", label: "Material Item", options: commonItems }, { name: "qty", label: "Received Quantity", type: "number" }, { name: "warehouse", label: "Warehouse", options: commonWarehouses }, { name: "date", label: "Receipt Date", type: "date", defaultValue: today() }, { name: "by", label: "Received By", defaultValue: store.user.name }],
    requisition: [{ name: "requestedBy", label: "Requested By" }, { name: "department", label: "Department", options: ["HR", "IT", "Sales", "Finance", "Procurement", "Operations"] }, { name: "item", label: "Material Item", options: commonItems }, { name: "qty", label: "Quantity", type: "number" }, { name: "date", label: "Required Date", type: "date", defaultValue: today() }, { name: "priority", label: "Priority", options: ["Normal", "High", "Urgent"] }],
  };

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) ?? "").trim();
    let validation: ValidationErrors = {};
    let operation: Promise<void>;
    if (kind === "item") {
      const onHand = editItem?.onHand ?? 0; const reorderLevel = Number(value("reorderLevel"));
      const item: MaterialItem = { id: value("id"), name: value("name"), category: value("category"), uom: value("uom"), unitCost: Number(value("unitCost")), reorderLevel, warehouse: value("warehouse"), onHand, reserved: editItem?.reserved ?? 0, status: onHand <= 0 ? "Out of Stock" : onHand <= reorderLevel ? "Low Stock" : "Normal" };
      validation = validateItem(item);
      if (!editItem && store.items.some(current => current.id === item.id)) validation.id = "Item code already exists";
      operation = editItem ? store.updateItem(item) : store.addItem(item);
    } else if (kind === "warehouse") {
      const warehouse: Warehouse = { id: value("id"), name: value("name"), location: value("location"), type: value("type") as Warehouse["type"], capacity: Number(value("capacity")), manager: value("manager"), used: 0, items: 0 };
      validation = validateWarehouse(warehouse); if (store.warehouses.some(current => current.id === warehouse.id)) validation.id = "Warehouse code already exists"; operation = store.addWarehouse(warehouse);
    } else if (kind === "requisition") {
      const requisition: Requisition = { id: `REQ-${Date.now()}`, requestedBy: value("requestedBy"), department: value("department"), item: value("item"), qty: Number(value("qty")), date: value("date"), priority: value("priority") as Requisition["priority"], status: "Pending" };
      validation = validateRequisition(requisition); operation = store.addRequisition(requisition);
    } else {
      const type = kind === "receipt" ? "GR" : value("type") as StockMovement["type"];
      const qty = Number(value("qty"));
      const movement: StockMovement = { id: `MOV-${Date.now()}`, type, item: value("item"), qty: type === "GI" ? -Math.abs(qty) : qty, warehouse: value("warehouse"), ref: value("ref"), date: value("date"), by: value("by") || store.user.name, note: value("notes") || (kind === "receipt" ? "Goods received" : "Manual movement") };
      validation = validateMovement(movement); operation = store.recordMovement(movement);
    }
    if (Object.keys(validation).length) { setErrors(validation); return; }
    setSaving(true); try { await operation; onClose(); } finally { setSaving(false); }
  }

  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={event => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="record-modal-title"><div className="modal-head"><h2 id="record-modal-title">{titles[kind][0]}</h2><button aria-label="Close dialog" className="modal-close" onClick={onClose}><Icon name="close" width="18" /></button></div><form className="modal-body" onSubmit={submit}><div className="form-grid">{fields[kind].map(field => <div className="field" key={field.name}><label htmlFor={field.name}>{field.label}</label>{field.options ? <select id={field.name} name={field.name} defaultValue={field.defaultValue ?? ""} className={errors[field.name] ? "input-error" : ""}><option value="" disabled>Select {field.label.toLowerCase()}</option>{field.options.map(option => <option key={option}>{option}</option>)}</select> : <input id={field.name} name={field.name} type={field.type ?? "text"} placeholder={field.placeholder} defaultValue={field.defaultValue} readOnly={Boolean(editItem && field.name === "id")} className={errors[field.name] ? "input-error" : ""} />}{errors[field.name] && <span className="field-error">{errors[field.name]}</span>}</div>)}<div className="field full"><label htmlFor="notes">Notes</label><textarea id="notes" name="notes" placeholder="Add optional notes or supporting details" /></div></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" disabled={saving} className="primary-button">{saving ? "Saving..." : titles[kind][1]}</button></div></form></div></div>;
}

function usePage(resetOn: unknown[]) {
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), resetOn);
  return [page, setPage] as const;
}

export function MmsOverview() {
  const { items, warehouses, movements, requisitions, issueRequisition } = useMms();
  const [modal, setModal] = useState<ModalKind | null>(null);
  return <div className="page-content"><PageHead title="Material Management System" description="Inventory overview · Stock health · Warehouses · Recent operations" button="Add New Item" onAdd={() => setModal("item")} /><Metrics /><StockAlert /><div className="dashboard-grid"><div className="stack"><Panel title="Inventory by Warehouse" sub="Capacity utilization and material distribution"><div className="panel-body"><div className="warehouse-cards">{warehouses.map(warehouse => { const percent = Math.round(warehouse.used / warehouse.capacity * 100); return <div className="warehouse-card" key={warehouse.id}><div className="warehouse-top"><div><div className="warehouse-code">{warehouse.id}</div><div className="warehouse-name">{warehouse.name}</div><div className="warehouse-location">{warehouse.location}</div></div><span className="type-pill">{warehouse.type}</span></div><div className="capacity-meta"><span>{warehouse.items} stock items</span><b>{percent}% used</b></div><div className="bar-track"><div className="bar-fill" style={{ width: `${percent}%`, background: percent > 75 ? "#D97706" : "#2563EB" }} /></div></div>; })}</div></div></Panel><Panel title="Stock Health" sub="Current quantity compared with reorder levels"><div className="panel-body stock-bars">{items.slice(0, 6).map(item => <div key={item.id}><div className="stock-bar-meta"><span className="stock-name">{item.name}</span><span className="stock-number">{item.onHand} {item.uom} · reorder {item.reorderLevel}</span></div><div className="bar-track"><div className="bar-fill" style={{ width: `${Math.min(100, item.onHand / Math.max(item.reorderLevel, 1) * 60)}%`, background: item.status === "Normal" ? "#16A34A" : item.status === "Low Stock" ? "#D97706" : "#C8102E" }} /></div></div>)}</div></Panel></div><div className="stack"><Panel title="Recent Stock Movement" sub="Latest warehouse transactions"><div className="panel-body movement-list">{movements.slice(0, 5).map(movement => <div className="movement-row" key={movement.id}><div className="movement-type"><Status value={movement.type} /></div><div><div className="movement-name">{movement.item}</div><div className="movement-detail">{movement.id} · {movement.warehouse}</div></div><span className="movement-qty" style={{ color: movement.qty > 0 ? "#16A34A" : "#C8102E" }}>{movement.qty > 0 ? "+" : ""}{movement.qty}</span></div>)}</div></Panel><Panel title="Pending Requisitions" sub="Requests waiting for inventory action"><div className="panel-body movement-list">{requisitions.filter(request => request.status === "Pending").map(request => <div className="movement-row" key={request.id}><div className="movement-type"><Icon name="clipboard" width="14" /></div><div><div className="movement-name">{request.item}</div><div className="movement-detail">{request.id} · {request.department}</div></div><button className="table-action" onClick={() => issueRequisition(request.id)}>Issue</button></div>)}</div></Panel></div></div>{modal && <RecordModal kind={modal} onClose={() => setModal(null)} />}</div>;
}

export function ItemsView() {
  const { items, notify } = useMms();
  const [modal, setModal] = useState<ModalKind | null>(null); const [editItem, setEditItem] = useState<MaterialItem>(); const [query, setQuery] = useState(""); const [filter, setFilter] = useState("all");
  const rows = useMemo(() => items.filter(item => (filter === "all" || item.category === filter) && `${item.id} ${item.name} ${item.category}`.toLowerCase().includes(query.toLowerCase())), [items, query, filter]);
  const [page, setPage] = usePage([query, filter]); const paged = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return <div className="page-content"><PageHead title="Item Master" description="Create and maintain material master records across INSA warehouses" button="Add New Item" onAdd={() => { setEditItem(undefined); setModal("item"); }} /><Metrics /><StockAlert /><Panel title={`Material Items (${rows.length})`} toolbar={<SearchToolbar query={query} setQuery={setQuery} filter={filter} setFilter={setFilter} options={[...new Set(items.map(item => item.category))]} onExport={() => downloadCsv("mms-items.csv", rows.map(item => ({ Code: item.id, Name: item.name, Category: item.category, OnHand: item.onHand, Status: item.status })))} />}><div className="table-wrap"><table className="data-table"><thead><tr>{["Item Code", "Item Name", "Category", "UOM", "On Hand", "Reserved", "Available", "Unit Cost", "Warehouse", "Status", "Actions"].map(header => <th key={header}>{header}</th>)}</tr></thead><tbody>{paged.map(item => <tr key={item.id}><td className="cell-code">{item.id}</td><td className="cell-primary">{item.name}</td><td>{item.category}</td><td>{item.uom}</td><td>{item.onHand}</td><td>{item.reserved}</td><td>{item.onHand - item.reserved}</td><td>{formatEtb(item.unitCost)}</td><td>{item.warehouse}</td><td><Status value={item.status} /></td><td><div className="filters"><button aria-label={`View ${item.name}`} className="icon-button" onClick={() => notify(`${item.name}: ${item.onHand - item.reserved} available`, "info")}><Icon name="eye" width="13" /></button><button aria-label={`Edit ${item.name}`} className="icon-button" onClick={() => { setEditItem(item); setModal("item"); }}><Icon name="edit" width="13" /></button></div></td></tr>)}</tbody></table>{!rows.length && <div className="empty-state"><Icon name="search" /><div>No materials match your search.</div></div>}</div><Pagination count={rows.length} page={page} setPage={setPage} /></Panel>{modal && <RecordModal kind={modal} editItem={editItem} onClose={() => setModal(null)} />}</div>;
}

export function WarehousesView() {
  const { warehouses, notify } = useMms(); const [modal, setModal] = useState<ModalKind | null>(null);
  return <div className="page-content"><PageHead title="Warehouses" description="Manage storage locations, capacity, ownership, and utilization" button="Create Warehouse" onAdd={() => setModal("warehouse")} /><Metrics /><div className="warehouse-cards" style={{ marginBottom: 16 }}>{warehouses.map(warehouse => { const percent = Math.round(warehouse.used / warehouse.capacity * 100); return <div className="panel" key={warehouse.id}><div className="panel-body"><div className="warehouse-top"><div><div className="warehouse-code">{warehouse.id}</div><div className="warehouse-name" style={{ fontSize: 13 }}>{warehouse.name}</div><div className="warehouse-location">{warehouse.location}</div></div><Status value={warehouse.type} /></div><div className="capacity-meta"><span>{warehouse.items} items</span><b>{percent}% used</b></div><div className="bar-track"><div className="bar-fill" style={{ width: `${percent}%`, background: percent > 75 ? "#D97706" : "#16A34A" }} /></div><button className="secondary-button" style={{ marginTop: 14 }} onClick={() => notify(`${warehouse.name} is managed by ${warehouse.manager}`, "info")}>View details</button></div></div>; })}</div><Panel title="Warehouse Directory"><div className="table-wrap"><table className="data-table"><thead><tr>{["Code", "Warehouse", "Location", "Type", "Capacity", "Used", "Available", "Items", "Manager", "Status"].map(header => <th key={header}>{header}</th>)}</tr></thead><tbody>{warehouses.map(warehouse => <tr key={warehouse.id}><td className="cell-code">{warehouse.id}</td><td className="cell-primary">{warehouse.name}</td><td>{warehouse.location}</td><td><Status value={warehouse.type} /></td><td>{warehouse.capacity.toLocaleString()}</td><td>{warehouse.used.toLocaleString()}</td><td>{(warehouse.capacity - warehouse.used).toLocaleString()}</td><td>{warehouse.items}</td><td>{warehouse.manager}</td><td><Status value="Active" /></td></tr>)}</tbody></table></div></Panel>{modal && <RecordModal kind={modal} onClose={() => setModal(null)} />}</div>;
}

function InventoryTable({ title = "Inventory" }: { title?: string }) {
  const { items, warehouses } = useMms(); const [modal, setModal] = useState<ModalKind | null>(null); const [query, setQuery] = useState(""); const [filter, setFilter] = useState("all");
  const rows = useMemo(() => items.filter(item => (filter === "all" || item.warehouse === filter) && `${item.id} ${item.name}`.toLowerCase().includes(query.toLowerCase())), [items, query, filter]);
  const [page, setPage] = usePage([query, filter]); const paged = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return <div className="page-content"><PageHead title={title} description="Real-time inventory balances, availability, valuation, and stock adjustments" button="Stock Adjustment" onAdd={() => setModal("movement")} /><Metrics /><StockAlert /><Panel title="Current Inventory" toolbar={<SearchToolbar query={query} setQuery={setQuery} filter={filter} setFilter={setFilter} label="All warehouses" options={warehouses.map(warehouse => warehouse.id)} onExport={() => downloadCsv("mms-inventory.csv", rows.map(item => ({ Code: item.id, Material: item.name, Warehouse: item.warehouse, OnHand: item.onHand, Reserved: item.reserved, Available: item.onHand - item.reserved, Value: item.onHand * item.unitCost, Status: item.status })))} />}><div className="table-wrap"><table className="data-table"><thead><tr>{["Item Code", "Material", "Warehouse", "On Hand", "Reserved", "Available", "Reorder Level", "Stock Coverage", "Value", "Status"].map(header => <th key={header}>{header}</th>)}</tr></thead><tbody>{paged.map(item => <tr key={item.id}><td className="cell-code">{item.id}</td><td className="cell-primary">{item.name}</td><td>{item.warehouse}</td><td>{item.onHand} {item.uom}</td><td>{item.reserved}</td><td>{item.onHand - item.reserved}</td><td>{item.reorderLevel}</td><td><div className="bar-track" style={{ width: 90 }}><div className="bar-fill" style={{ width: `${Math.min(100, item.onHand / Math.max(item.reorderLevel, 1) * 50)}%`, background: item.status === "Normal" ? "#16A34A" : item.status === "Low Stock" ? "#D97706" : "#C8102E" }} /></div></td><td>{formatEtb(item.onHand * item.unitCost)}</td><td><Status value={item.status} /></td></tr>)}</tbody></table>{!rows.length && <div className="empty-state"><Icon name="box" /><div>No inventory records found.</div></div>}</div><Pagination count={rows.length} page={page} setPage={setPage} /></Panel>{modal && <RecordModal kind={modal} onClose={() => setModal(null)} />}</div>;
}
export function InventoryView() { return <InventoryTable />; }
export function StockLevelsView() { return <InventoryTable title="Stock Levels" />; }

export function MovementsView() {
  const { movements } = useMms(); const [modal, setModal] = useState<ModalKind | null>(null); const [query, setQuery] = useState(""); const [filter, setFilter] = useState("all");
  const rows = useMemo(() => movements.filter(movement => (filter === "all" || movement.type === filter) && `${movement.id} ${movement.item} ${movement.ref}`.toLowerCase().includes(query.toLowerCase())), [movements, query, filter]); const [page, setPage] = usePage([query, filter]);
  return <div className="page-content"><PageHead title="Stock Movements" description="Track goods receipts, issues, transfers, and inventory adjustments" button="Record Movement" onAdd={() => setModal("movement")} /><Metrics /><Panel title="Movement Register" toolbar={<SearchToolbar query={query} setQuery={setQuery} filter={filter} setFilter={setFilter} label="All movement types" options={["GR", "GI", "TR", "ADJ"]} onExport={() => downloadCsv("mms-movements.csv", rows.map(row => ({ ID: row.id, Type: row.type, Material: row.item, Quantity: row.qty, Warehouse: row.warehouse, Reference: row.ref, Date: row.date })))} />}><div className="table-wrap"><table className="data-table"><thead><tr>{["Movement ID", "Type", "Material", "Quantity", "Warehouse", "Reference", "Date", "Processed By", "Notes"].map(header => <th key={header}>{header}</th>)}</tr></thead><tbody>{rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(movement => <tr key={movement.id}><td className="cell-code">{movement.id}</td><td><Status value={movement.type} /></td><td className="cell-primary">{movement.item}</td><td style={{ color: movement.qty > 0 ? "#16A34A" : "#C8102E", fontWeight: 800 }}>{movement.qty > 0 ? "+" : ""}{movement.qty}</td><td>{movement.warehouse}</td><td className="cell-code">{movement.ref}</td><td>{movement.date}</td><td>{movement.by}</td><td>{movement.note}</td></tr>)}</tbody></table></div><Pagination count={rows.length} page={page} setPage={setPage} /></Panel>{modal && <RecordModal kind={modal} onClose={() => setModal(null)} />}</div>;
}

export function GoodsReceiptsView() {
  const { movements, warehouses } = useMms(); const [modal, setModal] = useState<ModalKind | null>(null); const [query, setQuery] = useState(""); const [filter, setFilter] = useState("all");
  const rows = useMemo(() => movements.filter(movement => movement.type === "GR" && (filter === "all" || movement.warehouse === filter) && `${movement.id} ${movement.ref} ${movement.item}`.toLowerCase().includes(query.toLowerCase())), [movements, query, filter]); const [page, setPage] = usePage([query, filter]);
  return <div className="page-content"><PageHead title="Goods Receipts" description="Receive purchased materials and update warehouse stock balances" button="New Goods Receipt" onAdd={() => setModal("receipt")} /><Metrics /><Panel title="Goods Receipt Register" toolbar={<SearchToolbar query={query} setQuery={setQuery} filter={filter} setFilter={setFilter} label="All warehouses" options={warehouses.map(warehouse => warehouse.id)} onExport={() => downloadCsv("mms-goods-receipts.csv", rows.map(row => ({ Receipt: row.id, PO: row.ref, Material: row.item, Quantity: row.qty, Warehouse: row.warehouse, Date: row.date, ReceivedBy: row.by })))} />}><div className="table-wrap"><table className="data-table"><thead><tr>{["Receipt No.", "PO Reference", "Material", "Received Qty", "Warehouse", "Receipt Date", "Received By", "Note", "Status"].map(header => <th key={header}>{header}</th>)}</tr></thead><tbody>{rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(receipt => <tr key={receipt.id}><td className="cell-code">GRN-{receipt.id.slice(-6)}</td><td className="cell-code">{receipt.ref}</td><td className="cell-primary">{receipt.item}</td><td style={{ color: "#16A34A", fontWeight: 800 }}>+{receipt.qty}</td><td>{receipt.warehouse}</td><td>{receipt.date}</td><td>{receipt.by}</td><td>{receipt.note}</td><td><Status value="Received" /></td></tr>)}</tbody></table></div><Pagination count={rows.length} page={page} setPage={setPage} /></Panel>{modal && <RecordModal kind={modal} onClose={() => setModal(null)} />}</div>;
}

export function RequisitionsView() {
  const { requisitions, issueRequisition } = useMms(); const [modal, setModal] = useState<ModalKind | null>(null); const [query, setQuery] = useState(""); const [filter, setFilter] = useState("all");
  const rows = useMemo(() => requisitions.filter(request => (filter === "all" || request.status === filter) && `${request.id} ${request.item} ${request.requestedBy}`.toLowerCase().includes(query.toLowerCase())), [requisitions, query, filter]); const [page, setPage] = usePage([query, filter]);
  return <div className="page-content"><PageHead title="Material Requisitions" description="Review internal requests and issue approved materials from inventory" button="New Requisition" onAdd={() => setModal("requisition")} /><Metrics /><Panel title="Requisition Register" toolbar={<SearchToolbar query={query} setQuery={setQuery} filter={filter} setFilter={setFilter} label="All statuses" options={["Pending", "Issued", "Rejected"]} onExport={() => downloadCsv("mms-requisitions.csv", rows.map(row => ({ ID: row.id, RequestedBy: row.requestedBy, Department: row.department, Material: row.item, Quantity: row.qty, Date: row.date, Priority: row.priority, Status: row.status })))} />}><div className="table-wrap"><table className="data-table"><thead><tr>{["Req. ID", "Requested By", "Department", "Material Item", "Quantity", "Date", "Priority", "Status", "Actions"].map(header => <th key={header}>{header}</th>)}</tr></thead><tbody>{rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(request => <tr key={request.id}><td className="cell-code">{request.id}</td><td className="cell-primary">{request.requestedBy}</td><td>{request.department}</td><td>{request.item}</td><td>{request.qty}</td><td>{request.date}</td><td><span className={`status-badge ${request.priority === "Normal" ? "status-general" : request.priority === "High" ? "status-low" : "status-out"}`}>{request.priority}</span></td><td><Status value={request.status} /></td><td>{request.status === "Pending" && <button className="table-action" onClick={() => issueRequisition(request.id)}>Issue</button>}</td></tr>)}</tbody></table></div><Pagination count={rows.length} page={page} setPage={setPage} /></Panel>{modal && <RecordModal kind={modal} onClose={() => setModal(null)} />}</div>;
}

export function ReportsView() {
  const { items, movements, resetData } = useMms();
  const byWarehouse = items.reduce<Record<string, number>>((result, item) => ({ ...result, [item.warehouse]: (result[item.warehouse] ?? 0) + item.onHand * item.unitCost }), {});
  const max = Math.max(...Object.values(byWarehouse), 1);
  return <div className="page-content"><PageHead title="Reports & Analytics" description="Inventory valuation, stock health, and transaction insights" button="Restore Demo Data" onAdd={resetData} /><Metrics /><div className="report-grid"><Panel title="Inventory Value by Warehouse" sub="Current on-hand valuation"><div className="panel-body"><div className="report-bars">{Object.entries(byWarehouse).map(([warehouse, value]) => <div key={warehouse} className="report-bar" title={`${warehouse}: ${formatEtb(value)}`} style={{ height: `${Math.max(15, value / max * 100)}%` }}><span>{warehouse.replace("WH-", "")}</span></div>)}</div></div></Panel><Panel title="Stock Health Distribution" sub="Normal, low, and out-of-stock materials"><div className="panel-body"><div className="donut" title={`${items.filter(item => item.status === "Normal").length} healthy items`} /><div className="alert-items" style={{ justifyContent: "center", marginTop: 18 }}><span style={{ color: "#16A34A" }}>Normal: {items.filter(item => item.status === "Normal").length}</span><span>Low: {items.filter(item => item.status === "Low Stock").length}</span><span style={{ color: "#C8102E" }}>Out: {items.filter(item => item.status === "Out of Stock").length}</span></div></div></Panel><Panel title="Movement Summary" sub="All recorded inventory transactions"><div className="panel-body stock-bars">{(["GR", "GI", "TR", "ADJ"] as const).map(type => { const count = movements.filter(movement => movement.type === type).length; return <div key={type}><div className="stock-bar-meta"><Status value={type} /><b>{count}</b></div><div className="bar-track"><div className="bar-fill" style={{ width: `${Math.max(4, count / Math.max(movements.length, 1) * 100)}%`, background: "#2563EB" }} /></div></div>; })}</div></Panel><Panel title="Reorder Recommendations" sub="Materials at or below reorder level"><div className="panel-body movement-list">{items.filter(item => item.status !== "Normal").map(item => <div className="movement-row" key={item.id}><div className="movement-type"><Icon name="alert" width="14" /></div><div><div className="movement-name">{item.name}</div><div className="movement-detail">Available {item.onHand - item.reserved} · reorder at {item.reorderLevel}</div></div><Status value={item.status} /></div>)}</div></Panel></div></div>;
}
