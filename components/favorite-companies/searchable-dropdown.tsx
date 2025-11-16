"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import ChevronUp from "@/assets/chevron-up.svg";
import ChevronDown from "@/assets/chevron-down.svg";
import Button from "@/components/common/button";
import { SearchableDropdownProps } from "@/models/company";
import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axiosClient";
import { useForm } from "react-hook-form";
import ErrorMsg from "@/components/common/error-msg";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useCompanies } from "@/hooks/useCompanies";

type SaveMemoPayload = {
  email: string;
  company_name: string;
  memo: string;
};

type SaveMemoResponse = {
  message: string;
};

export default function SearchableDropdown({
  label,
  onModalOpen,
}: SearchableDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const { data: options = [] } = useCompanies();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onSubmit", // submit 시에만 유효성 검사 (기본값)
    reValidateMode: "onChange", //  에러 상태일 때, 언제 다시 검사할지
    defaultValues: {
      email: "cloundyon31@gmail.com",
      company_name: "",
      memo: "",
    },
  });
  const companyName = watch("company_name");

  // useMutation 제네릭 순서: useMutation<TData, TError, TVariables, TContext>()
  const saveMemoMutation = useMutation<
    SaveMemoResponse,
    Error,
    SaveMemoPayload
  >({
    mutationFn: async (payload: {
      email: string;
      company_name: string;
      memo: string;
    }) => {
      const res = await axiosClient.post<SaveMemoResponse>(
        "/favorites",
        payload
      );
      return res.data;
    },
    onSuccess: (data) => {
      console.log("POST 요청 성공 후 받아온 데이터: ", data);
      alert(data.message ?? "저장되었습니다!");
      onModalOpen?.((prev) => !prev);

      // ✅ SSR 데이터 다시 가져오기 (서버 fetch 다시 실행)
      router.refresh();
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 422) {
          // 현재 422 에러 메시지(msg)는 "Field required"
          alert("요청 값이 올바르지 않습니다. 필수 항목을 다시 확인해주세요.");
          return;
        }

        if (status === 400) {
          // 현재 400 에러 메시지(msg)는 "{}는 이미 관심기업으로 등록되어 있습니다"
          const serverMsg = error.response?.data?.detail;

          alert(
            serverMsg ??
              "요청 값이 올바르지 않습니다. 필수 항목을 다시 확인해주세요."
          );
          return;
        }
      }

      alert("저장 중 오류가 발생했습니다.");
    },
  });

  const onSubmit = (data: SaveMemoPayload) => {
    saveMemoMutation.mutate(data);
  };

  // 검색 필터링
  const filteredOptions = useMemo<string[]>(() => {
    if (!companyName.trim()) return options;
    return options.filter((opt: string) =>
      opt.toLowerCase().includes(companyName.toLowerCase())
    );
  }, [companyName, options]);

  // option 선택
  function handleSelect(option: string) {
    setValue("company_name", option); // 인풋에 반영
    setIsDropdownOpen(false);
  }

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      {label && (
        <label className="mb-[0.8rem] block text-[1.6rem] font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* 인풋 + 아이콘 래퍼 */}
      <div className="relative">
        <input
          id="company_name"
          type="text"
          placeholder="기업명을 입력하세요."
          className={`w-full h-16 text-[1.6rem] rounded-md border border-grey-300 bg-white px-[1.6rem] py-[0.8rem] outline-none ring-0
                     focus:border-primary-500 ${
                       errors.company_name ? "error" : ""
                     }`}
          {...register("company_name", {
            required: "기업명은 필수입니다.",
            onChange: () => setIsDropdownOpen(true),
          })}
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
      <ErrorMsg target={errors.company_name} />

      <div className="mt-[0.8rem] border rounded-md border-grey-300 w-full ">
        <textarea
          id="memo"
          className={`inputUnset textareaCustom ${errors.memo ? "error" : ""}`}
          rows={10}
          placeholder="기업 소개를 입력하세요."
          {...register("memo", {
            required: "기업 소개란은 필수입니다.",
          })}
        ></textarea>
      </div>
      <ErrorMsg target={errors.memo} />

      <Button
        type="submit"
        black
        rounded
        className="max-w-24 ml-auto py-[0.8rem] mt-[3.6rem]"
      >
        저장
      </Button>
    </form>
  );
}
