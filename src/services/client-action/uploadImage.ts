import { generateUniqueFileName } from './fileActions';
import browserClient from '@/utils/supabase/client';

/**
 * 다중 파일 업로드 함수
 * @param files 업로드할 파일 배열
 * @param folderName 업로드할 폴더명
 * @param bucketName 업로드할 버킷명
 * @returns 업로드된 파일의 URL과 파일명을 포함한 배열
 * @throws 파일 업로드 또는 Signed URL 생성 실패 시 에러 발생
 */

export const uploadImage = async (
  files: File[],
  folderName: string,
  bucketName: string,
): Promise<{ url: string; filename: string }[]> => {
  const supabase = browserClient;
  const uploadedFiles: { url: string; filename: string }[] = [];

  for (const file of files) {
    const uniqueFileName = await generateUniqueFileName(file.name, folderName, bucketName);
    const { data, error } = await supabase.storage.from(bucketName).upload(`${folderName}/${uniqueFileName}`, file);

    if (error) throw error;
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(`${folderName}/${uniqueFileName}`, 60 * 60);

    if (signedUrlError || !signedUrlData) throw new Error('Signed URL을 가져오는 데 실패했습니다.');
    uploadedFiles.push({ url: signedUrlData.signedUrl, filename: uniqueFileName });
  }

  return uploadedFiles;
};
