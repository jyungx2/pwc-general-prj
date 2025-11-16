// components/financials/financial-viewer.tsx
"use client";

import { FinancialViewerProps } from "@/models/financial";
import FinancialTable from "./financial-table";
import Spinner from "@/assets/spinner.svg";
import Box from "@/assets/box.svg";
import ErrorFace from "@/assets/error-face.svg";
import Image from "next/image";

export default function FinancialViewer({
  rows,
  loading,
  error,
}: FinancialViewerProps) {
  return (
    <section
      aria-label="재무제표 조회 결과"
      className="mt-8 rounded-lg border border-grey-300 bg-grey-50 overflow-hidden"
    >
      {/* 이 박스 높이/스크롤이 'PDF 뷰어 박스' 역할 */}
      <div className="h-[759px] w-full overflow-auto bg-white p-8">
        {/* 1) 로딩 상태 */}
        {loading && (
          <div className="flex h-full flex-col items-center justify-center gap-8 text-[1.4rem] text-grey-500">
            <Image
              src={Spinner}
              alt="재무제표를 불러오는 중입니다."
              className="animate-spinner-rotate"
            />
            <p>기업명과 보고서 옵션을 선택하여 재무제표를 조회해보세요.</p>
          </div>
        )}

        {/* 2) 데이터가 아직 없고, 로딩도 아닐 때 → 안내 문구만 */}
        {!loading && !error && (!rows || rows.length === 0) && (
          <div className="flex h-full flex-col items-center justify-center gap-8 text-[1.4rem] text-grey-500">
            <Image src={Box} alt="조회된 재무제표 데이터가 없습니다." />
            <p>기업명과 보고서 옵션을 선택하여 재무제표를 조회해보세요.</p>
          </div>
        )}

        {/* 3) 데이터 있을 때 */}
        {!loading && !error && rows && rows.length > 0 && (
          <FinancialTable rows={rows} />
        )}

        {/* 4) 에러 발생 시 */}
        {!loading && error && (
          <div className="flex flex-col h-full gap-[2rem] items-center justify-center">
            <Image
              src={ErrorFace}
              alt="재무제표 조회 시 오류가 발생했습니다."
            />
            <div className="flex flex-col items-center gap-1">
              <p>재무제표를 조회 중 오류가 발생했습니다.</p>
              <p>옵션을 확인 후 다시 시도해주세요.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
