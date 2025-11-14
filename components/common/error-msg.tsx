"use client";

import { FieldError } from "react-hook-form";

type ErrorMsgProps = {
  target?: FieldError;
};

export default function ErrorMsg({ target }: ErrorMsgProps) {
  if (!target) return null;
  return <p className="text-red text-[1.4rem] mt-2 pl-2">{target.message}</p>;
}
