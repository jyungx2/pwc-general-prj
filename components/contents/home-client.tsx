"use client";

import CompanyTable from "@/components/contents/company-table";
import CompanyDetailModal from "@/components/contents/company-detail";
import SubHeader from "@/components/contents/sub-header";
import { Pagination } from "@/components/pagination/pagination";
import { Company } from "@/models/company";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axiosClient";
import { useRouter } from "next/navigation";

type HomeClientProps = {
  initialFavorites: Company[];
  totalPages: number;
};

export default function HomeClient({
  initialFavorites,
  totalPages,
}: HomeClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const email = process.env.NEXT_PUBLIC_EMAIL;

  // ✅ 선택된 기업 id 목록을 여기서 관리
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const router = useRouter();

  const favorites = initialFavorites;

  // ✅ 공통 삭제 mutation (단일/여러 개 다 여기서)
  const { mutate: deleteFavorites, isPending } = useMutation({
    mutationFn: async (ids: number[]) => {
      await Promise.all(
        ids.map((id) =>
          axiosClient.delete(`/favorites/${id}`, {
            params: { email },
          })
        )
      );
    },
    onSuccess: () => {
      setSelectedIds([]); // 선택 초기화

      // ✅ SSR 데이터 다시 가져오기 (서버 fetch 다시 실행)
      router.refresh();
      // favorites는 SSR(fetch no-store) 데이터이기 때문에
      // React Query 캐시 무효화(invalidateQueries)는 동작하지 않음.
      // queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  // ✅ 여러 개 삭제
  const handleDeleteSelected = () => {
    if (!selectedIds.length) return;
    deleteFavorites(selectedIds);
  };

  // ✅ 개별 삭제 (휴지통 아이콘)
  const handleDeleteOne = (id: number) => {
    deleteFavorites([id]);
  };

  return (
    <div className="my-24 flex flex-col gap-[2.4rem]">
      <SubHeader
        selectedCount={selectedIds?.length}
        onConfirmDelete={handleDeleteSelected}
        isDeleting={isPending}
      />
      <CompanyTable
        favorites={favorites}
        onRowClick={setSelectedCompany}
        selectedIds={selectedIds}
        onChangeSelectedIds={setSelectedIds}
        onDeleteOne={handleDeleteOne}
        isDeleting={isPending}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      {selectedCompany && (
        <CompanyDetailModal
          selectedCompany={selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}
    </div>
  );
}
