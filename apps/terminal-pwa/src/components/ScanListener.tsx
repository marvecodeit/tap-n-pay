import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { AlertCircle, CreditCard, LoaderCircle, ScanLine } from "lucide-react";

interface ScanListenerProps {
  onScan: (cardId: string) => void;
  disabled?: boolean;
  compact?: boolean;
  waitingForAmount?: boolean;
  scanning?: boolean;
  autoFocus?: boolean;
}

export function ScanListener({
  onScan,
  disabled = false,
  compact = false,
  waitingForAmount = false,
  scanning = false,
  autoFocus = false,
}: ScanListenerProps) {
  const bufferRef = useRef("");
  const lastKeyTimeRef = useRef(0);
  const scanTimeoutRef = useRef<number | null>(null);
  const scannerInputRef = useRef<HTMLInputElement>(null);
  const [scanNotice, setScanNotice] = useState("");
  const [scannerFocused, setScannerFocused] = useState(false);

  function submitScan() {
    if (scanTimeoutRef.current !== null) {
      window.clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = null;
    }
    const cardId = bufferRef.current.trim().toUpperCase();
    bufferRef.current = "";
    if (scannerInputRef.current) scannerInputRef.current.value = "";
    if (!cardId) return;
    if (cardId.length < 6) {
      setScanNotice("Barcode was not recognized. Please scan again.");
      return;
    }
    setScanNotice("");
    onScan(cardId);
  }

  function handleScannerKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter" && event.key !== "Tab") return;
    event.preventDefault();
    submitScan();
  }

  function handleScannerChange(value: string) {
    bufferRef.current = value;
    if (scanTimeoutRef.current !== null) {
      window.clearTimeout(scanTimeoutRef.current);
    }
    scanTimeoutRef.current = window.setTimeout(submitScan, 250);
  }

  useEffect(() => {
    if (!autoFocus || disabled || waitingForAmount || scanning) return;
    const activeElement = document.activeElement;
    if (
      activeElement instanceof HTMLInputElement &&
      activeElement.getAttribute("aria-label") === "Purchase amount in naira"
    ) {
      return;
    }
    scannerInputRef.current?.focus();
  }, [autoFocus, disabled, scanning, waitingForAmount]);

  useEffect(
    () => () => {
      if (scanTimeoutRef.current !== null) {
        window.clearTimeout(scanTimeoutRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!autoFocus || disabled || waitingForAmount || scanning) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (
        target instanceof HTMLInputElement &&
        target.getAttribute("aria-label") === "Purchase amount in naira"
      ) {
        return;
      }
      window.requestAnimationFrame(() => scannerInputRef.current?.focus());
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [autoFocus, disabled, scanning, waitingForAmount]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (disabled) return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
      ) {
        return;
      }

      const now = Date.now();
      if (now - lastKeyTimeRef.current > 150) bufferRef.current = "";
      lastKeyTimeRef.current = now;

      if (event.key === "Enter" || event.key === "Tab") {
        if (!bufferRef.current) return;
        event.preventDefault();
        submitScan();
      } else if (event.key.length === 1) {
        bufferRef.current += event.key;
        if (scanTimeoutRef.current !== null) {
          window.clearTimeout(scanTimeoutRef.current);
        }
        scanTimeoutRef.current = window.setTimeout(submitScan, 250);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [disabled, onScan]);

  return (
    <div
      className={
        compact
          ? "relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-xl bg-[#FFFEFC] px-4 py-6 text-center sm:min-h-[400px] sm:px-5 lg:min-h-[520px]"
          : "flex items-center gap-4 rounded-2xl border border-[#E8DDCB] bg-[#FAF8F4] p-5 sm:p-6"
      }
    >
      {compact ? (
        <>
          <input
            aria-label="Barcode scanner input"
            autoComplete="off"
            className="sr-only"
            disabled={disabled || waitingForAmount}
            inputMode="none"
            onBlur={() => setScannerFocused(false)}
            onChange={(event) => handleScannerChange(event.currentTarget.value)}
            onFocus={() => setScannerFocused(true)}
            onKeyDown={handleScannerKeyDown}
            ref={scannerInputRef}
            tabIndex={-1}
            type="text"
          />
          <div
            aria-hidden={waitingForAmount}
            className={`flex w-full max-w-md flex-col items-center transition-[filter,opacity] duration-200 ${
              waitingForAmount ? "pointer-events-none blur-[3px] opacity-60" : ""
            }`}
          >
            <div className="relative mb-4 grid size-28 place-items-center rounded-full bg-[#FAF4E9] text-[#95601D]">
              <span className="grid size-16 -rotate-6 place-items-center rounded-xl border-4 border-white bg-[#95601D] text-white shadow-[0_12px_24px_rgba(74,49,21,0.2)]">
                <CreditCard aria-hidden="true" className="size-9" />
              </span>
              <span className="absolute right-3 top-6 size-10 rounded-full border-2 border-[#E8C994]" />
            </div>
            <p className="font-sora text-xl font-semibold text-[#231B12]">
              Scan student card
            </p>
            <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-[#8B8072]">
              Scanner focuses automatically after amount entry. If you typed the
              amount, click Focus scanner before scanning the matric ID.
            </p>
            <button
              aria-live="polite"
              className={`mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                scanning || scannerFocused ? "bg-[#A9906B]" : "bg-[#95601D]"
              }`}
              disabled={disabled || waitingForAmount || scanning}
              onClick={() => scannerInputRef.current?.focus()}
              type="button"
            >
              {scanning ? (
                <LoaderCircle
                  aria-hidden="true"
                  className="size-4 animate-spin"
                />
              ) : (
                <CreditCard aria-hidden="true" className="size-4" />
              )}
              {scanning
                ? "Checking student..."
                : scannerFocused
                  ? "Scanner ready — scan matric barcode"
                  : "Focus scanner"}
            </button>
            <span
              aria-live="polite"
              className="mt-3 text-xs font-semibold text-emerald-700"
            >
              {scanning
                ? "Loading student details"
                : scannerFocused
                  ? "Scan now, then review and authorize the payment"
                  : "Scan starts automatically after the barcode is read"}
            </span>
          </div>
          {waitingForAmount && (
            <div className="absolute inset-0 z-10 flex items-center justify-center px-5">
              <div
                aria-live="polite"
                className="rounded-xl border border-white/80 bg-white/75 px-5 py-3 text-sm font-semibold text-[#514638] shadow-sm backdrop-blur-sm"
              >
                Enter an amount first
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#ECD8BC] text-[#8C5E1E]">
            <ScanLine aria-hidden="true" className="size-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-[#231B12]">Ready for card scan</p>
            <p className="mt-1 text-sm leading-relaxed text-[#75685A]">
              Enter the purchase amount, then ask the student to tap their card.
            </p>
          </div>
          <span className="hidden shrink-0 items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#75685A] sm:inline-flex">
            <span className="size-2 rounded-full bg-emerald-600" />
            USB scanner
          </span>
        </>
      )}
      <div className={compact ? "mt-3" : ""}>
        {scanNotice && (
          <p
            className="mt-2 flex items-center gap-1.5 text-sm font-medium text-red-700"
            role="alert"
          >
            <AlertCircle aria-hidden="true" className="size-4 shrink-0" />
            {scanNotice}
          </p>
        )}
      </div>
    </div>
  );
}
