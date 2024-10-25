'use server';

import { IS_EXIST_EMAIL, IS_NOT_EXIST_EMAIL, SUCCESS_LOGIN, SUCCESS_SIGN_UP } from '@/constants/authMessage';
import { createClient } from '@/utils/supabase/server';

/** 이메일 체크 */
const checkExistEmail = async (email: string) => {
  const supabase = createClient();

  const { data, error } = await supabase.from('profiles').select('user_email').eq('user_email', email);

  if (error) return { error: error.message };
  if (data && data.length > 0) return { isExists: true };

  return { isExists: false };
};

/** 회원가입 */
export const signUp = async (formData: { email: string; password: string; nickname: string }) => {
  const supabase = createClient();

  const { error: checkEmailError, isExists } = await checkExistEmail(formData.email);

  if (checkEmailError) throw new Error(checkEmailError);
  if (isExists) throw new Error(IS_EXIST_EMAIL);

  const { error: signUpError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        user_nickname: formData.nickname,
      },
    },
  });

  if (signUpError) throw new Error(signUpError.message);

  await signOut();
  return { message: SUCCESS_SIGN_UP };
};

/** 로그인 */
export const login = async (formData: { email: string; password: string }) => {
  const supabase = createClient();

  // 오류코드, 메세지 확인해보기
  const { error: checkEmailError, isExists } = await checkExistEmail(formData.email);
  if (checkEmailError) throw new Error(checkEmailError);
  if (!isExists) throw new Error(IS_NOT_EXIST_EMAIL);

  const { data, error: loginError } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (loginError) throw new Error(loginError.message);
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
