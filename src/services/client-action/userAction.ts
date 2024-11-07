import browserClient from '@/utils/supabase/client';

export const fetchUser = async () => {
  const {
    data: { user },
  } = await browserClient.auth.getUser();
  return user;
};
