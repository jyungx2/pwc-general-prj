export function formatKoreanDateTime(isoString: string): string {
  const date = new Date(isoString);

  // 파싱 실패하면 빈 문자열 반환
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 0~11 이라 +1
  const day = String(date.getDate()).padStart(2, "0");

  const hour = date.getHours(); // 0~23
  const minute = String(date.getMinutes()).padStart(2, "0");

  const meridiem = hour < 12 ? "오전" : "오후"; // 12시 기준 오전/오후
  let hour12 = hour % 12;
  if (hour12 === 0) hour12 = 12; // 0시는 12시로 표시

  const hourStr = String(hour12).padStart(2, "0");

  // 최종 포맷: 2025. 07. 18 오후 06:55
  return `${year}. ${month}. ${day} ${meridiem} ${hourStr}:${minute}`;
}
