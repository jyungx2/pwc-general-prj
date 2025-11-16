"use client";

import { FieldError } from "react-hook-form";

type ErrorMsgProps = {
  target?: FieldError;
  className?: string;
};

export default function ErrorMsg({ target, className }: ErrorMsgProps) {
  if (!target) return null;
  return (
    <p className={`text-red text-[1.4rem] mt-2 pl-2 ${className}`}>
      {target.message}
    </p>
  );
}
