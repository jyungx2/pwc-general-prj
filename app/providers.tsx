"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  // 순수 리액트 프로젝트처럼 Server Component(layout.tsx)에서 직접 new QueryClient() 만들면 X
  // layout.tsx
  // ❌ const queryClient = new QueryClient();

  // - RootLayout(layout.tsx)은 기본적으로 Server Component이므로
  //  *   그 안에서 new QueryClient()를 생성하면 서버 프로세스 간에 공유될 위험이 있음.
  //  *   (요청/유저 간 캐시가 섞일 가능성 + 직렬화 이슈까지 발생)

  // 1. 그래서 반드시 "use client"가 선언된 Client Component 내부에서 QueryClient 인스턴스를 생성해야 함.

  // 2. 또한, useState의 lazy initializer(() => new QueryClient())를 사용하면
  //    해당 컴포넌트가 렌더될 때마다 new QueryClient()가 재생성되지 않음.
  //    즉, "첫 마운트 시 딱 한 번만" QueryClient 인스턴스를 만들고,
  //    이후 리렌더/StrictMode의 더블 렌더링 상황에도 동일한 인스턴스를 재사용하여
  //    React Query의 캐시가 유지되도록 보장함.
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
