import "dotenv/config"; // .env(.local)에서 환경변수 로드
import fetch from "node-fetch"; // Node용 fetch
import JSZip from "jszip"; // zip 압축 해제
import { XMLParser } from "fast-xml-parser"; // XML → JS 객체
import fs from "fs";

const API_KEY = process.env.NEXT_PUBLIC_DART_API_KEY;

if (!API_KEY) {
  console.error("DART_API_KEY 환경변수를 설정하세요.");
  process.exit(1);
}

async function main() {
  // 1) corpCode.xml ZIP 요청
  const url = `https://opendart.fss.or.kr/api/corpCode.xml?crtfc_key=${API_KEY}`;
  const res = await fetch(url);

  if (!res.ok) {
    console.error("corpCode.xml 요청 실패:", res.status, res.statusText);
    process.exit(1);
  }

  const arrayBuffer = await res.arrayBuffer();

  // 2) ZIP 압축 해제
  const zip = await JSZip.loadAsync(Buffer.from(arrayBuffer));
  const xmlFile = zip.file("CORPCODE.xml");
  if (!xmlFile) {
    console.error("ZIP 안에 CORPCODE.xml을 찾을 수 없습니다.");
    process.exit(1);
  }

  const xmlText = await xmlFile.async("string");

  // 3) XML → JS 객체 변환
  const parser = new XMLParser();
  const json = parser.parse(xmlText);

  // json.result.list 가 기업 리스트 (형태: { corp_code, corp_name, stock_code, ... }[])
  const list = json.result.list;

  // 4) 우리가 쓰기 편하게 가공 (예: corp_name 기준)
  //    실제 과제에서는 원하는 구조로 바꿔서 DB에 insert하거나, data/corpCodes.json으로 저장하면 됨.
  const simplified = list.map((item) => ({
    corp_code: String(item.corp_code).padStart(8, "0"),
    corp_name: item.corp_name,
    stock_code: item.stock_code,
  }));

  fs.writeFileSync(
    "./data/corpCodes.json",
    JSON.stringify(simplified, null, 2),
    "utf-8"
  );

  console.log(`✅ corpCodes.json 저장 완료 (총 ${simplified.length}건)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
