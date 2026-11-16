import { PageHeading } from "../portal/PortalShared";

export function HelpPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeading
        title="Help & Support"
        description="Helpful guidance for using your TapNPay student account."
      />
      <section className="space-y-4 rounded-xl border border-[#EADCCB] bg-white p-5 sm:p-6">
        <div>
          <h2 className="font-bold">How to pay on campus</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[#66766D]">
            <li>Visit a participating campus payment point.</li>
            <li>Tap your registered student ID card on the payment reader.</li>
            <li>Confirm the amount shown by the payment point.</li>
            <li>Wait for payment verification to finish.</li>
            <li>Check the final result before leaving the counter.</li>
          </ol>
        </div>
        <div className="border-t border-[#E7EEE9] pt-4">
          <h2 className="font-bold">Payment status</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#66766D]">
            A payment is successful only after the payment service confirms it.
            If a payment is pending, wait for confirmation before trying again
            to avoid duplicate charges.
          </p>
        </div>
        <div className="border-t border-[#E7EEE9] pt-4">
          <h2 className="font-bold">Need assistance?</h2>
          <p className="mt-2 text-sm text-[#66766D]">
            Contact your school’s TapNPay support desk for account, card, or
            payment issues.
          </p>
        </div>
      </section>
    </div>
  );
}
