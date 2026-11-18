import { useState } from "react";
import { ArrowLeft, ShieldAlert, CheckCircle2, Lock } from "lucide-react";
import type { Student } from "@tapnpay/api-client";

interface ReportCardProps {
  student: Student;
  onBlockCard: () => Promise<void>;
  onBack: () => void;
}

export function ReportCard({ student, onBlockCard, onBack }: ReportCardProps) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReport = async () => {
    const confirm = window.confirm(
      "Are you sure you want to FREEZE your card? This will immediately prevent anyone from using it at cafeteria terminals."
    );
    if (!confirm) return;

    setLoading(true);
    try {
      await onBlockCard();
      setIsBlocked(true);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-slate-900">Card Security</h2>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-700">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Active Card</span>
            <span className="font-mono font-bold text-slate-900">
              {student.active_card_id || "Card not issued"}
            </span>
          </div>
        </div>

        {!isBlocked ? (
          <>
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Lost or Misplaced Your Card?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Freezing your card blocks it across all cafeteria POS terminals. Your wallet balance is safe and stored on the server — it cannot be spent once frozen.
              </p>
            </div>

            <button
              onClick={handleReport}
              disabled={loading}
              className="w-full py-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShieldAlert className="w-5 h-5" />
              <span>{loading ? "Freezing Card..." : "Freeze & Report Lost Card"}</span>
            </button>
          </>
        ) : (
          <div className="text-center py-6 space-y-3 bg-red-50 rounded-2xl border border-red-200 p-4">
            <CheckCircle2 className="w-12 h-12 text-red-600 mx-auto" />
            <h3 className="font-bold text-red-900 text-base">Card Successfully Frozen</h3>
            <p className="text-xs text-red-700">
              Your card has been placed on the cafeteria hotlist. Any POS terminal will reject it. Visit the cafeteria administration office to get a replacement card.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
