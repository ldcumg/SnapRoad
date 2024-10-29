import { Database } from '@/database.types';
import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    },
  );
};

// 이거 고치기
const browserClient = createClient();
export default browserClient;
