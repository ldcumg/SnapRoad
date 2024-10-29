import { createClient } from '@/utils/supabase/client';

/** 비밀번호 reset */
export const sendEmailResetPassword = async (email: string) => {
  const supabase = createClient();

  const { data: resetData, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.origin + '/mypage/password-reset',
  });
  return resetData;
};
