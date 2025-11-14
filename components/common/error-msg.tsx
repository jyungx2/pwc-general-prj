"use client";

export default function ErrorMsg({ target }) {
  if (!target) return;
  return <p className="text-red text-[1.4rem] mt-2 pl-2">{target.message}</p>;
}
