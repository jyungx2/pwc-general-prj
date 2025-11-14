"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type NavLinkProps = {
  href: string;
  children: ReactNode;
};

export default function NavLink({ href, children }: NavLinkProps) {
  const path = usePathname();

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
