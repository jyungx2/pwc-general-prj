"use client";

import { SubHeaderProps } from "@/models/company";

export default function SubHeader({
  title,
  subtitle,
  primaryBtn,
  secondaryBtn,
}: SubHeaderProps) {
  return (
    <div className="flex justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-[2.8rem] font-semibold">{title}</h1>
        <p className="text-[1.4rem] text-grey-500 font-regular">{subtitle}</p>
      </div>

      {(primaryBtn || secondaryBtn) && (
        <div className="flex gap-4">
          {primaryBtn}
          {secondaryBtn}
        </div>
      )}
    </div>
  );
}
