"use client";

import FinancialSearchForm from "@/components/financial/financial-search-form";
import FinancialViewer from "@/components/financial/financial-viewer";
import SubHeader from "@/components/contents/sub-header";
import {
  FinancialApiResponse,
  FinancialSearchFormValues,
  FinancialTableRow,
} from "@/models/financial";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function OptionalPage() {
  const [rows, setRows] = useState<FinancialTableRow[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const financialsMutation = useMutation({
    mutationFn: async (
      values: FinancialSearchFormValues
    ): Promise<FinancialApiResponse> => {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const params = new URLSearchParams(values);
      console.log("재무제표 조회 시 들어오는 params: ", params);

      const res = await fetch(`/api/financials?${params.toString()}`);
      if (!res.ok) {
        throw new Error(
          "💥 단일회사 전체 재무제표 가져오는 OPENDART API 요청 실패"
        );
      }
      const financialData = res.json();

      return financialData;
    },
    onSuccess: (data) => {
      setRows(data.rows);
      setHasSearched(true); // 성공하면 true -> 검색버튼 UI 조정
    },
  });

  const handleSearch = (values: FinancialSearchFormValues) => {
    financialsMutation.mutate(values);
  };

  const isLoading = financialsMutation.isPending;

  return (
    <>
      <section className="banner-section banner-section--optional">
        {/* 이 안쪽 div는 단순히 높이만 만들어주는 용도 */}
        <div className="h-[24rem]" />
      </section>

      <div className="my-24 flex flex-col gap-[2.4rem]">
        <SubHeader
          title="기업 재무제표 조회"
          subtitle="기업명과 보고서 옵션을 선택하여 제무제표를 조회해보세요."
        />

        <FinancialSearchForm
          onSubmit={handleSearch}
          loading={isLoading}
          hasSearched={hasSearched}
        />
        <FinancialViewer loading={isLoading} rows={rows} />
      </div>
    </>
  );
}
