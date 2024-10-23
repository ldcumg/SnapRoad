import { createClient } from '@/utils/supabase/client';

export const signInWithKakao = async () => {
  const supabase = createClient();

  await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      // 우리의 origin 으로 정확히 리다이렉션 될 수 있도록
      redirectTo: window.origin + '/auth/callback',
    },
  });
};
