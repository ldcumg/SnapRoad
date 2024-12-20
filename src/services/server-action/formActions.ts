'use server';

import TABLES from '@/constants/tables';
import { createClient } from '@/utils/supabase/server';

// 포스트
export const postForm = async (formData: {
  userId: string;
  groupId: string;
  desc: string;
  date?: string;
  time?: string;
  lat?: number | null;
  lng?: number | null;
  place?: string;
  postThumbnailImage: string;
  imageArray: string[];
}) => {
  const supabase = createClient();

  const { data, error: postFormError } = await supabase
    .from(TABLES.posts)
    .insert({
      group_id: formData.groupId,
      user_id: formData.userId,
      post_date: formData.date,
      post_time: formData.time,
      post_desc: formData.desc,
      post_lat: formData.lat,
      post_lng: formData.lng,
      post_address: formData.place,
      post_thumbnail_image: formData.postThumbnailImage,
      image_array: formData.imageArray,
    })
    .select('post_id')
    .single();

  if (postFormError) {
    console.error('포스트 등록 에러:', postFormError);
    throw new Error(postFormError.message);
  }

  return { postId: data.post_id };
};

// 포스트 업데이트
export const updateForm = async (formData: {
  postId: string;
  userId: string;
  groupId: string;
  desc: string;
  date?: string;
  time?: string;
  lat?: number | null;
  lng?: number | null;
  place?: string;
  postThumbnailImage: string;
  imageArray: string[];
}) => {
  const supabase = createClient();

  const { error } = await supabase
    .from(TABLES.posts)
    .update({
      group_id: formData.groupId,
      user_id: formData.userId,
      post_date: formData.date,
      post_time: formData.time,
      post_desc: formData.desc,
      post_lat: formData.lat,
      post_lng: formData.lng,
      post_address: formData.place,
      post_thumbnail_image: formData.postThumbnailImage,
      image_array: formData.imageArray,
    })
    .eq('post_id', formData.postId);

  if (error) {
    console.error('업데이트 실패:', error);
    throw new Error(error.message);
  }

  return { postId: formData.postId };
};

// 포스트ID
export const updateImagePostId = async (postId: string, uploadSessionId: string) => {
  const supabase = createClient();
  const { error } = await supabase
    .from(TABLES.images)
    .update({ post_id: postId })
    .eq('upload_session_id', uploadSessionId);

  if (error) {
    console.error('이미지에 post_id 업데이트에 실패했습니다:', error.message);
    throw new Error('이미지 업데이트 오류');
  }
};

// 해시태그
export const saveTags = async (hashtags: string[], postId: string, groupId: string) => {
  if (!groupId) {
    console.error('groupId가 없습니다.');
    throw new Error('groupId가 필요합니다.');
  }

  const hashtagData = hashtags.map((tag) => ({
    tag_title: tag,
    post_id: postId,
    group_id: groupId,
  }));

  if (hashtagData.length > 0) {
    const supabase = createClient();
    const { error } = await supabase.from(TABLES.tags).insert(hashtagData);
    if (error) {
      console.error('태그 저장에 실패했습니다:', error.message);
      throw new Error('태그 저장 오류');
    }
  }
};

// 해시태그 삭제
export const deleteTags = async (postId: string, groupId: string) => {
  const supabase = createClient();
  const { error } = await supabase.from(TABLES.tags).delete().eq('post_id', postId).eq('group_id', groupId);
  if (error) {
    console.error('해시태그 삭제 에러:', error);
    throw new Error(error.message);
  }
};
