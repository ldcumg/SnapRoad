import browserClient from '@/utils/supabase/client';

export const fetchUserSession = async () => {
  const {
    data: { session },
  } = await browserClient.auth.getSession();
  return session;
};
