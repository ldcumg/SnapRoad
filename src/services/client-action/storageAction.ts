// 'use server';
import { createClient } from '@/utils/supabase/client';

/** default 이미지 */
export const getDefaultImageUrl = async () => {
  const supabase = createClient();
  const { data } = supabase.storage.from('public_images').getPublicUrl('test_user_default_thumbnail.png');
  return data;
};

/** private 이미지 */
export const getSignedImageUrl = async (imageUrl: string, bucket: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(imageUrl, 60);
  if (error) throw new Error(error.message);
  return data;
};

/** 이미지 업로드 */
export const uploadProfileImage = async (fileName: string, newImage: File, storage: string) => {
  console.log('fileName :>> ', fileName);
  console.log('newImage :>> ', newImage);
  console.log('storage :>> ', storage);

  const supabase = createClient();
  const { data, error } = await supabase.storage.from(storage).upload(fileName, newImage);
  console.log('data :>> ', data);
  if (error) throw new Error(error.message);
  return { message: '이미지 등록 성공' };
};
