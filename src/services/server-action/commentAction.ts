'use server';

import { createClient } from '@/utils/supabase/server';

export const fetchGetComments = async (postId: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('comment')
    .select('*, profiles(*)')
    .eq('post_id', postId)
    .is('deleted_at', null);
  console.log('디비에서 가져온 댓글 정보 data :>> ', data);

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
  console.log('삭제할 commentId :>> ', commentId);

  const supabase = createClient();

  const { data, error } = await supabase
    .from('comment')
    .update({ deleted_at: new Date().toISOString() })
    .eq('comment_id', commentId)
    .select();

  console.log('삭제 처리된 댓글 정보 data :>> ', data);

  console.log('error :>> ', error);
  if (error) throw new Error(error.message);
};

/** 댓글 수정 */
