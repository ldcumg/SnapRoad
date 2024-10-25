'use server';

import { SUCCESS_LOGIN, SUCCESS_SIGN_UP } from '@/constants/authMessage';
import { getErrorMessage } from '@/constants/supabaseErrorCode';
import { createClient } from '@/utils/supabase/server';

/** 회원가입 */
export const signUp = async (formData: { email: string; password: string; nickname: string }) => {
  const supabase = createClient();

  const { error: signUpError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        user_nickname: formData.nickname,
      },
    },
  });

  if (signUpError) throw new Error(getErrorMessage(signUpError.code));

  await signOut();
  return { message: SUCCESS_SIGN_UP };
};

/** 로그인 */
export const login = async (formData: { email: string; password: string }) => {
  const supabase = createClient();

  const { data, error: loginError } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (loginError) throw new Error(getErrorMessage(loginError.code));

  return { message: SUCCESS_LOGIN, data: data };
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
