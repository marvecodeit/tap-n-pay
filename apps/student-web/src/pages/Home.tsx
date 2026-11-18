import { useState } from "react";
import {
  PlusCircle,
  Receipt,
  ShieldAlert,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { formatKobo } from "@tapnpay/ui";
import type { Student, Transaction } from "@tapnpay/api-client";

interface HomeProps {
  student: Student;
  recentTxns: Transaction[];
  onNavigate: (tab: "home" | "topup" | "receipts" | "report") => void;
}

export function Home({ student, recentTxns, onNavigate }: HomeProps) {
  const [copied, setCopied] = useState(false);

  const copyCardId = () => {
    if (student.active_card_id) {
      navigator.clipboard.writeText(student.active_card_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Wallet Balance Hero Card */}
      <div className="bg-gradient-to-br from-[#342218] via-[#563713] to-[#70470F] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden border border-[#8A5A16]/50">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-[#F3B965]/10 rounded-full blur-2xl"></div>

        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[#F3B965]">
              Cafeteria Wallet
            </span>
            <h2 className="text-sm font-semibold text-white/90">
              {student.name}
            </h2>
          </div>
          <button
            onClick={copyCardId}
            className="text-[11px] font-mono bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1 rounded-full text-white/90 flex items-center gap-1 transition-all"
            title="Click to copy card ID"
          >
            {copied ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            ) : null}
            {copied ? "Copied" : student.active_card_id || "Card not issued"}
          </button>
        </div>

        <div className="space-y-1 mb-6">
          <span className="text-xs text-[#E5B452]">Available Balance</span>
          <div className="text-4xl font-extrabold tracking-tight font-mono">
            {formatKobo(student.balance ?? 0)}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onNavigate("topup")}
          className="w-full py-3.5 px-4 bg-[#F3B965] hover:bg-[#E5B452] text-[#342218] font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Top Up with Paystack</span>
        </button>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate("receipts")}
          className="p-4 bg-white rounded-2xl border border-[#EADCCB] shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between h-28 group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#F8F0E5] text-[#8A5A16] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-sm text-[#34271A] block">
              Digital Receipts
            </span>
            <span className="text-xs text-[#75685A]">Meal vouchers</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate("report")}
          className="p-4 bg-white rounded-2xl border border-[#EADCCB] shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between h-28 group"
        >
          <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-sm text-[#34271A] block">
              Lost Card
            </span>
            <span className="text-xs text-[#75685A]">Instant freeze</span>
          </div>
        </button>
      </div>

      {/* Recent Meal Transactions */}
      <div className="bg-white rounded-3xl p-5 border border-[#EADCCB] shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[#34271A] text-sm">Recent Activity</h3>
          <button
            onClick={() => onNavigate("receipts")}
            className="text-xs font-semibold text-[#8A5A16] hover:text-[#70470F] flex items-center gap-0.5"
          >
            See all <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTxns.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            Transactions will appear here once your account is connected.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentTxns.slice(0, 3).map((txn) => (
              <div
                key={txn.txn_id}
                className="py-3 flex justify-between items-center"
              >
                <div>
                  <span className="font-semibold text-sm text-slate-900 block">
                    Meal Payment ({txn.terminal_id})
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Code: {txn.verification_code || "Unavailable"} •{" "}
                    {new Date(txn.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-right font-black font-mono text-sm text-slate-900">
                  -{formatKobo(txn.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
