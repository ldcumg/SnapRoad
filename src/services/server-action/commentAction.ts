'use server';

import { createClient } from '@/utils/supabase/server';

export const fetchGetComments = async (postId: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('comment')
    .select('*, profiles(*)')
    .eq('post_id', postId)
    .is('deleted_at', null);

  if (error) throw new Error(error.message);

  return data;
};

/** 댓글 등록 */
export const fetchInsertComment = async (newComment: {
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

  if (error) throw new Error(error.message);
  return { message: '댓글 등록 성공', data };
};

/** 댓글 삭제 */
export const fetchDeleteComment = async (commentId: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('comment')
    .update({ deleted_at: new Date().toISOString() })
    .eq('comment_id', commentId)
    .select();

  if (error) throw new Error(error.message);
  return { message: '댓글 삭제 성공', data };
};

/** 댓글 수정 */
export const fetchUpdateComment = async (commentId: string, commentDesc: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('comment')
    .update({ comment_desc: commentDesc })
    .eq('comment_id', commentId)
    .select();

  if (error) throw new Error(error.message);
  return { message: '댓글 수정 성공', data };
};
