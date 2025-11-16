// components/financials/financial-table.tsx
"use client";

import { FinancialTableProps } from "@/models/financial";

export default function FinancialTable({ rows }: FinancialTableProps) {
  if (!rows || rows.length === 0) {
    return (
      <div className="mt-8 rounded-md border border-grey-200 p-6 text-center text-grey-500">
        조회된 재무제표가 없습니다.
      </div>
    );
  }

  const first = rows[0];
  const thLabel = first.thstrmName || "당기";
  const frmLabel = first.frmtrmName || "전기";
  const bfeLabel = first.bfefrmtrmName || "전전기";

  return (
    <section
      aria-label="기업 재무제표 표"
      className="mt-8 rounded-md border border-grey-200 bg-white"
    >
      {/* 스크롤 생기더라도 전체 표는 깨지지 않게 */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-[1.4rem]">
          <thead>
            <tr className="bg-grey-50 border-b border-grey-200">
              <th className="px-4 py-2 text-left border-r border-grey-200">
                재무제표
              </th>
              <th className="px-4 py-2 text-left border-r border-grey-200">
                계정명
              </th>
              <th className="px-4 py-2 text-right border-r border-grey-200">
                {thLabel}
              </th>
              <th className="px-4 py-2 text-right border-r border-grey-200">
                {frmLabel}
              </th>
              <th className="px-4 py-2 text-right">{bfeLabel}</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={`${row.statementName}-${row.accountName}-${idx}`}
                className="border-b border-grey-100"
              >
                {/* 재무제표 이름 */}
                <td className="px-4 py-2 align-top border-r border-grey-100 whitespace-nowrap">
                  {row.statementName}
                </td>

                {/* 계정명 + 상세 */}
                <td className="px-4 py-2 align-top border-r border-grey-100">
                  <div>{row.accountName}</div>
                  {row.accountDetail && row.accountDetail !== "-" && (
                    <div className="mt-1 text-[1.2rem] text-grey-500">
                      {row.accountDetail}
                    </div>
                  )}
                </td>

                {/* 당기 / 전기 / 전전기 금액 */}
                <td className="px-4 py-2 text-right align-top border-r border-grey-100">
                  {row.thstrmAmount || "-"}
                </td>
                <td className="px-4 py-2 text-right align-top border-r border-grey-100">
                  {row.frmtrmAmount || "-"}
                </td>
                <td className="px-4 py-2 text-right align-top">
                  {row.bfefrmtrmAmount || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
