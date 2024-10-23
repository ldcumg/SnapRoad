import { createClient } from '@/utils/supabase/client';

/** 카카오 로그인 */
export const signInWithKakao = async () => {
  const supabase = createClient();

  await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: window.origin + '/auth/callback',
    },
  });
};

/** 구글 로그인 */
export const signInWithGoogle = async () => {
  const supabase = createClient();

  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.origin + '/auth/callback',
    },
  });
};
