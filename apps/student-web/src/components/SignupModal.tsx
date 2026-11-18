import { useState } from "react";
import { X, ShieldCheck, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import type { Student } from "@tapnpay/api-client";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (student: Student) => void;
}

export function SignupModal({ isOpen, onClose, onSuccess }: SignupModalProps) {
  const [name, setName] = useState("");
  const [matricNumber, setMatricNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [initialDepositNaira, setInitialDepositNaira] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !matricNumber.trim()) {
      setErrorMsg("Please provide your full name and matriculation number.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const initialKobo = (parseInt(initialDepositNaira, 10) || 0) * 100;

    try {
      const res = await fetch("http://localhost:8000/api/v1/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          student_id: matricNumber.trim().toUpperCase(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          initial_balance_kobo: initialKobo,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Registration failed" }));
        throw new Error(err.detail || `Server error (${res.status})`);
      }

      const newStudent: Student = await res.json();
      onSuccess(newStudent);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Registration could not reach the backend. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative border border-slate-200 overflow-hidden">
        {/* Glow header decoration */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl"></div>

        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">
              TP
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Open Student Account</h2>
              <span className="text-[11px] text-slate-500 block">Instant QR card & cafeteria wallet</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Toluwalase Adebayo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Student / Matric Number *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. STU-2026-442"
              value={matricNumber}
              onChange={(e) => setMatricNumber(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                University Email
              </label>
              <input
                type="email"
                placeholder="student@uni.edu.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="080XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Starter Meal Credit (₦)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">₦</span>
              <input
                type="number"
                value={initialDepositNaira}
                onChange={(e) => setInitialDepositNaira(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="2000"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Funds your cafeteria meal wallet upon account creation.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-2xl font-black text-sm shadow-lg transition-transform active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isSubmitting ? "Generating Card Token..." : "Create Account & Activate Card"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>No physical hardware needed. Instant digital token.</span>
        </div>
      </div>
    </div>
  );
}
