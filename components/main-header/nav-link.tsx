"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, children }) {
  const path = usePathname();
  console.log("path: ", path);
  return (
    <Link
      href={href}
      className={
        path === href
          ? `text-black font-semibold text-[1.4rem]`
          : `text-grey-500 font-medium text-[1.4rem]`
      }
    >
      {children}
    </Link>
  );
}
