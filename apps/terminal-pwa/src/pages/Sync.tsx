import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  CheckCircle,
  Clock,
  ShieldCheck,
  Database,
} from "lucide-react";
import { getPendingTransactions } from "../db/transactions";
import {
  getLastSyncTime,
  getTerminalConfig,
  OFFLINE_LIMITS,
} from "../db/syncState";
import { performSync } from "../lib/sync";
import { formatKobo } from "@tapnpay/ui";
import type { Transaction } from "@tapnpay/api-client";

export function Sync() {
  const [pendingTxns, setPendingTxns] = useState<Transaction[]>([]);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  const loadData = async () => {
    const txns = await getPendingTransactions();
    const time = await getLastSyncTime();
    setPendingTxns(txns);
    setLastSync(time);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncStatusMsg(null);
    const result = await performSync();
    if (result.success) {
      setSyncStatusMsg(
        `Sync completed! ${result.syncedTxnCount} transactions uploaded.`,
      );
    } else {
      setSyncStatusMsg(`Sync failed: ${result.error}`);
    }
    await loadData();
    setIsSyncing(false);
  };

  const totalPendingKobo = pendingTxns.reduce(
    (sum, t) => sum + (t.status === "PENDING" ? t.amount : 0),
    0,
  );

  return (
    <div className="w-full max-w-xl mx-auto p-4 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Terminal Sync Engine</h2>
        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
          {isSyncing ? "Syncing..." : "Sync Now"}
        </button>
      </div>

      {syncStatusMsg && (
        <div className="p-3 bg-slate-800 border border-slate-700 text-sm rounded-xl text-slate-200">
          {syncStatusMsg}
        </div>
      )}

      {/* Sync Status Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase mb-1">
            <Clock className="w-4 h-4 text-indigo-400" />
            Last Synced
          </div>
          <div className="text-lg font-bold text-white">
            {lastSync ? lastSync.toLocaleTimeString() : "Never"}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {lastSync ? lastSync.toLocaleDateString() : "Initial sync needed"}
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase mb-1">
            <Database className="w-4 h-4 text-emerald-400" />
            Pending Uploads
          </div>
          <div className="text-lg font-bold text-emerald-400">
            {pendingTxns.length} txns
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {formatKobo(totalPendingKobo)} value
          </div>
        </div>
      </div>

      {/* Offline Safety Limits Card */}
      <div className="bg-slate-800/60 border border-slate-700/60 p-5 rounded-2xl">
        <div className="flex items-center gap-2 text-white font-bold text-sm mb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Offline Safety Guards
        </div>
        <div className="space-y-2 text-xs text-slate-300">
          <div className="flex justify-between py-1 border-b border-slate-700/60">
            <span>Max Offline Queue per Terminal</span>
            <span className="font-mono font-bold text-white">
              {OFFLINE_LIMITS.MAX_TERMINAL_OFFLINE_COUNT} txns /{" "}
              {formatKobo(OFFLINE_LIMITS.MAX_TERMINAL_OFFLINE_VALUE_KOBO)}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span>Terminal Lock Timeout</span>
            <span className="font-mono font-bold text-white">4 Hours</span>
          </div>
        </div>
      </div>
    </div>
  );
}
