'use server';

import { getDefaultImageUrl } from '../client-action/storageAction';
import { getSignedImgUrl } from './getSignedImgUrl';
import { createClient } from '@/utils/supabase/server';

export const getProfile = async (userId: string) => {
  const supabase = createClient();

  /** 프로필 정보 가져오기 */
  const { data: profiles, error } = await supabase.from('profiles').select('*').eq('user_id', userId);
  if (error) throw new Error(error.message);

  let profileImageUrl = '';
  // signed URL을 생성하여 프로필 데이터에 추가
  if (profiles && profiles.length > 0) {
    const userProfile = profiles[0];

    if (userProfile.user_image_url) {
      // signed URL 생성
      profileImageUrl = (await getSignedImgUrl('avatars', 86400, userProfile.user_image_url)) || '';
    } else {
      // 기본 이미지 경로 추가
      const publicImageUrl = await getDefaultImageUrl();
      profileImageUrl = publicImageUrl.publicUrl;
    }
  }

  return { profiles: profiles, profileImageUrl: profileImageUrl };
};

export const updateProfile = async (userId: string, imageName: string, newNickname: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('profiles')
    .update({ user_image_url: imageName, user_nickname: newNickname })
    .eq('user_id', userId);

  if (error) throw new Error(error.message);

  return data;
};
