import { getSignedImgUrl } from './server-action/getSignedImgUrl';
import { createClient } from '@/utils/supabase/server';

export const fetchPostDetail = async (postId: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('posts')
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
    console.error('error ... : ', error);
    throw new Error('게시글 상세 정보 조회 시 오류가 발생했습니다.');
  }

  // 해당 게시글을 쓴 유저의 signed url
  if (data?.post_author_user?.user_image_url) {
    const signedImageUrl = await getSignedImgUrl('avatars', 86400, data.post_author_user.user_image_url);
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

  // 2. promise.all 로 성능 개선 버전
  data.images = await Promise.all(
    // MEMO : data.images가 배열이 아닌 경우 map 호출 X, undefined 반환
    data.images?.map(async (image) => {
      const signedImageUrl = await getSignedImgUrl('tour_images', 86400, `${image.group_id}/${image.post_image_name}`);

      return {
        ...image,
        signed_image_url: signedImageUrl ?? null,
      };
    }) || [],
  );

  return data;
};
