import { createClient } from '@/utils/supabase/server';

export const fetchPostData = async (postId: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('posts')
    .select(
      `
        *,
        tags (*),
        images (*)
      `,
    )
    .eq('post_id', postId)
    .single();

  if (error) {
    console.error('error :>> ', error);
    throw new Error('post 정보 가져오기 실패');
  }

  return data;
};
