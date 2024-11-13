'use server';

import { getSignedImgUrls } from './getSignedImgUrls';
import buckets from '@/constants/buckets';
import { TEN_MINUTES_FOR_SUPABASE } from '@/constants/time';
import type { PostCoverImage, PostImage } from '@/types/postTypes';
import { createClient } from '@/utils/supabase/server';

/** 그룹 게시물들 이미지 요청 */
export const getPostsImagesPerGroup = async ({
  queryKey: [groupId],
  pageParam,
}: {
  queryKey: string[];
  pageParam: number;
}): Promise<PostImage[]> => {
  const supabase = createClient();

  const PAGE_PER = 21;

  const { status, data, error } = await supabase
    .from('images')
    .select('id, post_id, post_image_name')
    .eq('group_id', groupId)
    .is('deleted_at', null)
    .range(PAGE_PER * pageParam, PAGE_PER * pageParam + PAGE_PER - 1);

  if ((status !== 200 && error) || !data) throw new Error(error.message);

  //TODO - util 함수로 만들기
  const postImages = data.map((post) => `${groupId}/${post.post_image_name}`);
  const postImagesUrls = await getSignedImgUrls(buckets.tourImages, TEN_MINUTES_FOR_SUPABASE, postImages);

  const dataWithSignedUrl = data.map((post) => {
    if (!postImagesUrls) return;
    const matchedUrl = postImagesUrls.find((url) => url.path === `${groupId}/${post.post_image_name}`);

    return {
      ...post,
      post_image_url: matchedUrl ? matchedUrl.signedUrl : '',
    };
  });

  return dataWithSignedUrl as PostImage[];
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
    .select('post_id, post_image_name, post_lat, post_lng')
    .eq('group_id', groupId)
    .eq('is_cover', true)
    .is('deleted_at', null);

  if ((status !== 200 && error) || !data) throw new Error(error.message);

  const postImages = data.map((post) => `${groupId}/${post.post_image_name}`);
  const postImagesUrls = await getSignedImgUrls(buckets.tourImages, TEN_MINUTES_FOR_SUPABASE, postImages);

  const dataWithSignedUrl = data.map((post) => {
    if (!postImagesUrls) return;
    const matchedUrl = postImagesUrls.find((url) => url.path === `${groupId}/${post.post_image_name}`);

    return {
      ...post,
      post_image_url: matchedUrl ? matchedUrl.signedUrl : '',
    };
  });

  return dataWithSignedUrl as PostCoverImage[];
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
