'use server';

import TABLES from '@/constants/tables';
import { createClient } from '@/utils/supabase/client';

// 포스트 생성
export async function createPost(post: {
  userId: string;
  groupId: string;
  postDesc: string;
  postDate: string;
  postTime: string;
  postLat: number | null;
  postLng: number | null;
  postThumbnailImage: string;
  imageArray: string[];
  postAddress: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(TABLES.posts)
    .insert([
      {
        user_id: post.userId,
        group_id: post.groupId,
        post_desc: post.postDesc,
        post_date: post.postDate,
        post_time: post.postTime,
        post_lat: post.postLat,
        post_lng: post.postLng,
        post_thumbnail_image: post.postThumbnailImage,
        image_array: post.imageArray,
        post_address: post.postAddress,
      },
    ])
    .select('post_id')
    .single();
  if (error || !data) throw new Error(error.message || '포스트 저장 오류');
  return { message: '포스트 등록 성공', data };
}

export async function updateImagesPostId(postId: string, uploadSessionId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(TABLES.images)
    .update({ post_id: postId })
    .eq('upload_session_id', uploadSessionId);
  if (error) throw new Error('이미지 업데이트 오류');
  return { message: '이미지 테이블 등록 성공', data };
}

// 태그 저장
export async function saveTags(tags: { tag: string; postId: string; groupId: string }) {
  const supabase = createClient();
  const { data, error } = await supabase.from(TABLES.tags).insert({
    tag_title: tags.tag,
    post_id: tags.postId,
    group_id: tags.groupId,
  });
  if (error) throw new Error('태그 저장 오류');
  return { message: '태그 등록 성공', data };
}
