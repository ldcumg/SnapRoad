'use server';

import { createClient } from '@/utils/supabase/server';

export const getProfile = async (userId: string) => {
  const supabase = createClient();

  const { data: profiles, error } = await supabase.from('profiles').select('*').eq('user_id', userId);

  if (error) throw new Error(error.message);

  return profiles;
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
