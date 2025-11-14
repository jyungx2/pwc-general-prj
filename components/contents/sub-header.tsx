"use client";

import Button from "@/components/common/button";
import Modal from "@/components/common/modal";
import SearchableDropdown from "@/components/common/searchable-dropdown";
import { Plus, Trash } from "lucide-react";
import { useState } from "react";
import Xbutton from "@/assets/xbtn.svg";
import Xbutton2 from "@/assets/xbtn-2.svg";
import Xcircle from "@/assets/xcircle.svg";
import Image from "next/image";

export default function SubHeader() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <div className="flex justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-[2.8rem] font-semibold">관심기업 관리 서비스</h1>
        <p className="text-[1.4rem] text-grey-500 font-regular">
          관심 기업을 등록하고 삭제하며 관리하세요.
        </p>
      </div>

      <div className="flex gap-4">
        <Button
          black
          rounded
          icon={<Plus size={20} />}
          onClick={() => setIsCreateOpen(true)}
        >
          관심기업 생성
        </Button>
        <Button
          white
          rounded
          icon={<Trash size={20} />}
          onClick={() => setIsDeleteOpen(true)}
        >
          관심기업 삭제
        </Button>
      </div>

      {isCreateOpen && (
        <Modal
          onClose={() => setIsCreateOpen(false)}
          className="w-240 p-[2rem] pt-0 gap-[3.2rem]"
        >
          <div className="flex justify-between border-b border-grey-300 py-[1.4rem] -mx-8 px-8 ">
            <h1 className="text-[1.8rem] font-semibold ">관심기업 생성</h1>

            <button
              onClick={() => setIsCreateOpen(false)}
              className="cursor-pointer"
            >
              <Image src={Xbutton} alt="x-button" />
            </button>
          </div>

          <SearchableDropdown
            label="관심기업 검색"
            // options={COMPANY_OPTIONS}
            // value={selectedCompany}
            // onChange={setSelectedCompany}
            placeholder="회사명을 입력하세요"
          />
        </Modal>
      )}

      {isDeleteOpen && (
        <Modal
          onClose={() => setIsDeleteOpen(false)}
          className="justify-center items-center w-160 gap-[3.2rem] p-[2.4rem]"
        >
          <button
            onClick={() => setIsDeleteOpen(false)}
            className="cursor-pointer ml-auto"
          >
            <Image src={Xbutton2} alt="x-button" />
          </button>

          <Image src={Xcircle} alt="x-circle" />

          <div className="flex flex-col gap-[1.2rem]">
            <p className="font-bold text-[2.4rem]">총 2개 삭제하시겠습니까?</p>

            <p className="flex flex-col gap-2 justify-center items-center">
              <span>관심기업 삭제시 복구할 수 없습니다.</span>
              <span>정말 삭제하시겠습니까?</span>
            </p>
          </div>

          <div className="w-full flex flex-col gap-[1.2rem]">
            <Button black rounded>
              삭제
            </Button>
            <Button white rounded onClick={() => setIsDeleteOpen(false)}>
              취소
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
