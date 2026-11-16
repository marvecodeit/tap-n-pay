import React from "react";
import { RefreshCw, Wifi, WifiOff, AlertTriangle } from "lucide-react";
import { formatKobo } from "@tapnpay/ui";

interface SyncBadgeProps {
  pendingCount: number;
  pendingAmountKobo: number;
  isSyncing: boolean;
  isOfflineLocked: boolean;
  lockReason?: string;
  onManualSync: () => void;
}

export function SyncBadge({
  pendingCount,
  pendingAmountKobo,
  isSyncing,
  isOfflineLocked,
  lockReason,
  onManualSync,
}: SyncBadgeProps) {
  if (isOfflineLocked) {
    return (
      <div className="w-full bg-red-600 text-white p-3 flex items-center justify-between shadow-lg sticky top-0 z-40 animate-pulse">
        <div className="flex items-center gap-2 text-sm font-bold">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{lockReason || "Terminal locked: Offline too long. Sync now."}</span>
        </div>
        <button
          onClick={onManualSync}
          disabled={isSyncing}
          className="px-3 py-1 bg-white text-red-600 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-slate-100 flex items-center gap-1 shadow"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
          {isSyncing ? "Syncing..." : "Sync"}
        </button>
      </div>
    );
  }

  const isPending = pendingCount > 0;

  return (
    <button
      type="button"
      onClick={onManualSync}
      disabled={isSyncing}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
        isPending
          ? "bg-amber-950/60 text-amber-300 border-amber-800 hover:bg-amber-900/60"
          : "bg-emerald-950/60 text-emerald-300 border-emerald-800 hover:bg-emerald-900/60"
      }`}
      title="Click to sync with backend"
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isPending ? "bg-amber-400" : "bg-emerald-400"
          }`}
        ></span>
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isPending ? "bg-amber-500" : "bg-emerald-500"
          }`}
        ></span>
      </span>

      {isSyncing ? (
        <span className="flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          Syncing...
        </span>
      ) : isPending ? (
        <span className="flex items-center gap-1.5">
          <WifiOff className="w-3.5 h-3.5 text-amber-400" />
          {pendingCount} pending ({formatKobo(pendingAmountKobo)})
        </span>
      ) : (
        <span className="flex items-center gap-1.5">
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          Online & Synced
        </span>
      )}
    </button>
  );
}
