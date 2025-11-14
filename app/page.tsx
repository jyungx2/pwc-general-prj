import HomeClient from "@/components/contents/home-client";
import { Company } from "@/models/company";

async function getFavorites(email: string): Promise<Company[]> {
  // 백엔드 도메인으로 직접 호출 (외부 API)
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/favorites?email=${email}`,
    {
      cache: "no-store", // SSR (항상 새로 그리기) 느낌
      //   cache: "force-cache", // 기본값 ("같은 fetch 결과를 캐시로 재사용해도 된다”는 허용만 하는 옵션으로, revalidate를 쓰면 N초마다 다시 확인하는 ISR, revalidate 없이 쓰면 캐시를 쓰는데, 재검증 주기는 다른 레벨(경로/루트 레벨 설정 등)에 따라 결정한다는 의미)
      //   next: { revalidate: N } → ISR (캐시 + 주기적 재검증) 설정
    }
  );

  if (!res.ok) {
    // 에러 핸들링은 상황에 맞게 (에러 페이지로 throw 등)
    throw new Error("관심기업 조회 실패");
  }

  const data = await res.json();
  return data.items; // 백엔드 응답 구조에 맞게 수정
}

export default async function Home() {
  const email = "cloundyon31@gmail.com"; // 나중에 로그인 유저 정보에서 가져오면 됨

  // 서버에서 미리 관심기업 데이터 가져오기
  const favorites = await getFavorites(email);

  // "클라이언트" 컴포넌트에 props로 넘김
  return <HomeClient initialFavorites={favorites} />;
}
