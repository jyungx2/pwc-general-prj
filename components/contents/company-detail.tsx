"use client";

import Button from "@/components/common/button";
import Modal from "@/components/common/modal";
import { Props } from "@/models/company";
import { Pencil } from "lucide-react";
import { useState } from "react";

export default function CompanyDetailModal({ data, onClose }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(data.memo);

  return (
    <Modal
      modalClassName="items-end justify-end"
      className="w-1/2 h-full p-8 pt-0 0 rounded-none" // 전체 크기 조절
      onClose={onClose}
    >
      {/* 상단 제목 */}
      <header className="mb-[3.9rem] text-center text-[1.8rem] font-semibold border-b border-grey-300 py-[1.3rem] -mx-8 px-8">
        {data.company_name}
      </header>

      {/* 내용 영역 */}
      <div className="flex-1 border border-grey-300 rounded-md mb-[3.6rem]">
        <textarea
          className="inputUnset textareaCustom w-full h-full resize-none text-[1.6rem] p-4"
          value={description}
          readOnly={!isEditing}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* 하단 버튼 영역 */}
      <footer className="mt-4 flex justify-end">
        {isEditing ? (
          <div className="flex gap-[1.2rem]">
            <Button
              white
              rounded
              className="border-grey-200"
              onClick={() => setIsEditing(false)}
            >
              취소하기
            </Button>
            <Button black rounded>
              저장하기
            </Button>
          </div>
        ) : (
          <Button
            icon={<Pencil size={20} />}
            black
            rounded
            className="font-medium px-[1.6rem] py-[0.8rem] max-w-[11.6rem] gap-[0.8rem]"
            onClick={() => setIsEditing(true)}
          >
            수정하기
          </Button>
        )}
      </footer>
    </Modal>
  );
}
