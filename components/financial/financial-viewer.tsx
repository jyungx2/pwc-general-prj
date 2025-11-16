// components/financials/financial-viewer.tsx
"use client";

import { FinancialTableRow } from "@/models/financial";
import FinancialTable from "./financial-table";
import Spinner from "@/assets/spinner.svg";
import Box from "@/assets/box.svg";
import Image from "next/image";

type FinancialViewerProps = {
  loading: boolean;
  rows: FinancialTableRow[] | null;
};

export default function FinancialViewer({
  loading,
  rows,
}: FinancialViewerProps) {
  return (
    <section
      aria-label="재무제표 조회 결과"
      className="mt-8 rounded-lg border border-grey-300 bg-grey-50 overflow-hidden"
    >
      {/* 이 박스 높이/스크롤이 'PDF 뷰어 박스' 역할 */}
      <div className="h-[560px] w-full overflow-auto bg-white p-8">
        {/* 1) 로딩 상태 */}
        {loading && (
          <div className="flex h-full flex-col items-center justify-center gap-8 text-[1.4rem] text-grey-500">
            <Image
              src={Spinner}
              alt="로딩 중"
              className="animate-spinner-rotate"
            />
            <p>기업명과 보고서 옵션을 선택하여 제무제표를 조회해보세요.</p>
          </div>
        )}

        {/* 2) 아직 rows 없고, 로딩도 아닐 때 → 안내 문구만 */}
        {!loading && (!rows || rows.length === 0) && (
          <div className="flex h-full flex-col items-center justify-center gap-8 text-[1.4rem] text-grey-500">
            <Image src={Box} alt="로딩 중" />
            <p>기업명과 보고서 옵션을 선택하여 제무제표를 조회해보세요.</p>
          </div>
        )}

        {/* 3) 데이터 있을 때 */}
        {!loading && rows && rows.length > 0 && <FinancialTable rows={rows} />}
      </div>
    </section>
  );
}
