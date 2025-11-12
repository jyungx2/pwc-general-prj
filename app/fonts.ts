import localFont from "next/font/local";

export const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  display: "swap",
  style: "normal",
  weight: "45 920",
  variable: "--font-pretendard", // localFont가 만든 CSS 변수를 DOM에 붙이는 클래스
});
