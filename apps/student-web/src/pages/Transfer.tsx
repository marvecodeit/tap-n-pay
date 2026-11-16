import { useMemo, useState, type KeyboardEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Clock3,
  Search,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  recentRecipients,
  recentTransfers,
  type TransferRecipient,
} from "../data/transferRecipients.js";
import { PageHeading } from "../portal/PortalShared";

type TransferStep =
  "find" | "amount" | "review" | "pending" | "success" | "failed";

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}.00`;
}

export function TransferPage() {
  const [step, setStep] = useState<TransferStep>("find");
  const [query, setQuery] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [recipient, setRecipient] = useState<TransferRecipient | null>(null);
  const normalizedQuery = query.trim().toLowerCase();

  const matchedRecipients = useMemo(
    () =>
      recentRecipients.filter((student) =>
        `${student.name} ${student.matric}`
          .toLowerCase()
          .includes(normalizedQuery),
      ),
    [normalizedQuery],
  );

  function selectRecipient(student: TransferRecipient) {
    setRecipient(student);
    setStep("amount");
  }

  function continueWithSearch() {
    if (!normalizedQuery) return;
    const match = matchedRecipients[0];
    if (match) {
      selectRecipient(match);
      return;
    }

    const initials = query
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
    selectRecipient({
      name: query.trim(),
      matric: "Demo TapNPay Student",
      initials: initials || "TS",
    });
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      continueWithSearch();
    }
  }

  function resetTransfer() {
    setStep("find");
    setQuery("");
    setAmount("");
    setNote("");
    setRecipient(null);
  }

  if (step === "success" || step === "failed") {
    const succeeded = step === "success";
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center">
        <section className="w-full rounded-2xl border border-[#EADCCB] bg-white p-8 text-center shadow-sm sm:p-10">
          <span
            className={`mx-auto grid size-16 place-items-center rounded-full ${succeeded ? "bg-[#E8F3E8] text-[#176B3A]" : "bg-[#FBEAEA] text-[#A33B31]"}`}
          >
            {succeeded ? (
              <Check className="size-8" />
            ) : (
              <X className="size-8" />
            )}
          </span>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-[#8A5A16]">
            {succeeded ? "Transaction complete" : "Action needed"}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#34271A]">
            {succeeded ? "Transfer successful" : "Transfer failed"}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[#75685A]">
            {succeeded
              ? `${formatNaira(Number(amount))} was sent to ${recipient?.name}. This is a demo; no funds were moved.`
              : "The demo could not process this transfer. No funds were deducted."}
          </p>
          {succeeded && (
            <div className="mt-6 rounded-xl bg-[#F8F3EC] px-4 py-3 text-sm">
              <span className="text-[#75685A]">Reference </span>
              <strong className="text-[#34271A]">TPN-9842-DA7X</strong>
            </div>
          )}
          <button
            className="mt-7 min-h-12 w-full rounded-lg bg-[#8A5A16] px-5 text-sm font-bold text-white transition-colors hover:bg-[#70470F]"
            onClick={resetTransfer}
            type="button"
          >
            Make another transfer
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeading
        title="Transfer"
        description="Send money instantly to any registered TapNPay student."
      />

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,1fr)]">
        <section className="overflow-hidden rounded-2xl border border-[#EADCCB] bg-white shadow-sm">
          <ol
            aria-label="Transfer steps"
            className="grid grid-cols-3 border-b border-[#EADCCB] bg-[#FCFAF7] px-4 py-4 sm:px-7"
          >
            {(["Recipient", "Amount", "Review"] as const).map(
              (label, index) => {
                const activeIndex =
                  step === "find" ? 0 : step === "amount" ? 1 : 2;
                const active = index <= activeIndex;
                return (
                  <li
                    className="flex min-w-0 items-center gap-2 sm:gap-3"
                    key={label}
                  >
                    <span
                      className={`grid size-7 shrink-0 place-items-center rounded-full border text-xs font-bold ${active ? "border-[#8A5A16] bg-[#8A5A16] text-white" : "border-[#D8CCBD] text-[#8C8175]"}`}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={`truncate text-xs font-semibold sm:text-sm ${active ? "text-[#8A5A16]" : "text-[#8C8175]"}`}
                    >
                      {label}
                    </span>
                    {index < 2 && (
                      <span
                        aria-hidden="true"
                        className="ml-1 h-px min-w-2 flex-1 bg-[#EADCCB] sm:ml-2"
                      />
                    )}
                  </li>
                );
              },
            )}
          </ol>

          {step === "find" && (
            <div className="p-5 sm:p-8">
              <h2 className="text-xl font-bold text-[#34271A] sm:text-2xl">
                Who are you sending to?
              </h2>
              <label
                className="mb-2 mt-5 block text-xs font-semibold uppercase tracking-[0.12em] text-[#75685A]"
                htmlFor="recipient-search"
              >
                Search registered students
              </label>
              <div className="flex min-h-12 items-center gap-3 rounded-xl border border-[#DCCDBB] px-4 focus-within:border-[#8A5A16] focus-within:ring-2 focus-within:ring-[#F8F0E5]">
                <Search
                  aria-hidden="true"
                  className="size-5 shrink-0 text-[#75685A]"
                />
                <input
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#34271A] outline-none placeholder:text-[#9A8874] sm:text-base"
                  id="recipient-search"
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Name or matric number"
                  value={query}
                />
                {normalizedQuery && (
                  <button
                    className="text-sm font-bold text-[#8A5A16] hover:text-[#70470F]"
                    onClick={continueWithSearch}
                    type="button"
                  >
                    Continue
                  </button>
                )}
              </div>

              <div className="mt-7 flex items-center justify-between border-b border-[#EADCCB] pb-2">
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#75685A]">
                  {normalizedQuery ? "Search results" : "Recent recipients"}
                </h3>
                <span className="text-xs text-[#8C8175]">
                  {matchedRecipients.length} students
                </span>
              </div>
              <div className="divide-y divide-[#EADCCB]">
                {matchedRecipients.map((student) => (
                  <button
                    className="flex min-h-[70px] w-full items-center gap-3 text-left transition-colors hover:bg-[#FCFAF7]"
                    key={student.matric}
                    onClick={() => selectRecipient(student)}
                    type="button"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#F2E4D0] text-sm font-bold text-[#8A5A16]">
                      {student.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <strong className="block truncate text-sm font-bold text-[#34271A]">
                        {student.name}
                      </strong>
                      <span className="mt-1 block text-xs text-[#75685A]">
                        {student.matric}
                      </span>
                    </span>
                    <ChevronRight
                      aria-hidden="true"
                      className="size-5 shrink-0 text-[#34271A]"
                    />
                  </button>
                ))}
                {normalizedQuery && matchedRecipients.length === 0 && (
                  <div className="py-6 text-sm text-[#75685A]">
                    <strong className="text-[#34271A]">
                      No registered student found
                    </strong>
                    <p className="mt-1">
                      Continue to use “{query.trim()}” as a demo recipient.
                    </p>
                  </div>
                )}
              </div>
        
            </div>
          )}

          {step === "amount" && recipient && (
            <div className="space-y-5 p-5 sm:p-8">
              <div className="flex items-center gap-3 rounded-xl bg-[#FCFAF7] p-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#F2E4D0] font-bold text-[#8A5A16]">
                  {recipient.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8A5A16]">
                    Sending to
                  </span>
                  <strong className="mt-1 block truncate text-base text-[#34271A]">
                    {recipient.name}
                  </strong>
                  <span className="text-xs text-[#75685A]">
                    {recipient.matric}
                  </span>
                </span>
                <button
                  className="text-sm font-semibold text-[#8A5A16] hover:text-[#70470F]"
                  onClick={() => setStep("find")}
                  type="button"
                >
                  Change
                </button>
              </div>
              <label
                className="block text-sm font-semibold text-[#4F4235]"
                htmlFor="transfer-amount"
              >
                Amount
              </label>
              <div className="flex h-16 items-center rounded-xl border border-[#DCCDBB] px-4 focus-within:border-[#8A5A16] focus-within:ring-2 focus-within:ring-[#F8F0E5]">
                <span className="mr-2 text-2xl font-bold text-[#8A5A16]">
                  ₦
                </span>
                <input
                  autoFocus
                  className="min-w-0 flex-1 bg-transparent text-3xl font-bold text-[#34271A] outline-none placeholder:text-[#C6B8A7]"
                  id="transfer-amount"
                  inputMode="numeric"
                  onChange={(event) =>
                    setAmount(event.target.value.replace(/\D/g, ""))
                  }
                  placeholder="0"
                  value={amount}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[1000, 2500, 5000, 10000].map((value) => (
                  <button
                    className="min-h-10 rounded-lg border border-[#EADCCB] px-2 text-sm font-semibold text-[#6B5D4D] hover:border-[#8A5A16] hover:bg-[#FBF8F3]"
                    key={value}
                    onClick={() => setAmount(String(value))}
                    type="button"
                  >
                    ₦{value.toLocaleString("en-NG")}
                  </button>
                ))}
              </div>
              <label
                className="block text-sm font-semibold text-[#4F4235]"
                htmlFor="transfer-note"
              >
                Note{" "}
                <span className="font-normal text-[#8C8175]">(optional)</span>
              </label>
              <input
                className="min-h-12 w-full rounded-xl border border-[#DCCDBB] bg-white px-4 text-sm text-[#34271A] outline-none placeholder:text-[#9A8874] focus:border-[#8A5A16] focus:ring-2 focus:ring-[#F8F0E5]"
                id="transfer-note"
                onChange={(event) => setNote(event.target.value)}
                placeholder="What’s this for?"
                value={note}
              />
              <button
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#8A5A16] px-5 text-sm font-bold text-white transition-colors hover:bg-[#70470F] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!amount || Number(amount) <= 0}
                onClick={() => setStep("review")}
                type="button"
              >
                Review transfer{" "}
                <ArrowRight aria-hidden="true" className="size-4" />
              </button>
            </div>
          )}

          {step === "review" && recipient && (
            <div className="p-5 sm:p-8">
              <div className="text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-full bg-[#F8F0E5] text-[#8A5A16]">
                  <Send aria-hidden="true" className="size-5" />
                </span>
                <h2 className="mt-4 text-xl font-bold text-[#34271A]">
                  Review your transfer
                </h2>
                <p className="mt-1 text-sm text-[#75685A]">
                  Check the details before confirming.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3 border-b border-[#EADCCB] pb-5">
                <span className="grid size-11 place-items-center rounded-full bg-[#F2E4D0] font-bold text-[#8A5A16]">
                  {recipient.initials}
                </span>
                <span>
                  <strong className="block text-sm text-[#34271A]">
                    {recipient.name}
                  </strong>
                  <span className="text-xs text-[#75685A]">
                    {recipient.matric}
                  </span>
                </span>
              </div>
              <dl className="divide-y divide-[#F0E7DE] text-sm">
                <div className="flex justify-between gap-4 py-4">
                  <dt className="text-[#75685A]">Amount</dt>
                  <dd className="font-semibold text-[#34271A]">
                    {formatNaira(Number(amount))}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-4">
                  <dt className="text-[#75685A]">Note</dt>
                  <dd className="max-w-[60%] truncate font-semibold text-[#34271A]">
                    {note || "No note"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-4">
                  <dt className="text-[#75685A]">Transfer fee</dt>
                  <dd className="font-semibold text-[#34271A]">₦0.00</dd>
                </div>
                <div className="flex justify-between gap-4 py-4 text-base">
                  <dt className="font-bold text-[#34271A]">Total</dt>
                  <dd className="font-bold text-[#34271A]">
                    {formatNaira(Number(amount))}
                  </dd>
                </div>
              </dl>
              <button
                className="mt-5 min-h-12 w-full rounded-lg bg-[#8A5A16] px-5 text-sm font-bold text-white transition-colors hover:bg-[#70470F]"
                onClick={() => setStep("pending")}
                type="button"
              >
                Confirm transfer
              </button>
              <button
                className="mt-2 min-h-11 w-full rounded-lg px-5 text-sm font-semibold text-[#75685A] hover:bg-[#FCFAF7]"
                onClick={() => setStep("amount")}
                type="button"
              >
                Edit details
              </button>
            </div>
          )}

          {step === "pending" && (
            <div className="p-6 text-center sm:p-8">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#FBF1DD] text-[#8A5A16]">
                <Clock3 aria-hidden="true" className="size-6" />
              </span>
              <h2 className="mt-4 text-xl font-bold text-[#34271A]">
                Transfer pending
              </h2>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  className="min-h-12 rounded-lg bg-[#8A5A16] px-4 text-sm font-bold text-white hover:bg-[#70470F]"
                  onClick={() => setStep("success")}
                  type="button"
                >
                  Confirm success
                </button>
                <button
                  className="min-h-12 rounded-lg border border-[#EADCCB] px-4 text-sm font-bold text-[#6B5D4D] hover:bg-[#FCFAF7]"
                  onClick={() => setStep("failed")}
                  type="button"
                >
                  Simulate failure
                </button>
              </div>
              <button
                className="mt-3 min-h-10 px-4 text-sm font-semibold text-[#75685A] hover:text-[#34271A]"
                onClick={resetTransfer}
                type="button"
              >
                Cancel
              </button>
            </div>
          )}
        </section>

        <aside className="rounded-2xl border border-[#EADCCB] bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A5A16]">
            Recent
          </p>
          <h2 className="mt-1 text-xl font-bold text-[#34271A]">
            Transfer history
          </h2>
          <div className="mt-4 divide-y divide-[#EADCCB] border-y border-[#EADCCB]">
            {recentTransfers.map((transfer) => (
              <article
                className="flex items-center gap-3 py-4"
                key={transfer.id}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#F2E4D0] text-sm font-bold text-[#8A5A16]">
                  {transfer.description
                    .replace(/^(Money from |Transfer to )/, "")
                    .charAt(0)}
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block truncate text-sm text-[#34271A]">
                    {transfer.description}
                  </strong>
                  <span className="mt-1 block text-xs text-[#8C8175]">
                    {transfer.date}
                  </span>
                </span>
                <strong
                  className={`shrink-0 text-sm ${transfer.direction === "in" ? "text-[#176B3A]" : "text-[#34271A]"}`}
                >
                  {transfer.direction === "in" ? "+" : "−"} ₦
                  {transfer.amountNaira.toLocaleString("en-NG")}
                </strong>
              </article>
            ))}
          </div>
          <button
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#8A5A16] hover:text-[#70470F]"
            onClick={() => setStep("find")}
            type="button"
          >
            Start a transfer{" "}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </button>
        </aside>
      </div>
    </div>
  );
}
