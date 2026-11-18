import { QrCode } from "lucide-react";
import { PageHeading, usePortal } from "../portal/PortalShared";

export function StudentCardPage() {
  const { student } = usePortal();
  const cardId = student?.active_card_id;

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
          Card blocking is not available through the NestJS API yet. Contact
          your campus administrator if your card is missing.
        </p>
        <button
          className="mt-4 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          disabled
          type="button"
        >
          Report card lost and block
        </button>
      </div>
    </div>
  );
}
