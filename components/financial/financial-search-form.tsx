"use client";

import { useForm } from "react-hook-form";
import Capture from "@/assets/capture.svg";
import Button from "@/components/common/button";
import { useMemo, useState } from "react";
import Image from "next/image";
import Search from "@/assets/search.svg";
import { useCompanies } from "@/hooks/useCompanies";
import {
  FinancialSearchFormProps,
  FinancialSearchFormValues,
} from "@/models/financial";
import ErrorMsg from "@/components/common/error-msg";

const yearOptions = ["2021", "2022", "2023", "2024", "2025"];

const reportOptions = [
  { label: "1분기보고서", value: "11013" },
  { label: "반기보고서", value: "11012" },
  { label: "3분기보고서", value: "11014" },
  { label: "사업보고서", value: "11011" },
];

const fsOptions = [
  { label: "재무제표", value: "OFS" },
  { label: "연결재무제표", value: "CFS" },
];

export default function FinancialSearchForm({
  onSubmit,
}: FinancialSearchFormProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: options = [] } = useCompanies();

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FinancialSearchFormValues>({
    defaultValues: {
      corpName: "",
      bsnsYear: "",
      reprtCode: "",
      fsDiv: undefined,
    },
  });

  const companyName = watch("corpName");

  // 검색 필터링
  const filteredOptions = useMemo<string[]>(() => {
    if (!companyName.trim()) return options;
    return options.filter((opt: string) =>
      opt.toLowerCase().includes(companyName.toLowerCase())
    );
  }, [companyName, options]);

  // option 선택
  function handleSelect(option: string) {
    setValue("corpName", option); // 인풋에 반영
    setIsDropdownOpen(false);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-[1.6rem]"
    >
      {/* 기업명 드롭다운 (백엔드에서 받은 목록) */}
      <div className="flex flex-col">
        <div className="flex">
          <label
            htmlFor="corpName"
            className="flex items-center w-32 mb-[0.8rem] text-[1.6rem] font-semibold text-gray-700"
          >
            <span className="text-primary-500 mr-1">*</span>
            <span>기업명</span>
          </label>
          <div className="relative flex-1">
            <input
              id="corpName"
              type="text"
              className={`w-full h-16 text-[1.6rem] rounded-md border border-grey-300 bg-white px-[0.8rem] py-[0.8rem] outline-none ring-0
                             focus:border-primary-500 ${
                               errors.corpName ? "error" : ""
                             }`}
              {...register("corpName", {
                required: "기업명을 입력해주세요.",
                onChange: () => setIsDropdownOpen(true),
              })}
            />

            {/* 아래 화살표 아이콘 영역 */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-[0.8rem]"
            >
              <Image src={Search} alt="dropdown-chevron" />
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
                      const isSelected = option === companyName;

                      return (
                        <li key={i} className="">
                          <button
                            type="button"
                            onClick={() => handleSelect(option)}
                            className={`flex w-full h-16 items-center p-[0.8rem] 
                                  ${
                                    isSelected
                                      ? "bg-primary-300 text-body rounded-md"
                                      : "text-gray-900 hover:bg-grey-100 focus:bg-primary-300 rounded-xs"
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
        </div>

        <ErrorMsg target={errors.corpName} className="ml-32 mt-4" />
      </div>

      {/* 사업연도 */}
      <div className="flex gap-2">
        <label
          htmlFor="bsnsYear"
          className="flex items-center w-32 mb-1 font-semibold"
        >
          <span className="text-primary-500 mr-1">*</span>
          <span>사업연도</span>
        </label>
        <select
          id="bsnsYear"
          className={`dropdownDesign ${errors.bsnsYear ? "error" : ""}`}
          {...register("bsnsYear", {
            required: "사업연도를 선택해주세요.",
          })}
        >
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <ErrorMsg target={errors.bsnsYear} />
      </div>

      {/* 보고서명 */}
      <div className="flex gap-2">
        <label
          htmlFor="reprtCode"
          className="flex items-center w-32 mb-1 font-semibold"
        >
          <span className="text-primary-500 mr-1">*</span>
          <span>보고서명</span>
        </label>
        <select
          id="reprtCode"
          className={`dropdownDesign ${errors.reprtCode ? "error" : ""}`}
          {...register("reprtCode", {
            required: "보고서명을 선택해주세요.",
          })}
        >
          {reportOptions.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        <ErrorMsg target={errors.reprtCode} />
      </div>

      {/* 재무제표 종류 */}
      <div className="flex gap-2">
        <label
          htmlFor="fsDiv"
          className="flex items-center w-32 mb-1 font-semibold"
        >
          <span className="text-primary-500 mr-1">*</span>
          <span>재무제표</span>
        </label>
        <select
          id="fsDiv"
          className={`dropdownDesign ${errors.fsDiv ? "error" : ""}`}
          {...register("fsDiv", {
            required: "재무제표 유형을 선택해주세요.",
          })}
        >
          <option value="" disabled selected>
            재무제표 유형을 선택해주세요.
          </option>
          {fsOptions.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
        <ErrorMsg target={errors.fsDiv} />
      </div>

      <Button
        type="submit"
        icon={<Image src={Capture} alt="검색 아이콘" />}
        black
        rounded
        className="self-center gap-[0.8rem] px-[6rem]"
      >
        검색
      </Button>
    </form>
  );
}
