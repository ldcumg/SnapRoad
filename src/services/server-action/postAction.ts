'use server';

import type { PostCoverImage, PostImage } from '@/types/postTypes';
import { createClient } from '@/utils/supabase/server';

/** 그룹 게시물들에 해당하는 이미지 요청 */
export const getPostsImagesPerGroup = async ({
  queryKey: [groupId],
  pageParam,
}: {
  queryKey: string[];
  pageParam: number;
}): Promise<PostImage[]> => {
  const supabase = createClient();

  const { status, data, error } = await supabase
    .from('images')
    .select('id, post_id, post_image_url, post_image_name')
    .eq('group_id', groupId)
    .is('deleted_at', null)
    .range(15 * pageParam, 15 * pageParam + 14);

  if (status !== 200 && error) throw new Error(error.message);

  return data as PostImage[];
};

/** 그룹 게시물 중 대표 이미지만 요청 */
export const getPostsCoverImagesPerGroup = async ({
  queryKey: [groupId],
}: {
  queryKey: string[];
}): Promise<PostCoverImage[]> => {
  const supabase = createClient();

  const { status, data, error } = await supabase
    .from('images')
    .select('post_id, post_image_name, post_image_url, post_lat, post_lng')
    .eq('group_id', groupId)
    .eq('is_cover', true)
    .is('deleted_at', null);

  if (status !== 200 && error) throw new Error(error.message);

  return data as PostCoverImage[];
};

/** 게시글 삭제 */
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
