'use server';

import { createClient } from '@/utils/supabase/server';

const getGroupDetails = async (group_id: string) => {
  const supabase = createClient();
  const state = await supabase
    .from('group')
    .select('group_title, group_desc, group_id, group_status, group_image_url')
    .eq('group_id', group_id)
    .single();
  if (state.status !== 200) throw state.error;
  console.log('state.data :>> ', { ...state.data });
  const signedImgUrl = await getSignedGroupImg(state.data?.group_image_url);
  console.log('signedImgUrl :>> ', signedImgUrl);
  if (state.data) {
    return { ...state.data, group_image_url: signedImgUrl?.signedUrl };
  }
};

const getSignedGroupImg = async (group_image_url: string) => {
  const supabase = createClient();
  const { data: signedImgUrl } = await supabase.storage.from('group_image').createSignedUrl(group_image_url, 60);
  return signedImgUrl;
};

export { getGroupDetails };
