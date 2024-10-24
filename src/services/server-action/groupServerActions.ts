'use server';

import { getSignedImgUrl } from './getSignedImgUrl';
import { createClient } from '@/utils/supabase/server';

const getGroupDetails = async (group_id: string) => {
  const supabase = createClient();
  const state = await supabase
    .from('group')
    .select('group_title, group_desc, group_id, group_status, group_image_url')
    .eq('group_id', group_id)
    .single();
  if (state.status !== 200) throw state.error;
  const signedImgUrl = await getSignedImgUrl('group_image', 60 * 10, state.data?.group_image_url);
  if (state.data) {
    return { ...state.data, group_image_url: signedImgUrl };
  }
};

export { getGroupDetails };
