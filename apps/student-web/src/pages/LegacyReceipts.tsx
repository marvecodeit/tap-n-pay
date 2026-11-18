import { useState } from "react";
import { ArrowLeft, CheckCircle, Receipt } from "lucide-react";
import { formatKobo } from "@tapnpay/ui";
import type { Transaction } from "@tapnpay/api-client";

interface LegacyReceiptsProps {
  transactions: Transaction[];
  onBack: () => void;
}

export function Receipts({ transactions, onBack }: LegacyReceiptsProps) {
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  return (
    <div className="w-full max-w-md mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
          type="button"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-slate-900">Digital Receipts</h2>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
          <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">
            No Receipts Found
          </h3>
          <p className="text-xs text-slate-400">
            Receipts appear here automatically as soon as your cafeteria meal
            transactions sync.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => {
            const isVoid = transaction.status === "VOID";
            return (
              <button
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-sm transition-all hover:border-indigo-300"
                key={transaction.txn_id}
                onClick={() => setSelectedTxn(transaction)}
                type="button"
              >
                <span>
                  <span className="flex items-center gap-2">
                    <strong className="text-sm text-slate-900">
                      Cafeteria Meal
                    </strong>
                    {isVoid ? (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                        VOIDED
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        <CheckCircle className="size-3" /> PAID
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block font-mono text-xs text-slate-400">
                    Voucher: {transaction.verification_code || "Unavailable"} ·{" "}
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </span>
                </span>
                <strong
                  className={`font-mono text-base ${isVoid ? "text-slate-400 line-through" : "text-slate-900"}`}
                >
                  {formatKobo(transaction.amount)}
                </strong>
              </button>
            );
          })}
        </div>
      )}

      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <section
            aria-labelledby="receipt-title"
            aria-modal="true"
            className="w-full max-w-sm space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
            role="dialog"
          >
            <div className="border-b border-dashed border-slate-200 pb-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Official Meal Voucher
              </span>
              <h3
                className="text-base font-bold text-slate-800"
                id="receipt-title"
              >
                Campus Cafeteria
              </h3>
              <div className="my-2 font-mono text-3xl font-black text-slate-900">
                {formatKobo(selectedTxn.amount)}
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-bold text-slate-600">
                Verification: {selectedTxn.verification_code || "Unavailable"}
              </span>
            </div>
            <div className="space-y-2 font-mono text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Terminal:</span>
                <strong className="text-slate-900">
                  {selectedTxn.terminal_id}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Date &amp; Time:</span>
                <span>{new Date(selectedTxn.created_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Card ID:</span>
                <span>…{selectedTxn.card_id.slice(-4)}</span>
              </div>
              <div className="flex justify-between">
                <span>Transaction ID:</span>
                <span>{selectedTxn.txn_id.slice(0, 8)}</span>
              </div>
            </div>
            <button
              className="w-full rounded-2xl bg-slate-900 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800"
              onClick={() => setSelectedTxn(null)}
              type="button"
            >
              Close receipt
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
