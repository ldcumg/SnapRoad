import { GroupObjType, UserGroupType } from '@/types/groupTypes';
import browserClient from '@/utils/supabase/client';

const insertGroupData = async (groupObj: GroupObjType) => {
  const state = await browserClient.from('group').insert(groupObj);
  if (state.status !== 201) throw state.error;
  else if (state.status === 201) return { data: state.data, error: state.error };
};

const insertUserGroupData = async (userGroupObj: UserGroupType) => {
  const state = await browserClient.from('user_group').insert(userGroupObj);
  if (state.status !== 201) throw state.error;
  else if (state.status === 201) return { data: state.data, error: state.error, groupId: userGroupObj.group_id };
};

const checkMemberexist = async (group_id: string, userId: string) => {
  const state = await browserClient
    .from('user_group')
    .select('user_id, group_id')
    .eq('group_id', group_id)
    .eq('user_id', userId);
  if (state.status !== 200) throw state.error;
  return { data: state.data, error: state.error };
};

type GroupListType = {
  pageParam: number;
  userId: string;
};

export type GroupListResponseType = {
  id: number;
  user_id: string;
  group_id: string;
  userCount?: number | undefined;
  group_data: {
    group_id: string;
    group_title: string;
    group_desc: string;
    group_image_url: string;
    updated_at: Date;
  };
};

const getGroupListByPage = async ({ pageParam, userId }: GroupListType) => {
  const state = await browserClient
    .from('user_group')
    .select(
      `
      id,
      user_id,
      group_id,
      group_data: group(
        group_id,
        group_title,
        group_desc,
        group_image_url,
        updated_at
      )`,
    )
    .eq('user_id', userId)
    .range(pageParam * 6, pageParam * 5 + 5);
  if (state.status !== 200) throw state.error;
  return state.data as GroupListResponseType[] | null;
};

const getGroupUsersCount = async (groupId: string) => {
  const state = await browserClient.from('user_group').select('user_id').eq('group_id', groupId);
  if (state.status !== 200) throw state.error;
  return state.data?.length;
};

export { insertGroupData, insertUserGroupData, checkMemberexist, getGroupListByPage, getGroupUsersCount };
