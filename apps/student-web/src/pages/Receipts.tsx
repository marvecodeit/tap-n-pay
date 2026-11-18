import { useEffect, useState } from "react";
import { FileClock, Receipt } from "lucide-react";
import { Link } from "react-router-dom";
import { TransactionList } from "../components/TransactionList";
import {
  mapWalletTransactions,
  type SampleTransaction,
} from "../data/sampleTransactions";
import { api, getApiErrorMessage } from "../lib/api";
import { EmptyState, PageHeading, usePortal } from "../portal/PortalShared";
export { Receipts } from "./LegacyReceipts";

export function ReceiptsPage() {
  const { student } = usePortal();
  const [receipts, setReceipts] = useState<SampleTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    api
      .getStudentWallet()
      .then((wallet) => {
        if (active) {
          setReceipts(mapWalletTransactions(wallet.transactions));
        }
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            getApiErrorMessage(requestError, "Could not load your receipts."),
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [student?.student_id]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeading
        title="Digital receipts"
        description="Review and print receipts for money received and payments made."
      />
      {loading ? (
        <p
          className="rounded-xl border border-[#EADCCB] bg-white px-5 py-10 text-center text-sm text-[#75685A]"
          role="status"
        >
          Loading receipts...
        </p>
      ) : error ? (
        <p
          className="rounded-xl border border-red-200 bg-red-50 px-5 py-10 text-center text-sm text-red-800"
          role="alert"
        >
          {error}
        </p>
      ) : receipts.length ? (
        <section className="overflow-hidden rounded-xl border border-[#EADCCB] bg-white">
          <div className="border-b border-[#EADCCB] px-5 py-4">
            <h2 className="font-bold text-[#34271A]">Recent wallet receipts</h2>
            <p className="mt-1 text-xs text-[#75685A]">
              Select a payment to view and print its receipt.
            </p>
          </div>
          <TransactionList transactions={receipts} />
        </section>
      ) : (
        <EmptyState
          icon={<Receipt className="size-6" />}
          title="No receipts yet"
          detail="Receipts for wallet payments will appear here."
        />
      )}
      <Link
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#8A5A16] no-underline hover:text-[#70470F]"
        to="/dashboard/transactions"
      >
        <FileClock aria-hidden="true" className="size-4" />
        View transactions
      </Link>
    </div>
  );
}
