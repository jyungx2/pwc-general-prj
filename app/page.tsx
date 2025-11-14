"use client";

import CompanyTable from "@/components/contents/company-table";
import CompanyDetailModal from "@/components/contents/company-detail";
import SubHeader from "@/components/contents/sub-header";
import { Pagination } from "@/components/pagination/pagination";
import { Company } from "@/models/company";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axiosClient";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 50;
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const email = "cloundyon31@gmail.com";

  const { data: favorites } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await axiosClient.get(`/favorites?email=${email}`);
      const data = res.data.items; // 실제 데이터(items)는 항상 AxiosResponse 객체(res)의 "data"안에 존재
      console.log("data: ", data);
      return data;
    },
  });

  return (
    <div className="my-24 flex flex-col gap-[2.4rem]">
      <SubHeader />
      <CompanyTable favorites={favorites} onRowClick={setSelectedCompany} />
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
