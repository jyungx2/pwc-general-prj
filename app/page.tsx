"use client";

import CompanyTable from "@/components/contents/company-table";
import CompanyDetailModal from "@/components/contents/company-detail";
import SubHeader from "@/components/contents/sub-header";
import { Pagination } from "@/components/pagination/pagination";
import { Company } from "@/models/company";
import { useState } from "react";

export default function Home() {
  // useQuery: page 바뀔 때마다 자동으로 서버 요청하도록 queryKey에 currentPage값 포함
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 50;
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  return (
    <div className="my-24 flex flex-col gap-[2.4rem]">
      <SubHeader />
      <CompanyTable onRowClick={setSelectedCompany} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* ✅ 상세 모달: 선택된 회사가 있을 때만 */}
      {selectedCompany && (
        <CompanyDetailModal
          data={selectedCompany}
          onClose={() => setSelectedCompany(null)} // 배경 클릭 시 닫기
        />
      )}
    </div>
  );
}
