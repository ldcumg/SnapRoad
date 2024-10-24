/**
 * 랜덤 파일명을 생성
 * @param originalFileName 원본 파일명
 * @returns 랜덤하게 생성된 파일명 (예: 123456.jpg)
 */

export const generateRandomFileName = (originalFileName: string) => {
  const randomNumber = Math.floor(Math.random() * 1000000);
  const fileExtension = originalFileName.split('.').pop();
  return `${randomNumber}.${fileExtension}`;
};
