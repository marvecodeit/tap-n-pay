import { PageHeading, usePortal } from "../portal/PortalShared";

export function SettingsPage() {
  const { student } = usePortal();
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeading
        title="Account settings"
        description="Review your student account details."
      />
      <section className="rounded-xl border border-[#EADCCB] bg-white p-5 sm:p-6">
        <dl className="divide-y divide-[#E7EEE9]">
          {[
            ["Full name", student?.name],
            ["Student ID", student?.student_id],
            ["School email", student?.email],
            ["Phone", student?.phone],
          ].map(([label, value]) => (
            <div
              key={label}
              className="grid gap-1 py-4 sm:grid-cols-[180px_1fr]"
            >
              <dt className="text-sm text-[#75685A]">{label}</dt>
              <dd className="text-sm font-medium text-[#34443A]">
                {value || "Not provided"}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 rounded-lg bg-[#FBF8F3] p-3 text-sm text-[#75685A]">
          Password and profile editing will be available when the
          account-management API is connected.
        </p>
      </section>
    </div>
  );
}
