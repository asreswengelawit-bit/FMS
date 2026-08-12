import { items, movements, requisitions, warehouses } from "../data";
import type { MmsData } from "../types";

export interface MmsRepository {
  load(): Promise<MmsData>;
  save(data: MmsData): Promise<void>;
}

const STORAGE_KEY = "insa_erp_mms_data_v1";
const seed = (): MmsData => ({ items, movements, requisitions, warehouses });

export class LocalMmsRepository implements MmsRepository {
  async load(): Promise<MmsData> {
    if (typeof window === "undefined") return seed();
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return seed();
    try { return JSON.parse(stored) as MmsData; }
    catch { localStorage.removeItem(STORAGE_KEY); return seed(); }
  }

  async save(data: MmsData): Promise<void> {
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}
