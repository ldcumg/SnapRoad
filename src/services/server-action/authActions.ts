'use server';

import { getSignedImgUrl } from './getSignedImgUrl';
import TABLES from '@/constants/tables';
import { createClient } from '@/utils/supabase/server';

/** 회원가입 */
export const signUp = async (formData: { email: string; password: string; nickname: string }) => {
  const supabase = createClient();

  const { error: signUpError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.nickname,
      },
    },
  });

  if (signUpError?.code === 'user_already_exists') return { error: { message: '이미 사용 중인 이메일입니다.' } };
  if (signUpError) throw signUpError;

  await signOut(); // 회원 가입 후, 바로 세션 생기는거 방지
  return { message: '회원가입이 완료되었습니다.' };
};

/** 로그인 */
export const login = async (formData: { email: string; password: string }) => {
  const supabase = createClient();

  const { data, error: loginError } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (loginError?.code === 'invalid_credentials') return { error: { message: '잘못된 이메일 또는 비밀번호입니다.' } };
  if (loginError) throw loginError;

  return { message: '로그인 완료되었습니다.' };
};

export const getSession = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};

export const signOut = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};

/** 비밀번호 변경 */
export const resetPassword = async (newPassword: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) throw new Error(error.message);
  return data;
};

export const getUserData = async (userId: string) => {
  const supabase = createClient();
  let { data, error } = await supabase
    .from(TABLES.profiles)
    .select('user_nickname, user_image_url')
    .eq('user_id', userId)
    .single();
  if (error) throw new Error(error.message);
  if (data?.user_image_url) {
    const signedImgUrl = await getSignedImgUrl('avatars', 60 * 60 * 24, data.user_image_url);
    if (signedImgUrl) {
      data = { ...data, user_image_url: signedImgUrl };
    }
  }
  return data;
};
