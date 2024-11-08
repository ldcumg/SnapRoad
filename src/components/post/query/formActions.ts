'use server';

import { getSignedImgUrl } from '@/services/server-action/getSignedImgUrl';
import { createClient } from '@/utils/supabase/server';

export const postForm = async (formData: {
  // userId: string;
  // groupId: string;
  desc: string;
  date: string;
  time: string;
}) => {
  const supabase = createClient();

  const { error: postFormError } = await supabase
    .from('posts')
    .insert({
      post_date: formData.date,
      post_time: formData.time,
      post_desc: formData.desc,
    })
    .select('post_id')
    .single();
};

getSignedImgUrl;
