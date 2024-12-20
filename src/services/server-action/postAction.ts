'use server';

import { getSignedImgUrls } from './getSignedImgUrls';
import BUCKETS from '@/constants/buckets';
import TABLES from '@/constants/tables';
import { ONE_HOUR_FOR_SUPABASE } from '@/constants/time';
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

  const { data, error } = await supabase
    .from(TABLES.images)
    .select('id, post_id, post_image_name')
    .eq('group_id', groupId)
    .not('post_id', 'is', null)
    .is('deleted_at', null)
    .order('created_at', { ascending: true })
    .range(PAGE_PER * pageParam, PAGE_PER * pageParam + PAGE_PER - 1);

  if (error || !data) throw new Error(error.message);

  //TODO - util 함수로 만들기
  const postImages = data.map((post) => `${groupId}/${post.post_image_name}`);
  const postImagesUrls = await getSignedImgUrls(BUCKETS.tourImages, ONE_HOUR_FOR_SUPABASE, postImages);

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

  const { data, error } = await supabase
    .from(TABLES.images)
    .select('post_id, post_image_name, post_lat, post_lng')
    .eq('group_id', groupId)
    .eq('is_cover', true)
    .not('post_id', 'is', null)
    .is('deleted_at', null)
    .order('created_at', { ascending: true });

  if (error || !data) throw new Error(error.message);

  const postImages = data.map((post) => `${groupId}/${post.post_image_name}`);
  const postImagesUrls = await getSignedImgUrls(BUCKETS.tourImages, ONE_HOUR_FOR_SUPABASE, postImages);

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

  const { data, error } = await supabase.rpc('delete_post_and_images', {
    post_id: postId,
  });

  if (error) {
    console.log('게시물 삭제 중 오류 발생 ', error);
    throw new Error(`게시물 삭제 중 오류 발생: ${error.message}`);
  }

  return { message: '게시물 삭제 성공', data };
};
