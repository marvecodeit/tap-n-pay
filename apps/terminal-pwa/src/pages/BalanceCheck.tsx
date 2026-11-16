import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  WalletCards,
} from "lucide-react";
import type { Card } from "@tapnpay/api-client";
import { formatKobo } from "@tapnpay/ui";
import { ScanListener } from "../components/ScanListener";
import { StudentIdentity } from "../components/StudentIdentity";
import { demoCards, demoStudentDetails } from "../data/demoCards";
import { CardNotFoundError, getCard } from "../db/balances";

export function BalanceCheck({ onBack }: { onBack: () => void }) {
  const [card, setCard] = useState<Card | null>(null);
  const [error, setError] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  async function handleScan(cardId: string) {
    setCard(null);
    setError("");
    setIsScanning(true);
    try {
      const [scannedCard] = await Promise.all([
        getCard(cardId),
        new Promise<void>((resolve) => window.setTimeout(resolve, 900)),
      ]);
      if (!scannedCard) throw new CardNotFoundError();
      setCard(scannedCard);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Card scan could not be verified. Please scan again.",
      );
    } finally {
      setIsScanning(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8C5E1E]">
            Student assistance
          </p>
          <h1 className="mt-1 font-sora text-[30px] font-semibold tracking-tight text-[#231B12] sm:text-[36px]">
            Check card balance
          </h1>
          <p className="mt-1 text-sm text-[#75685A]">
            {card
              ? "Balances are only shown after a physical TapNPay card scan."
              : "Ask the student to scan their physical card to view the available balance."}
          </p>
        </div>
        <button
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#E8DDCB] bg-white px-4 py-2.5 text-sm font-semibold text-[#8C5E1E] transition-colors hover:bg-[#FAF7F1]"
          onClick={onBack}
          type="button"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to checkout
        </button>
      </header>

      {card ? (
        <div className="grid items-stretch gap-4 lg:grid-cols-[1.55fr_1fr]">
          <article className="min-h-[360px] rounded-2xl border border-[#E8DDCB] bg-[#FFFEFC] p-5 shadow-[0_12px_35px_rgba(74,49,21,0.06)] sm:min-h-[400px] sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8B8072]">
                  Verified cardholder
                </p>
                <h2 className="mt-1 font-sora text-lg font-semibold text-[#231B12]">
                  Student details
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <CheckCircle2 aria-hidden="true" className="size-3.5" />
                Scan successful
              </span>
            </div>
            <div className="mt-6">
              <StudentIdentity card={card} />
            </div>
            <div className="mt-6 grid gap-3 border-t border-[#E8DDCB] pt-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#8B8072]">
                  Department
                </p>
                <p className="mt-1 text-sm font-semibold text-[#231B12]">
                  {demoStudentDetails[card.student_id]?.department ||
                    "Department not provided"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#8B8072]">
                  Matric number
                </p>
                <p className="mt-1 text-sm font-semibold text-[#231B12]">
                  {card.student_id}
                </p>
              </div>
            </div>
          </article>

          <section className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl bg-[#8C5E1E] p-6 text-center text-white shadow-[0_12px_35px_rgba(74,49,21,0.12)] sm:min-h-[400px] sm:p-8">
            <span className="grid size-14 place-items-center rounded-2xl bg-[#F4EBDD] text-[#8C5E1E]">
              <WalletCards aria-hidden="true" className="size-7" />
            </span>
            <p className="mt-6 text-xs font-medium text-white/85">
              Current available balance
            </p>
            <p className="mt-2 font-sora text-[34px] font-bold tracking-tight sm:text-[40px]">
              {formatKobo(card.balance)}
            </p>
            <p className="mt-2 text-xs text-white/75">
              TapNPay student wallet
            </p>
            {card.blocked === 1 && (
              <span className="mt-4 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800">
                Card blocked
              </span>
            )}
            <button
              className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-[#8C5E1E] transition-colors hover:bg-[#FAF4E9]"
              onClick={() => {
                setCard(null);
                setError("");
              }}
              type="button"
            >
              <WalletCards aria-hidden="true" className="size-4" />
              Scan another card
            </button>
          </section>
        </div>
      ) : (
        <section className="rounded-2xl border border-[#E8DDCB] bg-white p-5 shadow-sm sm:p-7">
          <div className="mx-auto max-w-2xl space-y-5">
          <ScanListener
            onScan={handleScan}
            onScanClick={() => void handleScan(demoCards[0].card_id)}
            disabled={isScanning}
            compact
            scanning={isScanning}
          />

          {error && (
            <p
              className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              role="alert"
            >
              <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              {error}
            </p>
          )}

          </div>
        </section>
      )}
    </div>
  );
}
