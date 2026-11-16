import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, Printer, X } from "lucide-react";
import { formatKobo } from "@tapnpay/ui";
import {
  formatTransactionDate,
  sampleTransactions,
  type SampleTransaction,
} from "../data/sampleTransactions";

type TransactionListProps = {
  transactions?: SampleTransaction[];
  limit?: number;
  onTransactionClick?: (transaction: SampleTransaction) => void;
};

export function TransactionList({
  transactions = sampleTransactions,
  limit,
  onTransactionClick,
}: TransactionListProps) {
  const [selectedTransaction, setSelectedTransaction] =
    useState<SampleTransaction | null>(null);
  const visibleTransactions = limit
    ? transactions.slice(0, limit)
    : transactions;

  useEffect(() => {
    if (!selectedTransaction) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedTransaction(null);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedTransaction]);

  if (!visibleTransactions.length) {
    return (
      <p className="px-5 py-10 text-center text-sm text-[#75685A]">
        No sample transactions match these filters.
      </p>
    );
  }

  return (
    <div className="divide-y divide-[#F0E7DE]">
      {visibleTransactions.map((transaction) => {
        const Icon = transaction.icon;
        const isSuccessful = transaction.status === "successful";
        const isIncoming = transaction.direction === "in";

        return (
          <article
            aria-label={`${transaction.merchant}, ${formatKobo(transaction.amountKobo)}, ${isSuccessful ? "Successful" : "Pending"}. View transaction details.`}
            className="grid cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-4 py-4 transition-colors hover:bg-[#FCFAF7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#8A5A16] sm:grid-cols-[minmax(220px,1.4fr)_minmax(180px,1fr)_minmax(110px,0.7fr)_120px_20px] sm:gap-4 sm:px-5"
            key={transaction.id}
            onClick={() =>
              onTransactionClick
                ? onTransactionClick(transaction)
                : setSelectedTransaction(transaction)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setSelectedTransaction(transaction);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#F8F0E5] text-[#8A5A16]">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <span className="min-w-0">
                <strong className="block truncate text-sm text-[#34271A]">
                  {transaction.merchant}
                </strong>
                <span className="mt-1 block text-xs text-[#75685A]">
                  {transaction.category}
                </span>
              </span>
            </div>
            <p className="col-span-2 text-xs text-[#8C8175] sm:col-span-1">
              {formatTransactionDate(transaction.date)} · {transaction.time}
              <span className="block pt-1 text-[11px] text-[#A09589]">
                {transaction.id}
              </span>
            </p>
            <strong
              className={`text-sm font-bold sm:text-right ${isIncoming ? "text-[#176B3A]" : isSuccessful ? "text-[#176B3A]" : "text-[#A66B1C]"}`}
            >
              {isIncoming ? "+" : "−"}
              {formatKobo(transaction.amountKobo)}
            </strong>
            <span
              className={`inline-flex w-fit items-center justify-self-end gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${isSuccessful ? "bg-[#E7F5EB] text-[#176B3A]" : "bg-[#FBF1DD] text-[#A66B1C]"}`}
            >
              {isSuccessful ? (
                <CheckCircle2 aria-hidden="true" className="size-3.5" />
              ) : (
                <Clock3 aria-hidden="true" className="size-3.5" />
              )}
              {isSuccessful ? "Successful" : "Pending"}
            </span>
          </article>
        );
      })}
      {selectedTransaction && (
        <div
          className="receipt-print-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedTransaction(null);
            }
          }}
        >
          <section
            aria-labelledby="transaction-detail-title"
            aria-modal="true"
            className="receipt-print-area my-auto w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
            role="dialog"
          >
            <header className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#F8F0E5] text-[#8A5A16]">
                  <selectedTransaction.icon
                    aria-hidden="true"
                    className="size-5"
                  />
                </span>
                <div className="min-w-0">
                  <h2
                    className="truncate text-lg font-bold text-[#34271A]"
                    id="transaction-detail-title"
                  >
                    {selectedTransaction.merchant}
                  </h2>
                  <p className="text-sm text-[#75685A]">
                    {selectedTransaction.category}
                  </p>
                </div>
              </div>
              <button
                aria-label="Close transaction details"
                className="grid size-9 shrink-0 place-items-center rounded-lg text-[#75685A] hover:bg-[#F8F3EC]"
                onClick={() => setSelectedTransaction(null)}
                type="button"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </header>

            <div className="mt-6 border-b border-[#F0E7DE] pb-5 text-center">
              <p className="text-3xl font-bold text-[#34271A]">
                {selectedTransaction.direction === "in" ? "+" : "−"}
                {formatKobo(selectedTransaction.amountKobo)}
              </p>
              <span
                className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${selectedTransaction.status === "successful" ? "bg-[#E7F5EB] text-[#176B3A]" : "bg-[#FBF1DD] text-[#A66B1C]"}`}
              >
                {selectedTransaction.status === "successful" ? (
                  <CheckCircle2 aria-hidden="true" className="size-3.5" />
                ) : (
                  <Clock3 aria-hidden="true" className="size-3.5" />
                )}
                {selectedTransaction.status === "successful"
                  ? "Successful"
                  : "Pending"}
              </span>
            </div>

            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[#75685A]">Date and time</dt>
                <dd className="text-right font-medium text-[#34271A]">
                  {formatTransactionDate(selectedTransaction.date)} ·{" "}
                  {selectedTransaction.time}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#75685A]">Transaction reference</dt>
                <dd className="text-right font-medium text-[#34271A]">
                  {selectedTransaction.id}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#75685A]">Type</dt>
                <dd className="text-right font-medium text-[#34271A]">
                  {selectedTransaction.direction === "in"
                    ? "Money received"
                    : "Payment sent"}
                </dd>
              </div>
            </dl>
            <button
              className="receipt-print-hide mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#8A5A16] px-4 py-2 text-sm font-semibold text-white hover:bg-[#70470F]"
              onClick={() => window.print()}
              type="button"
            >
              <Printer aria-hidden="true" className="size-4" />
              Print receipt
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
