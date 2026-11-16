import { CheckCircle2, ArrowRight, Printer, QrCode } from "lucide-react";
import { formatKobo } from "@tapnpay/ui";
import type { Student } from "@tapnpay/api-client";

interface CardIssuedModalProps {
  student: Student;
  isOpen: boolean;
  onProceed: () => void;
}

export function CardIssuedModal({ student, isOpen, onProceed }: CardIssuedModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in zoom-in-95 duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center border border-slate-200 relative overflow-hidden">
        {/* Confetti / celebration badge */}
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Account Active!
        </h2>
        <p className="text-xs text-slate-500 mt-1 mb-5">
          Your TapNPay cafeteria identity card has been issued and linked to your wallet.
        </p>

        {/* Card Token Visual Preview */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-xl text-left relative overflow-hidden mb-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-300 block">
                CAMPUS CAFETERIA CARD
              </span>
              <div className="font-extrabold text-base text-white">{student.name}</div>
              <div className="text-[11px] text-slate-400 font-mono">{student.student_id}</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
              TP
            </div>
          </div>

          {/* QR Graphic Graphic Placeholder */}
          <div className="bg-white p-3 rounded-xl flex items-center justify-center gap-3 text-slate-900 my-2">
            <QrCode className="w-12 h-12 text-slate-900" />
            <div className="text-left font-mono">
              <span className="text-[10px] uppercase text-slate-400 font-semibold block">Static Token</span>
              <span className="font-bold text-sm tracking-wide text-slate-900">{student.active_card_id}</span>
            </div>
          </div>

          <div className="mt-3 flex justify-between items-end text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">Opening Balance</span>
              <span className="text-emerald-400 font-black font-mono text-sm">
                {formatKobo(student.balance || 0)}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">No network needed</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={onProceed}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-black rounded-2xl text-sm shadow-md transition-transform active:scale-98 flex items-center justify-center gap-2"
          >
            <span>Go to My Wallet Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => window.print()}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save Card Slip</span>
          </button>
        </div>
      </div>
    </div>
  );
}
