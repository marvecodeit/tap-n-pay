import { UserRound } from "lucide-react";
import type { Card } from "@tapnpay/api-client";
import { demoStudentDetails } from "../data/demoCards";

export function StudentIdentity({
  card,
  photoSize = "large",
}: {
  card: Card;
  photoSize?: "small" | "large";
}) {
  const initials = card.student_name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const details = demoStudentDetails[card.student_id];
  const isLarge = photoSize === "large";

  return (
    <div className="flex items-center gap-4">
      <div
        aria-label={`Illustrative profile avatar for ${card.student_name}; demo photo unavailable`}
        className={`grid shrink-0 place-items-center overflow-hidden rounded-2xl border border-[#D8C6AB] bg-[#ECD8BC] text-[#76501D] ${
          isLarge ? "size-20 sm:size-24" : "size-14"
        }`}
        role="img"
      >
        <div className="flex flex-col items-center gap-0.5">
          <UserRound
            aria-hidden="true"
            className={isLarge ? "size-8" : "size-5"}
            strokeWidth={1.5}
          />
          <span
            className={isLarge ? "text-sm font-bold" : "text-xs font-bold"}
          >
            {initials}
          </span>
        </div>
      </div>
      <div className="min-w-0">
        <p
          className={`truncate font-bold text-[#231B12] ${
            isLarge ? "font-sora text-[22px]" : "font-sora text-[15px]"
          }`}
        >
          {card.student_name}
        </p>
        <p className="mt-1 truncate text-[13px] text-[#75685A]">
          {details?.department || "Department not provided"}
        </p>
        <p className="mt-0.5 truncate text-[13px] text-[#75685A]">
          {details?.course || "Course not provided"}
        </p>
        <p className="mt-2 text-xs font-medium text-[#514638]">
          Matriculation no.{" "}
          <span className="font-semibold">{card.student_id}</span>
        </p>
      </div>
    </div>
  );
}
