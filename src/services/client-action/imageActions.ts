import browserClient from '@/utils/supabase/client';

const bucketName = 'tour_images';
const folderName = 'group_name';

export const fetchSignedUrl = async (filename: string) => {
  const { data, error } = await browserClient.storage
    .from(bucketName)
    .createSignedUrl(`${folderName}/${filename}`, 60 * 60);
  if (error) throw new Error('Signed URL 생성 실패');
  return data.signedUrl;
};

export const uploadImageToDatabase = async (imageData: any) => {
  const { data, error } = await browserClient.from('images').insert(imageData).select();
  if (error) throw new Error(error.message);
  return data[0];
};

export const setCoverImage = async (userId: string, createdAt: string, imageId: number) => {
  await browserClient.from('images').update({ is_cover: false }).eq('user_id', userId).eq('created_at', createdAt);
  await browserClient.from('images').update({ is_cover: true }).eq('id', imageId);
};

export const deleteImageFromStorage = async (filename: string) => {
  const { error } = await browserClient.storage.from(bucketName).remove([`${folderName}/${filename}`]);
  if (error) throw new Error(`스토리지에서 파일 삭제 중 오류 발생: ${error.message}`);
};

export const deleteImageFromDatabase = async (imageId: number) => {
  const { error } = await browserClient.from('images').delete().eq('id', imageId);
  if (error) throw new Error(`데이터베이스에서 이미지 삭제 중 오류 발생: ${error.message}`);
};
