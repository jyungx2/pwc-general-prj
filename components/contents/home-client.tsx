"use client";

import CompanyTable from "@/components/contents/company-table";
import CompanyDetailModal from "@/components/contents/company-detail";
import SubHeader from "@/components/common/sub-header";
import { Pagination } from "@/components/pagination/pagination";
import { Company } from "@/models/company";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axiosClient";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/common/button";
import { Plus, Trash } from "lucide-react";
import Modal from "@/components/common/modal";
import SearchableDropdown from "@/components/common/searchable-dropdown";
import Xbutton from "@/assets/xbtn.svg";
import Xbutton2 from "@/assets/xbtn-2.svg";
import Xcircle from "@/assets/xcircle.svg";
import Image from "next/image";
import axios from "axios";

type HomeClientProps = {
  initialFavorites: Company[];
  currentPage: number;
  totalPages: number;
};

export default function HomeClient({
  initialFavorites,
  currentPage,
  totalPages,
}: HomeClientProps) {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const email = process.env.NEXT_PUBLIC_EMAIL;

  // ✅ 선택된 기업 id 목록을 여기서 관리
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const router = useRouter();
  const selectedCount = selectedIds.length;

  const favorites = initialFavorites;

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const searchParams = useSearchParams(); // 현재 URL의 쿼리 파라미터 읽기

  // FIXME: 페이지 이동 시 선택된 체크박스 초기화 로직
  // 기존에는 currentPage가 바뀔 때마다 effect에서 setSelectedIds([])를 호출해서
  // "페이지가 바뀌면 선택 상태를 비운다"는 동작을 구현하려고 했지만..
  // useEffect(() => {
  //   setSelectedIds([]);
  // }, [currentPage]);

  // effect 안에서 props(currentPage) → state(selectedIds)처럼
  // 내부 파생 상태만 갱신하는 패턴은
  // - React가 권장하는 "외부 시스템과의 동기화용 effect" 용도와 맞지 않고
  // - 불필요한 추가 렌더링(cascading renders)을 유발할 수 있어 경고가 발생함.

  // 그래서 이 로직은 사용하지 않고, 상위 컴포넌트에서 key={currentPage}를 주어
  // HomeClient 전체를 페이지마다 새로 마운트시키는 방식으로 상태를 초기화한다.

  // 페이지 변경: URL의 ?page= 바꾸기 → 서버 컴포넌트가 다시 실행됨
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(page)); // 쿼리파라미터 'page' 세팅
    console.log("params: ", params);
    router.push(`/?${params.toString()}`);
    // App Router에서는 push만 해도 해당 경로의 서버 컴포넌트가 다시 호출됨
  };

  // ✅ 공통 삭제 mutation (단일/여러 개 다 여기서)
  const { mutate: deleteFavorites, isPending: isDeleting } = useMutation({
    mutationFn: async (ids: number[]) => {
      await Promise.all(
        ids.map((id) =>
          axiosClient.delete(`/favorites/${id}`, {
            params: { email },
          })
        )
      );
    },
    onSuccess: () => {
      setSelectedIds([]); // 선택 초기화

      // ✅ SSR 데이터 다시 가져오기 (서버 fetch 다시 실행)
      router.refresh();
      // favorites는 SSR(fetch no-store) 데이터이기 때문에
      // React Query 캐시 무효화(invalidateQueries)는 동작하지 않음.
      // queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: (error) => {
      console.log("삭제 실패시 error: ", error);
      // Axios 에러인지 먼저 체크
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        // 1) 서버가 422 응답한 경우 (validation 문제)
        if (status === 422) {
          // 현재 422 에러 메시지(msg)는 "Field required"
          alert("요청 값이 올바르지 않습니다. 필수 항목을 다시 확인해주세요.");
          return;
        }

        // 2) response 자체가 없으면 → 네트워크 / CORS / 서버 미응답
        if (!error.response) {
          alert(
            "네트워크 오류로 요청에 실패했습니다. 인터넷 연결을 확인해주세요."
          );
          return;
        }

        // 3) 그 외 기타 서버 에러 (500, 403 등)
        alert("요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }

      // 4) axios 에러도 아닌 이상한 예외
      alert("알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    },
  });

  // ✅ 여러 개 삭제
  const handleDeleteSelected = () => {
    if (!selectedIds.length) return;
    deleteFavorites(selectedIds);
  };

  // ✅ 개별 삭제 (휴지통 아이콘)
  const handleDeleteOne = (id: number) => {
    deleteFavorites([id]);
  };

  const handleConfirmDelete = () => {
    handleDeleteSelected();
    setIsDeleteOpen(false);
  };

  const handleOpenDeleteModal = () => {
    if (!selectedIds.length) {
      alert("삭제할 관심기업을 선택해주세요.");
      return;
    }
    setIsDeleteOpen(true);
  };

  return (
    <>
      <section className="banner-section banner-section--main">
        {/* 이 안쪽 div는 단순히 높이만 만들어주는 용도 */}
        <div className="h-[24rem]" />
      </section>

      <div className="my-24 flex flex-col gap-[2.4rem]">
        <SubHeader
          title="관심기업 관리 서비스"
          subtitle="관심 기업을 등록하고 삭제하며 관리하세요."
          primaryBtn={
            <Button
              black
              rounded
              icon={<Plus size={20} />}
              onClick={() => setIsCreateOpen(true)}
            >
              관심기업 생성
            </Button>
          }
          secondaryBtn={
            <Button
              white
              rounded
              icon={<Trash size={20} />}
              onClick={handleOpenDeleteModal}
              disabled={isDeleting}
            >
              관심기업 삭제
            </Button>
          }
        />
        <CompanyTable
          favorites={favorites}
          onRowClick={setSelectedCompany}
          selectedIds={selectedIds}
          onChangeSelectedIds={setSelectedIds}
          onDeleteOne={handleDeleteOne}
        />
        <Pagination
          currentPage={currentPage} // 서버에서 내려준 현재 페이지
          totalPages={totalPages} // 총 페이지 개수
          onPageChange={handlePageChange} // ✅ URL을 바꾸는 함수
        />
        {selectedCompany && (
          <CompanyDetailModal
            selectedCompany={selectedCompany}
            onClose={() => setSelectedCompany(null)}
          />
        )}
      </div>

      {isCreateOpen && (
        <Modal
          onClose={() => setIsCreateOpen(false)}
          className="w-240 p-8 pt-0 gap-[3.2rem]"
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
            onModalOpen={setIsCreateOpen}
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
            <p className="font-bold text-[2.4rem]">
              총 {selectedCount}개 삭제하시겠습니까?
            </p>

            <p className="flex flex-col gap-2 justify-center items-center">
              <span>관심기업 삭제시 복구할 수 없습니다.</span>
              <span>정말 삭제하시겠습니까?</span>
            </p>
          </div>

          <div className="w-full flex flex-col gap-[1.2rem]">
            <Button
              black
              rounded
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              삭제
            </Button>
            <Button
              white
              rounded
              onClick={() => setIsDeleteOpen(false)}
              disabled={isDeleting}
            >
              취소
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
