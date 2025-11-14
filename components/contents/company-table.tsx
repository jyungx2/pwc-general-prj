"use client";

import { CompanyTableProps } from "@/models/company";
import { Trash } from "lucide-react";
import { useState } from "react";

export const rows = [
  {
    id: 1,
    email: "cc.com",
    company_name: "삼성전자",
    memo: "최고의 전자회사",
    created_at: "2025. 07. 18 오후 06:55",
  },
  {
    id: 2,
    email: "cd.com",
    company_name: "네이버",
    memo: "최고의 포털회사",
    created_at: "2024. 03. 10 오전 11:15",
  },
];

export default function CompanyTable({ onRowClick }: CompanyTableProps) {
  // const [selected, setSelected] = useState<number[]>([]);
  // const allChecked = selected.length === rows.length && rows.length > 0;
  const [checked, setChecked] = useState(false);

  return (
    <div className="rounded-lg border border-grey-300 bg-white overflow-hidden">
      {/* 1) 헤드 전용 테이블 (스크롤 불가) */}
      <table className="w-full table-fixed border-collapse border-spacing-0">
        <caption className="sr-only">관심 기업 리스트</caption>
        {/* colgroup = “각 열(컬럼)의 레이아웃 정보 담당”  => 같은 “열 전체 레이아웃/배경 수준” */}
        {/* colgroup: 헤더/바디 두 테이블이 동일한 너비를 갖도록 맞춰줌 */}
        <colgroup>
          <col className="w-[7.4rem]" />
          {/* 1열: 체크박스 */}
          <col />
          {/* 2열: 회사명 */}
          <col className="w-[29.3rem]" />
          {/* 3열: 생성일자 */}
          <col className="w-[7.4rem]" />
          {/* 4열: 휴지통 */}
        </colgroup>

        <thead className="sticky top-0 z-10 bg-grey-100 text-default font-semibold border-b border-grey-300">
          {/* [&>th]: 각 셀의 스타일링 => 패딩 / 타이포그래피 / 정렬 */}
          <tr className="[&>th]:px-4 [&>th]:py-4 h-20">
            {/* scope="col" = “이 헤더 셀이 어느 열의 ‘제목’인지?” */}
            {/* scope="col" : 열 헤더 (column header) */}
            {/* 이 th 아래 세로 방향(col)의 모든 td들과 연결된 헤더라고 의미를 알려줌 */}
            <th>
              <input
                type="checkbox"
                id="allCheck"
                aria-label="전체 선택"
                className="peer inputUnset checkboxCustom"
              />
              <label
                className="flex gap-4 cursor-pointer items-end justify-center before:w-8 before:h-8 before:inline-block before:content-[''] before:bg-[url('/icons/unchecked.svg')] peer-checked:before:bg-[url('/icons/checked.svg')] font-gowunBold text-[18px]"
                htmlFor="allCheck"
              ></label>
            </th>
            <th scope="col" className="text-left">
              회사명
            </th>
            <th scope="col" className="text-left">
              생성일자
            </th>
            <th scope="col" />
            {/* 휴지통 제목은 empty */}
          </tr>
        </thead>
      </table>

      {/* 2) 바디 전용 테이블 (여기만 스크롤) */}
      <div className="max-h-[600px] overflow-y-scroll scrollbar">
        <table
          className="w-full table-fixed border-collapse border-spacing-0"
          // 이 테이블이 실제 데이터 테이블 역할임을 명시
          aria-label="관심 기업 리스트"
          // onClick={()}
        >
          {/* colgroup을 똑같이 한 번 더 써줘야 컬럼 정렬이 깨지지 않음 */}
          <colgroup>
            <col className="w-[7.4rem]" />
            <col />
            <col className="w-[29.3rem]" />
            <col className="w-[7.4rem]" />
          </colgroup>

          <tbody className="text-text-heading font-regular divide-y divide-border divide-grey-300">
            {rows.map((r) => {
              // const checked = selected.includes(r.id);
              return (
                <tr
                  key={r.id}
                  className={` hover:bg-primary-100 ${
                    checked ? "bg-primary-100" : ""
                  } [&>td]:px-4 [&>td]:py-3`}
                  onClick={() => onRowClick(r)}
                >
                  {/* scope="row" : 행 헤더    (row header) 이 th 오른쪽 가로 방향(row)의 td들과 연결 */}
                  <td>
                    <input
                      type="checkbox"
                      id={`check-${r.id}`}
                      className="peer inputUnset checkboxCustom"
                    />
                    <label
                      className="flex gap-4 cursor-pointer items-end justify-center before:w-8 before:h-8 before:inline-block before:content-[''] before:bg-[url('/icons/unchecked.svg')] peer-checked:before:bg-[url('/icons/checked.svg')] font-gowunBold text-[18px]"
                      htmlFor={`check-${r.id}`}
                    ></label>
                  </td>
                  <td>{r.company_name}</td>
                  <td>{r.created_at}</td>
                  <td className="text-right">
                    <button
                      className="rounded p-1 hover:bg-red-50 text-grey-300 cursor-pointer"
                      aria-label={`${r.company_name} 삭제`}
                      onClick={() => {
                        /* 삭제 mutate */
                      }}
                    >
                      <Trash size={20} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
