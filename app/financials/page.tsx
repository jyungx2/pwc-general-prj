"use client";

import FinancialSearchForm from "@/components/financial/financial-search-form";
import FinancialViewer from "@/components/financial/financial-viewer";
import SubHeader from "@/components/common/sub-header";
import {
  FinancialApiResponse,
  FinancialError,
  FinancialSearchFormValues,
  FinancialTableRow,
} from "@/models/financial";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function OptionalPage() {
  const [rows, setRows] = useState<FinancialTableRow[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const financialsMutation = useMutation<
    FinancialApiResponse, // TData: onSuccess(data)의 data 타입
    FinancialError, // TError: onError(error)의 error 타입
    FinancialSearchFormValues // TVariables: mutate(values)의 values 타입
  >({
    mutationFn: async (values) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const params = new URLSearchParams(values);
      console.log("재무제표 조회 시 들어오는 params: ", params);

      const res = await fetch(`/api/financials?${params.toString()}`);

      if (!res.ok) {
        // 서버에서 내려준 에러 메시지가 담긴 JSON 데이터를 통째로 읽어서 onError로 반환
        const errorBody = (await res.json()) as FinancialError;
        console.log("서버 에러 응답:", errorBody);
        throw errorBody;
      }

      const financialData = (await res.json()) as FinancialApiResponse;
      console.log("재무제표 결과: ", financialData);

      return financialData;
    },
    // React Query는 Promise(ex. res.json())가 resolve될 때까지 기다렸다가 resolved 된 값을 onSuccess(data) 에 넘겨주기 때문에 mutitonFn에서 await 여부와 상관없이 정상 동작
    onSuccess: (data) => {
      setRows(data.rows);
      setHasSearched(true); // 성공하면 true -> 검색버튼 UI 조정
    },
    onError: (err) => {
      console.log("에러 원인: ", err.message);
      setRows([]);
      setHasSearched(false); // 요청 실패했으므로, 안전하게 false로 리셋
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
        <FinancialViewer
          rows={rows}
          loading={isLoading}
          error={financialsMutation.error}
        />
      </div>
    </>
  );
}
