'use server';

import tables from '@/constants/tables';
import { getSignedImgUrl } from './getSignedImgUrl';
import { createClient } from '@/utils/supabase/server';

// TODO 삭제될 예정
export const fetchGetComments = async (postId: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from(tables.comment)
    .select('*, profiles(*)')
    .eq('post_id', postId)
    .is('deleted_at', null);

  if (error) throw new Error(error.message);

  return data;
};

export const fetchComments = async (postId: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from(tables.comment)
    .select('*, comment_author_user:profiles (user_id, user_nickname, user_image_url) ')
    .eq('post_id', postId)
    .is('deleted_at', null);

  if (error) {
    console.error('error ... : ', error);
    throw new Error('댓글 정보 조회 시 오류가 발생했습니다.');
  }

  const commentData = await Promise.all(
    data.map(async (comment) => {
      const signedImageUrl = await getSignedImgUrl('avatars', 86400, comment.comment_author_user?.user_image_url!);
      return {
        ...comment,
        comment_author_user: {
          user_nickname: comment.comment_author_user?.user_nickname,
          signed_image_url: signedImageUrl ?? null,
        },
      };
    }),
  );

  return commentData;
};

/** 댓글 등록 */
export const fetchInsertComment = async (newComment: {
  postId: string;
  userId: string;
  parentId: string | null;
  commentDesc: string;
}) => {
  const supabase = createClient();

  const { data, error } = await supabase.from(tables.comment).insert([
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
    .from(tables.comment)
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
    .from(tables.comment)
    .update({ comment_desc: commentDesc })
    .eq('comment_id', commentId)
    .select();

  if (error) throw new Error(error.message);
  return { message: '댓글 수정 성공', data };
};
