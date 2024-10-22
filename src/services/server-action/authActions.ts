'use server';

import { ERROR_SIGN_UP, Is_EXIST_EMAIL, SUCCESS_SIGN_UP } from '@/constants/authMessage';
import { createClient } from '@/utils/supabase/server';

/** 이메일 중복 체크 */
const checkExistEmail = async (email: string) => {
  const supabase = createClient();

  const { data, error } = await supabase.from('profiles').select('user_email').eq('user_email', email);

  if (error) {
    console.log('이메일 중복 체크 중 오류 발생', error.message);
    return { error: ERROR_SIGN_UP };
  }

  if (data && data.length > 0) {
    return { isExists: true };
  }

  return { isExists: false };
};

export const signUp = async (formData: { email: string; password: string; nickname: string }) => {
  const supabase = createClient();

  const { error: checkEmailError, isExists } = await checkExistEmail(formData.email);

  /** 일반 오류 */
  if (checkEmailError) {
    throw new Error(checkEmailError);
  }

  /** 중복 이메일 오류 */
  if (isExists) {
    throw new Error(Is_EXIST_EMAIL);
  }

  /** 회원가입 시도 */
  const { error: signUpError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        user_nickname: formData.nickname,
      },
    },
  });

  /** 일반 오류 */
  if (signUpError) {
    console.log('회원가입 중 오류 발생', signUpError.message);
    throw new Error('ERROR_SIGN_UP');
  }

  return { message: SUCCESS_SIGN_UP };
};
