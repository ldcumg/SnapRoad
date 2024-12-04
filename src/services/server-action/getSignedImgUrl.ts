'use server';

import { createClient } from '@/utils/supabase/server';

/**
 * @function getSignedImgUrl = 이미지 URL을 서명하여 반환
 * @param {string} bucketName = 버킷 이름
 * @param {number} expiration = url유효기간 / 단위: 초
 * @param {string} imageName = 저장된 이미지 이름
 * @returns {string} = 서명된 이미지 URL
 */
export const getSignedImgUrl = async (bucketName: string, expiration: number, imageName: string) => {
  const supabase = createClient();
  const { data: signedImgUrl } = await supabase.storage.from(bucketName).createSignedUrl(imageName, expiration);
  return signedImgUrl?.signedUrl;
};
