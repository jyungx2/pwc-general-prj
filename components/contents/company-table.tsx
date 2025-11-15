"use client";

import { CompanyTableProps } from "@/models/company";
import { formatKoreanDateTime } from "@/utils/formatDate";
import { Trash } from "lucide-react";

export default function CompanyTable({
  favorites,
  onRowClick,
  selectedIds,
  onChangeSelectedIds,
  onDeleteOne,
  isDeleting,
}: CompanyTableProps) {
  // favorites가 변경되면, 존재하지 않는 id는 selectedIds에서 제거
  // useEffect(() => {
  //   if (!favorites) return;
  //   setSelectedIds((prev) =>
  //     prev.filter((id) => favorites.some((f) => f.id === id))
  //   );
  // }, [favorites]);
  const hasFavorites = favorites.length > 0;

  const allChecked =
    favorites &&
    favorites.length > 0 &&
    selectedIds.length === favorites.length;

  // ✅ 전체 선택 / 해제
  const handleToggleAll = () => {
    if (!favorites) return;
    if (allChecked) {
      // 전부 해제
      onChangeSelectedIds([]);
    } else {
      // 전부 선택
      onChangeSelectedIds(favorites.map((f) => f.id));
    }
  };

  // ✅ 개별 row 선택 / 해제
  const handleToggleRow = (id: number) => {
    onChangeSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

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
                checked={allChecked}
                onChange={handleToggleAll}
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
      <div
        className={`max-h-[600px]  ${
          hasFavorites ? "overflow-y-auto scrollbar" : ""
        }`}
      >
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
            {hasFavorites ? (
              favorites?.map((row) => {
                const isChecked = selectedIds.includes(row.id);
                return (
                  <tr
                    key={row.id}
                    className={` hover:bg-primary-100 ${
                      isChecked ? "bg-primary-100" : ""
                    } [&>td]:px-4 [&>td]:py-3`}
                    onClick={() => onRowClick(row)}
                  >
                    {/* scope="row" : 행 헤더    (row header) 이 th 오른쪽 가로 방향(row)의 td들과 연결 */}
                    <td
                      onClick={(e) => {
                        // 체크박스 클릭이 row 클릭(onRowClick)으로 전파되지 않게 막기
                        e.stopPropagation();
                      }}
                    >
                      <input
                        type="checkbox"
                        id={`check-${row.id}`}
                        className="peer inputUnset checkboxCustom"
                        checked={isChecked}
                        onChange={() => handleToggleRow(row.id)}
                      />
                      <label
                        className="flex gap-4 cursor-pointer items-end justify-center before:w-8 before:h-8 before:inline-block before:content-[''] before:bg-[url('/icons/unchecked.svg')] peer-checked:before:bg-[url('/icons/checked.svg')] font-gowunBold text-[18px]"
                        htmlFor={`check-${row.id}`}
                      ></label>
                    </td>
                    <td>{row.company_name}</td>
                    <td>{formatKoreanDateTime(row.created_at)}</td>
                    <td
                      className="text-right"
                      onClick={(e) => {
                        // 휴지통 클릭 시에도 행 클릭 막기
                        e.stopPropagation();
                      }}
                    >
                      <button
                        className="rounded p-1 hover:bg-red-50 text-grey-300 cursor-pointer"
                        aria-label={`${row.company_name} 삭제`}
                        onClick={() => onDeleteOne(row.id)}
                        disabled={isDeleting}
                      >
                        <Trash size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="h-180  text-center text-grey-500">
                  <div className="flex items-center justify-center text-grey-500 min-h-80 max-h-[40vh] text-[1.8rem]">
                    현재 등록한 관심기업은 없습니다.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
