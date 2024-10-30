import browserClient from '@/utils/supabase/client';

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