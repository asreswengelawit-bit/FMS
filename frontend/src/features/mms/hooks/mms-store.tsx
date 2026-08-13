"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { LocalMmsRepository } from "../api/repository";
import { mmsApi } from "../api/http-client";
import { items as seedItems, movements as seedMovements, requisitions as seedRequisitions, suppliers as seedSuppliers, warehouses as seedWarehouses } from "../data";
import type { MaterialItem, MmsData, MmsUser, Requisition, StockMovement, Supplier, Warehouse } from "../types";
import { authMode, userFromAccessToken } from "@/features/shared/lib/auth";

type Toast = { id: number; message: string; tone: "success" | "error" | "info" };
type MmsContextValue = MmsData & {
  loading: boolean;
  error: string | null;
  user: MmsUser;
  toasts: Toast[];
  canWrite: boolean;
  addItem(item: MaterialItem): Promise<void>;
  updateItem(item: MaterialItem): Promise<void>;
  addWarehouse(warehouse: Warehouse): Promise<void>;
  recordMovement(movement: StockMovement): Promise<void>;
  addRequisition(requisition: Requisition): Promise<void>;
  issueRequisition(id: string): Promise<void>;
  addSupplier(supplier: Supplier): Promise<void>;
  updateSupplier(supplier: Supplier): Promise<void>;
  deactivateSupplier(id: string): Promise<void>;
  resetData(): Promise<void>;
  notify(message: string, tone?: Toast["tone"]): void;
  dismissToast(id: number): void;
  signOut(): void;
};

const repository = new LocalMmsRepository();
const initial: MmsData = { items: seedItems, movements: seedMovements, requisitions: seedRequisitions, suppliers: seedSuppliers, warehouses: seedWarehouses };
const demoUser: MmsUser = { id: "USR-014", name: "Dawit Alemu", role: "inventory_manager", permissions: ["mms:read", "mms:write", "mms:approve", "mms:export"] };
const Context = createContext<MmsContextValue | null>(null);

function inventoryStatus(onHand: number, reorder: number): MaterialItem["status"] {
  return onHand <= 0 ? "Out of Stock" : onHand <= reorder ? "Low Stock" : "Normal";
}

export function MmsProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<MmsData>(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [user, setUser] = useState<MmsUser>(demoUser);

  const refreshLive = useCallback(async () => {
    const [items, warehouses, movements, requisitions, suppliers] = await Promise.all([
      mmsApi.listItems(),
      mmsApi.listWarehouses(),
      mmsApi.listMovements(),
      mmsApi.listRequisitions(),
      mmsApi.listSuppliers(),
    ]);
    setData({ items, warehouses, movements, requisitions, suppliers });
  }, []);

  useEffect(() => {
    if (authMode === "keycloak") setUser(userFromAccessToken() ?? { ...demoUser, role: "viewer", permissions: ["mms:read"] });
    
    // Demo mode is deliberately UI-only.  A local API URL may still be set
    // for other workflows, but demo users do not have a bearer token for it.
    const isLive = authMode !== "demo" && Boolean(process.env.NEXT_PUBLIC_MMS_API_URL);
    if (isLive) {
      setLoading(true);
      refreshLive()
        .catch(e => setError(e instanceof Error ? e.message : "Could not load MMS data"))
        .finally(() => setLoading(false));
    } else {
      repository.load()
        .then(setData)
        .catch(e => setError(e instanceof Error ? e.message : "Could not load MMS data"))
        .finally(() => setLoading(false));
    }
  }, [refreshLive]);

  const notify = useCallback((message: string, tone: Toast["tone"] = "success") => {
    const id = Date.now();
    setToasts(current => [...current, { id, message, tone }]);
    window.setTimeout(() => setToasts(current => current.filter(toast => toast.id !== id)), 3500);
  }, []);
  const dismissToast = useCallback((id: number) => setToasts(current => current.filter(toast => toast.id !== id)), []);

  const commit = useCallback(async (next: MmsData, message: string) => {
    setLoading(true); setError(null);
    try { await repository.save(next); setData(next); notify(message); }
    catch (e) { const message = e instanceof Error ? e.message : "Operation failed"; setError(message); notify(message, "error"); throw e; }
    finally { setLoading(false); }
  }, [notify]);

  const addItem = useCallback(async (item: MaterialItem) => {
    const isLive = authMode !== "demo" && Boolean(process.env.NEXT_PUBLIC_MMS_API_URL);
    if (isLive) {
      setLoading(true); setError(null);
      try {
        await mmsApi.createItem(item);
        await refreshLive();
        notify(`${item.name} was added`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Operation failed";
        setError(msg); notify(msg, "error");
        throw e;
      } finally {
        setLoading(false);
      }
    } else {
      await commit({ ...data, items: [item, ...data.items] }, `${item.name} was added`);
    }
  }, [commit, data, refreshLive, notify]);

  const updateItem = useCallback(async (item: MaterialItem) => {
    const isLive = authMode !== "demo" && Boolean(process.env.NEXT_PUBLIC_MMS_API_URL);
    if (isLive) {
      setLoading(true); setError(null);
      try {
        await mmsApi.updateItem(item);
        await refreshLive();
        notify(`${item.name} was updated`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Operation failed";
        setError(msg); notify(msg, "error");
        throw e;
      } finally {
        setLoading(false);
      }
    } else {
      await commit({ ...data, items: data.items.map(current => current.id === item.id ? item : current) }, `${item.name} was updated`);
    }
  }, [commit, data, refreshLive, notify]);

  const addWarehouse = useCallback(async (warehouse: Warehouse) => {
    const isLive = authMode !== "demo" && Boolean(process.env.NEXT_PUBLIC_MMS_API_URL);
    if (isLive) {
      setLoading(true); setError(null);
      try {
        await mmsApi.createWarehouse(warehouse);
        await refreshLive();
        notify(`${warehouse.name} was created`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Operation failed";
        setError(msg); notify(msg, "error");
        throw e;
      } finally {
        setLoading(false);
      }
    } else {
      await commit({ ...data, warehouses: [warehouse, ...data.warehouses] }, `${warehouse.name} was created`);
    }
  }, [commit, data, refreshLive, notify]);

  const recordMovement = useCallback(async (movement: StockMovement) => {
    const isLive = authMode !== "demo" && Boolean(process.env.NEXT_PUBLIC_MMS_API_URL);
    if (isLive) {
      setLoading(true); setError(null);
      try {
        if (movement.type === "GR") {
          const item = data.items.find(current => current.name === movement.item);
          await mmsApi.createGoodsReceipt({
            ref: movement.ref,
            item: item?.id ?? movement.item,
            qty: movement.qty,
            warehouse: movement.warehouse,
            date: movement.date,
            by: movement.by,
          });
        } else {
          const item = data.items.find(current => current.name === movement.item);
          await mmsApi.adjustInventory({
            ...movement,
            item: item?.id ?? movement.item,
          });
        }
        await refreshLive();
        notify(`${movement.type} movement recorded`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Operation failed";
        setError(msg); notify(msg, "error");
        throw e;
      } finally {
        setLoading(false);
      }
    } else {
      const item = data.items.find(current => current.name === movement.item);
      const delta = movement.type === "GI" ? -Math.abs(movement.qty) : movement.type === "ADJ" ? movement.qty : Math.abs(movement.qty);
      const updatedItems = data.items.map(current => current.id !== item?.id ? current : { ...current, onHand: Math.max(0, current.onHand + delta), status: inventoryStatus(Math.max(0, current.onHand + delta), current.reorderLevel) });
      await commit({ ...data, items: updatedItems, movements: [movement, ...data.movements] }, `${movement.type} movement recorded`);
    }
  }, [commit, data, refreshLive, notify]);

  const addRequisition = useCallback(async (requisition: Requisition) => {
    const isLive = authMode !== "demo" && Boolean(process.env.NEXT_PUBLIC_MMS_API_URL);
    if (isLive) {
      setLoading(true); setError(null);
      try {
        const item = data.items.find(current => current.name === requisition.item);
        await mmsApi.createRequisition({
          ...requisition,
          item: item?.id ?? requisition.item,
        });
        await refreshLive();
        notify("Requisition submitted");
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Operation failed";
        setError(msg); notify(msg, "error");
        throw e;
      } finally {
        setLoading(false);
      }
    } else {
      await commit({ ...data, requisitions: [requisition, ...data.requisitions] }, "Requisition submitted");
    }
  }, [commit, data, refreshLive, notify]);

  const issueRequisition = useCallback(async (id: string) => {
    const isLive = authMode !== "demo" && Boolean(process.env.NEXT_PUBLIC_MMS_API_URL);
    if (isLive) {
      setLoading(true); setError(null);
      try {
        await mmsApi.issueRequisition(id);
        await refreshLive();
        notify(`${id} was issued`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Operation failed";
        setError(msg); notify(msg, "error");
        throw e;
      } finally {
        setLoading(false);
      }
    } else {
      const requisition = data.requisitions.find(current => current.id === id);
      if (!requisition) return;
      const item = data.items.find(current => current.name === requisition.item);
      if (!item || item.onHand - item.reserved < requisition.qty) { notify("Insufficient available stock", "error"); return; }
      const movement: StockMovement = { id: `MOV-${Date.now()}`, type: "GI", item: item.name, qty: -requisition.qty, warehouse: item.warehouse, ref: requisition.id, date: new Date().toISOString().slice(0,10), by: demoUser.name, note: `Issued to ${requisition.department}` };
      const nextItems = data.items.map(current => current.id !== item.id ? current : { ...current, onHand: current.onHand - requisition.qty, status: inventoryStatus(current.onHand - requisition.qty, current.reorderLevel) });
      const nextRequisitions = data.requisitions.map(current => current.id === id ? { ...current, status: "Issued" as const } : current);
      await commit({ ...data, items: nextItems, requisitions: nextRequisitions, movements: [movement, ...data.movements] }, `${requisition.id} was issued`);
    }
  }, [commit, data, refreshLive, notify]);

  const addSupplier = useCallback(async (supplier: Supplier) => {
    const isLive = authMode !== "demo" && Boolean(process.env.NEXT_PUBLIC_MMS_API_URL);
    if (isLive) {
      setLoading(true); setError(null);
      try { await mmsApi.createSupplier(supplier); await refreshLive(); notify(`${supplier.name} was added`); }
      catch (e) { const msg = e instanceof Error ? e.message : "Operation failed"; setError(msg); notify(msg, "error"); throw e; }
      finally { setLoading(false); }
    } else await commit({ ...data, suppliers: [supplier, ...data.suppliers] }, `${supplier.name} was added`);
  }, [commit, data, notify, refreshLive]);

  const updateSupplier = useCallback(async (supplier: Supplier) => {
    const isLive = authMode !== "demo" && Boolean(process.env.NEXT_PUBLIC_MMS_API_URL);
    if (isLive) {
      setLoading(true); setError(null);
      try { await mmsApi.updateSupplier(supplier); await refreshLive(); notify(`${supplier.name} was updated`); }
      catch (e) { const msg = e instanceof Error ? e.message : "Operation failed"; setError(msg); notify(msg, "error"); throw e; }
      finally { setLoading(false); }
    } else await commit({ ...data, suppliers: data.suppliers.map(current => current.id === supplier.id ? supplier : current) }, `${supplier.name} was updated`);
  }, [commit, data, notify, refreshLive]);

  const deactivateSupplier = useCallback(async (id: string) => {
    const supplier = data.suppliers.find(current => current.id === id);
    if (!supplier) return;
    const isLive = authMode !== "demo" && Boolean(process.env.NEXT_PUBLIC_MMS_API_URL);
    if (isLive) {
      setLoading(true); setError(null);
      try { await mmsApi.deleteSupplier(id); await refreshLive(); notify(`${supplier.name} was deactivated`); }
      catch (e) { const msg = e instanceof Error ? e.message : "Operation failed"; setError(msg); notify(msg, "error"); throw e; }
      finally { setLoading(false); }
    } else await commit({ ...data, suppliers: data.suppliers.map(current => current.id === id ? { ...current, status: "INACTIVE" } : current) }, `${supplier.name} was deactivated`);
  }, [commit, data, notify, refreshLive]);

  const resetData = useCallback(async () => {
    const isLive = authMode !== "demo" && Boolean(process.env.NEXT_PUBLIC_MMS_API_URL);
    if (isLive) {
      notify("Cannot reset live database from UI", "info");
    } else {
      await commit(initial, "Demo data restored");
    }
  }, [commit, notify]);

  const signOut = useCallback(() => { sessionStorage.removeItem("erp_access_token"); sessionStorage.removeItem("erp_refresh_token"); window.location.assign("/login"); }, []);

  const value = useMemo<MmsContextValue>(() => ({ ...data, loading, error, user, toasts, canWrite: user.permissions.includes("mms:write"), addItem, updateItem, addWarehouse, recordMovement, addRequisition, issueRequisition, addSupplier, updateSupplier, deactivateSupplier, resetData, notify, dismissToast, signOut }), [data, loading, error, user, toasts, addItem, updateItem, addWarehouse, recordMovement, addRequisition, issueRequisition, addSupplier, updateSupplier, deactivateSupplier, resetData, notify, dismissToast, signOut]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useMms() {
  const value = useContext(Context);
  if (!value) throw new Error("useMms must be used inside MmsProvider");
  return value;
}
