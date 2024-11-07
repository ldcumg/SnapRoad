import { createClient } from '@/utils/supabase/client';

/**
 * 소셜로그인
 * @param provider 제공 기관 (kakao,google,github)
 */
export const signInWithOAuth = async (loginProvider: 'kakao' | 'google' | 'github') => {
  const supabase = createClient();

  await supabase.auth.signInWithOAuth({
    provider: loginProvider,
    options: {
      redirectTo: window.origin + '/api/auth/callback',
    },
  });
};
