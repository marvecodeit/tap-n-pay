import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CalendarDays, Search } from "lucide-react";
import type { Transaction } from "@tapnpay/api-client";
import { formatKobo } from "@tapnpay/ui";
import { getCard } from "../db/balances";

type HistoryProps = {
  transactions: Transaction[];
  onRefresh: () => void | Promise<void>;
};

function statusStyle(status: Transaction["status"]) {
  if (status === "VOID" || status === "FAILED")
    return "bg-red-50 text-red-700";
  return "bg-emerald-50 text-emerald-800";
}

export function History({ transactions, onRefresh }: HistoryProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [studentIds, setStudentIds] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  async function refreshHistory() {
    try {
      await onRefresh();
      setError("");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not refresh transaction history.",
      );
    }
  }

  useEffect(() => {
    let active = true;
    async function loadStudentIds() {
      try {
        const entries = await Promise.all(
          transactions.map(async (transaction) => {
            const card = await getCard(transaction.card_id);
            return [transaction.txn_id, card?.student_id || ""] as const;
          }),
        );
        if (active) setStudentIds(Object.fromEntries(entries));
      } catch (cause) {
        if (active) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Could not load student details for the transaction history.",
          );
        }
      }
    }

    void loadStudentIds();
    return () => {
      active = false;
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const queryText = query.trim().toLowerCase();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const oneWeekAgo = new Date(startOfToday);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 6);

    return transactions.filter((transaction) => {
      const studentId = studentIds[transaction.txn_id] || "";
      const reference = (
        transaction.verification_code || transaction.txn_id
      ).toLowerCase();
      const matchesQuery =
        !queryText ||
        (transaction.student_name || "Student")
          .toLowerCase()
          .includes(queryText) ||
        studentId.toLowerCase().includes(queryText) ||
        reference.includes(queryText);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "successful" &&
          transaction.status !== "VOID" &&
          transaction.status !== "FAILED" &&
          (transaction.status === "PENDING" ||
            transaction.status === "SYNCED" ||
            transaction.status === "APPROVED")) ||
        (statusFilter === "failed" &&
          (transaction.status === "VOID" ||
            transaction.status === "FAILED"));
      const createdAt = new Date(transaction.created_at);
      const matchesDate =
        dateFilter === "all" ||
        (dateFilter === "today" && createdAt >= startOfToday) ||
        (dateFilter === "week" && createdAt >= oneWeekAgo);
      return matchesQuery && matchesStatus && matchesDate;
    });
  }, [dateFilter, query, statusFilter, studentIds, transactions]);

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8C5E1E]">
            Local activity
          </p>
          <h1 className="mt-1 font-sora text-[25px] font-bold tracking-tight text-[#231B12] sm:text-[36px]">
            Transaction history
          </h1>
          <p className="mt-1 text-sm text-[#75685A]">
            Payments recorded by this terminal.
          </p>
        </div>
        <span className="rounded-full border border-[#E8DDCB] bg-white px-3 py-1.5 text-xs font-medium text-[#75685A]">
          {transactions.length}{" "}
          {transactions.length === 1 ? "transaction" : "transactions"}
        </span>
      </header>

      <section className="overflow-hidden rounded-2xl border border-[#E8DDCB] bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-[#EEE6DA] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <label className="relative min-w-0 flex-1 sm:max-w-sm">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8B8072]"
            />
            <input
              className="min-h-11 w-full rounded-lg border border-[#E8DDCB] bg-[#FAF8F4] pl-9 pr-3 text-sm text-[#231B12] outline-none placeholder:text-[#9A8D7D] focus:border-[#8C5E1E] focus:ring-2 focus:ring-[#ECD8BC]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, matric no. or reference"
              type="search"
              value={query}
            />
          </label>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <label className="sr-only" htmlFor="history-date">
              Filter by date
            </label>
            <div className="relative">
              <CalendarDays
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8B8072]"
              />
              <select
                className="min-h-11 w-full appearance-none rounded-lg border border-[#E8DDCB] bg-white py-2 pl-9 pr-8 text-sm text-[#514638] outline-none focus:border-[#8C5E1E] sm:w-auto"
                id="history-date"
                onChange={(event) => setDateFilter(event.target.value)}
                value={dateFilter}
              >
                <option value="all">All dates</option>
                <option value="today">Today</option>
                <option value="week">Last 7 days</option>
              </select>
            </div>
            <label className="sr-only" htmlFor="history-status">
              Filter by status
            </label>
            <select
              className="min-h-11 rounded-lg border border-[#E8DDCB] bg-white px-3 py-2 text-sm text-[#514638] outline-none focus:border-[#8C5E1E]"
              id="history-status"
              onChange={(event) => setStatusFilter(event.target.value)}
              value={statusFilter}
            >
              <option value="all">All statuses</option>
              <option value="successful">Successful</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {error && (
          <p
            className="flex items-center gap-2 border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            <AlertCircle aria-hidden="true" className="size-4 shrink-0" />
            {error}
          </p>
        )}

        {filteredTransactions.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="font-semibold text-[#514638]">
              {transactions.length === 0
                ? "No transactions recorded yet."
                : "No transactions match these filters."}
            </p>
            <p className="mt-1 text-base text-[#8B8072]">
              Completed demo payments will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-[#FAF8F4] text-xs uppercase tracking-wide text-[#75685A]">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Reference</th>
                  <th className="px-5 py-3.5 font-semibold">Student</th>
                  <th className="px-5 py-3.5 font-semibold">Matriculation no.</th>
                  <th className="px-5 py-3.5 font-semibold">Amount</th>
                  <th className="px-5 py-3.5 font-semibold">Date &amp; time</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEE6DA]">
                {filteredTransactions.map((transaction) => {
                  const date = new Date(transaction.created_at);
                  return (
                    <tr
                      className="transition-colors hover:bg-[#FCFAF6]"
                      key={transaction.txn_id}
                    >
                      <td className="px-5 py-4 font-mono text-xs font-semibold text-[#76501D]">
                        {transaction.verification_code ||
                          transaction.txn_id.slice(0, 12)}
                      </td>
                      <td className="px-5 py-4 font-semibold text-[#231B12]">
                        {transaction.student_name || "Student"}
                      </td>
                      <td className="px-5 py-4 text-[#75685A]">
                        {studentIds[transaction.txn_id] || "—"}
                      </td>
                      <td className="px-5 py-4 font-sora font-semibold text-[#231B12]">
                        {formatKobo(transaction.amount)}
                      </td>
                      <td className="px-5 py-4 text-[#75685A]">
                        <time dateTime={transaction.created_at}>
                          {date.toLocaleDateString()}{" "}
                          {date.toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </time>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle(transaction.status)}`}
                        >
                          <span
                            aria-hidden="true"
                            className={`size-1.5 rounded-full ${
                              transaction.status === "VOID" ||
                              transaction.status === "FAILED"
                                ? "bg-red-600"
                                : "bg-emerald-600"
                            }`}
                          />
                          {transaction.status === "VOID" ||
                          transaction.status === "FAILED"
                            ? "Failed"
                            : "Successful"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EEE6DA] px-5 py-3.5">
          <p aria-live="polite" className="text-xs text-[#8B8072]">
            Showing {filteredTransactions.length} of {transactions.length}{" "}
            {transactions.length === 1 ? "transaction" : "transactions"}
          </p>
          <button
            className="min-h-10 rounded-lg border border-[#E8DDCB] px-4 text-sm font-semibold text-[#514638] hover:bg-[#FAF8F4]"
            onClick={() => void refreshHistory()}
            type="button"
          >
            Refresh history
          </button>
        </div>
      </section>
    </div>
  );
}
