import { FileClock, Receipt } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState, PageHeading } from "../portal/PortalShared";
export { Receipts } from "./LegacyReceipts";

export function ReceiptsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeading
        title="Digital receipts"
        description="Review receipts for confirmed campus payments."
      />
      <EmptyState
        icon={<Receipt className="size-6" />}
        title="No receipts yet"
        detail="Receipts will appear here when confirmed transaction history is connected."
      />
      <Link
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#8A5A16] no-underline hover:text-[#70470F]"
        to="/dashboard/transactions"
      >
        <FileClock aria-hidden="true" className="size-4" />
        View transactions
      </Link>
    </div>
  );
}
