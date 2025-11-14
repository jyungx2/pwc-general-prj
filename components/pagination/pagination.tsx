// components/pagination/Pagination.tsx
"use client";

import PaginationButton from "@/components/pagination/page-button";
import { usePagination } from "@/hooks/usePagination";
import ChevronLeft from "@/assets/chevron-left.svg";
import ChevronRight from "@/assets/chevron-right.svg";
import Dots from "@/assets/dots.svg";
import Image from "next/image";
import { PaginationProps } from "@/models/pagination";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = usePagination(currentPage, totalPages);

  if (totalPages <= 1) return null;

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages || p === currentPage) return;
    onPageChange(p);
  };

  return (
    <nav
      className="flex items-center justify-center gap-2 py-4 text-gray-700"
      aria-label="페이지 네비게이션"
    >
      {/* 이전 */}
      <PaginationButton
        disabled={currentPage === 1}
        onClick={() => goToPage(currentPage - 1)}
      >
        <Image src={ChevronLeft} alt="left" />
        <span>이전</span>
      </PaginationButton>

      {/* 페이지 번호 + ... */}
      {pages.map((p, idx) =>
        p === "..." ? (
          <Image key={`dots-${idx}`} src={Dots} alt="more pages" />
        ) : (
          <PaginationButton
            key={p}
            isActive={p === currentPage}
            onClick={() => goToPage(p)}
          >
            {p}
          </PaginationButton>
        )
      )}

      {/* 다음 */}
      <PaginationButton
        disabled={currentPage === totalPages}
        onClick={() => goToPage(currentPage + 1)}
      >
        <span>다음</span>
        <Image src={ChevronRight} alt="right" />
      </PaginationButton>
    </nav>
  );
}
