import { useState } from "react";
import { Delete } from "lucide-react";
import { formatKobo } from "@tapnpay/ui";

interface PriceKeypadProps {
  amountKobo: number;
  onChange: (kobo: number) => void;
  disabled?: boolean;
}

export function PriceKeypad({
  amountKobo,
  onChange,
  disabled = false,
}: PriceKeypadProps) {
  const [amountError, setAmountError] = useState("");
  const currentNaira = Math.floor(amountKobo / 100);

  function appendDigits(digitsToAppend: string) {
    if (disabled) return;
    const digits = currentNaira === 0 ? "" : currentNaira.toString();
    const nextAmountKobo = Number(`${digits}${digitsToAppend}`) * 100;
    if (!Number.isSafeInteger(nextAmountKobo)) {
      setAmountError("This amount is too large to represent accurately.");
      return;
    }
    setAmountError("");
    onChange(nextAmountKobo);
  }

  const appendDigit = (digit: string) => appendDigits(digit);

  function deleteLastDigit() {
    setAmountError("");
    onChange(
      currentNaira < 10
        ? 0
        : Math.floor(currentNaira / 10) * 100,
    );
  }

  function clearAmount() {
    setAmountError("");
    onChange(0);
  }

  const buttonClass =
    "min-h-11 rounded-xl border border-[#E8DDCB] bg-white text-base font-semibold text-[#34271A] shadow-sm transition-colors hover:border-[#D4A359] hover:bg-[#FCFAF6] active:bg-[#ECD8BC] disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-12";

  return (
    <section aria-label="Purchase amount" className="space-y-3">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8B8072]">
              Purchase total
            </p>
            <label
              className="mt-1 block text-xs font-medium text-[#514638]"
              id="purchase-amount-label"
            >
              Amount to collect
            </label>
          </div>
          <span className="rounded-lg bg-[#F4EBDD] px-2.5 py-1.5 text-xs font-bold tracking-wide text-[#8C5E1E]">
            NGN
          </span>
        </div>
        <div className="mt-3 flex min-h-[78px] items-center justify-center rounded-2xl border border-[#F0E2D1] bg-[#FAF7F1] px-4 sm:min-h-[88px]">
          <span
            aria-hidden="true"
            className="mr-2 font-sora text-2xl font-semibold text-[#D4A359]"
          >
            ₦
          </span>
          <output
            aria-live="polite"
            aria-labelledby="purchase-amount-label"
            className="min-w-0 truncate font-sora text-[30px] font-bold tracking-tight text-[#231B12] sm:text-[40px]"
          >
            {formatKobo(amountKobo).replace("₦", "")}
          </output>
        </div>
        {amountError ? (
          <p className="mt-2 text-xs text-red-700" role="alert">
            {amountError}
          </p>
        ) : (
          <p className="mt-2 text-xs text-[#8B8072]">
            Enter the total amount to collect.
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <button
            aria-label={`Enter ${digit}`}
            className={buttonClass}
            disabled={disabled}
            key={digit}
            onClick={() => appendDigit(String(digit))}
            type="button"
          >
            {digit}
          </button>
        ))}
        <button
          aria-label="Enter 00"
          className={buttonClass}
          disabled={disabled}
          onClick={() => appendDigits("00")}
          type="button"
        >
          00
        </button>
        <button
          aria-label="Enter 0"
          className={buttonClass}
          disabled={disabled}
          onClick={() => appendDigit("0")}
          type="button"
        >
          0
        </button>
        <button
          aria-label="Delete last digit"
          className={`${buttonClass} text-[#8C5E1E]`}
          disabled={disabled || amountKobo === 0}
          onClick={deleteLastDigit}
          type="button"
        >
          <Delete aria-hidden="true" className="mx-auto size-5" />
        </button>
      </div>
      <button
        className="w-full rounded-lg py-2 text-sm font-semibold text-[#76501D] transition-colors hover:bg-[#F4EBDD] hover:text-[#8C5E1E] disabled:cursor-not-allowed disabled:text-[#76501D] disabled:opacity-100"
        disabled={disabled || amountKobo === 0}
        onClick={clearAmount}
        type="button"
      >
        Clear amount
      </button>
    </section>
  );
}
