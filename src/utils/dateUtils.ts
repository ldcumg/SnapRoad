/**
 * 날짜를 숫자 형식으로 변환
 * @param dateString 날짜 문자열 (예: '2023-10-21T12:30:00Z')
 * @month 월은 0부터 시작하므로 +1
 * @returns 변환된 날짜 문자열 (예: '2023-10-21-12:30')
 */

export const formatDateToNumber = (dateString: string | undefined): string => {
  if (!dateString) return '';
  const dateObj = new Date(dateString);
  if (isNaN(dateObj.getTime())) return '';
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

/**
 * 날짜를 PostgreSQL timestamp 형식으로 변환
 * @param dateString ISO 형식의 날짜 문자열 (예: '2024-10-25T02:12:46.286705Z')
 * @returns 변환된 날짜 문자열 (예: '2024-10-25 02:12:46.286705')
 */

export const formatDateToPostgres = (dateString: string): string => {
  const date = new Date(dateString);
  const pad = (n: number) => (n < 10 ? '0' + n : n);
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const milliseconds = date.getMilliseconds().toString().padStart(6, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
};
