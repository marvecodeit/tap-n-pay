import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  LockKeyhole,
  ShieldCheck,
  X,
} from "lucide-react";
import { formatKobo } from "@tapnpay/ui";
import type { Card, Transaction } from "@tapnpay/api-client";
import { PriceKeypad } from "../components/PriceKeypad";
import { ScanListener } from "../components/ScanListener";
import { StudentIdentity } from "../components/StudentIdentity";
import { ApprovalScreen } from "../components/ApprovalScreen";
import { CardNotFoundError } from "../db/balances";
import { debitScannedStudentWallet, getScannedStudentCard } from "../lib/studentProfile";

interface CheckoutProps {
  onTransactionComplete: () => void | Promise<void>;
  onViewHistory: () => void;
}

function errorText(error: unknown) {
  if (error instanceof CardNotFoundError)
    return "No registered student matches this matric ID. Please scan again.";
  return error instanceof Error
    ? error.message
    : "Unable to complete checkout. Please try again.";
}

export function Checkout({ onTransactionComplete, onViewHistory }: CheckoutProps) {
  const [amountKobo, setAmountKobo] = useState(0);
  const [scannedCard, setScannedCard] = useState<Card | null>(null);
  const [completedTxn, setCompletedTxn] = useState<Transaction | null>(null);
  const [updatedCard, setUpdatedCard] = useState<Card | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [historyNotice, setHistoryNotice] = useState("");
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const processingRef = useRef(false);
  const paymentReferenceRef = useRef<string | null>(null);

  async function handleScan(cardId: string) {
    setErrorMessage("");
    paymentReferenceRef.current = null;
    if (amountKobo <= 0) {
      setErrorMessage("Enter a purchase amount before scanning a student card.");
      return;
    }

    setIsScanning(true);
    try {
      const [scanResult] = await Promise.all([
        getScannedStudentCard(cardId),
        new Promise<void>((resolve) => window.setTimeout(resolve, 900)),
      ]);
      const card = scanResult?.card;
      if (!card) throw new CardNotFoundError();
      setScannedCard(card);
      paymentReferenceRef.current = `POS-${crypto.randomUUID()}`;
    } catch (error) {
      setScannedCard(null);
      setErrorMessage(errorText(error));
    } finally {
      setIsScanning(false);
    }
  }

  async function confirmPayment() {
    if (!scannedCard || processingRef.current || amountKobo <= 0) return;
    processingRef.current = true;
    setIsProcessing(true);
    setErrorMessage("");

    try {
      const reference =
        paymentReferenceRef.current ?? `POS-${crypto.randomUUID()}`;
      paymentReferenceRef.current = reference;
      const { card: updated, transaction } = await debitScannedStudentWallet(
        scannedCard,
        amountKobo,
        reference,
      );

      setUpdatedCard(updated);
      setCompletedTxn(transaction);
      try {
        await onTransactionComplete();
      } catch {
        setHistoryNotice(
          "Payment was saved, but the history list could not refresh. Reopen transaction history to check it.",
        );
      }
    } catch (error) {
      setErrorMessage(errorText(error));
    } finally {
      processingRef.current = false;
      setIsProcessing(false);
    }
  }

  function cancelTransaction() {
    setShowCancelConfirmation(true);
  }

  function confirmCancelTransaction() {
    setScannedCard(null);
    setAmountKobo(0);
    setErrorMessage("");
    paymentReferenceRef.current = null;
    setShowCancelConfirmation(false);
  }

  useEffect(() => {
    if (!showCancelConfirmation) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setShowCancelConfirmation(false);
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [showCancelConfirmation]);

  function startNewTransaction() {
    setCompletedTxn(null);
    setUpdatedCard(null);
    setScannedCard(null);
    setAmountKobo(0);
    setErrorMessage("");
    setHistoryNotice("");
    paymentReferenceRef.current = null;
  }

  if (completedTxn && updatedCard) {
    return (
      <ApprovalScreen
        transaction={completedTxn}
        card={updatedCard}
        onDone={startNewTransaction}
        onViewHistory={onViewHistory}
        notice={historyNotice}
      />
    );
  }

  const activeStep = scannedCard ? 2 : 1;
  const steps = ["Amount", "Verify", "Complete"];

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8C5E1E]">
            New sale
          </p>
          <h1 className="mt-2 font-sora text-[25px] font-medium tracking-tight text-[#231B12] sm:text-[36px]">
            {scannedCard ? "Verify & confirm" : "Enter purchase amount"}
          </h1>
          <p className="mt-1 text-xs text-[#75685A] sm:text-sm">
            {scannedCard
              ? "Confirm the student and transaction details."
              : "Enter the total, then scan the student's matric barcode."}
          </p>
        </div>
        <ol
          aria-label="Checkout progress"
          className="flex items-center gap-2 self-end pb-1 sm:gap-3"
        >
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isComplete = stepNumber < activeStep;
            const isActive = stepNumber === activeStep;
            return (
              <li className="flex items-center gap-2 sm:gap-3" key={step}>
                <span
                  aria-current={isActive ? "step" : undefined}
                  className={`grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                    isActive
                      ? "bg-[#8C5E1E] text-white"
                      : isComplete
                        ? "bg-[#E8D5B6] text-[#76501D]"
                        : "bg-[#EFE9E0] text-[#A99E8F]"
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle2 aria-hidden="true" className="size-4" />
                  ) : (
                    stepNumber
                  )}
                </span>
                <span
                  className={`text-xs ${
                    isActive || isComplete
                      ? "font-semibold text-[#8C5E1E]"
                      : "text-[#A99E8F]"
                  }`}
                >
                  {step}
                </span>
                {stepNumber < steps.length && (
                  <span
                    aria-hidden="true"
                    className="h-px w-5 bg-[#E8DDCB] sm:w-8"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </header>

      {errorMessage && (
        <div
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>{errorMessage}</span>
          <button
            aria-label="Dismiss message"
            className="ml-auto rounded p-1 text-red-700 hover:bg-red-100"
            onClick={() => setErrorMessage("")}
            type="button"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
      )}

      {showCancelConfirmation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#21190F]/55 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowCancelConfirmation(false);
            }
          }}
        >
          <section
            aria-labelledby="cancel-confirmation-title"
            aria-modal="true"
            className="relative w-full max-w-[430px] rounded-[24px] bg-[#FFFEFC] px-6 py-7 text-center shadow-[0_24px_70px_rgba(27,20,12,0.28)] sm:px-8"
            role="dialog"
          >
            <button
              aria-label="Close cancel confirmation"
              className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-[#75685A] transition-colors hover:bg-[#F4EBDD] hover:text-[#231B12]"
              onClick={() => setShowCancelConfirmation(false)}
              type="button"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-red-50 text-red-600">
              <X aria-hidden="true" className="size-6" />
            </span>
            <h2
              className="mt-4 font-sora text-xl font-semibold text-[#231B12]"
              id="cancel-confirmation-title"
            >
              Cancel this transaction?
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-[#75685A]">
              The current amount and scanned student details will be cleared.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                className="min-h-12 rounded-xl border border-[#E8DDCB] bg-white px-3 text-xs font-semibold text-[#34271A] transition-colors hover:bg-[#FAF7F1]"
                onClick={() => setShowCancelConfirmation(false)}
                type="button"
              >
                Continue payment
              </button>
              <button
                className="min-h-12 rounded-xl bg-[#C83931] px-3 text-xs font-bold text-white transition-colors hover:bg-[#AD2F28]"
                onClick={confirmCancelTransaction}
                type="button"
              >
                Yes, cancel
              </button>
            </div>
          </section>
        </div>
      )}

      {!scannedCard ? (
        <div className="grid items-stretch gap-4 lg:grid-cols-2">
          <section className="min-h-[400px] rounded-2xl border border-[#E8DDCB] bg-[#FFFEFC] p-4 shadow-[0_8px_24px_rgba(74,49,21,0.05)] sm:min-h-[440px] sm:p-5 lg:min-h-[560px]">
            <PriceKeypad
              amountKobo={amountKobo}
              onChange={(amount) => {
                setAmountKobo(amount);
                setScannedCard(null);
                paymentReferenceRef.current = null;
                setErrorMessage("");
              }}
              disabled={isProcessing}
            />
          </section>
          <section className="min-h-[400px] rounded-2xl border border-[#E8DDCB] bg-[#FFFEFC] p-4 shadow-[0_8px_24px_rgba(74,49,21,0.05)] sm:min-h-[440px] sm:p-5 lg:min-h-[560px]">
            <ScanListener
              onScan={handleScan}
              disabled={isProcessing || isScanning || amountKobo <= 0}
              compact
              waitingForAmount={amountKobo <= 0}
              scanning={isScanning}
              autoFocus
            />
          </section>
        </div>
      ) : (
        <div className="grid items-stretch gap-4 lg:grid-cols-2">
          <section className="min-h-[360px] rounded-2xl border border-[#E8DDCB] bg-[#FFFEFC] p-4 shadow-[0_8px_24px_rgba(74,49,21,0.05)] sm:min-h-[400px] sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#8B8072]">
                  Identity confirmation
                </p>
                <h2 className="mt-1 text-base font-medium text-[#231B12]">
                  Student cardholder
                </h2>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF5EF] px-2.5 py-1.5 text-xs font-semibold text-emerald-700">
                <CheckCircle2 aria-hidden="true" className="size-3" />
                Scan successful
              </span>
            </div>
            <div className="mt-4">
              <StudentIdentity card={scannedCard} />
            </div>
            <p className="mt-4 rounded-lg bg-[#FAF7F1] px-3 py-2.5 text-center text-xs text-[#8B8072]">
              Compare the cardholder with their student card before confirming
              payment.
            </p>
          </section>

          <section className="flex min-h-[360px] flex-col rounded-2xl border border-[#E8DDCB] bg-[#FFFEFC] p-4 shadow-[0_8px_24px_rgba(74,49,21,0.05)] sm:min-h-[400px] sm:p-5">
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#8B8072]">
              Payment summary
            </p>
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#EEE3D5] bg-[#FAF7F1] p-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#E8D5B6] text-[13px] font-bold text-[#76501D]">
                {scannedCard.student_name
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")
                  .toUpperCase()}
              </span>
              <span>
                <span className="block text-xs text-[#8B8072]">
                  Paying as
                </span>
                <span className="mt-0.5 block text-[13px] font-semibold text-[#231B12]">
                  {scannedCard.student_name}
                </span>
              </span>
            </div>
            {scannedCard.is_profile_complete === false && (
              <p
                className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-900"
                role="status"
              >
                This student profile is incomplete. Ask the student to complete
                their profile before taking payment.
              </p>
            )}
            <p className="mt-5 text-xs text-[#8B8072]">
              Transaction amount
            </p>
            <p className="mt-1 border-b border-[#EEE3D5] pb-4 font-sora text-[28px] font-bold tracking-tight text-[#231B12]">
              {formatKobo(amountKobo)}
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-[#FAF7F1] p-3">
                <dt className="text-xs text-[#8B8072]">
                  Available balance
                </dt>
                <dd className="mt-1 font-sora text-[24px] font-bold leading-tight text-[#231B12]">
                  {formatKobo(scannedCard.balance)}
                </dd>
              </div>
              <div className="rounded-xl bg-[#FAF7F1] p-3">
                <dt className="text-xs text-[#8B8072]">
                  Balance after payment
                </dt>
                <dd
                  className="mt-1 font-sora text-[24px] font-bold leading-tight text-[#231B12]"
                >
                  {formatKobo(Math.max(scannedCard.balance - amountKobo, 0))}
                </dd>
              </div>
            </dl>
            <div className="mt-auto space-y-2 pt-4">
              <button
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#95601D] px-4 py-3 text-xs font-bold text-white shadow-[0_8px_18px_rgba(74,49,21,0.12)] transition-colors hover:bg-[#7D4F17] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={
                  isProcessing ||
                  amountKobo <= 0 ||
                  scannedCard.is_profile_complete === false
                }
                onClick={confirmPayment}
                type="button"
              >
                <LockKeyhole aria-hidden="true" className="size-4" />
                {isProcessing ? "Processing payment…" : "Confirm payment"}
                {!isProcessing && (
                  <ArrowRight aria-hidden="true" className="size-4" />
                )}
              </button>
              <button
                className="min-h-11 w-full rounded-xl border border-[#E8DDCB] bg-white px-4 py-2.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
                disabled={isProcessing}
                onClick={cancelTransaction}
                type="button"
              >
                Cancel transaction
              </button>
              <p className="flex items-center justify-center gap-1.5 pt-1 text-center text-xs text-[#8B8072]">
                <ShieldCheck aria-hidden="true" className="size-3 shrink-0" />
                Payment is protected against duplicate submission.
              </p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
