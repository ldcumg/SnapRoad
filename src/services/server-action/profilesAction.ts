'use server';

import { getSignedImgUrl } from './getSignedImgUrl';
import { createClient } from '@/utils/supabase/server';

export const getProfile = async (userId: string) => {
  const supabase = createClient();

  /** 프로필 정보 가져오기 */
  const { data: profiles, error } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
  if (error) throw new Error(error.message);

  const userProfile = profiles;
  const signedImgUrl = await getSignedImgUrl('avatars', 86400, userProfile.user_image_url as string);

  return { profiles: profiles, profileImageUrl: signedImgUrl };
};

export const updateProfile = async (userId: string, imageName: string, newNickname: string) => {
  const supabase = createClient();

  // const { error: userError } = await supabase.auth.updateUser({
  //   data: {
  //     full_name: newNickname,
  //   },
  // });

  const { data, error } = await supabase
    .from('profiles')
    .update({ user_image_url: imageName, user_nickname: newNickname })
    .eq('user_id', userId);

  if (error) throw new Error(error.message);

  return data;
};
