// app/api/financials/route.ts
import { NextRequest, NextResponse } from "next/server";
import corpCodes from "@/data/corpCodes.json"; // 아까 만든 JSON
import {
  CorpCodeEntry,
  DartSingleAccountResponse,
  FinancialTableRow,
} from "@/models/financial";

function getCorpCodeByName(name: string): string | null {
  const entry = (corpCodes as CorpCodeEntry[]).find(
    (c) => c.corp_name === name
  );
  return entry?.corp_code ?? null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const apiKey = process.env.NEXT_PUBLIC_DART_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { message: "DART_API_KEY가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  // 1) 필수 파라미터 검증
  const corpName = searchParams.get("corpName");
  const bsnsYear = searchParams.get("bsnsYear");
  const reprtCode = searchParams.get("reprtCode");
  const fsDiv = searchParams.get("fsDiv");

  if (!corpName || !bsnsYear || !reprtCode || !fsDiv) {
    return NextResponse.json(
      { message: "필수 파라미터가 누락되었습니다." },
      { status: 400 }
    );
  }

  // 2) 기업명 기반으로 corp_code 조회
  const corpCode = getCorpCodeByName(corpName);
  if (!corpCode) {
    return NextResponse.json(
      { message: `corp_code를 찾을 수 없습니다: ${corpName}` },
      { status: 404 }
    );
  }

  // 3) DART 재무제표 API 호출
  // DART 단일회사 전체 재무제표 API
  const dartUrl = new URL(
    "https://opendart.fss.or.kr/api/fnlttSinglAcntAll.json"
  );

  dartUrl.searchParams.set("crtfc_key", apiKey);
  dartUrl.searchParams.set("corp_code", corpCode);
  dartUrl.searchParams.set("bsns_year", bsnsYear);
  dartUrl.searchParams.set("reprt_code", reprtCode);
  dartUrl.searchParams.set("fs_div", fsDiv);

  const res = await fetch(dartUrl.toString(), { cache: "no-store" });

  if (!res.ok) {
    return NextResponse.json(
      {
        message: `DART API 요청 실패: ${res.status} ${res.statusText}`,
      },
      { status: 502 }
    );
  }

  const dartData = (await res.json()) as DartSingleAccountResponse;

  // 4) DART status 코드 체크
  if (dartData.status !== "000") {
    return NextResponse.json(
      {
        message: `DART API 에러: [${dartData.status}] ${dartData.message}`,
      },
      { status: 502 }
    );
  }

  const list = dartData.list ?? [];

  // 5) 프론트 테이블에서 바로 쓰기 좋은 형태로 매핑
  const rows: FinancialTableRow[] = list.map((item) => ({
    statementName: item.sj_nm,
    accountName: item.account_nm,
    accountDetail: item.account_detail,
    thstrmName: item.thstrm_nm,
    thstrmAmount: item.thstrm_amount,
    frmtrmName: item.frmtrm_nm,
    frmtrmAmount: item.frmtrm_amount,
    bfefrmtrmName: item.bfefrmtrm_nm,
    bfefrmtrmAmount: item.bfefrmtrm_amount,
  }));

  // 6) 최종 응답 (메타 정보 + rows)
  return NextResponse.json({
    corpName,
    corpCode,
    bsnsYear,
    reprtCode,
    fsDiv,
    rows,
  });
}
