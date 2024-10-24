import { generateRandomFileName } from '@/utils/fileNameUtils';
import browserClient from '@/utils/supabase/client';

// multiply file upload
export const uploadImage = async (files: File[]): Promise<{ url: string; filename: string }[]> => {
  const supabase = browserClient;
  const uploadedFiles: { url: string; filename: string }[] = [];

  for (const file of files) {
    const randomFileName = generateRandomFileName(file.name);

    const { data, error } = await supabase.storage.from('tour_images').upload(`group_name/${randomFileName}`, file);
    if (error) throw error;

    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('tour_images')
      .createSignedUrl(`group_name/${randomFileName}`, 60 * 60);

    if (signedUrlError || !signedUrlData) throw new Error('Signed URL을 가져오는 데 실패했습니다.');

    console.log('이미지 업로드 성공, Signed URL:', signedUrlData.signedUrl);
    uploadedFiles.push({ url: signedUrlData.signedUrl, filename: randomFileName });
  }

  return uploadedFiles;
};
