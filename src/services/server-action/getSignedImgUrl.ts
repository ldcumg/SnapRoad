'use server';

import { createClient } from '@/utils/supabase/server';

/**
 * @param bucketName = 버킷 이름
 * @param expiration = url유효기간 / 단위: 초
 * @param imageName = 저장된 이미지 이름
 * */
export const getSignedImgUrl = async (bucketName: string, expiration: number, imageName: string) => {
  const supabase = createClient();
  const { data: signedImgUrl } = await supabase.storage.from(bucketName).createSignedUrl(imageName, expiration);
  return signedImgUrl?.signedUrl;
};
