import { FileClock } from "lucide-react";
import { Link } from "react-router-dom";

export function PaymentResultPage() {
  return (
    <main className="min-h-screen bg-[#F8F3EC] px-4 py-12">
      <div className="mx-auto max-w-xl rounded-xl border border-[#EADCCB] bg-white p-6 sm:p-8">
        <div className="grid size-12 place-items-center rounded-full bg-amber-50 text-amber-700">
          <FileClock className="size-6" />
        </div>
        <h1 className="mt-5 text-2xl font-bold">
          Payment pending verification
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#66766D]">
          The student app does not receive a confirmed transaction result for
          this reference. Check your transactions later; do not treat this as a
          successful payment.
        </p>
        <Link
          className="mt-6 inline-flex rounded-lg bg-[#8A5A16] px-4 py-2.5 text-sm font-semibold text-white no-underline"
          to="/dashboard"
        >
          Return to dashboard
        </Link>
      </div>
    </main>
  );
}
