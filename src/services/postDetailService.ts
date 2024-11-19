import { getSignedImgUrl } from './server-action/getSignedImgUrl';
import buckets from '@/constants/buckets';
import tables from '@/constants/tables';
import { TEN_MINUTES_FOR_SUPABASE } from '@/constants/time';
import { ImageDetail, PostDetail } from '@/types/postDetailTypes';
import { createClient } from '@/utils/supabase/server';
import * as Sentry from '@sentry/nextjs';

export const fetchPostDetail = async (postId: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from(tables.posts)
    .select(
      `
    *,
    tags (*),
    images (*),
    group:group (group_title), 
    post_author_user:profiles (user_id, user_nickname, user_image_url) 
  `,
    )
    .eq('post_id', postId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // 해당 게시글을 쓴 유저의 signed url
  if (data?.post_author_user?.user_image_url) {
    const signedImageUrl = await getSignedImgUrl(
      'avatars',
      TEN_MINUTES_FOR_SUPABASE,
      data.post_author_user.user_image_url,
    );
    (data.post_author_user as typeof data.post_author_user & { signed_image_url: string | null }).signed_image_url =
      signedImageUrl ?? null;
  }

  // 게시글의 이미지들에 대해 signed URL을 생성하여 각 이미지 객체에 추가
  // 1. 단순 반복문
  //   if (data?.images?.length) {
  //     for (const image of data.images) {
  //       const signedImageUrl = await getSignedImgUrl('tour_images', 86400, `${image.group_id}/${image.post_image_name}`);
  //       (image as typeof image & { signed_image_url: string | null }).signed_image_url = signedImageUrl ?? null;
  //     }
  //   }

  // 2. promise.all
  const updatedImages = await Promise.all(
    // MEMO : data.images가 배열이 아닌 경우 map 호출 X, undefined 반환
    data.images?.map(async (image) => {
      const signedImageUrl = await getSignedImgUrl(
        buckets.tourImages,
        86400,
        `${image.group_id}/${image.post_image_name}`,
      );

      return {
        ...image,
        signed_image_url: signedImageUrl ?? null,
      };
    }) || [],
  );
  return {
    ...data,
    images: updatedImages as ImageDetail[],
  } as PostDetail;
};
