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

/**
 * 파일명에서 확장자를 제거하는 함수
 * @param filename 파일명 (예: example.jpg)
 * @returns 확장자가 제거된 파일명 (예: example)
 * 확장자가 없는 경우 원래 파일명을 반환
 */

export const removeFileExtension = (filename: string) => {
  return filename.substring(0, filename.lastIndexOf('.')) || filename;
};
