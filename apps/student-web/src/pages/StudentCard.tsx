import { useState } from "react";
import { QrCode } from "lucide-react";
import { PageHeading, usePortal } from "../portal/PortalShared";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function StudentCardPage() {
  const { student } = usePortal();
  const [isBlocking, setIsBlocking] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const cardId = student?.active_card_id;
  const isLocal = !student || student.isLocal;

  async function blockCard() {
    if (!cardId || isLocal) return;
    setIsBlocking(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(
        `${API_BASE}/api/v1/cards/${encodeURIComponent(cardId)}/block`,
        { method: "POST" },
      );
      if (!response.ok)
        throw new Error(
          "The card service could not block this card. Try again or contact support.",
        );
      setMessage("The card service confirmed that this card is blocked.");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to reach the card service.",
      );
    } finally {
      setIsBlocking(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeading
        title="My Student Card"
        description="Review your registered student ID and its current status."
      />
      <section className="rounded-xl border border-[#C88A2A] bg-[#8A5A16] p-6 text-white sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#F3B965]">
              TapNPay Student ID
            </p>
            <h2 className="mt-6 text-xl font-bold">
              {student?.name || "Student name unavailable"}
            </h2>
            <p className="mt-1 text-sm text-[#F4DEC0]">
              {student?.student_id || "Matriculation number unavailable"}
            </p>
            <p className="mt-4 text-xs text-[#F3B965]">
              {student?.department || "Department not provided"}
              {student?.level ? ` · ${student.level}` : ""}
            </p>
          </div>
          <QrCode
            className="size-14 rounded-lg bg-white p-2 text-[#342218]"
            aria-label="Illustrative QR code"
          />
        </div>
        <div className="mt-8 flex flex-wrap justify-between gap-4 border-t border-white/20 pt-4 text-sm">
          <span>
            Status: {cardId ? "Verification unavailable" : "Not registered"}
          </span>
          <span className="font-mono">
            {cardId || "Card identifier unavailable"}
          </span>
        </div>
      </section>
      <div className="rounded-xl border border-[#EADCCB] bg-white p-5">
        <h3 className="font-bold">Card security</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#66766D]">
          If your card is missing, report it to block future use. Blocking is
          sent to the card service and only shown as complete after the service
          confirms.
        </p>
        <button
          className="mt-4 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!cardId || isLocal || isBlocking}
          onClick={blockCard}
          type="button"
        >
          {isBlocking
            ? "Contacting card service…"
            : "Report card lost and block"}
        </button>
        {isLocal && (
          <p className="mt-2 text-xs text-[#839087]">
            Card controls are unavailable for demo or locally entered account
            details.
          </p>
        )}
        {message && (
          <p role="status" className="mt-3 text-sm text-[#8A5A16]">
            {message}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-3 text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
