export function usePagination(
  currentPage: number,
  totalPages: number,
  siblingCount = 2
) {
  const MAX_VISIBLE = 9; // 👈 9페이지 이하면 그냥 다 보여주기
  const EDGE_BLOCK = 8;

  //  1. 초반 구간: 현재 페이지가 1~8일 때
  if (totalPages <= MAX_VISIBLE) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= EDGE_BLOCK) {
    const firstBlock = Array.from({ length: EDGE_BLOCK }, (_, i) => i + 1); // [1..8]

    return [...firstBlock, "...", totalPages] as (number | "...")[];
  }

  // 2. 후반 구간: 현재 페이지가 마지막 8개 안쪽일 때
  if (currentPage >= totalPages - EDGE_BLOCK + 1) {
    const start = totalPages - EDGE_BLOCK + 1;
    const lastBlock = Array.from({ length: EDGE_BLOCK }, (_, i) => start + i); // [43..50] 같은 구간

    return [1, "...", ...lastBlock] as (number | "...")[];
  }

  // 3. 그 외 "중간" 구간에서만 leftGap/rightGap 로직 사용
  const leftSibling = Math.max(currentPage - siblingCount, 2);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages - 1);

  const leftGap = leftSibling - 1; // 1 ~ leftSibling 사이 간격 개수
  const rightGap = totalPages - rightSibling; // rightSibling ~ 마지막 사이 간격 개수

  const range: (number | "...")[] = [];

  // 왼쪽 부분
  if (leftGap <= 4) {
    // 1,2,3 처럼 간격이 작으면 그냥 숫자로 다 보여줌
    for (let i = 1; i < leftSibling; i++) {
      range.push(i);
    }
  } else {
    // 간격이 크면 1 ... leftSibling-1 생략
    range.push(1, "...");
  }

  // 가운데 (현재 페이지 주변)
  for (let i = leftSibling; i <= rightSibling; i++) {
    range.push(i);
  }

  // 오른쪽 부분
  if (rightGap <= 4) {
    // 간격이 작으면 그냥 숫자로 다 보여줌
    for (let i = rightSibling + 1; i <= totalPages; i++) {
      range.push(i);
    }
  } else {
    // 간격이 크면 ... last
    range.push("...", totalPages);
  }

  return range;
}
