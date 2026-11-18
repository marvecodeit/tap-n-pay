import { UserRound } from "lucide-react";
import type { Card } from "@tapnpay/api-client";

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
  const isLarge = photoSize === "large";

  return (
    <div className="flex items-center gap-4">
      {card.profile_image_url ? (
        <img
          alt={`Profile photo of ${card.student_name}`}
          className={`shrink-0 rounded-2xl border border-[#D8C6AB] object-cover ${
            isLarge ? "size-20 sm:size-24" : "size-14"
          }`}
          referrerPolicy="no-referrer"
          src={card.profile_image_url}
        />
      ) : (
        <div
          aria-label={`Illustrative profile avatar for ${card.student_name}; photo unavailable`}
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
      )}
      <div className="min-w-0">
        <p
          className={`truncate font-bold text-[#231B12] ${
            isLarge ? "font-sora text-[22px]" : "font-sora text-[15px]"
          }`}
        >
          {card.student_name}
        </p>
        <p className="mt-1 truncate text-[13px] text-[#75685A]">
          {card.department || "Department not provided"}
        </p>
        {card.faculty && (
          <p className="mt-0.5 truncate text-[13px] text-[#75685A]">
            Faculty: {card.faculty}
          </p>
        )}
        {card.level ? (
          <p className="mt-0.5 truncate text-[13px] text-[#75685A]">
            Level: {card.level}
          </p>
        ) : !card.faculty ? (
          <p className="mt-0.5 truncate text-[13px] text-[#75685A]">
            Course not provided
          </p>
        ) : null}
        <p className="mt-2 text-xs font-medium text-[#514638]">
          Matriculation no.{" "}
          <span className="font-semibold">{card.student_id}</span>
        </p>
        {card.is_profile_complete !== undefined && (
          <p
            className={`mt-2 text-xs font-semibold ${
              card.is_profile_complete ? "text-emerald-700" : "text-amber-700"
            }`}
          >
            Profile {card.is_profile_complete ? "complete" : "incomplete"}
          </p>
        )}
      </div>
    </div>
  );
}
