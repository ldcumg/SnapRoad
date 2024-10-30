'use server';

import { createClient } from '@/utils/supabase/server';

export const fetchPostComment = async (newComment: {
  postId: string;
  userId: string;
  parentId: string | null;
  commentDesc: string;
}) => {
  const supabase = createClient();

  const { data, error } = await supabase.from('comment').insert([
    {
      post_id: newComment.postId,
      user_id: newComment.userId,
      parent_id: newComment.parentId,
      comment_desc: newComment.commentDesc,
    },
  ]);

  if (error) {
    console.error('error', error);
    return { success: false, error };
  }

  return { message: '댓글 등록 성공', data };
};
