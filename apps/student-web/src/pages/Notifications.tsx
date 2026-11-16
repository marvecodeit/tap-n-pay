import { Bell } from "lucide-react";
import { EmptyState, PageHeading } from "../portal/PortalShared";

export function NotificationsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeading
        title="Notifications"
        description="Important updates about your account and student card."
      />
      <EmptyState
        icon={<Bell className="size-6" />}
        title="You’re all caught up"
        detail="Payment and card notifications will appear here when connected services provide them."
      />
    </div>
  );
}