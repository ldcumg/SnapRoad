'use server';

import { createClient } from '@/utils/supabase/server';

/**
 * @function getSignedImgUrls = 여러 singedImgUrl을 한번에 받아올 수 있는 기능
 * @param bucketName = 버킷 이름
 * @param expiration = url유효기간 / 단위: 초
 * @param imageNameArray = 저장된 이미지 이름 배열
 * */
export const getSignedImgUrls = async (bucketName: string, expiration: number, imageNameArray: string[]) => {
  const supabase = createClient();
  const { data: signedImgUrls } = await supabase.storage.from(bucketName).createSignedUrls(imageNameArray, expiration);
  return signedImgUrls;
};
