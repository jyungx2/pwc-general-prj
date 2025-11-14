"use client";

import Button from "@/components/common/button";
import Modal from "@/components/common/modal";
import { axiosClient } from "@/lib/axiosClient";
import { Props } from "@/models/company";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useState } from "react";

export default function CompanyDetailModal({
  selectedCompany,
  onClose,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [memoDraft, setMemoDraft] = useState(""); // ✏️ 편집용
  const queryClient = useQueryClient();

  console.log("selectedCompany: ", selectedCompany);
  const email = process.env.NEXT_PUBLIC_EMAIL;

  const { data: companyDetail } = useQuery({
    queryKey: ["company", "detail", selectedCompany?.id, email],
    queryFn: async () => {
      const res = await axiosClient.get(`/favorites/${selectedCompany?.id}`, {
        params: { email },
      });
      const data = res.data;
      console.log("상세 data: ", data);
      return data;
    },
    enabled: !!email && !!selectedCompany?.id,
  });

  const { mutate: saveMemo, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      await axiosClient.put(
        `/favorites/${selectedCompany?.id}`,
        {
          // 요청 바디 (JSON body)
          memo: memoDraft,
        },
        {
          // 쿼리스트링 (?email=xxx)
          params: { email },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["company", "detail", selectedCompany?.id, email],
      });
      setIsEditing(false);
      alert("수정이 완료되었습니다!");
    },
    onError: () => {
      alert("수정 중 오류가 발생했습니다.");
    },
  });

  // useEffect(() => {
  //   if (companyDetail?.memo !== null) {
  //     setMemo(companyDetail.memo);
  //   }
  // }, [companyDetail]);

  const handleStartEdit = () => {
    // 편집 시작할 때 서버 값을 로컬 state(memoDraft)로 복사
    setMemoDraft(companyDetail?.memo ?? "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false); // draft는 그냥 버림
  };

  return (
    <Modal
      modalClassName="items-end justify-end" // 오른쪽 정렬
      className="w-1/2 h-screen p-8 pt-0 rounded-none" // 전체 너비는 반만큼, 높이는 스크린 높이만큼 차지하도록 설정
      onClose={onClose}
    >
      {/* 상단 제목 */}
      <header className="mb-[3.9rem] text-center text-[1.8rem] font-semibold border-b border-grey-300 py-[1.3rem] -mx-8 px-8">
        {companyDetail?.company_name}
      </header>

      {/* 내용 영역 */}
      <div className="flex-1 border border-grey-300 rounded-md mb-[3.6rem] ">
        <textarea
          id="memo"
          className="textareaCustom w-full h-full text-[1.6rem] p-4 outline-none"
          value={
            isEditing
              ? memoDraft // 편집 중엔 draft
              : companyDetail?.memo ?? "" // 그 외엔 서버 값(SOT)
          }
          readOnly={!isEditing}
          onChange={(e) => setMemoDraft(e.target.value)}
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
              onClick={() => handleCancel()}
              disabled={isSaving}
            >
              취소하기
            </Button>
            <Button
              black
              rounded
              onClick={() => saveMemo()}
              disabled={isSaving}
            >
              {isSaving ? "저장 중..." : "저장하기"}
            </Button>
          </div>
        ) : (
          <Button
            icon={<Pencil size={20} />}
            black
            rounded
            className="font-medium px-[1.6rem] py-[0.8rem] max-w-[11.6rem] gap-[0.8rem]"
            onClick={() => handleStartEdit()}
          >
            수정하기
          </Button>
        )}
      </footer>
    </Modal>
  );
}
