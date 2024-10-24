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
    // 업로드된 파일의 퍼블릭 URL 생성
    const { data: publicUrlData } = supabase.storage.from('tour_images').getPublicUrl(`group_name/${randomFileName}`);
    if (!publicUrlData) throw new Error('퍼블릭 URL을 가져올 수 없습니다.');
    console.log('이미지 업로드 성공:', publicUrlData.publicUrl);
    uploadedFiles.push({ url: publicUrlData.publicUrl, filename: randomFileName });
  }
  return uploadedFiles;
};
