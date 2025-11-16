"use client";

import Button from "@/components/common/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="flex flex-col gap-4 justify-center items-center font-semibold text-[2rem] mt-150">
      <h1>요청하신 페이지를 찾을 수 없습니다.</h1>
      <p>홈으로 이동하여 다시 시도해주세요.</p>

      <Button
        black
        rounded
        className="max-w-fit px-[3.2rem] mt-8"
        onClick={() => router.back()}
      >
        이전 페이지로 돌아가기
      </Button>
    </main>
  );
}
