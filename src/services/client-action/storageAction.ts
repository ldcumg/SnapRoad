import buckets from '@/constants/buckets';
import { createClient } from '@/utils/supabase/client';

/** default 이미지 */
export const getDefaultImageUrl = async () => {
  const supabase = createClient();
  const { data } = supabase.storage.from(buckets.publicImages).getPublicUrl('test_user_default_thumbnail.png');
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
export const uploadProfileImage = async (imageName: string, newImage: File, storage: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.storage.from(storage).upload(imageName, newImage);
  if (error) throw new Error(error.message);
  return { message: '이미지 등록 성공' };
};
