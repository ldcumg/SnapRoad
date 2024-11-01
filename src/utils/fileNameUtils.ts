import browserClient from '@/utils/supabase/client';

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

/**
 * 배열에서 무작위 요소를 선택하여 반환하는 함수
 * @param array - 요소가 포함된 배열
 * @returns 배열에서 무작위로 선택된 요소
 * 주어진 배열의 길이를 기준으로 무작위 인덱스를 생성한 뒤, 해당 인덱스의 요소를 반환합니다.
 * 예: [1, 2, 3] 배열이 주어지면, 1, 2, 또는 3 중 하나를 무작위로 반환합니다.
 */

export const getRandomElement = (array: any[]) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

/**
 * 중복되지 않는 파일 이름 생성 함수
 * @param filename 원본 파일명 (예: example.jpg)
 * @param folderName 파일이 저장될 폴더명
 * @param bucketName 파일이 저장될 버킷명
 * @param data.length 중복 파일이 없다면 중단
 * @param newFileName 파일명에 숫자 추가
 * @returns 중복되지 않는 고유한 파일명 (예: example(1).jpg)
 *
 * 파일이 이미 존재할 경우, 숫자를 증가시켜 고유 파일명을 생성합니다.
 * 예를 들어 `example.jpg`가 이미 존재하면 `example(1).jpg`, `example(2).jpg` 형식으로 생성합니다.
 */

export const generateUniqueFileName = async (filename: string, folderName: string, bucketName: string) => {
  const fileNameWithoutExtension = filename.substring(0, filename.lastIndexOf('.'));
  const extension = filename.substring(filename.lastIndexOf('.'));
  let newFileName = filename;
  let count = 1;

  while (true) {
    const { data, error } = await browserClient.storage.from(bucketName).list(folderName, { search: newFileName });
    if (!data || data.length === 0) break;
    newFileName = `${fileNameWithoutExtension}(${count})${extension}`;
    count++;
  }

  return newFileName;
};
