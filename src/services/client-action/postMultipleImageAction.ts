import BUCKETS from '@/constants/buckets';
import { ONE_DAY_FOR_SUPABASE } from '@/constants/time';
import { generateUniqueFileName } from '@/utils/fileNameUtils';
import browserClient from '@/utils/supabase/client';

/**
 * 다중 파일 업로드
 * @BUCKET_NAME 상수
 * @param files 업로드할 파일 배열
 * @param folderName 업로드할 폴더명
 * @returns 업로드된 파일의 URL과 파일명을 포함한 배열
 */

export const uploadImage = async (files: File[], folderName: string): Promise<{ url: string; filename: string }[]> => {
  const supabase = browserClient;
  const uploadedFiles: { url: string; filename: string }[] = [];

  for (const file of files) {
    const uniqueFileName = await generateUniqueFileName(file.name, folderName, BUCKETS.tourImages);
    const { data, error } = await supabase.storage
      .from(BUCKETS.tourImages)
      .upload(`${folderName}/${uniqueFileName}`, file);

    if (error) throw error;
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(BUCKETS.tourImages)
      .createSignedUrl(`${folderName}/${uniqueFileName}`, ONE_DAY_FOR_SUPABASE);

    if (signedUrlError || !signedUrlData) throw new Error('Signed URL을 가져오는 데 실패했습니다.');
    uploadedFiles.push({ url: signedUrlData.signedUrl, filename: uniqueFileName });
  }

  return uploadedFiles;
};
