import { type ReactNode } from "react";
import { useOutletContext } from "react-router-dom";
import type { Student } from "@tapnpay/api-client";

export type StudentProfile = Student & {
  department?: string;
  faculty?: string;
  level?: string;
  isLocal?: boolean;
};

export type PortalContext = {
  student: StudentProfile | null;
  setStudent: (student: StudentProfile | null) => void;
};

export function usePortal() {
  return useOutletContext<PortalContext>();
}

export function PageHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="mt-1 text-sm text-[#75685A]">{description}</p>
    </header>
  );
}

export function EmptyState({
  icon,
  title,
  detail,
}: {
  icon: ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <div className="mt-5 flex flex-col items-center rounded-lg border border-dashed border-[#CBD8CF] bg-[#FAFCFB] px-5 py-12 text-center">
      <span className="grid size-11 place-items-center rounded-full bg-[#F8F0E5] text-[#8A5A16]">
        {icon}
      </span>
      <h2 className="mt-4 text-base font-semibold">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-[#75685A]">
        {detail}
      </p>
    </div>
  );
}
