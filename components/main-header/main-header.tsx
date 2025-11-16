import Image from "next/image";
import logo from "@/assets/logo.svg";
import NavLink from "@/components/main-header/nav-link";
import Link from "next/link";

export default function MainHeader() {
  return (
    <header className="flex justify-between py-5 border-b-[0.5px] border-grey-300">
      <Link href="/">
        <Image src={logo} alt="main-logo" priority />
      </Link>

      <nav>
        <ul className="flex gap-15">
          <li>
            <NavLink href="/">일반 과제</NavLink>
          </li>

          <li>
            <NavLink href="/financials">산업 전문화 과제</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
