import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  EyeOff,
  Plus,
  ReceiptText,
  ShieldCheck,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatKobo } from "@tapnpay/ui";
import { EmptyState, PageHeading, usePortal } from "../portal/PortalShared";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const presetAmounts = [10000, 25000, 50000, 100000];

type TopUpInitResponse = {
  authorization_url: string;
};

export function WalletPage() {
  const { student } = usePortal();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [amountNaira, setAmountNaira] = useState(2000);
  const [customAmount, setCustomAmount] = useState("");
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const amountKobo = amountNaira * 100;

  useEffect(() => {
    if (!isTopUpOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsTopUpOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTopUpOpen]);

  async function startTopUp() {
    if (!student?.student_id || student.isLocal) {
      setError(
        "Wallet funding is unavailable until your account is registered with the card service.",
      );
      return;
    }

    setIsStartingCheckout(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/v1/topups/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: student.student_id,
          amount_kobo: amountKobo,
          email: student.email,
        }),
      });
      const result = (await response.json()) as TopUpInitResponse & {
        detail?: string;
      };
      if (!response.ok || !result.authorization_url) {
        throw new Error(
          result.detail || "The payment service could not start checkout.",
        );
      }
      window.location.assign(result.authorization_url);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to reach the payment service.",
      );
    } finally {
      setIsStartingCheckout(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeading
        title="Wallet"
        description="Manage your wallet and review wallet activity."
      />

      <section className="rounded-2xl bg-[#342218] p-5 text-white sm:p-6">
        <p className="text-sm text-white/75">AUL Student Wallet</p>
        <div className="mt-2 flex items-center gap-2">
          <p className="text-3xl font-bold">
            {balanceVisible ? formatKobo(student?.balance ?? 0) : "₦••••••"}
          </p>
          <button
            aria-label={balanceVisible ? "Hide balance" : "Show balance"}
            className="grid size-8 place-items-center rounded-full text-white/75 hover:bg-white/10 hover:text-white"
            onClick={() => setBalanceVisible((visible) => !visible)}
            type="button"
          >
            {balanceVisible ? (
              <Eye aria-hidden="true" className="size-5" />
            ) : (
              <EyeOff aria-hidden="true" className="size-5" />
            )}
          </button>
        </div>
        <p className="mt-1 text-sm text-white/75">Available balance</p>
        <p className="mt-5 border-t border-white/20 pt-4 text-sm leading-relaxed text-white/65">
          Wallet funds are spendable on fees and charges. Refund credits appear
          here but cannot be withdrawn as cash.
        </p>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          aria-expanded={isTopUpOpen}
          className="inline-flex min-h-12 min-w-56 items-center justify-center gap-2 rounded-full bg-[#8A5A16] px-6 py-3 text-sm font-semibold text-white hover:bg-[#70470F]"
          onClick={() => {
            setIsTopUpOpen(true);
            setNotice("");
            setError("");
          }}
          type="button"
        >
          <Plus aria-hidden="true" className="size-4" />
          Top up
        </button>
        <button
          className="inline-flex min-h-12 min-w-56 items-center justify-center gap-2 rounded-full border border-[#EADCCB] bg-white px-6 py-3 text-sm font-semibold text-[#8A5A16] hover:bg-[#FBF8F3]"
          onClick={() => {
            setIsTopUpOpen(false);
            setNotice("Fee payments are not available yet.");
          }}
          type="button"
        >
          <ArrowUpRight aria-hidden="true" className="size-4" />
          Pay fees
        </button>
      </div>

      {notice && (
        <p className="text-sm text-[#75685A]" role="status">
          {notice}
        </p>
      )}

      {isTopUpOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsTopUpOpen(false);
          }}
        >
          <section
            aria-labelledby="topup-title"
            aria-modal="true"
            className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-[660px] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
            role="dialog"
          >
            <header className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-[#34271A]" id="topup-title">
                Top-up Wallet
              </h2>
              <button
                aria-label="Close top-up dialog"
                className="grid size-9 place-items-center rounded-full text-[#75685A] hover:bg-[#F8F3EC]"
                onClick={() => setIsTopUpOpen(false)}
                type="button"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </header>

            <div className="rounded-2xl bg-[#342218] p-5 text-white">
              <p className="text-xs text-[#F3B965]">AUL Student Wallet</p>
              <p className="mt-2 text-lg font-bold">
                {student?.name || "Student account"}
              </p>
              <div className="mt-4 border-t border-white/20 pt-4">
                <p className="text-xs text-[#F3B965]">Current balance</p>
                <p className="mt-2 text-2xl font-bold">
                  {formatKobo(student?.balance ?? 0)}
                </p>
              </div>
            </div>

            <section className="mt-4 overflow-hidden rounded-2xl border border-[#E9E9E9]">
              <h3 className="border-b border-[#E9E9E9] px-5 py-4 font-bold text-[#34271A]">
                Top up amount
              </h3>
              <div className="space-y-4 p-4 sm:p-5">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {presetAmounts.map((amount) => (
                    <button
                      aria-pressed={!customAmount && amountNaira === amount}
                      className={`min-h-10 rounded-full border px-3 py-2 text-sm font-medium ${!customAmount && amountNaira === amount ? "border-[#8A5A16] bg-[#F6EBDD] text-[#70470F]" : "border-[#E6E2DE] bg-[#F5F4F3] text-[#51483F] hover:bg-[#EEEAE6]"}`}
                      key={amount}
                      onClick={() => {
                        setAmountNaira(amount);
                        setCustomAmount("");
                      }}
                      type="button"
                    >
                      ₦{amount.toLocaleString("en-NG")}
                    </button>
                  ))}
                </div>
                <label className="block text-sm font-medium text-[#51483F]">
                  Or enter amount (₦)
                  <input
                    className="mt-2 w-full appearance-none rounded-full border border-[#D8D2CC] bg-white px-4 py-3 text-[#34271A] [color-scheme:light] outline-none focus:border-[#8A5A16] focus:ring-2 focus:ring-[#F6EBDD]"
                    min="100"
                    onChange={(event) => {
                      const value = event.target.value;
                      setCustomAmount(value);
                      if (value) setAmountNaira(Number(value));
                    }}
                    type="number"
                    value={customAmount}
                  />
                </label>
                <strong className="block text-sm text-[#70470F]">
                  {formatKobo(amountKobo)}
                </strong>
                <p className="rounded-xl bg-[#F8F3EC] p-3 text-xs leading-relaxed text-[#75685A]">
                  Wallet funds are spendable on fees and charges but are not
                  withdrawable as cash. Refund credits also appear here.
                </p>
              </div>
            </section>

            <button
              className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#8A5A16] px-4 py-3 text-sm font-bold text-white hover:bg-[#70470F] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={
                isStartingCheckout ||
                !Number.isFinite(amountNaira) ||
                amountNaira < 100
              }
              onClick={startTopUp}
              type="button"
            >
              <ArrowUpRight aria-hidden="true" className="size-4" />
              {isStartingCheckout
                ? "Connecting to payment service…"
                : `Top up ${formatKobo(amountKobo)} via Paystack`}
            </button>
            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-[#8C857E]">
              <ShieldCheck aria-hidden="true" className="size-4" />
              Secured by Paystack · SSL encrypted
            </p>
            {error && (
              <p className="mt-3 text-sm text-red-700" role="alert">
                {error}
              </p>
            )}
          </section>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-[#E9E9E9] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E9E9E9] px-5 py-5">
          <div className="flex items-center gap-2">
            <ArrowDownLeft
              aria-hidden="true"
              className="size-5 text-[#8A5A16]"
            />
            <h2 className="font-bold text-[#34271A]">Wallet history</h2>
          </div>
        </div>
        <div className="px-5 pb-5">
          <EmptyState
            icon={<ReceiptText className="size-5" />}
            title="No wallet activity yet"
            detail="Confirmed top-ups and fee payments will appear here when wallet history is available."
          />
          <Link
            className="mt-4 inline-flex text-sm font-semibold text-[#8A5A16] no-underline hover:underline"
            to="/dashboard/receipts"
          >
            View digital receipts
          </Link>
        </div>
      </section>
    </div>
  );
}
