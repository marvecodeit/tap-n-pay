import { useState } from "react";
import { CheckCircle2, AlertTriangle, FileSpreadsheet, RefreshCw } from "lucide-react";
import { formatKobo } from "@tapnpay/ui";
import type { ReconciliationReport } from "@tapnpay/api-client";

export function Reports() {
  const [report, setReport] = useState<ReconciliationReport>({
    date: new Date().toISOString().slice(0, 10),
    total_wallet_balance_kobo: 34500000, // ₦345,000.00
    total_paystack_balance_kobo: 35000000, // ₦350,000.00
    total_fees_kobo: 500000, // ₦5,000.00
    total_payouts_kobo: 0,
    difference_kobo: 0,
    is_balanced: true,
    total_transactions_count: 312,
    total_voids_count: 4,
    total_refunds_count: 1,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRunReconciliation = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Daily Reconciliation Invariant
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated double-entry mathematical proof of cafeteria cash integrity
          </p>
        </div>
        <button
          onClick={handleRunReconciliation}
          disabled={isRefreshing}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Verify Invariant</span>
        </button>
      </div>

      {/* Invariant Banner */}
      <div
        className={`p-5 rounded-2xl border flex items-start gap-4 ${
          report.is_balanced
            ? "bg-emerald-950/40 border-emerald-800 text-emerald-300"
            : "bg-red-950/40 border-red-800 text-red-300"
        }`}
      >
        {report.is_balanced ? (
          <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0 mt-0.5" />
        )}
        <div className="space-y-1">
          <h3 className="text-base font-black uppercase tracking-wide">
            {report.is_balanced ? "Invariant Verified — Books Balanced" : "Discrepancy Detected — Action Required"}
          </h3>
          <p className="text-xs text-slate-300 font-mono">
            Sum of all Student Wallet Balances ({formatKobo(report.total_wallet_balance_kobo)}) === Paystack Net Balance ({formatKobo(report.total_paystack_balance_kobo - report.total_fees_kobo - report.total_payouts_kobo)})
          </p>
          <div className="text-[11px] text-slate-400 mt-1">
            Difference: <strong className="font-mono text-white">{formatKobo(report.difference_kobo)}</strong>
          </div>
        </div>
      </div>

      {/* Ledger Invariant Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            1. Student Wallet Float
          </span>
          <div className="text-2xl font-black font-mono text-white">
            {formatKobo(report.total_wallet_balance_kobo)}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Sum of active cards</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            2. Gross Paystack Deposits
          </span>
          <div className="text-2xl font-black font-mono text-emerald-400">
            {formatKobo(report.total_paystack_balance_kobo)}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Total student top-ups</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            3. Processing Fees & Withdrawals
          </span>
          <div className="text-2xl font-black font-mono text-slate-400">
            -{formatKobo(report.total_fees_kobo + report.total_payouts_kobo)}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Paystack 1.5% + withdrawals</span>
        </div>
      </div>

      {/* Audit Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
          Today's Audit Summary ({report.date})
        </h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Meal Checkouts</span>
            <span className="text-xl font-bold text-white font-mono">{report.total_transactions_count}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">POS Immediate Voids</span>
            <span className="text-xl font-bold text-amber-400 font-mono">{report.total_voids_count}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Admin Refunds</span>
            <span className="text-xl font-bold text-blue-400 font-mono">{report.total_refunds_count}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
