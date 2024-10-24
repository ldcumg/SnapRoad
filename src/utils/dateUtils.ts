/**
 * 날짜를 숫자 형식으로 변환
 * @param dateString 날짜 문자열 (예: '2023-10-21T12:30:00Z')
 * @returns 변환된 날짜 문자열 (예: '20231021-1230')
 */

export const formatDateToNumber = (dateString: string): string => {
  const dateObj = new Date(dateString);

  const year = dateObj.getFullYear();
  // 월은 0부터 시작하므로 +1, 두 자리로 표시
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  return `${year}${month}${day}-${hours}${minutes}`;
};