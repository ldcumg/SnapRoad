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
