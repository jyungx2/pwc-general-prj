"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import ChevronUp from "@/assets/chevron-up.svg";
import ChevronDown from "@/assets/chevron-down.svg";
import Button from "@/components/common/button";
import { SearchableDropdownProps } from "@/models/company";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axiosClient";

export default function SearchableDropdown({
  label,
  placeholder = "검색어를 입력하세요",
  onChange,
}: SearchableDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState<string | null>(null); // 🔹 현재 선택된 회사명
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { data: options } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const res = await axiosClient.get("/companies");
      const data = await res.data.companies;
      return data;
    },
  });

  // 검색 필터링
  const filteredOptions = useMemo<string[]>(() => {
    if (!keyword.trim()) return options;
    return options.filter((opt: string) =>
      opt.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [keyword, options]);

  // option 선택
  function handleSelect(option: string) {
    setKeyword(option); // 인풋에 선택된 회사명 표시 f
    setSelected(option); // 현재 선택된 값 저장 (주황색 표시용)
    setIsDropdownOpen(false);
    onChange?.(option);
  }

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label className="mb-[0.8rem] block text-[1.6rem] font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* 인풋 + 아이콘 래퍼 */}
      <div className="relative">
        <input
          type="text"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            if (!isDropdownOpen) setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder={placeholder}
          className="w-full h-16 text-[1.6rem] rounded-md border border-grey-300 bg-white px-[1.6rem] py-[0.8rem] outline-none ring-0
                     focus:border-primary-500"
        />

        {/* 아래 화살표 아이콘 영역 */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="absolute inset-y-0 right-0 flex items-center pr-2"
        >
          <Image
            src={isDropdownOpen ? ChevronUp : ChevronDown}
            alt="dropdown-chevron"
          />
        </button>

        {/* 드롭다운 리스트 */}
        {isDropdownOpen && (
          <div
            className="absolute left-0 right-0 z-20 mt-1 max-h-60 overflow-y-auto rounded-md
                       bg-white boxShadow p-[0.8rem] no-scrollbar"
          >
            {filteredOptions?.length === 0 ? (
              <div className="flex items-center h-16 leading-16 p-[0.8rem] text-grey-500">
                검색 결과가 없습니다.
              </div>
            ) : (
              <ul className="flex flex-col gap-1">
                {filteredOptions?.map((option, i) => {
                  const isSelected = option === selected;

                  return (
                    <li key={i} className="">
                      <button
                        type="button"
                        onClick={() => handleSelect(option)}
                        className={`flex w-full h-16 items-center p-[0.8rem] 
                          ${
                            isSelected
                              ? "bg-primary-300 text-body rounded-md"
                              : "text-gray-900 hover:bg-grey-100 rounded-xs"
                          }`}
                      >
                        {option}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="mt-[0.8rem] border rounded-md border-grey-300 w-full mb-[3.6rem]">
        <textarea
          id="content"
          className="inputUnset textareaCustom"
          rows={10}
          placeholder="회사 소개를 입력하세요."
        ></textarea>
      </div>

      <Button black rounded className="max-w-24 ml-auto py-[0.8rem]">
        저장
      </Button>
    </div>
  );
}
