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

type PostLists = {
  group_id: string;
};

const getGroupPostLists = async (user_id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.from('user_group').select('group_id').eq('user_id', user_id).limit(10);
  if (error) throw error;
  return data as PostLists[];
};

const getPostListsByGroupId = async (group_id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.from('post').select('post_thumbnail_image').eq('group_id', group_id).single();
  if (error) throw error;
  return data;
};

const getRandomGroupId = async (userId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_group_id_by_user', {
    insert_user_id: userId,
  });
  if (data) return data as string;
  return null;
};

const getRandomThumbnail = async (groupId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_group_thumbnail_by_group_id', {
    input_group_id: groupId,
  });
  //NOTE - 썸네일 이미지, created_at, post_address도 같이 가져와야함
  //근데 어떻게 고쳐야할지 모르겠음
  if (data) return data as string;
  return null;
};

export { getGroupDetails, getGroupPostLists, getPostListsByGroupId, getRandomGroupId, getRandomThumbnail };
