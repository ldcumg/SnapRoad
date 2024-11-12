'use server';

import buckets from '@/constants/buckets';
import { getSignedImgUrl } from './getSignedImgUrl';
import { getSignedImgUrls } from './getSignedImgUrls';
import { TEN_MINUTES_OF_SECONDS } from '@/constants/time';
import type { GroupInfo } from '@/types/groupTypes';
import { createClient } from '@/utils/supabase/server';

const getGroupDetails = async (group_id: string) => {
  const supabase = createClient();
  const state = await supabase
    .from('group')
    .select('group_title, group_desc, group_id, group_status, group_image_url')
    .eq('group_id', group_id)
    .single();
  if (state.status !== 200) throw state.error;
  const signedImgUrl = await getSignedImgUrl('group_image', 60 * 10, state.data?.group_image_url as string);
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
  const { data, error } = await supabase.from('posts').select('post_thumbnail_image').eq('group_id', group_id).single();
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

const getGroupInfo = async ({ queryKey: [groupId] }: { queryKey: string[] }): Promise<GroupInfo> => {
  const supabase = createClient();

  const { status, data, error } = await supabase
    .from('group')
    .select(
      'group_title, group_desc, group_image_url, group_invite_code, user_group(is_owner, profiles(user_image_url, user_nickname, user_email))',
    )
    .eq('group_id', groupId)
    .is('deleted_at', null)
    .single();

  if ((status !== 200 && error) || !data) throw new Error(error.message);

  const groupImageSignedUrl = getSignedImgUrl(buckets.groupImage(), TEN_MINUTES_OF_SECONDS, data.group_image_url ?? '');

  const profileImages = data.user_group.map((user) => user.profiles?.user_image_url ?? '');
  const profileImagesUrls = getSignedImgUrls(buckets.avatars(), TEN_MINUTES_OF_SECONDS, profileImages);

  const signedUrls = await Promise.all([groupImageSignedUrl, profileImagesUrls]);

  data.user_group.map((user) => {
    if (!profileImagesUrls || !user.profiles || !signedUrls[1]) return;
    const matchedUrl = signedUrls[1].find((url) => url.path === user.profiles?.user_image_url);

    user.profiles.user_image_url = matchedUrl ? matchedUrl.signedUrl : null;

    return user;
  });

  return { ...data, group_image_url: signedUrls[0] } as GroupInfo;
};

export { getGroupDetails, getGroupPostLists, getPostListsByGroupId, getRandomGroupId, getGroupInfo };
