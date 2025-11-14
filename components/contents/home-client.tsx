"use client";

import CompanyTable from "@/components/contents/company-table";
import CompanyDetailModal from "@/components/contents/company-detail";
import SubHeader from "@/components/contents/sub-header";
import { Pagination } from "@/components/pagination/pagination";
import { Company } from "@/models/company";
import { useState } from "react";

type HomeClientProps = {
  initialFavorites: Company[];
};

export default function HomeClient({ initialFavorites }: HomeClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 50;
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // 지금은 초기 데이터만 사용 (페이지네이션 SSR까지 하려면 나중에 searchParams랑 묶으면 됨)
  const favorites = initialFavorites;

  return (
    <div className="my-24 flex flex-col gap-[2.4rem]">
      <SubHeader />
      <CompanyTable favorites={favorites} onRowClick={setSelectedCompany} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      {selectedCompany && (
        <CompanyDetailModal
          data={selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}
    </div>
  );
}
