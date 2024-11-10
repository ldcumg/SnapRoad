'use server';

import { getSignedImgUrl } from '@/services/server-action/getSignedImgUrl';
import { createClient } from '@/utils/supabase/server';

export const postForm = async (formData: {
  userId: string;
  groupId: string;
  desc: string;
  date: string;
  time: string;
  lat?: number | null;
  lng?: number | null;
  place?: string;
}) => {
  const supabase = createClient();

  const { data, error: postFormError } = await supabase
    .from('posts')
    .insert({
      group_id: formData.groupId,
      user_id: formData.userId,
      post_date: formData.date,
      post_time: formData.time,
      post_desc: formData.desc,
      post_lat: formData.lat,
      post_lng: formData.lng,
      post_address: formData.place,
    })
    .select('post_id')
    .single();

  if (postFormError) {
    console.error('포스트 등록 에러:', postFormError);
    throw new Error(postFormError.message);
  }
};

getSignedImgUrl;
