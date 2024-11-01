'use server';

import type { GroupPost, PostImage } from '@/types/postTypes';
import { createClient } from '@/utils/supabase/server';

/** 그룹 게시물 요청 */
export const getPostsPerGroup = async ({ queryKey: [groupId] }: { queryKey: string[] }): Promise<GroupPost[]> => {
  const supabase = createClient();

  const { status, data, error } = await supabase
    .from('posts')
    //QUESTION - 게시물은 있지만 이미지는 삭제했을 경우
    .select('post_id, images(is_cover, post_image_name, post_image_url, post_lat, post_lng)')
    .eq('group_id', groupId)
    .is('deleted_at', null);

  if (status !== 200 && error) throw new Error(error.message);

  return data as GroupPost[];
};

/** 그룹 게시물들에 해당하는 이미지 요청 */
export const getPostsImagesPerGroup = async ({ queryKey: [groupId] }: { queryKey: string[] }): Promise<PostImage[]> => {
  const supabase = createClient();

  const { status, data, error } = await supabase
    .from('images')
    .select('id, post_id, post_image_url, post_image_name')
    .eq('group_id', groupId)
    .is('deleted_at', null);

  if (status !== 200 && error) throw new Error(error.message);

  return data as PostImage[];
};
