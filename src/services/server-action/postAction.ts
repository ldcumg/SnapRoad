'use server';

import { createClient } from '@/utils/supabase/server';

/** 댓글 삭제 */
export const fetchDeletePost = async (postId: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('posts')
    .update({ deleted_at: new Date().toISOString() })
    .eq('post_id', postId)
    .select();

  if (error) throw new Error(error.message);
  return { message: '게시글 삭제 성공', data };
};
