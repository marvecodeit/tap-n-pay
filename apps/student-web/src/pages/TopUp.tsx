import { useState } from "react";
import { ArrowLeft, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { formatKobo } from "@tapnpay/ui";
import type { Student } from "@tapnpay/api-client";

interface TopUpProps {
  student: Student;
  onSuccess: (amountKobo: number) => void;
  onBack: () => void;
}

declare const PaystackPop: any;

export function TopUp({ student, onSuccess, onBack }: TopUpProps) {
  const [selectedAmountKobo, setSelectedAmountKobo] = useState<number>(200000); // ₦2,000 default
  const [customAmountNaira, setCustomAmountNaira] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const presets = [1000, 2000, 3000, 5000, 10000];

  const handlePreset = (naira: number) => {
    setSelectedAmountKobo(naira * 100);
    setCustomAmountNaira("");
  };

  const handleCustomChange = (val: string) => {
    setCustomAmountNaira(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setSelectedAmountKobo(parsed * 100);
    }
  };

  const handlePaystackPayment = () => {
    if (selectedAmountKobo < 10000) {
      setStatusMsg("Minimum top up is ₦100.00");
      return;
    }

    setIsProcessing(true);
    setStatusMsg(null);

    // Paystack public test key (or env configured)
    const paystackKey = "pk_test_sample_tapnpay_key";

    if (typeof PaystackPop !== "undefined") {
      const handler = PaystackPop.setup({
        key: paystackKey,
        email: student.email || "student@university.edu.ng",
        amount: selectedAmountKobo, // Paystack expects kobo
        currency: "NGN",
        ref: `topup_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        callback: (response: any) => {
          setIsProcessing(false);
          setStatusMsg("Payment received via Paystack! Crediting wallet...");
          onSuccess(selectedAmountKobo);
        },
        onClose: () => {
          setIsProcessing(false);
        },
      });
      handler.openIframe();
    } else {
      // Offline / demo fallback when external Paystack CDN is not loaded
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess(selectedAmountKobo);
      }, 1000);
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
        <h2 className="text-xl font-bold text-slate-900">Top Up Wallet</h2>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Select Amount
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {presets.map((preset) => {
              const kobo = preset * 100;
              const isSelected = selectedAmountKobo === kobo && !customAmountNaira;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePreset(preset)}
                  className={`py-3 px-2 rounded-2xl font-bold text-sm border-2 transition-all ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm"
                      : "border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  ₦{preset.toLocaleString()}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Or Custom Amount (₦)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-slate-400 font-bold text-lg">₦</span>
            <input
              type="number"
              placeholder="e.g. 7500"
              value={customAmountNaira}
              onChange={(e) => handleCustomChange(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center border border-slate-100">
          <span className="text-sm font-semibold text-slate-600">Total to Pay</span>
          <span className="text-2xl font-black font-mono text-slate-900">
            {formatKobo(selectedAmountKobo)}
          </span>
        </div>

        {statusMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        <button
          onClick={handlePaystackPayment}
          disabled={isProcessing}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-2xl font-black text-base shadow-lg transition-transform active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Zap className="w-5 h-5 fill-current" />
          <span>{isProcessing ? "Opening Paystack..." : `Pay ${formatKobo(selectedAmountKobo)}`}</span>
        </button>

        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Secured by Paystack. Direct cafeteria credit.</span>
        </div>
      </div>
    </div>
  );
}
