import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Link } from "react-router-dom";
import { TransactionList } from "../components/TransactionList";
import {
  formatTransactionDate,
  mapWalletTransactions,
  type TransactionDirection,
} from "../data/sampleTransactions";
import { api, getApiErrorMessage } from "../lib/api";
import { PageHeading, usePortal } from "../portal/PortalShared";

export function TransactionsPage() {
  const { student } = usePortal();
  const [transactions, setTransactions] = useState<
    ReturnType<typeof mapWalletTransactions>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("all");
  const [direction, setDirection] = useState<"all" | TransactionDirection>(
    "all",
  );
  const [fromDate, setFromDate] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    api
      .getStudentWallet()
      .then((wallet) => {
        if (active) setTransactions(mapWalletTransactions(wallet.transactions));
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            getApiErrorMessage(
              requestError,
              "Could not load your transactions.",
            ),
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

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesStatus = status === "all" || transaction.status === status;
    const matchesDate = !fromDate || transaction.date >= fromDate;
    const matchesDirection =
      direction === "all" || transaction.direction === direction;
    return matchesStatus && matchesDate && matchesDirection;
  });

  async function exportTransactions() {
    const { default: ExcelJS } = await import("exceljs");
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "TapNPay";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Transactions");
    worksheet.columns = [
      { header: "Date", key: "date", width: 16 },
      { header: "Time", key: "time", width: 14 },
      { header: "Transaction ID", key: "id", width: 22 },
      { header: "Description", key: "merchant", width: 28 },
      { header: "Category", key: "category", width: 22 },
      { header: "Direction", key: "direction", width: 14 },
      { header: "Amount (NGN)", key: "amount", width: 18 },
      { header: "Status", key: "status", width: 14 },
    ];
    worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF8A5A16" },
    };

    filteredTransactions.forEach((transaction) => {
      const row = worksheet.addRow({
        date: formatTransactionDate(transaction.date),
        time: transaction.time,
        id: transaction.id,
        merchant: transaction.merchant,
        category: transaction.category,
        direction: transaction.direction === "in" ? "Money in" : "Money out",
        amount: transaction.amountKobo / 100,
        status: transaction.status,
      });
      row.getCell("amount").numFmt = '"₦"#,##0.00;[Red]-"₦"#,##0.00';
    });

    worksheet.views = [{ state: "frozen", ySplit: 1 }];
    worksheet.autoFilter = "A1:H1";

    const buffer = await workbook.xlsx.writeBuffer();
    const url = URL.createObjectURL(
      new Blob([buffer as BlobPart], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "tapnpay-transactions.xlsx";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeading
        title="Transactions"
        description="Your latest wallet transactions, including money sent and received."
      />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm text-[#53645A]">
            From date
            <input
              className="mt-1 block min-h-11 rounded-lg border border-[#EADCCB] bg-white px-3 py-2 text-sm text-[#34271A]"
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
            />
          </label>
          <div
            aria-label="Transaction direction"
            className="flex rounded-lg border border-[#EADCCB] bg-white p-1"
            role="group"
          >
            {(
              [
                ["all", "All"],
                ["in", "Money in"],
                ["out", "Money out"],
              ] as const
            ).map(([value, label]) => (
              <button
                aria-pressed={direction === value}
                className={`min-h-9 rounded-md px-3 text-sm ${direction === value ? "bg-[#8A5A16] font-semibold text-white" : "text-[#75685A] hover:bg-[#FBF8F3]"}`}
                key={value}
                onClick={() => setDirection(value)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
          <label className="text-sm text-[#53645A]">
            Payment status
            <select
              className="mt-1 block min-h-11 rounded-lg border border-[#EADCCB] bg-white px-3 py-2 text-sm text-[#34271A]"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="successful">Successful</option>
              <option value="pending">Pending</option>
            </select>
          </label>
        </div>
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#D7A34F] px-4 py-2 text-sm font-semibold text-[#34271A] hover:bg-[#E2B665]"
          onClick={exportTransactions}
          type="button"
        >
          <Download aria-hidden="true" className="size-4" />
          Export
        </button>
      </div>
      {(fromDate || status !== "all" || direction !== "all") && (
        <button
          className="min-h-10 px-2 text-sm font-semibold text-[#8A5A16] hover:underline"
          onClick={() => {
            setFromDate("");
            setStatus("all");
            setDirection("all");
          }}
          type="button"
        >
          Clear filters
        </button>
      )}
      <section className="overflow-hidden rounded-xl border border-[#EADCCB] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EADCCB] px-5 py-4">
          <h2 className="font-bold text-[#34271A]">Recent activity</h2>
          <span className="text-xs text-[#75685A]">Transaction records</span>
        </div>
        {loading ? (
          <p className="px-5 py-10 text-center text-sm text-[#75685A]" role="status">
            Loading transactions...
          </p>
        ) : error ? (
          <p className="px-5 py-10 text-center text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : (
          <TransactionList transactions={filteredTransactions} />
        )}
      </section>
      <Link
        className="inline-flex text-sm font-semibold text-[#8A5A16] no-underline hover:text-[#70470F]"
        to="/dashboard/receipts"
      >
        View digital receipts
      </Link>
    </div>
  );
}
