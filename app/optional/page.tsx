"use client";

import SubHeader from "@/components/contents/sub-header";

export default function OptionalPage() {
  return (
    <>
      <section className="banner-section banner-section--optional">
        {/* 이 안쪽 div는 단순히 높이만 만들어주는 용도 */}
        <div className="h-[24rem]" />
      </section>

      <div className="my-24 flex flex-col gap-[2.4rem]">
        <SubHeader
          title="기업 재무제표 조회"
          subtitle="기업명과 보고서 옵션을 선택하여 제무제표를 조회해보세요."
          // selectedCount={selectedIds?.length}
          // onConfirmDelete={handleDeleteSelected}
          // isDeleting={isPending}
        />
      </div>
    </>
  );
}
