"use client";

import { useState } from "react";
import { Plus, CheckCircle, AlertTriangle, XCircle, Play, RotateCcw } from "lucide-react";
import type { AccountingPeriod, PeriodCloseChecklist } from "../types/fms";
import {
  openPeriodAction,
  closePeriodAction,
  reopenPeriodAction,
} from "../actions/fms-actions";
import { runPreCloseChecklist } from "../api/journals";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/features/shared/components/ui/dialog";
import { StatusBadge } from "@/features/shared/components/StatusBadge";

interface PeriodManagerProps {
  initialPeriods: AccountingPeriod[];
}

export default function PeriodManager({ initialPeriods }: PeriodManagerProps) {
  const [periods, setPeriods] = useState<AccountingPeriod[]>(initialPeriods);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [checklist, setChecklist] = useState<PeriodCloseChecklist | null>(null);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [checklistLoading, setChecklistLoading] = useState(false);
  const [activePeriodId, setActivePeriodId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [periodName, setPeriodName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reopenReason, setReopenReason] = useState("");
  const [isReopenOpen, setIsReopenOpen] = useState(false);

  async function handleOpenPeriod(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!periodName || !startDate || !endDate) {
      setError("All fields are required.");
      return;
    }

    const res = await openPeriodAction({ ok: false }, { periodName, startDate, endDate });
    if (res.ok) {
      const mockNew: AccountingPeriod = {
        id: "mock_p_" + Date.now(),
        periodName,
        startDate,
        endDate,
        status: "OPEN",
        preparedBy: "general_accountant",
        closedBy: null,
        closedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: null,
      };
      setPeriods([mockNew, ...periods]);
      setIsCreateOpen(false);
      setPeriodName("");
      setStartDate("");
      setEndDate("");
    } else {
      setError(res.message || "Failed to open period.");
    }
  }

  async function handleLoadChecklist(periodId: string) {
    setChecklistLoading(true);
    setActivePeriodId(periodId);
    try {
      const checklistData = await runPreCloseChecklist(periodId);
      setChecklist(checklistData);
      setIsChecklistOpen(true);
    } catch (err: any) {
      alert("Failed to load checklist: " + err.message);
    } finally {
      setChecklistLoading(false);
    }
  }

  async function handleHardClose(periodId: string) {
    const res = await closePeriodAction(periodId);
    if (res.ok) {
      setPeriods(periods.map(p => 
        p.id === periodId 
          ? { ...p, status: "CLOSED", closedBy: "finance_manager", closedAt: new Date().toISOString() } 
          : p
      ));
      setIsChecklistOpen(false);
    } else {
      alert("Hard close failed: " + res.message);
    }
  }

  async function handleReopenPeriod(e: React.FormEvent) {
    e.preventDefault();
    if (!activePeriodId) return;
    const res = await reopenPeriodAction(activePeriodId, { reason: reopenReason });
    if (res.ok) {
      setPeriods(periods.map(p => p.id === activePeriodId ? { ...p, status: "OPEN", closedBy: null, closedAt: null } : p));
      setIsReopenOpen(false);
      setReopenReason("");
    } else {
      alert("Reopen failed: " + res.message);
    }
  }

  return (
    <div className="bg-white border rounded-lg p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Accounting Period Control</h2>
          <p className="text-xs text-slate-500">Lock, verify, and close operational months</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-2">
              <Plus size={14} /> Open Period
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-white">
            <DialogHeader>
              <DialogTitle>Open New Accounting Period</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleOpenPeriod} className="flex flex-col gap-4 mt-2">
              {error && <div className="text-red-500 text-sm">{error}</div>}
              
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="periodName">Period Name (YYYY-MM)</Label>
                <Input 
                  id="periodName" 
                  placeholder="e.g. 2026-08" 
                  value={periodName} 
                  onChange={e => setPeriodName(e.target.value)} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="start">Start Date</Label>
                  <Input 
                    type="date" 
                    id="start" 
                    value={startDate} 
                    onChange={e => setStartDate(e.target.value)} 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="end">End Date</Label>
                  <Input 
                    type="date" 
                    id="end" 
                    value={endDate} 
                    onChange={e => setEndDate(e.target.value)} 
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button type="submit">Open Period</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {periods.map(p => (
          <div key={p.id} className="flex flex-wrap items-center justify-between p-3.5 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-md">{p.periodName}</span>
                <span className="text-xs text-slate-400">({p.startDate} to {p.endDate})</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Prepared by {p.preparedBy} {p.closedBy && `· Closed by ${p.closedBy}`}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge status={p.status} />
              
              {p.status === "OPEN" && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  disabled={checklistLoading && activePeriodId === p.id}
                  onClick={() => handleLoadChecklist(p.id)}
                  className="text-xs flex items-center gap-1.5"
                >
                  <Play size={12} /> Close Checklist
                </Button>
              )}

              {p.status === "CLOSED" && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => { setActivePeriodId(p.id); setIsReopenOpen(true); }}
                  className="text-xs text-slate-500 flex items-center gap-1"
                >
                  <RotateCcw size={12} /> Reopen Period
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pre-close checklist dialog */}
      <Dialog open={isChecklistOpen} onOpenChange={setIsChecklistOpen}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle>Period Closure Verification Checklist</DialogTitle>
          </DialogHeader>
          {checklist && (
            <div className="flex flex-col gap-4 mt-2">
              <div className="text-sm text-slate-600">
                Evaluating period <strong className="text-slate-900">{checklist.periodName}</strong> for closure eligibility.
              </div>

              <div className="divide-y border rounded-lg bg-slate-50/50">
                {checklist.checklistItems.map((item, idx) => (
                  <div key={idx} className="flex gap-3 p-3 items-start">
                    {item.status === "PASS" ? (
                      <CheckCircle size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                    ) : item.status === "WARNING" ? (
                      <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-semibold text-sm text-slate-800">{item.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.description}</div>
                      {item.remedyHint && (
                        <div className="text-xs text-amber-600 mt-1 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-100">{item.remedyHint}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-3 pt-3 border-t">
                <div className="text-xs text-slate-400">
                  Status: {checklist.passed ? (
                    <span className="text-emerald-600 font-semibold">ALL CHECKS PASSED</span>
                  ) : (
                    <span className="text-rose-600 font-semibold">BLOCKERS FOUND</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsChecklistOpen(false)}>Cancel</Button>
                  
                  {checklist.passed && activePeriodId && (
                    <Button onClick={() => handleHardClose(activePeriodId)} className="bg-rose-600 hover:bg-rose-700 text-white">
                      Confirm Hard Close
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reopen Period dialog */}
      <Dialog open={isReopenOpen} onOpenChange={setIsReopenOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Reopen Accounting Period</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReopenPeriod} className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="reason">Justification Reason *</Label>
              <Input 
                id="reason" 
                placeholder="e.g. Audit correction needed for utilities accrual" 
                value={reopenReason} 
                onChange={e => setReopenReason(e.target.value)} 
              />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button type="button" variant="outline" onClick={() => setIsReopenOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white">Reopen Period</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
