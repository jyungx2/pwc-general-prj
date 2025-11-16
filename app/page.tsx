import HomeClient from "@/components/contents/home-client";
import { Favorites } from "@/models/company";

async function getFavorites(email: string, page: number): Promise<Favorites> {
  // 백엔드 도메인으로 직접 호출 (외부 API)
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/favorites?email=${email}&page=${page}`,
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
  console.log("From Server Component: ", data);
  return data; // 백엔드 응답 구조에 맞게 수정
}

// * App Router에서 page 컴포넌트가 기본으로 받는 props 타입
// - params: URL 경로의 동적 세그먼트 값 (현재 루트 "/", 동적 세그먼트 없음 → 항상 빈 객체)
// - searchParams: "?email=...&page=..." 처럼 쿼리스트링으로 넘어오는 값들
type PageProps = {
  // params와 searchParams는 모두 Promise로 들어오기 때문에 Promise 타입으로 선언
  params: Promise<Record<string, string | string[]>>;
  searchParams?: Promise<Record<string, string | string[]>>;
};

export default async function Home(props: PageProps) {
  // 🔍 [디버깅 포인트 요약]
  //  - 처음에는 searchParams를 단순 객체라고 생각하고
  //      const { searchParams } = props;
  //      const currentPage = Number(searchParams?.page ?? "1");
  //    이렇게 사용했음.
  //  - 하지만 DevTools에서 찍어보니 searchParams가
  //    ReactPromise { status: "pending" / "halted", value: null, ... }
  //    형태로 보였고, 실제 page 값은 접근할 수 없었음.
  //  - 결과적으로 searchParams?.page 가 항상 undefined가 되어
  //    currentPage는 매번 1로 계산 & 동일한 데이터만 보였고,
  //    → 페이지네이션 버튼 하이라이트가 항상 "1"에만 고정되는 문제가 발생.
  //
  //  ✅ 해결:
  //  - searchParams를 Promise로 보고, 먼저 await 해서 "실제 객체"로 해석한 뒤 사용.
  //  - 이렇게 하면 URL이 "/?page=2" 일 때
  //    resolvedSearchParams.page === "2" 가 되어 currentPage도 2로 계산됨.

  // 1️⃣ Promise인 searchParams를 먼저 await 해서 '실제 쿼리 객체'로 변환
  console.log(props.searchParams);
  const resolvedSearchParams = await props.searchParams;
  console.log("searchParams(HOME): ", resolvedSearchParams);

  const email = "cloundyon31@gmail.com"; // 나중에 로그인 유저 정보에서 가져오면 됨

  // 2️⃣ URL 쿼리의 page 값을 숫자로 변환
  //    - "/?page=2" → page: "2" → Number("2") === 2
  //    - 쿼리가 없으면 기본값 "1" 사용
  //    - Number 결과가 NaN 인 경우를 대비해 || 1 로 한 번 더 방어
  const currentPage = Number(resolvedSearchParams?.page ?? "1") || 1;

  // 3️⃣ 서버에서 미리 관심기업 데이터 가져오기 (SSR)
  //    - URL의 쿼리 파라미터(page)값을 가져와 currentPage를 그대로 백엔드 API에 전달
  const { items, total_pages } = await getFavorites(email, currentPage);

  // 4️⃣ 실제 화면은 클라이언트 컴포넌트(HomeClient)가 담당
  //    - SSR로 패칭한 초기 데이터(initialFavorites)를 props로 전달
  //    - currentPage / totalPages 정보도 함께 내려줘서
  //      Pagination 컴포넌트에서 현재 페이지 하이라이트, 이전/다음 버튼 상태 등을 관리
  return (
    <HomeClient
      key={currentPage} // 페이지 번호가 바뀌면 이 HomeClient는 새로운 컴포넌트로 취급
      initialFavorites={items}
      currentPage={currentPage}
      totalPages={total_pages}
    />
  );
}
