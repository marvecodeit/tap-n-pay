import { CheckCircle2, Plus, ReceiptText } from "lucide-react";
import type { Card, Transaction } from "@tapnpay/api-client";
import { formatKobo } from "@tapnpay/ui";
import { StudentIdentity } from "./StudentIdentity";

interface ApprovalScreenProps {
  transaction: Transaction;
  card: Card;
  onDone: () => void;
  onViewHistory: () => void;
  notice?: string;
}

export function ApprovalScreen({
  transaction,
  card,
  onDone,
  onViewHistory,
  notice,
}: ApprovalScreenProps) {
  const timestamp = new Date(transaction.created_at);

  return (
    <section className="mx-auto w-full max-w-2xl rounded-2xl border border-[#E8DDCB] bg-white p-5 shadow-sm sm:p-8">
      <ol
        aria-label="Checkout progress"
        className="mb-8 flex items-center justify-center gap-2 sm:gap-3"
      >
        {["Amount", "Verify", "Complete"].map((step, index) => (
          <li className="flex items-center gap-2 sm:gap-3" key={step}>
            <span
              aria-current={index === 2 ? "step" : undefined}
              className={`grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                index === 2
                  ? "bg-[#8C5E1E] text-white"
                  : "bg-[#E8D5B6] text-[#76501D]"
              }`}
            >
              {index < 2 ? (
                <CheckCircle2 aria-hidden="true" className="size-4" />
              ) : (
                index + 1
              )}
            </span>
            <span
              className={`text-xs ${
                index === 2
                  ? "font-semibold text-[#8C5E1E]"
                  : "text-[#76501D]"
              }`}
            >
              {step}
            </span>
            {index < 2 && (
              <span
                aria-hidden="true"
                className="h-px w-5 bg-[#E8DDCB] sm:w-8"
              />
            )}
          </li>
        ))}
      </ol>
      <div className="text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-700">
          <CheckCircle2 aria-hidden="true" className="size-9" />
        </span>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
          Payment complete
        </p>
        <h1 className="mt-1 font-sora text-[26px] font-bold tracking-tight text-[#231B12]">
          Payment successful
        </h1>
        <p className="mt-2 text-xs text-[#75685A]">
          The demo transaction has been saved on this device.
        </p>
        <p className="mt-6 font-sora text-[34px] font-bold tracking-tight text-[#8C5E1E]">
          {formatKobo(transaction.amount)}
        </p>
      </div>

      <div className="my-7 rounded-xl border border-[#E8DDCB] bg-[#FAF8F4] p-4 sm:p-5">
        <StudentIdentity card={card} photoSize="small" />
      </div>

      <dl className="divide-y divide-[#EEE6DA] rounded-xl border border-[#E8DDCB] px-4 sm:px-5">
        <div className="flex flex-wrap justify-between gap-2 py-3 text-sm">
          <dt className="text-xs text-[#75685A]">Transaction reference</dt>
          <dd className="font-mono text-xs font-semibold text-[#231B12]">
            {transaction.verification_code || transaction.txn_id.slice(0, 12)}
          </dd>
        </div>
        <div className="flex flex-wrap justify-between gap-2 py-3 text-sm">
          <dt className="text-xs text-[#75685A]">Date &amp; time</dt>
          <dd className="text-xs font-medium text-[#231B12]">
            {timestamp.toLocaleString()}
          </dd>
        </div>
        <div className="flex flex-wrap justify-between gap-2 py-3 text-sm">
          <dt className="text-xs text-[#75685A]">Updated balance</dt>
          <dd className="font-sora text-xs font-bold text-[#231B12]">
            {formatKobo(card.balance)}
          </dd>
        </div>
      </dl>

      {notice && (
        <p
          className="mt-4 rounded-lg border border-[#E8DDCB] bg-[#FAF8F4] px-3 py-2 text-sm text-[#76501D]"
          role="status"
        >
          {notice}
        </p>
      )}

      <button
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#8C5E1E] px-5 py-3 font-bold text-white transition-colors hover:bg-[#744C18]"
        onClick={onDone}
        type="button"
      >
        <Plus aria-hidden="true" className="size-5" />
        New transaction
      </button>
      <button
        className="mt-3 inline-flex min-h-9 w-full items-center justify-center gap-2 text-xs font-semibold text-[#8C5E1E] transition-colors hover:text-[#744C18]"
        onClick={onViewHistory}
        type="button"
      >
        <ReceiptText aria-hidden="true" className="size-4" />
        View in transaction history
      </button>
    </section>
  );
}
