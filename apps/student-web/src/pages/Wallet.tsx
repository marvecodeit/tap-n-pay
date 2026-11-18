import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  EyeOff,
  Plus,
  ReceiptText,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatKobo } from "@tapnpay/ui";
import { EmptyState, PageHeading, usePortal } from "../portal/PortalShared";
import { api, getApiErrorMessage } from "../lib/api";

const presetAmounts = [10000, 25000, 50000, 100000];

export function WalletPage() {
  const { student } = usePortal();
  const [wallet, setWallet] = useState<Awaited<
    ReturnType<typeof api.getStudentWallet>
  > | null>(null);
  const [walletLoading, setWalletLoading] = useState(true);
  const [walletError, setWalletError] = useState("");
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [amountNaira, setAmountNaira] = useState(2000);
  const [customAmount, setCustomAmount] = useState("");
  const [error, setError] = useState("");
  const amountKobo = amountNaira * 100;

  useEffect(() => {
    let active = true;

    api
      .getStudentWallet()
      .then((result) => {
        if (active) setWallet(result);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setWalletError(
            getApiErrorMessage(requestError, "Could not load wallet data."),
          );
        }
      })
      .finally(() => {
        if (active) setWalletLoading(false);
      });

    return () => {
      active = false;
    };
  }, [student?.student_id]);

  useEffect(() => {
    if (!isTopUpOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsTopUpOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTopUpOpen]);

  function startTopUp() {
    setError("Wallet top-ups are not available through the NestJS API yet.");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeading
        title="Wallet"
        description="View your wallet balance and recent transactions."
      />

      {walletError && (
        <p
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
          role="alert"
        >
          {walletError}
        </p>
      )}

      <section className="rounded-2xl bg-[#342218] p-5 text-white sm:p-6">
        <p className="text-sm text-white/75">AUL Student Wallet</p>
        <div className="mt-2 flex items-center gap-2">
          <p className="text-3xl font-bold">
            {!balanceVisible
              ? "₦••••••"
              : walletLoading
                ? "Loading..."
                : wallet
                  ? formatKobo(wallet.balanceKobo)
                  : "Unavailable"}
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
            setError("");
          }}
          type="button"
        >
          <Plus aria-hidden="true" className="size-4" />
          Top up
        </button>
        <Link
          className="inline-flex min-h-12 min-w-56 items-center justify-center gap-2 rounded-full border border-[#EADCCB] bg-white px-6 py-3 text-sm font-semibold text-[#8A5A16] no-underline hover:bg-[#FBF8F3]"
          to="/dashboard/transfer"
        >
          <Send aria-hidden="true" className="size-4" />
          Transfer
        </Link>
      </div>

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
                  {walletLoading
                    ? "Loading..."
                    : wallet
                      ? formatKobo(wallet.balanceKobo)
                      : "Unavailable"}
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
                !Number.isFinite(amountNaira) ||
                amountNaira < 100
              }
              onClick={startTopUp}
              type="button"
            >
              <ArrowUpRight aria-hidden="true" className="size-4" />
              Top up {formatKobo(amountKobo)}
            </button>
            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-[#8C857E]">
              <ShieldCheck aria-hidden="true" className="size-4" />
              NestJS wallet top-up service is not connected yet.
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
          {walletLoading ? (
            <p className="py-6 text-sm text-[#75685A]" role="status">
              Loading wallet history...
            </p>
          ) : wallet?.transactions.length ? (
            <ul className="divide-y divide-[#E9E9E9]">
              {wallet.transactions.map((transaction) => {
                const isCredit = transaction.type === "credit";
                return (
                  <li
                    className="flex flex-wrap items-center justify-between gap-3 py-4"
                    key={transaction.id}
                  >
                    <div>
                      <p className="font-semibold text-[#34271A]">
                        {transaction.description ||
                          (isCredit ? "Wallet credit" : "Wallet debit")}
                      </p>
                      <p className="mt-1 text-xs text-[#75685A]">
                        {new Date(transaction.createdAt).toLocaleString()} ·{" "}
                        {transaction.reference}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${isCredit ? "text-green-700" : "text-red-700"}`}
                      >
                        {isCredit ? "+" : "−"}
                        {formatKobo(transaction.amountKobo)}
                      </p>
                      <p className="mt-1 text-xs text-[#75685A]">
                        Balance: {formatKobo(transaction.balanceAfterKobo)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState
              icon={<ReceiptText className="size-5" />}
              title="No wallet transactions yet"
              detail="Your wallet activity will appear here."
            />
          )}
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
